---
title: Bower vs. npm for packaging Sass
date: 01/08/2014
---

Package managers for the front end. Fun eh? I'm about to be playing with
creating a modular CSS framework that needs to be shared across applications,
so I figured now would be a good time to investigate the tools available.
As nobody else seems to have done this with a specific eye to CSS I might
as well write about it too. Here is my use-case:

* I'm building a CSS framework, written in Sass (though this investigation's
  outcome would apply to all CSS preprocessors).
* I'll have some fundamental mixins and functions, which shall be used by
  multiple components, these components shall then be included into my
  application.
* My build pipeline shall be using Grunt.

There are two package managers on my shortlist: npm and Bower. Both are generic
package managers. Both make you specify your dependencies in json files. Both
install their dependencies into a folder within your application. At first
glance they are very similar and my initial gut feeling was "if I'm already
using npm for Grunt then why do I need Bower?". Why complicate the project with
an additional package manager? There must be something I'm missing.

The key difference between the two lies in [how they store dependent packages](http://stackoverflow.com/questions/18641899/difference-between-bower-and-npm/18652918#18652918).
Bower has a flat listing, while npm uses a nested hierarchy. To demonstrate
this difference lets use a couple of hypothetically named packages, that map
neatly onto a real world example used by the Guardian:

* Application - your app (e.g. The Guardian website) - which depends on:
* Component - a generic reusable CSS object (e.g. [guss-layout](https://github.com/guardian/guss-layout)) -
  which depends on:
* Helper - a selection of utility Sass mixins / functions (e.g. [sass-mq](https://github.com/guardian/sass-mq))

This is a drastically simplified example with a single component and helper,
but think about how this can expand when there is multiple component packages
each depending on various helper packages.


Bower's flat listing
--------------------

Bower flattens your dependency graph and installs all dependencies at the same
level, so after running `bower install` the application folder would
like this:

```
|--- bower_components
|    |--- component
|    |    |--- _component.scss
|    |--- helper
|    |    |--- _helper.scss
|--- bower.json
|--- styles.scss
```

This is really simple, but it can potentially pose a major problem - dependency
hell, which can occur when multiple components rely on different versions of the
same helper. Because Bower does not allow installing two versions of the same
package everything grinds to a halt.

Bower's flat listing means that the path to all of the app's dependencies are
one level deep so the app's `styles.css` would look like this:

```scss
@import 'bower_components/helper/helper';
@import 'bower_components/compoent/component';
```

This can be tidied up by adding `bower_components` to the Sass load_path to save
repeating it every time:

```scss
@import 'helper/helper';
@import 'compoent/component';
```

Very neat and tidy.


Npm's dependency tree
---------------------

Npm keeps the dependency tree intact, installing each package's dependencies
into  a `node_modules` folder within that package, so after running
`npm install` the application folder would look like this:

```
|--- node_modules
|    |--- component
|    |    |--- _component.scss
|    |    |--- node_modules
|    |    |    |--- helper
|    |    |    |    |--- _helper.scss
|--- package.json
|--- styles.scss
```

This layout is a bit more complex than Bower's flat listing, but it avoids
dependency hell as each component is responsible for its own dependencies rather
than having them all merged into the same level.

This nested dependency graph means the app's stylesheet's `@imports` end up
looking a little uglier than the Bower version:

```scss
@import 'node_modules/component/node_modules/helper/helper';
@import 'node_modules/compoent/component';
```

All this nesting means there isn't much value in adding `node_modules` to the
load path as there is still a load of node_modules references at lower levels
littering the `@import` paths anyway.


Unavoidable Dependency Hell
---------------------------

The thing is though, npm's resolution to dependency hell works great for JS
modules where you can scope the inclusion of a particular version of a helper
to a particular component. Sass has no such scoping though. You can only import
files into the global scope which means that any mixins and functions contained
within them also live in the global scope. Sass does not complain about
overwriting an existing mixin or function, which can lead to subtle and
insidious bugs when one version of a helper overwrites a different one and gets
used within a component that does not support it.

It's a potential minefield and I can't come up with a way out of this mismatched
dependency thing in Sass other than being careful not to fall prey to it in the
first place. Which can be done by being careful about not breaking backwards
compatibility in your helper's API, or when you do inevitably break it, you have
to upgrade everything that depends on that helper all at the same time.
It's a sucky problem but really your helpers should be so simple that you will
not need to update them in a way that breaks prior expectations anyway.
As the old joke goes: "Doctor doctor, it hurts when I do **this**" "Well, don't
do it then". Not got a better solution that the utterly unhelpful "you just need
to **know** when you're about to do it wrong", sorry.

So, npm's nested dependency tree is not actually a feature that is relevant to
writing a Sass framework anyway as Sass does not support that sort of
scoping. Which means that Bower is looking a lot nicer due to its simpler
folder structure (as npm's apparent complexity does not help solve anything
in Sass-land) and its ability to give bit of sugar around load paths.
Balls, this wasn't the answer I was hoping for, I don't want to require a second
package manager. What if I can make npm use a flat folder structure like Bower?


NPM Peer Dependencies
---------------------

What if I fiddle with that dependency graph a little bit. What if I say that
a component should not be responsible for loading in the helpers it needs, but
instead should trust that the application has already loaded a compatible
version of the helper that is available for the component to use. It means your
components break if you do not include that helper in your application's scss
file but it seems like a small price to pay for ensuring you are only pulling in
a single version of your helpers. It sounds daft and horrible but it might get
us out of this.

Here is the revised dependency chain, where the application explicitly states
that it requires Component and Helper, and Component hints that it needs a
specific version of Helper:

* Application - your app (e.g. The Guardian website) - which depends on:
  * Component (hinted: I need Helper to be included before me)
  * Helper

NPM has support for this hinting of things a component needs, but never calls
directly as a feature called [peer dependencies](http://blog.nodejs.org/2013/02/07/peer-dependencies/).
By specifying the helper as a peer dependency npm shall throw a error if two
components attempt to rely on two different versions of a single helper.

The component's `package.json` would look like:

```js
{
  "name": "component",
  "version": "1.0.0",
  "dependencies": {},
  "devDependencies": {},
  "peerDependencies": {
    "helper": "~1.0.0"
  }
}
```

The app's `package.json` would look like this:

```js
{
  "name": "myApp",
  "dependencies": {
    "helper": "~1.0.0",
    "component": "~1.0.0"
  },
  "devDependencies": {},
  "peerDependencies": {}
}
```

When you run `npm install` in your application's tree shall look like:

```
|--- node_modules
|    |--- component
|    |    |--- _component.scss
|    |--- helper
|    |    |--- _helper.scss
|--- package.json
|--- styles.scss
```

And thus your app's stylesheet would look like:

```scss
@import 'node_modules/helper/helper';
@import 'node_modules/compoent/component';
```

Currently peer dependencies are installed automatically and npm throws an error
when packages want to install conflicting versions of a peer dependency, so we
don't really need to explicitly specify them in the application's package.json.
However the npm maintainers [don't like the idea of peer dependencies in this form](https://github.com/npm/npm/issues/5080#issuecomment-40771461).
They would rather change it so that peerDependencies are not installed
automatically and that npm would warn rather than error when there are
peer dependency conflicts. I would rather be a bit more explicit in the
application's package.json to be ready for that impending change. So now we have
that flat Bower-like layout that we were hoping for, at the expense of having to
write a little more in our package.json manifest file. I'm pretty happy with
that.


Conclusion
----------

The more I sit and thing about this, the more I think that using npm with
peerDependencies is a good idea. It is not **explicitly** what peerDependencies
was originally envisioned for, but I think it seems like a good ideological
fit and certainly appears to solve the problem - while keeping build-time complexity
down thanks to not needing the overhead of Bower. [Please tell me if I'm crazy](https://twitter.com/BPScott).
