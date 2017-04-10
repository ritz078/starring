#!/usr/bin/env node
'use strict';
const meow = require('meow');
const ghAuth = require('ghauth');
const loadPkg = require('load-pkg');
const starRepos = require('./starRepos');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg }).notify();

function init(token) {
	loadPkg(async function (err, pkg) {
		starRepos(token, pkg)
	});
}

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

const opts = {
	configName: 'awesome',
	scopes: ['public_repo'],
	note: 'This token is for my awesome app',
	userAgent: 'My Awesome App'
}

ghAuth(opts, async function (err, authData) {
	init(authData.token)
})
