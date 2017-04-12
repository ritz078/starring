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
	${colors.green('Usage')}
	  $ ${colors.bold('starring')} ${colors.yellow('[input]')}

	${colors.green('Options')}
	  ${colors.bold.yellow('--all')}  Star all the packages listed in the package.json from current directory. [Default: false]

	${colors.green('Examples')}
	  $ ${colors.yellow.bold('starring')}
	  presents UI to select the packages you want to star.
	  $ ${colors.yellow.bold('starring colors')}
	  stars colors npm package on GitHub.
`);

function selectSomePackages(token) {
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

function init(token) {
	loadPkg(async function (err, pkg) {
		if(err) {
			console.log('🚨 No package.json file present in current directory.')
		}
		const packageNames = getPackageNames(pkg);

		if (cli.flags.all) {
			inquirer.prompt({
				type: 'confirm',
				name: 'confirmStarring',
				message: `Are you sure you want to star all the ${packageNames.length} repos ?`,
				default: false
			}).then(answers => {
				if (answers.confirmStarring) {
					starRepos(token, packageNames)
				} else {
					selectSomePackages(token)
				}
			})
		} else {
			selectSomePackages(token)
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
	if (cli.input[0]) {
		starRepos(authData.token, cli.input);
		return;
	}

	init(authData.token)
})
