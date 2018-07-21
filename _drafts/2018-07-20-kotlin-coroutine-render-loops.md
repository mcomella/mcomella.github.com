---
tags: kotlin
title: "Suspend allocates! Be careful with render loops and Kotlin coroutines"
---

Kotlin coroutines seem like a convenient way to write a ~60 FPS render loop: the loop can share its thread (the UI thread?) when it's not processing and coroutines' syntax keeps the code readable.

```kotlin
private val UPDATE_DELAY_MILLIS =
        Math.floor(1 / 60.0 * 1000).toLong() // ~60 FPS.

fun spawnGameLoop() = launch(UI) {
    while (isActive) {
        updateForFrame()
        delay(UPDATE_DELAY_MILLIS) // Thread suspends.
    }
}
```

*Disclaimer: this render loop is simplified for readability.*

However, the code is hiding something: **each coroutine suspension allocates memory.** Over time, this can trigger pauses for garbage collection that can drop frames and create a janky user experience. In general, it's best practice to avoid allocations in rapidly called functions. Let's take a look at the Android profiler:

Many allocations but small ones.

## Next Steps
- Performance hit of allocation?
- Perf hit of coroutine dispatching?
- How accurate are coroutine time updates?
- Performance of tight render loop (handlers) vs. coroutines.


## Solutions
It's clear we can't suspend

Dedicate a thread to your game loop and block it.

On Android, use handler.

Avenues I haven't explored:
- How expensive is dispatching?
- How accurate are updates?
- Someone else doing too much on your threads at the same time.


[lightweight]: http
