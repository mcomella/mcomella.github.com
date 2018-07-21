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
- Keep related ideas together, after addressing the earlier points.

An improvement Kotlin makes over Java is that **we can define functions outside of the primary class**: let's move those irrelevant and trivial ideas outside the primary class block, centralizing our key ideas and complex concepts inside the block. Let's have a look:

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

If you want to see a real example, check out TODO.

## Caveats and Related Ideas
I've only been using this pattern for a few months now so I'm unsure how this will hold up long term, especially as files grow in size and other developers contribute to these files. I also don't know what it's like to be another developer reading the code (beyond revisitng my own code after several weeks).

To make code easy to understand, we can't just focus on file organization. We should also at least consider:
- Naming
- Commenting
- Design of functionality (e.g. simplicity, decoupled, [the single responsibility principle][single])

## Second opinions
There are two official style guides for Kotlin -- from JetBrains and from Android -- which provide less opinionated suggestions for file organization. They generally give the advice that we should group related ideas and maintain a consistent logical ordering.

Specifically, [JetBrains suggests][kstyle], *"Do not sort the method declarations alphabetically or by visibility, and do not separate regular methods from extension methods. Instead, put related stuff together, so that someone reading the class from top to bottom would be able to follow the logic of what's happening. Choose an order (either higher-level stuff first, or vice versa) and stick to it."*

I find that sorting by visibility can improve readability but with many developers it's harder to maintain than grouping related ideas.

[From Android][astyle]: *"Source files are usually read from top-to-bottom meaning that the order, in general, should reflect that the declarations higher up will inform understanding of those farther down. Different files may choose to order their contents differently. Similarly, one file may contain 100 properties, another 10 functions, and yet another a single class."*

*"What is important is that each class uses some logical order, which its maintainer could explain if asked. For example, new functions are not just habitually added to the end of the class, as that would yield “chronological by date added” ordering, which is not a logical ordering."*

Which doesn't conflict with my suggestions here.

## Summary
There are many articles written on how to organize source code files. The key idea that I want to add is that **we can declare functions for trivial code outside of the primary class block, grouping key and complex ideas inside the class block**: this will guide programmers to focus on what's key/challening rather than the trivial details.

[memory]: https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two
[astyle]: https://web.archive.org/web/20180103180641/https://android.github.io/kotlin-guides/style.html#top-level-declarations
[kstyle]: https://web.archive.org/web/20180202195826/https://kotlinlang.org/docs/reference/coding-conventions.html#class-layout
[single]: https://en.wikipedia.org/wiki/Single_responsibility_principle
