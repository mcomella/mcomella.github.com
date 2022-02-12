---
title: "Easily Sign Local Android Release Builds For Testing With local.properties"
tags: [android,mozilla]
---

When you install an Android debug build, it just works. However, building a release build locally for testing purposes<sup>1</sup> is tedious if your team policy is to avoid committing your signing configuration<sup>2</sup>. The official documentation implies two methods:
1. Add your [signing configuration into build.gradle](https://developer.android.com/studio/publish/app-signing#sign-auto) and [load that configuration from `keystore.properties`](https://developer.android.com/studio/publish/app-signing#secure-shared-keystore)
1. Sign the APK [using the command line tools](https://developer.android.com/studio/command-line/apksigner)

In both cases the developer needs to take the time to generate a keystore/keys and configure the build process to recognize them, in addition to obstacles specific to each scenario.

What if building local release builds could _just work_ for all of your developers, as debug builds do? What if you could launch them directly from Android Studio? Keep reading for a solution.

## Easily signing local release builds
Since the Android build tools already generated a debug signing key for us, we can get the convenience of debug builds for release builds if we configure the build process to sign release builds with our debug signing key. **This functionality should be opt-in to avoid signing release builds intended for production with debug keys** (see "WARNING" section below) so we'll add a configuration option to enable this in the uncommitted `local.properties` file that Android Studio generates.

To start, we'll need to read the contents of `local.properties` in our `app/build.gradle` file:
```gradle
def loadLocalProperties() {
    // Android Studio creates a local.properties file in the root directory of
    // the project. Since this gradle file is in the default app module, we
    // need to look in the parent directory for the local.properties file.
    def f = file("../local.properties")
    def properties = new Properties()
    if (f.canRead()) {
        f.newReader().withReader {
            properties.load(it)
        }
    }
    return properties
}

def localProperties = loadLocalProperties()
```

Then we can update our project signing configuration in `app/build.gradle` to use the new property, named `autosignReleaseWithDebugKey`:
```gradle
android {
    // ...

    buildTypes {
        // ...

        release {
            // ...

            if (localProperties.getProperty(
                    "autosignReleaseWithDebugKey", "false").toBoolean()) {
                signingConfig signingConfigs.debug
            }
        }
    }
}
```

Finally, each developer that needs to build a release build can set that property in their `local.properties` file to enable automatic release build signing:
```gradle
autosignReleaseWithDebugKey=true
```

**Now we're done!** You can install release builds directly from Android Studio or via the command line (`./gradlew installRelease`) without committing your signing keys or requiring each developer to learn how to generate new ones. You can find [an example project with these changes on GitHub](https://github.com/mcomella/SignReleaseWithLocalProperties).

Note: I'm not sure if this would need to change if your app uses App Bundles.

## WARNING: do not sign production builds this way!
We don't want to sign production release builds with our debug keys because these keys are not generated to be secure (e.g. everyone's debug keys have the same password) and you may be locked into using your insecure debug keys on your production application.

To avoid this, **never opt-in to this functionality on a device that builds your production release builds** such as your CI machines or the local developer who creates the production builds. If you follow this advice and implement this correctly, you shouldn't run into these issues.

---

### Notes
<sub>1: As an example, you may want to build a release build to avoid measuring [unrealistic performance from `debuggable=false` during performance tests](https://www.youtube.com/watch?v=ZffMCJdA5Qc&feature=youtu.be&t=625) or to verify a fix to your ProGuard configuration.</sub>

<sub>2: Not committing your signing keys makes sense if you're an open source project or don't want to share the ability to sign the app broadly within the team.</sub>
