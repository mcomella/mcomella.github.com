---
tags: mozilla, kotlin
---
There are many ways to organize a file in Kotlin, 
months is that there are many ways to write things

```kotlin
/* A license header. */

package xyz.mcomella.kotlinfilestructure

import android.graphics.Point
import android.graphics.PointF
import java.util.UUID

// 1) Private constants. Public constants should generally
// be placed in a companion object to namespace them.
private const val VELOCITY_MODIFIER = 4.5f

// 2) Short enums, classes, or interfaces:
// longer ones should appear near the bottom.
enum class PlayerColors { RED, YELLOW, BLUE, GREEN }

/** 3) Primary class in this file. */
class PlayerModel(val name: String, val boardSize: Point) {

    // 4) Properties: generally sorted public
    // (the class' contract) to private [1].
    var onUpdateListener: ((PointF) -> Unit)? = null
    var isVisible = true

    val id = generateID()
    private val position = PointF(0f, 0f)

    // 5) Methods: generally sorted public
    // (the class' contract) to private [1].
    fun updatePosition(velocity: PointF) {
        updateX(velocity.x)
        updateY(velocity.y)
        onUpdateListener?.invoke(position)
    }

    // 6) Helper functions with side effects.
    private fun updateX(velocityX: Float) {
        position.x = position.x +
                velocityX * VELOCITY_MODIFIER
    }

    private fun updateY(velocityY: Float) {
        position.y = position.y +
                velocityY * VELOCITY_MODIFIER
    }

    // 7) A companion object. if needed.
    companion object { /* ... */ }
}

// 8) Helper functions without side effects,
// in contrast to 6) above.
private fun generateID() = UUID.randomUUID()

// 9) Long enums, classes, or interfaces:
// shorter ones should appear near the top.
class PlayerEventDispatcher /* ... */
```

When I open a file, I start at the top. What I want to know is:
* How can this class change state (the public methods)
* What state can change?

Only so many things in head so keep it short: only things in the braces can actually modify class. Gets things we don't care about outside: constants, non-side effects

* Separate side effects: 
* What bytecode/perf of this?
* Works for small files, haven't seen larger or many devs
* Cnotrived, but other Examples?
* Left out companion.

Other guides say don't sort public to private: I think it's helpful but they're right that related code should be put together.

https://android.github.io/kotlin-guides/style.html#top-level-declarations

https://kotlinlang.org/docs/reference/coding-conventions.html#class-layout