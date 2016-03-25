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

The findings: thread annotations are reasonably robust *except that they
don't follow the call stack.* For example:

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

In practice, I've found this to be a glaring flaw. Annotated methods
will often get wrapped by other methods to improve program readability,
however, those wrapping methods will not warn the user like the wrapped
methods were intended to.  We could explicitly add an annotation to the
wrapping method, however, it is redundant. Why is that a problem? Redundant
code isn't always changed together.  For example:

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

Also, it's easy to forget to add a redundancy and takes time to ensure
they're consistent. How large is your call stack starting from a framework
annotated method like, `onCreate`, to one of your utility methods like
`writeJSONObjectToFile`? It's difficult to add the annotations to each
of them, nevermind adjust them when the code is refactored.

There is a large maintenance burden for adding redundant annotations and
they're likely to become incorrect over time.

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
has to call `yourRunnable.run()` and can't set the thread annotation on
the `run` method, given how they currently work.

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

This redundancy is not as bad as the one mentioned above (as we'll see
later).

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
        onWorkerThread(); // expected: displays warning.
    }
}
{% endhighlight %}

It's the same situation if we create a new `Handler` on a worker thread.

## When is it useful to add thread annotations?
Thread annotations are most useful when the thread context of the method
is unlkely to change. Some examples:

* Methods that directly wrap thread-specific APIs, e.g. `writeJSONObjectToDisk`
should only run on a worker thread and `updateViewFromCursor` should
only run on the UI thread.
* Methods that may not directly wrap thread-specific APIs but have a
specific thread context in mind, e.g. `mergeDataFromDisk`.
* `Runnable` and `HandlerThread` methods, e.g. a `Runnable` posted to
the UI thread to update view state isn't going on a worker thread any
time soon.
* Interfaces used for callbacks if the callback will be called on a specific
thread -- e.g. if your callback will be called on the UI thread, instead of
taking `Runnable`, create a new interface like `UiThreadRunnable` and use that.
* Public APIs, e.g. as a library maintainer. Since these methods are
public, they're hard to change without breaking others' builds. As such,
their contract, including which thread they run on, is likely to stay
the same for many revisions. For example, the `Activity.onCreate` can be
annotated with `@UiThread`.

These annotations may catch a few bugs but as we saw above, without
redundancy, they won't catch everything. That being said, they're still
useful -- just know their shortcomings and don't rely on them.

Also, when you add a thread annotation, consider adding a comment to
explain why it's there.

## Working hard, not hardly working
Besides the concerns above, the thread annotations work just as I would
expect!  Here are a few of the places where thread annotations delight:

* Methods on the `View` classes that change visible View state are
annotated `@UiThread`, e.g. `TextView.setText`
* `AsyncTask` is appropriately annotated -- `doInBackground` is
`@WorkerThread` and `onPostExecute` is `@UiThread`
* Overriding methods in a subclass inherit the thread annotations from
the overridden method in the super class (or interface).

I have examples for these and more on [Github][src].

[docs]: https://sites.google.com/a/android.com/tools/tech-docs/support-annotations
[src]: https://github.com/mcomella/ThreadAnnotationsTest/tree/master/app/src/main/java/xyz/mcomella/threadannotationstest
