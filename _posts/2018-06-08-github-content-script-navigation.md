---
title: "Fixing Content Scripts on GitHub.com"
tags: github, addon
---
When writing a WebExtension using content scripts on GitHub.com, you'll quickly
find they don't work as expected: the content scripts won't run when clicking links,
e.g. when clicking into an issue from the issues list.

Content scripts ordinarily reload for each new page visited but, on GitHub, they don't. This is because
links on GitHub mutate the DOM and use the [`history.pushState` API][] instead of
loading pages the standard way, which would create an entirely new DOM per page.

I wrote [a content script][source] to fix this, which you can easily drop into your own
WebExtensions. The script works by adding a `MutationObserver` that will
check when the DOM has been updated, thus indicating that the new page has
been loaded from a user's perspective, and notify the WebExtension about this event.

If you want to try it out, the source [is on GitHub.][source] You can also check
out [a sample][the sample].

## Alternatives
The seemingly "correct" approach would be to create a `history.pushState`
observer using [the `webNavigation.onHistoryStateUpdated` listener][hist listener].
However, this listener does not work as expected: it's called twice -- once
before the DOM has been mutated and once after -- and I haven't found a good
way to distinguish them other than to look at changes in the DOM, which is
already the approach my solution takes.

[source]: https://github.com/mcomella/github-content-script-navigation/
[the sample]: https://github.com/mcomella/github-content-script-navigation/tree/master/sample
[`history.pushState` API]: https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
[hist listener]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webNavigation/onHistoryStateUpdated
