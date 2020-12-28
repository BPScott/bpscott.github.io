---
title: Powered By Middleman
tags: Middleman
---

I started using static site generators some time last year, beginning with
probably the most well known: [Jekyll](http://jekyllrb.com/), which powers
GitHub Pages. I found it ideal for creating simple sites with no need for
interactivity that can be deployed anywhere (due to being pure html/css/js)
while still allowing me control over the build process and asset optimisation.

Jekyll's focus is on being minimal, lean and slightly opinionated and I was
getting tired of having to implement functionality I wanted as plugins. If only
there was some tool that concerned itself with front-end best practices like
concatenation and minification of CSS and JavaScript and offered tooling like
LiveReload as standard...


## Enter Middleman

[Middleman](http://middlemanapp.com/) is a full-fat static site generator that
cares about optimisation and developer joy out of the box (or via offical
extensions). A quick list of things that I had to implement in Jekyll that are
easy in Middleman:

* [Sass](http://sass-lang.com/) and [Compass](http://compass-style.org/) support
  is standard thanks to the Sprockets asset pipeline.
* JavaScript concatentation and minification is also handled by Sprockets.
* HTML minification is handled by
  [middleman-minify-html](https://github.com/middleman/middleman-minify-html).
* Deployment to GitHub Pages (or ftp/rsync) is handled by
  [middleman-deploy](https://github.com/tvaughan/middleman-deploy).
* Live reload is handled by
  [middleman-livereload](https://github.com/middleman/middleman-livereload).

Naturally this site is built using Middleman and published onto GitHub Pages,
and the source to generate it is available on
[my GitHub account](https://github.com/BPScott/bpscott.github.io).
