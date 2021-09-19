---
title: Is it in Nightly yet?
tags: [mozilla,sideprojects]
---
Are you a Mozilla developer? Has your manager, itching to try out your
latest feature, ever asked you, "Is it in the latest Nightly build yet?"
I asked myself a little too often so I built a thing:

![Screenshot](/im/posts/is-it-in-nightly.png)

It's quite simple - pass in a changeset id and get an answer! Try it out
at [http://mcomella.xyz/is-it-in-nightly](http://mcomella.xyz/is-it-in-nightly)!

## Lessons learned

### React

I've been thinking about ways to construct more robust applications
in less time. To this end, [React][react] is mentioned a lot and this seemed
like a great opportunity to finally get my toes wet. Here are some things I
liked:

- Proper modularized components<sup>1</sup> reduces the burden of
context-switching between UI elements, making it simpler to think about,
focus on, and maintain each component.

- Via the `this.setState` calls, React explicitly forced me to declare
and reason about state changes in my app. Rather than thinking about the
state of the few variables I was actively using, I naturally thought
through the state of all of the variables in my component.

  I benefited from this when I was adding error handling
that returned from a callback early. With my traditional development
patterns, I would have initially forgotten to update the component state
but with React, I was naturally conscious of my state changes and added
the code as second-nature.  Notably, I also got the error handling state
change correct the first time, which I probably wouldn't have done in
traditional development, where I might forget to update a variable.

To be fair, I'll need to build a more complex app to really experience
& understand what the benefits of React are -- and more importantly, its
trade-offs!

### Testing

While I implemented this project, I was faced with a dilemma: write tests
because I'm creating a program I'd expect others to use<sup>2</sup> or
don't because it's just a small project. In the end, I decided to write
a few tests.

I came to discover that, even on tiny projects, testing is invaluable.

The server response in the initial implementation was slow when a changeset
was not in Nightly because the server didn't return quickly for invalid
changeset IDs.  I decided to add a fast fail implementation to
`mozhg.isRevisionSetValid`, for which I already wrote some tests that
passed the first time -- you know, the kind that you have to intentionally
break to make sure they're actually working -- and, given how simple the
code I added was<sup>3</sup>, I was surprised to find these tests failing,
despite the application seeming to perform correctly with manual testing.

Testing is great: I intend to do more.

### Code re-use

I originally built this with a server component<sup>4</sup> and later found out
I could do this all in a standalone HTML page. Given how much easier it is to
host HTML content, I decided to make the conversion.

My server implementation was in [node.js][node] and, using
[browserify][browserify], I found it incredibly easy to move my code from the
server to the browser. Given that my my code was already divided into the
`mozhg` node module and my client-side React code, I simply had to rewrite the
entry point of the page to delegate calls from React directly into my node
module, rather than passing these requests to the server. If I had written the
server in Python, it would have been a lengthy conversion!

Writing server-side and client-side code in the same language can be extremely
valuable if it's unclear where the separation of concerns will lie. That being
said, I could have done more research about what was possible, but there are
trade-offs: we don't always have time to do all the research.

## Implementation
To find the latest Nightly changeset ID, I dive into [Mozilla's latest
Nightly file dump][dump]<sup>5</sup>. Once there, I take the `moz_source_stamp`
attribute from the `fennec*.json` file. `moz_source_stamp` represents
the topmost commit that made it into that night's build.

With changeset ID in hand, I access [Mozilla's hgweb service][hgweb].
There are [JSON APIs available][json] for most of the commands you'd
find in a local hg repository and, fortunately for me, anything involving
revision sets isn't one of them. As such, I scrape the html interface
for a mozilla-central changelog revision set query. This query goes from
the changeset specified by the user to the latest Nightly changeset. If
the query returns an empty list, the user-specified changeset is either
1) not in mozilla-central or 2) appears after the last Nightly changeset
and thus is not in Nightly. If it returns a list of changesets, the
changeset is in mozilla-central before the last Nightly changeset and
thus is in Nightly.

As I elaborated on in the testing section above, in order to return
quickly from this method, I validate the changesets before passing them to the
revision set function.

Curious for more? You can find the source [on Github][githug].

- - -

<sub>
1: e.g. compared to web development without UI frameworks, but this is
also a general statement about how important encapsulation is.
</sub>

<sub>
2: It helps that my application depends on external factors like website
scraping too.
</sub>

<sub>
3: It turns out I did not intend to return `r1 && r2`, a coercion of my
string input arguments. Instead, I wanted `isR1Valid && isR2Valid`, which
are two booleans. [Oh, Javascript...][wat]
</sub>

<sub>
4: I make XSS requests (to get the revision content) and got blocked by
CORS. I created a server component to make the requests on the client's
behalf before I realized the requests were only blocked when accessing
the Mozilla properties via `http`, as opposed to `https`.
</sub>

<sub>
5: The file dump is specific to Firefox for Android, which may or
may not share the same latest commit for its nightly builds with other
projects (e.g. desktop Firefox). If you're interested in using this for
other projects, [file an issue][issue]!
</sub>


[dump]: https://archive.mozilla.org/pub/mobile/nightly/latest-mozilla-central-android-api-15/
[hgweb]: http://hg.mozilla.org
[json]: http://gregoryszorc.com/blog/2015/08/18/json-apis-on-hg.mozilla.org/
[browserify]: http://browserify.org/
[githug]: https://github.com/mcomella/is-it-in-nightly
[issue]: https://github.com/mcomella/is-it-in-nightly/issues
[react]: https://facebook.github.io/react/
[wat]: https://www.destroyallsoftware.com/talks/wat
[node]: https://nodejs.org
