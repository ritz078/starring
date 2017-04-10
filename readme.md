# starring [![Build Status](https://travis-ci.org/ritz078/starring.svg?branch=master)](https://travis-ci.org/ritz078/starring)

> Star all the packages being used in the current project.


## Install

```
$ npm install --save starring
```


## Usage

```js
const starring = require('starring');

starring('unicorns');
//=> 'unicorns & rainbows'
```


## API

### starring(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global starring
```

```
$ starring --help

  Usage
    starring [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ starring
    unicorns & rainbows
    $ starring ponies
    ponies & rainbows
```


## License

MIT © [Ritesh Kumar](https://github.com/ritz078/starring)
