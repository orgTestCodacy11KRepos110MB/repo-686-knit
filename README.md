# Knit

Development Framework for JS Monorepos

## Commands

#### play

```
❯ knit play
Usage: play [options]

start a dev server

Options:

  -h, --help           output usage information
  -p, --port <port>    set server port
  -h, --host <host>    set server host
  -r, --proxy <proxy>  set proxy uri
```


#### test

```
❯ knit test
Usage: test -- [jestOptions]

run tests

Options:

  -h, --help  output usage information
```

The test command will run all `*.test.js` files found under a `__tests__` folder across all your modules. It passes all flags to `jest` directly:

```
❯ knit test -- --watch
```

#### lint

```
❯ knit lint

Usage: lint [options]

run linter

Options:

  -h, --help  output usage information
```

#### flow

```
❯ knit flow
Usage: flow [options]

run flow

Options:

  -h, --help  output usage information
```

This command will run flow across all modules. You will still need a `.flowconfig` and to add `/* @flow */` to the top of any file you want checked by flow.

For your `.flowconfig` we recommend:

```
[ignore]
.*/node_modules/npm/.*
.*/node_modules/fbjs/.*
.*/node_modules/.*/test/.*

[options]
suppress_comment=\\(.\\|\n\\)*\\$FlowFixMe
suppress_comment=\\(.\\|\n\\)*\\$FlowIssue
suppress_comment=\\(.\\|\n\\)*\\$FlowIgnore
```

If you get flow errors from third party modules you can add them under `[ignore]`.

#### relay

```
❯ knit relay
Usage: relay [options]

update relay schema

Options:

  -h, --help  output usage information
```

This command will call out to a GraphQL server to fetch its schema and save it locally. Useful for running query validation without a live server (tests, travis etc.)

#### ls

```
❯ knit ls
Usage: ls [options] [modules...]

list modules and their dependencies

Options:

  -h, --help          output usage information
  -d, --dependencies  show dependencies
```

This command will list out your modules with their dependency count and show whether you have missing packages you need to install:

```
❯ knit ls
✔ discovering modules
✔ reading package.json of modules

info showing dependencies for 4 modules

- @knit/needle (0.0.7) [1 dependencies]
- @knit/depcheck (0.0.7) [4 dependencies, 1 missing]
- @knit/knit-core (0.0.12) [6 dependencies]
- @knit/knit (0.0.12) [37 dependencies]
```

Passing `--dependencies` will expand the dependencies into a list to show you a more detailed view of your modules:

```
❯ knit ls --dependencies
✔ discovering modules
✔ reading package.json of modules

info showing dependencies for 4 modules

- @knit/needle (0.0.7) [1 dependencies]
└─ read-pkg-up

- @knit/depcheck (0.0.7) [4 dependencies, 1 missing]
└─ lodash depcheck pify
missing:
└─ babylon

- @knit/knit-core (0.0.12) [6 dependencies]
└─ execa chalk fs-extra read-pkg @knit/needle @knit/depcheck

- @knit/knit (0.0.12) [37 dependencies]
└─ execa flow-bin eslint @knit/needle listr commander chalk @knit/knit-core ...
```

You can pass in module names to limit the scope of the search:

```
❯ knit ls @knit/needle
✔ discovering modules
✔ reading package.json of modules

info showing dependencies for 1 module

- @knit/needle (0.0.7) [1 dependencies]
└─ read-pkg-up
```

#### updated

```
❯ knit updated
Usage: updated [options]

list updated modules

Options:

  -h, --help  output usage information
```

This command shows which modules have been updated since the last release. It considers modules that have updated dependencies to be updated themselves. For example if `moduleB` depends on `moduleA` modifying `moduleA` will cause this command to return:

```
❯ knit updated
✔ discovering modules
✔ reading package.json of modules
✔ getting last tag
✔ determining updated modules since last release

info found 2 updated modules

- moduleA (0.0.1)
- moduleB (0.0.1)
```


#### validate

```
❯ knit validate
```

This command is used to make sure the project configuration will work with `knit` and looks to make sure their are no missing or unused dependencies.

```
❯ knit validate
✔ looking for `node_modules` in .*ignore files
✔ discovering modules
✔ checking yarn is on PATH
✔ checking yarn version
✔ validating package.json
✔ check for missing dependencies
✔ check for unused dependencies
```

#### release

```
❯ knit release
Usage: release [options] <version>

release updated modules

Options:

  -h, --help       output usage information
  -f, --force-all  release all modules. (will fail if version already released)
```

This will bump the version of all updated modules and tag and commit to git.

#### publish

```
❯ knit publish
Usage: publish [options]

publish updated modules

Options:

  -h, --help       output usage information
  -f, --force-all  publish all modules. (will fail if version already published)
```

This command does not commit anything to git and must be done on a tagged commit. The updated dependencies are knitted together (all required dependencies are added to the module package.json) and built against `commonjs`, `es6 modules` and `umd` targets.

Published modules can be used by `require`, `import`, modern tree-shaking bundlers like `webpack` and `rollup` using `jsnext:main` and as script tags thanks to https://unpkg.com.
