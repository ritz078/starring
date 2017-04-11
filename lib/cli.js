#!/usr/bin/env node
'use strict';
const meow = require('meow');
const ghAuth = require('ghauth');
const loadPkg = require('load-pkg');
const starRepos = require('./starRepos');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const inquirer = require('inquirer');
const colors = require('colors/safe');

updateNotifier({ pkg }).notify();

function getPackageNames(pkg) {
	const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
	return Object.keys(deps);
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

function init(token) {
	loadPkg(async function (err, pkg) {
		const packageNames = getPackageNames(pkg);

		if(cli.input[0]) {
			starRepos(token, cli.input);
			return;
		}

		if (cli.flags.all) {
			inquirer.prompt({
				type: 'confirm',
				name: 'confirmStarring',
				message: 'Are you sure you want to star all the above repos ?',
				default: false
			}).then(answers => {
				console.log(answers.confirmStarring)
			})

			starRepos(token, packageNames)
		} else {
			inquirer.prompt({
				type: 'checkbox',
				name: 'npmPackageNames',
				message: '\n Select packages you want to star \n',
				choices: () => {
					return getPackageNames(pkg).map(x => ({
						name: colors.green.bold(x),
						value: x
					}))
				},
			}).then(answers => {
				starRepos(token, answers.npmPackageNames)
			})
		}
	});
}

const opts = {
	configName: 'starring',
	scopes: ['public_repo'],
	note: 'Star github repos',
	userAgent: 'starring'
}

ghAuth(opts, async function (err, authData) {
	init(authData.token)
})
