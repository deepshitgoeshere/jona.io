---
title: a tiny introduction to brainfuck
short: brainfuck-intro
date: 2015-10-10
description: good
author: jona
---

Ah yes. Brainfuck. In many ways regarded as the "original esoteric language", it was created in regard to make the smallest possible compiler _(which has since been disproven again)_. It consists of only eight basic commands and an instruction pointer. The instruction pointer looks somewhat like this:

```
-----     -----     -----
| 0 | --- | 0 | --- | 0 | and so on...
-----     -----     -----
  ^
```
Yes, it's simply just a bunch of cells, each of which can hold a decimal value, with an arrow that points to one of those. But enough about that _for now_, let's see how we can install it.

### Installation

Brainfuck doesn't have an __official__ compiler, but rather, lots of compilers in different languages exist. The good™ thing is that additionally, lots of online interpreters exist (because, in the end, the language only has eight commands and therefore isn't _that_ hard to interpret), one of those being [this visualizer](http://fatiherikli.github.io/brainfuck-visualizer/), which is by far my favorite because it actually shows you what the content of the cells is __during runtime__.

One compiler you can probably get from your Linux/FreeBSD machine is __beef__, which describes itself as a "flexible brainfuck interpreter". It should be installable from APT, the AUR and maybe even pkg? I didn't check.

### Basics

As I said before, Brainfuck has eight (8) basic commands:

`+` - Increments the cell the pointer is at by 1.

`-` - Decrements said cell by 1.

`<` and `>` - Moves the pointer to the previous and next cell.

`.` - Prints the value of the current cell to `stdout` (in ASCII).

`,` - Takes a single byte of input from `stdin`.

`[` and  `]` - Loops the contents inside for as long as the cell the pointer is on after `]` ends isn't at zero (0).

The looping might surpise some people at first, but once you get it, it's actually easier than it first sounds. So, let's give it a spin by printing out the letter 'A':

```brainfuck
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
```
Output:
```
A (65 in decimal)
```

But ugh, that doesn't really look like good code, does it? Let's use the looping feature to our advantage:

```brainfuck
++++++++[>++++++++<-]>+.
```

Output:

```
A
```

But how did this work? Well, in Brainfuck, most of these loops actually use simple multiplication. Let's check it out one by one:

```brainfuck
++++++++ Increments cell 0 to 8
[
  > Switches to cell 1
  ++++++++ Increments cell 1 eight times
  <- Switches back to cell 0 and decrements it by 1
]
> Switches to cell 1
+ Adds 1 to cell 1
. Prints the resulting number (65) out
```

I forgot to mention, in most compilers, anything other than `+-><[],.` is not compiled, effectively making it a comment. That's why we can just write text and numbers in there.

So, did you guess what the loop actually does? It multiplies the number eight by the number in cell 0, which is also 8, therefore making the result 64. But because that's not the number we want, we're gonna add 1 to it, which we do after the loop.

That is the simplest way to go about constructing complex numbers in Brainfuck. For, say, 45, you'd see and say "oh hey, 44 is 11 times 4" and then construct a loop like this:

```brainfuck
++++[>+++++++++++<-]
```

, which puts 44 in cell 2. Now you only need to add a `>+` after it. Simple as that!

I will not get into the more advanced stuff, I'll only focus on the basics. Nevertheless, there wasn't really much to write here since Brainfuck itself is a pretty barebones language. If you want more examples of how powerful the language is, though, I recommend you to check out [some brainfuck fluff](http://www.hevanet.com/cristofd/brainfuck/) by Daniel B. Cristofani.
