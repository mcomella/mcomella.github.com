---
title: Android Studio 3.0 Profiler Injects Files Into Data Directory
tags: [mozilla,android]
---
After upgrading to Android Studio 3.0, I discovered a few mysterious new files
in my app's data directory (`/data/data/org.mozilla.focus.debug/`, in this
case):
- libperfa_x86.so
- perfa.jar
- perfd (binary file)

After some investigation, I discovered these files are a product of Android
Studio 3.0's newly rewritten profiler and are added under the following
conditions:
- Built with Android Studio 3.0+ (i.e. not Gradle)
- Running on an API 26+ device <sup><a href="#notes">1</a></sup>
- Have opened the "Android Profiler" tab at least once since the AS process
started

The [new Android profiler documentation][profiler] supports these conditions:

> To show you advanced profiling data, Android Studio must inject monitoring
> logic into your compiled app.

It provides some instructions to enable it, after which I see the "Enable
advanced profiling" checkbox is disabled and states "required for API level <
26 only":

![Screenshot of disabled "Enable advanced profiling" checkbox](/im/posts/advanced-profiler-unchecked.png)

I originally started investigating this in Firefox Focus for Android
[issue #1842][1842] so you can find more investigation details in that issue.

---

You can try it out for yourself by downloading my
[WhatsInMyDataDirectory][datadir] Android project (essentially an empty Android
app) and notice that the files are only added after meeting the conditions
above.

---

Why might you care? In our case, as part of [Firefox Focus][focus], we [verify
there are no unknown files][unknown files] left over on disk after a browsing
session ends, just in case they leak user data. These new files were unknown to
our test, triggering our assertion. We confirmed these files would not leak
user data because they do not appear for users on release builds.

<a name="Notes"></a>
## Notes
<sub>
1: You can enable advanced debugging on older devices, which may also inject
these files - I didn't test this. To do so, see the "Enable advanced profiling"
on the [new Android profiler overview page][profiler].
</sub>

[profiler]: https://developer.android.com/studio/preview/features/android-profiler.html
[datadir]: https://github.com/mcomella/WhatsInMyDataDirectory
[1842]: https://github.com/mozilla-mobile/focus-android/issues/1842
[focus]: https://www.mozilla.org/en-US/firefox/mobile/
[unknown files]: https://github.com/mozilla-mobile/focus-android/blob/16129cc35cc82fcecb9f3a2cf8afbe2f79eb9cc8/app/src/androidTest/java/org/mozilla/focus/activity/WebViewDataTest.java
