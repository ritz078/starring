#!/usr/bin/env node
'use strict';
const meow = require('meow');
const starring = require('.');

const cli = meow(`
	Usage
	  $ starring [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ starring
	  unicorns & rainbows
	  $ starring ponies
	  ponies & rainbows
`);

console.log(starring(cli.input[0] || 'unicorns'));
