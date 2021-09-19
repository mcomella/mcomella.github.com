---
title: Droidcon at a Glance
tags: [android,mozilla]
disqus-id-override: /blog/2016/droidcon-at-a-glance-.html
---
So much to do -- *so little time!* That's my main take-away from the two days I
spent amongst the cutting edge Android developers at [Droidcon SF][droidcon].

This week I had the opportunity to discover the great depths of innovation
present in the Android developer community, who have taken it upon
themselves to explore strange new worlds, to seek out new technologies,
and to boldly go where no dev as gone before -- it's reminiscent of the
exciting innovations currently impacting the web. For example, Lyft is
re-inventing the wheel (no pun intended) with [View-only
development][view-only], startups such as [Nimbledroid][] are creating
analysis tools we could only wish came with the platform, and entirely
new JVM languages such as [Kotlin][] are being used to substitute for the
platform standard Java.

My latest development interests revolve around my work at Mozilla: as a
small team, how can we move faster? I see opportunities to write less
code by using libraries<sup>1</sup> and to cause fewer regressions with
better code architecture, better testing, and tools that make certain
classes of common errors unlikely or even impossible! Droidcon pointed
out many partial solutions to these issues and I'm excited to try to
implement some with my team.

<sub>1: In the past, we've strayed away from using libraries because
we're on a strict APK size diet, but these days it's hard to ignore the
productivity gains.</sub>

## Quick Firefox for Android wins
1. Add [Facebook's Infer][infer] to CI. It apparently does a great job of
   catching `NullPointerException`s, amongst other checks.
1. Use [Sympli][] for seamless collaboration between engineers and designers.
   For my workflow with my designer, [antlam][], it'll be a huge time saver.
1. Consider [Nimbledroid][] for performance analysis. We roll our own and it
   can be time consuming -- it'd be great to outsource.
1. Investigate [Mobile Enerlytics][] for power consumption analysis. We don't
   have any official process to analyze power use so this could be a great
   start.

Some of the technologies listed here are startups and I was quite delighted
by their desire for collaboration: "What features would you want from
our application?" and "If there's something that doesn't work for you,
let us know and we'll do our best to fix it!" were common -- really cool.

## Long term explorations
I believe these technologies can help us move faster, but unlike those
above, they will come at some adoption cost to our development team. I
haven't spent enough time with these technologies yet so I don't know
the full story and if they're truly worth implementing.

1. Use a formal code architecture pattern like [MVP][] or highlight's
   [web-inspired reactive data flow model][web-native]. These can be added
   incrementally and encapsulate data, but generally require some developer
   ramp up for use.
1. Incorporate libraries to replace some of the code we write & maintain (e.g.
   [OkHttp][]): less developer time spent here, more developer time spent
   there! However, it'll eat into our APK size and method limit budgets.
1. Utilize libraries that enable different programming paradigms (e.g.
   [RxJava][]). This will usually allow incremental changes like changes to code
   architecture patterns but with even more ramp up and an larger impact on our
   APK size.
1. Consider using a more expressive programming language like [Kotlin][]. This
   could provide us with additional safeness and conciseness that we can use to
   move more quickly. It can even be written side-by-side with Java so we can
   integrate it slowly. However, adopting a new language comes with its own
   issues including developer ramp up time and the potential for poor tooling
   and eventual lack of support. But eliminating `NullPointerException`s
   altogether is tempting...

There will be more details about these technologies in my follow-up post about
the talks I saw.

## Long tail investigations
Lower priority things (I think!) to consider in the future:

### Development techniques
* [Avoiding fragments][fragments] due to their complex lifecycle.
* [View-based development][view-only], in an attempt to avoid the complexities
  of lifecycle events.

### Libraries
* Dependency injection (e.g. [Dagger][]).
* Animation libraries like [Rebound][] and its wrapper, [Backboard][].
* An Uber talk mentioned something called "Rave", a bunch of annotations, that
  I can't seem to locate.
* [Network Connection
  Class](https://code.facebook.com/projects/1547113495553528/network-connection-class/)
  to determine what type of network a user is on.
* [Device Year
  Class](https://code.facebook.com/projects/1552773164984484/device-year-class/)
   to determine how powerful a user's device is.

### Tools
* Use [Checkstyle][] in local builds -- save ourselves some time in code review.
* Look for other cloud analysis tools we can use like [Monkop][].
* [Bugsnag][] crash reporter (caveat: does not work with native crashes).
* Compare Java 8 support to alternatives like Kotlin.
* According to the guy who wrote ProGuard, non-optimized builds with ProGuard
  are faster than builds without ProGuard!

[antlam]: https://medium.com/@antlam/
[backboard]: https://github.com/tumblr/Backboard
[bugsnag]: https://bugsnag.com/
[checkstyle]: http://checkstyle.sourceforge.net/
[dagger]: https://square.github.io/dagger/
[droidcon]: http://sf.droidcon.com/
[fragments]: https://corner.squareup.com/2014/10/advocating-against-android-fragments.html
[infer]: http://fbinfer.com/
[kotlin]: https://kotlinlang.org/
[mobile enerlytics]: http://mobileenerlytics.com/
[monkop]: https://www.monkop.com/
[mvp]: https://github.com/rallat/EffectiveAndroid
[nimbledroid]: https://nimbledroid.com/
[okhttp]: https://github.com/square/okhttp/
[rebound]: https://facebook.github.io/rebound/
[rxjava]: https://github.com/ReactiveX/RxJava
[sympli]: https://sympli.io
[view-only]: https://github.com/lyft/scoop
[web-native]: https://www.youtube.com/watch?v=UsuzhTlccRk
