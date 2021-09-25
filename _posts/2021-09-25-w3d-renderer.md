---
title: "Reimplenting the Wolfenstein 3D renderer"
tags: [side projects]
license: "This work is copyrighted by Michael Comella with exception to the second screenshot, top-to-bottom, which I suspect is property of id Software because it contains screenshots featuring textures from the Wolfenstein 3D shareware release."
---
When I was young, I was told that games like [Wolfenstein 3D][wiki] use "fake 3D" and ever since I've been wondering what they meant by that. I recently satisfied my curiosity by reading through Fabien Sanglard's very enjoyable book, [**Game Engine Black Book: Wolfenstein 3D**][gebb], which explains how Wolfenstein 3D was built. While reading, I realized, "Hey -- I can do that!" and set about reimplenting the renderer: specifically, the algorithm that generates and textures the walls in a 3D perspective. Here's the result with a texture and a map I generated myself:

<img loading="lazy" src="/im/posts/w3d-programmer-art.webp" alt="A screenshot of Wolfenstein 3D as rendered by mcomella's implementation with mcomella's textures"/>

It's neat that [the original Wolfenstein 3D code is open source][w3d-source] and that its asset formats are well documented because it allowed me to run my renderer using the original maps and textures. Here's my renderer displaying the first level of Wolfenstein 3D's shareware download:

<img loading="lazy" src="/im/posts/w3d-shareware.webp" alt="A screenshot of Wolfenstein 3D as rendered by mcomella's implementation with the assets from the shareware version of Wolfenstein 3D"/>

If these screenshots look distorted compared to the original Wolfenstein 3D, it's because I ran out of steam before I fixed the aspect ratio.

So what's so fake about the 3D portayed in Wolfenstein 3D and games like it? As I understand it, it's nuanced. The walls are actually rendered in 3D: the engine calculates their projections into 3D space. However, the rendering of the floors and ceilings is an illusion: they're just a solid color. The objects in the game world, including characters, are placed in the two dimensional space defined by the walls but are stored and drawn just like an image you'd see on a website: "flat". These are known as sprites. There is also no conception of vertical space: every level exists on one floor and everything in the game is placed onto it. Note that players and enemies can travel vertically in Wolfenstein 3D's successors such as DOOM: I don't know how this effect is achieved and how it relates to "fake 3D" so I'll just have to read through the [**Game Engine Black Book: DOOM**][gebb doom]. 🙂 Knowing what I know now, it seems misleading to call these games "fake 3D" but I can see the challenges of explaining the nuances to me as a child.

As a tinkerer, I found the openness of the project engaging in a way I didn't expect: it's empowering to not only read and understand the code powering such an influential piece of software but also to be able to tweak it to satisfy my curiosity or to adapt some parts of it to my own project (like how I used the assets but not the renderer). In the same spirit, here is [the source code of my implementation][source] -- please respect the licenses!

If you curious about how the renderer is implemented, I highly recommend you read the [**Game Engine Black Book: Wolfenstein 3D**][gebb]. Thank you, Fabien Sanglard, for writing the book and inspiring this project and thank you to id Software for releasing the source code to enable curious folks like myself to learn.

[gebb]: https://fabiensanglard.net/gebbwolf3d/
[gebb doom]: https://fabiensanglard.net/gebbdoom/
[w3d-source]: https://github.com/id-Software/wolf3d
[wiki]: https://en.wikipedia.org/wiki/Wolfenstein_3D
[source]: https://github.com/mcomella/w3d-renderer
