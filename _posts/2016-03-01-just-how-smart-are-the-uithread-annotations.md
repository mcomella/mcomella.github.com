---
title: Android threading annotations – a False Sense of Security
tag: android,mozilla
---
When the [Android thread annotations][docs] such as `@UiThread` and
`@WorkerThread` were announced, I was excited -- I could rest assured
that the compiler was on my side, ensuring I wasn't causing performance
hits by writing to disk from the UI thread! However, many months later,
I've felt the annotations didn't work as well as I had hoped but I didn't
know the exact cause: I decided to investigate why.

The findings: thread annotations are reasonably robust *except that they don't
follow the call stack.* For example:

{% highlight java %}
@UiThread
void onUiThread() {}

void unannotatedCallsUiThread() {
    onUiThread();
}

@WorkerThread
void testMethodAnnotations(TextView textView) {
    textView.setText(""); // correct: displays warning.
    onUiThread();         // correct: displays warning.

    // UNEXPECTED: the following method does not display a warning.
    // I expect it to because it calls a @UiThread annotated method.
    unannotatedCallsUiThread();
}
{% endhighlight %}

In practice, I've found this to be a glaring flaw. Annotated methods will often
get wrapped by other methods to improve program readability, however, those
wrapping methods will not warn the user like the wrapped methods were intended to.
We could explicitly add an annotation to the wrapping method, however, it is
redundant. Why is that a problem? Redundant code isn't always changed together.
For example:

{% highlight java %}
@WorkerThread
JSONObject getJSONObjectFromFile { /* ... */ }

@WorkerThread // we add the redundant annotation to ensure the warning
int getCountForView() {
    JSONObject obj = getJSONObjectFromFile(...);
    int count = obj.getInt("count");
    return count;
}

// Let's refactor getCountForView to get the count from memory instead.
// Will we remember to remove the @WorkerThread annotation? When we remove
// it, do we remember why it's there? Are we sure it's still not necessary?
// What if getJSONObjectFromFile was wrapped by a less obvious method like,
// `mergeDataSourcesToJSONObject`?  It'd be much simpler (and correct!) if
// the annotation warnings to follow the call stack.

JSONObject getJSONObjectFromMemory() { /* ... */ } // no annotation

@WorkerThread // no longer necessary.
int getCountForView() {
    JSONObject obj = getJSONObjectFromMemory(...);
    // ...
}
{% endhighlight %}

Also, it's easy to forget to add a redundancy and takes time to ensure they're
otherwise consistent. How large is your call stack
starting from a framework annotated method like, `onCreate`, to one of your utility methods
like your `writeJSONObjectToFile`? It's difficult to add the annotations to each of
them, nevermind adjust them when the code is refactored.

There is a large maintenance burden for adding redundant annotations and they're
likely to become incorrect over time.

### Runnables
Additionally, `Runnable` instances do not infer which thread they're running on:

{% highlight java %}
activity.runOnUiThread(new Runnable() {
    @Override
    public void run() {
        // The UIThread is not inferred.
        onWorkerThread(); // UNEXPECTED: no warning
    }
});
{% endhighlight %}

From an implementation standpoint, this makes sense -- `Activity.runOnUiThread`
has to call `yourRunnable.run()` and can't set the thread annotation on the
`run` method, given how they currently work.

We can explicitly annotate, however, note the redundancy:

{% highlight java %}
activity.runOnUiThread(new Runnable() {
    @UiThread // ADDED: however, it is redundant to `runOnUiThread`
    @Override
    public void run() {
        onWorkerThread(); // correct: displays warning.
    }
});
{% endhighlight %}

This redundancy is not as bad as the one mentioned above (as we'll see below).

The explicit annotation on the overridden method can also be added to a
non-anonymous class:

{% highlight java %}
class UiThreadRunnable extends Runnable {
    @UiThread // Still redundant to `runOnUiThread`
    @Override
    void run() {
        onWorkerThread(); // correct: displays warning.
    }
}
{% endhighlight %}

### HandlerThreads
Like `Runnable`, `HandlerThread` instances do not infer their `Looper`
and have a similar issue:

{% highlight java %}
new Handler(Looper.getMainLooper()) {
    @Override
    public void handleMessage(Message inputMessage) {
        // Main thread looper is not inferred.
        onWorkerThread(); // UNEXPECTED: no warning.
    }
};

new Handler(Looper.getMainLooper()) {
    @UiThread // redundant to `Looper.getMainLooper()`
    @Override
    public void handleMessage(Message msg) {
        // But we can be explicit.
        onWorkerThread(); // expected: displays warning.
    }
};

class UiThreadHandler extends Handler {
    public UiThreadHandler(Looper looper) {
        super(looper);
    }

    @UiThread
    @Override
    public void handleMessage(Message msg) {
    }
}
{% endhighlight %}

It's the same situation if we create a new `Handler` on a worker thread.

## When is it useful to add thread annotations?
The most obvious place to put them are your top-level runnables. Not likely to
be moved between threads.

Minimally changing code.
  e.g. public code.

Public APIs because they're not changing anytime soon e.g. onCreate. i.e.,
whenever you'd write a comment, add an annotation too.

Similarly, if you practice proper modularization the public methods of the
public classes in a stand-alone package should be annotated.

You should probably comment when you add an annotation too.

However, these aren't useful

## Thread annotation robustness
TODO: Do we want this?

I said they were robust, we should give them credit. Link to github.

The following techniques correctly display a warning:

* Calling UiThread methods (including `View.*`!) from `@WorkerThread` methods and
  vice versa.
* Overriding methods in a subclass inherit the thread annotations from the
  overridden method.
* 



[docs]: https://sites.google.com/a/android.com/tools/tech-docs/support-annotations
