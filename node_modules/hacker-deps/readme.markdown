# hacker-deps

Print the list of hackers your application depends on.

# example

For a quick list of hackers, just do `hacker-deps $APP_ROOT`:

```
$ hacker-deps ~/projects/substack.net
 42.7%    James Halliday (substack)
 14.5%    Dominic Tarr (dominictarr)
  6.9%    Raynos (Raynos)
  5.0%    undefined
  4.5%    Isaac Z. Schlueter (isaacs)
  2.7%    Joshua Holbrook (jesusabdullah)
  2.1%    Max Ogden (maxogden)
  1.9%    ariya (ariya)
  1.8%    ForbesLindesay (ForbesLindesay)
  1.8%    johnny (NHQ)
  1.7%    Tim Caswell (creationix)
  1.6%    Constellation (Constellation)
  1.3%    Thorsten Lorenz (thlorenz)
  1.3%    Robert Kieffer (broofa)
  1.3%    Roman Shtylman (shtylman)
  1.2%    TJ Holowaychuk (visionmedia)
  1.2%    Nick Fitzgerald (mozilla)
  0.9%    Christopher Jeffrey (chjj)
  0.9%    Alex Gorbatchev (alexgorbatchev)
  0.9%    James Burke (jrburke)
  0.7%    Julian Gruber (juliangruber)
  0.4%    Mathias Bynens (bestiejs)
  0.4%    mishoo (mishoo)
  0.4%    Brian J. Brennan (brianloveswords)
  0.4%    Romain Beauxis (toots)
  0.3%    T. Jameson Little (beatgammit)
```

hacker-deps finds all package.json files and finds who wrote each non-private
package depended on in your application.

In this list the percentage is a normalized sum of all the packages in the
dependency graph weighted by distance to give a rough estimate of how reliant
your application is on the work of each hacker in the results.

To supplement the list of hackers with lists of packages, add `--verbose`:

```
$ hacker-deps ~/projects/substack.net --verbose | head -n30

 42.7%    James Halliday (substack)

    falafel          brfs                   http-browserify     resolve
    vm-browserify    browser-pack           commondir           astw
    lexical-scope    insert-module-globals  detective           module-deps
    wordwrap         optimist               parents             shell-quote
    syntax-error     browserify             deck                ent
    comandante       git-file               internet-timestamp  mkdirp
    ordered-emitter  duplex-pipe            http-duplex         pushover
    glog             hyperquest             hyperglue           hyperspace
    buffers          trumpet                baudio

 14.5%    Dominic Tarr (dominictarr)

    through       JSONStream    crypto-browserify  from
    map-stream    pause-stream  split              stream-combiner
    event-stream

  6.9%    Raynos (Raynos)

    console-browserify  duplexer  class-list

  5.0%    undefined

    custom        skip  lexical-scope-test  indexof
    substack.net

  4.5%    Isaac Z. Schlueter (isaacs)

    inherits  sax
```

You can also print the list of modules ranked by module score with `--modules`:

```
$ hacker-deps ~/projects/substack.net --modules | head -n20
findit      12.0 %  James Halliday (substack)
hyperquest  12.0 %  James Halliday (substack)
walk-fs     12.0 %  skoni (skoni)
optimist    12.0 %  James Halliday (substack)
text-table  12.0 %  James Halliday (substack)
through      6.0 %  Dominic Tarr (dominictarr)
duplexer     6.0 %  Raynos (Raynos)
seq          6.0 %  James Halliday (substack)
wordwrap     6.0 %  James Halliday (substack)
minimist     6.0 %  James Halliday (substack)
traverse     4.0 %  James Halliday (substack)
chainsaw     3.0 %  James Halliday (substack)
hashish      3.0 %  James Halliday (substack)
```

# usage

```
usage: hacker-deps OPTIONS

OPTIONS are:

  -v, --verbose     Verbose module output for the default output mode
  -m, --modules     List the normalized weights of each module used.
  -b, --budget      Hypothetical amount to budget for open source.
  -s, --socialism   Coefficient of socialism for --budget (default: 1.5)

```

# methods

``` js
var hdeps = require('hacker-deps')
```

## hdeps(root, cb)

Compute the hacker dependencies starting at the application path `root`.

`cb(err, hackers)` fires once the complete graph has been traced with `hackers`,
an array of entries sorted by a contribution score. Each row looks like:

``` js
{
  name: 'Dominic Tarr',
  github: 'dominictarr',
  packages: {
    split: 1.5,
    through: 3.1666666666666665,
    'vec2-dom': 1,
    'vec2-layout': 2,
    example: 2,
    rec2: 0.5,
    hyperscript: 0.5
  },
  score: 0.24436807941962585
}
```

The `score` is a normalized contribution score that shows how reliant your
application is on this author.

The `packages` object is non-normalized package data according to the sum of
`1/(2 * distance)` where `distance` is the number of dependencies up the
dependency hierarchy. The assumption here is that modules that are further away
are probably less crucial to your application.

# install

With [npm](https://npmjs.org) do:

```
npm install -g hacker-deps
```

# license

MIT
