---
title: the best npm guide in the entire world
short: npm-guide
date: 2016-01-19
description: read this
author: jona
draft: true
---

So, NPM. You're likely to have heard about it. It's The Next Big Thing in the field of package managers, as described by many. Actually though, it's already the Big Thing, since it holds the most number of packages out of any other package manager, 228,616 (at time of writing). By comparison, Maven Central (the second biggest package repository) 'only' has 129,780. That's still a lot, but NPM has almost twice as much.

So, now that we've established that, how do we get going with it? If you have Node.js/io.js installed, *you already have NPM*. That is, unless you use a really old version, like pre-0.8. But why would anyone do that. Like, don't do that.

#### What you need to know

There's some pretty important concepts about NPM that you *need* to understand before moving on:

  1. NPM operates on both *global* level and *local* level. If you've ever used RubyGems, you know what the global level is. Once a gem is installed, it's available in all of your projects since it's stored in `~/.gem`. NPM also does that, with the `-g` command-line flag. We'll get to that later though. The important thing is, most of the time you're going to download packages into your project's `node_modules` directory. This means that the packages in there can only be used in that very project. That is what local level means. It's important to distinguish between those two.
  2. NPM is a package manager, yes, but (but!) it's also a build tool! Stop using Gulp, Grunt, Brunch, Branch, Toilet, Housing Appliance, or whatever the next build tool is going to be named, NPM is here to bring you some serious competition, out of the box. (We'll get to that later, though)
  3. NPM, by default, downloads from http://npmjs.com, which is the central repository for packages. You can, though, set up your own repository if you're enterprise enough. Yes, that means that is costs.

### Your first package.json

Now that we've got that down, let's do this package install thing! First off, make sure you've got a `package.json`. That's sort of like a `Gemfile`, but more like a `pom.xml` (from Maven). It holds info about your package dependencies, but also general info about your project. Here's what it roughly looks like:

```json
{
  "name": "cool-package",
  "version": "0.1.0",
  "description": "a very nice package",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sup/nice.git"
  },
  "author": "jona <jona@jona.io> (http://jona.io/)",
  "license": "MIT"
}
```

`name`, `version` and `description` are pretty much self-explanatory. It's important to note that `version` expects a SemVer-compatible version number. Now I won't lie and say that SemVer, or more precisely, finding out when to bump which version number, has become quite the controversial topic. As a little cheatsheet:

![nice](https://u.teknik.io/ItT633.png)

If you're too lazy to create this manually (like me), just use `npm init`. It walks you through creating a package.json with all of the most important parts.

### Your first package

Let's talk more about `dependencies`. Imagine we'd install [moment.js][1] with the following command:

```sh
npm install moment
```

What happens? The `node_modules` folder is created with the `moment` subfolder in it. This is the *local* level I've talked about earlier. If we look at our `package.json` however, we notice that nothing has changed. Why didn't it add the package to the `dependencies` field or the other, weird, `devDependencies` one? Well, you need to explicitly state that you want the package version saved:

```sh
npm install --save moment
```

Now your `dependencies` field should look like this:

```json
"dependencies": {
    "moment": "^2.11.1"
}
```

As you can see, NPM keeps track of the package's version so that everyone has the same version of it. There's also a thing called version ranges that NPM does (has to do with the `^` before the version), but I won't touch on it. It's really confusing. Just keep it this way and don't worry about it for now.

If you run `npm install` without arguments or flags, it's going to install all dependencies declared in the `package.json`. This is most likely what you want to do when you're in a freshly downloaded/cloned Node.js project. (otherwise it likely won't work)

If you have some package that you need for development, but not in production, use `devDependencies`. This ensures that packages in that field only get loaded in development (`if (NODE_ENV !== 'production')`). You can install a package as `devDependency` like this:

```sh
npm install --save-dev winston
```

`devDependencies` are often build tools like Gulp or debuggers like winston.

### Globalization

There's some cool CLI's (read: **c**ommand-**l**ine **i**nterfaces) out there, and wow! - some are written with Node.js. Most of them are available as NPM package, and here's how to install one:

```sh
npm install -g figlet-cli
figlet -f "Dancing Font" "hello"
```

(`figlet-cli` does the cool command-line font thing, basically.)

The `-g` flag installs it in the `~/.npm` folder and symlinks it into `/usr/local/bin`, from which you can execute it.

### Building with NPM

Now, imagine you have your styles written in Sass/SCSS. How do you compile it into normal CSS? Some people would tell you to install Gulp and `gulp-sass`, but then you'd need a `Gulpfile` and you'd need to learn Gulp's syntax and piping and-- wait, there's an easier way?

*Re-introducing NPM.* Have you noticed the `scripts` field in your package.json? All it does is run commands. But because it runs commands, it's so much more powerful than build tools like Gulp will ever be. Ever ask yourself why UNIX geeks love shell scripts so much? That's the reason.

So, what you can do is install some kind of Sass binary (I recommend `gem install sass`, `node-sass` breaks WAY too often) and write this in your `scripts` field:

```json
"scripts": {
  "css": "sass public/scss/index.scss:public/css/index.css"
}
```

Now, if you run `npm run css`, it'll compile your SCSS and place it in the target location! Woot!

Another cool thing you can do is define a start script like this:

```json
"scripts": {
  "start": "node index.js"
}
```

For the `start` and `test` fields, running `npm start / npm test` is enough. No `npm run` syntax there.

The *third* cool thing is this: If you have a local dependency that has a binary it exposes (like nodemon does, for example), you can refer to that very easily in NPM scripts:

```json
"scripts": {
  "watch": "nodemon index.js"
}
```

*Technically*, you'd need to write this:

```json
"scripts": {
  "watch": "./node_modules/.bin/nodemon index.js"
}
```

But NPM does that for you! How awesome is that! But, you may ask, why do you need a local dependency of nodemon when you can just install it globally? It's so that people getting into your project don't have to run a `npm install -g package_1 package_2 ...` explicitly, but can just run `npm install` and have it handled for them. And since only the NPM scripts use those scripts, it doesn't clog up the global command namespace as well.

I really hope this post taught you some stuff about NPM you didn't know before! Of course, there's still lots of things uncleared. The [NPM docs][2] are a great starting point for those. (Shoutouts to [ashley williams][3] for putting so much effort into them)

If you want to scream at me for unknown reasons, you can find me [on Twitter]. Bye!
 
_Addendum 1: Shortcuts_

You can use `npm i` instead of `npm install` and `npm i -S` instead of `npm install --save`. Same with `npm i -D` instead of `npm install --save-dev`.

[1]: http://momentjs.com
[2]: http://docs.npmjs.com
[3]: http://twitter.com/ag_dubs
[4]: http://twitter.com/jonaisneat