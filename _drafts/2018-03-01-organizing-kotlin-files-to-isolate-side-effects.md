---
tags: mozilla, kotlin
---
A well-organized source file can nudge a programmer down an easier path to understanding the code. Code that is easy to understand is easier to add to  and code that is easier to add to is more likely to stay well-organized, completing the circle.

What makes a well-organized source file? It's helpful to understand what programmers look for when reading code. When I open a new file, I want to know:
- **What** makes this class change, i.e. what are the entry points of this class? These are usually the non-private members which respond to external events, e.g. from the user or server.
- **How** does this class change in response to these events? i.e. what do the class' variables get set to after each non-private method is called?

If I understand these points, I can understand the internals of the class. If a source file is organized to make these points easy to understand, I'd consider it well organized.

## Key Ideas
There are a few principles I use when organizing a single source file:
- **Put the key ideas near the top**: humans generally read from top to bottom.
- Get 1) trivial to understand and 2) irrelevant-to-the-key-idea code out of the way, towards the bottom: there are [only so many ideas a human can hold in their working memory][memory] so save that space for the complex concepts and key ideas.
- Barring ^, keep related ideas together
- Single class file?

A benefit that Kotlin gives us is that **we can have multiple top-level declarations**: those irrelevant and trivial ideas that we wanted to hide at the bottom *can be declared outside of the primary class*, centralizing our key ideas and complex concepts inside the class block. Let's have a look:

TODO: describe the summary more clearly here? And repeat it below.
TODO: define top-level declaration (functions defined outside the class?)

```kotlin
// By convention, for easy access, constants are at the top.
// Fortunately, it's easy to skip over this section.
private const val CONSTANT = 40

/**
 * Directly below the constants, the primary class in this file:
 * this javadoc should explain the responsibilities of this class
 * so the programmer knows what key ideas to expect next.
 *
 * Your key ideas and complex concepts should go inside this block.
 */
class PrimaryClass {

    // The variables of this class: they explain how this
    // class can change. Public variables should be near the
    // top, to bring focus to how the class changes when external
    // code changes their values.
    var position = 0f
    private var velocity = 0f

    // Functions, with the public functions near the top: these public
    // functions are the primary way to start changes to this class.
    fun whenCalledIStartChangesToThisClass() { /* ... */ }

    private fun helperFunctionWhichDoesComplexStateChanges() { /* ... */ }
}

// *THE KEY IDEA*: move all of the easy-to-understand and
// irrelevant private helper functions here, outside the
// primary class block.
private fun hasNoSideEffectsSoIsEasyToUnderstand(int: Int) = /* ... */

private fun bindModelToViewIsConventionalAndGenerallyEasyToUnderstand(
    model: Model,
    view: View
) { /* ... */ }
```

## A Real Example
Let's look at a real source file from Firefox TV:

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

## Caveats and Related Ideas
- Only small source files so far
- Haven't seen how others perceive it, or how changes over time.
- bytecode?

Of course, how you organize a source file isn't the only factor to take into account when making your code easy to understand:
- Naming
- Functionality design: single responsibility principle
- Good comments
- High level ideas together

## Second opinions
Looking at the official style guides for Kotlin:

Other guides say don't sort public to private: I think it's helpful but they're right that related code should be put together.

## Summary
There are many articles and style guides written on how to organize source code files. The key idea that I want to add is **Kotlin lets you group key ideas towards the top in the primary class by moving irrelevant ideas towards down as top-level declarations below the primary class.**

[memory]: https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two
[astyle]: https://web.archive.org/web/20180103180641/https://android.github.io/kotlin-guides/style.html#top-level-declarations
[kstyle]: https://web.archive.org/web/20180202195826/https://kotlinlang.org/docs/reference/coding-conventions.html#class-layout
