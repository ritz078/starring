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
const globalPackages = require('global-packages');

updateNotifier({ pkg }).notify();

function getPackageNames(pkg) {
	const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
	return Object.keys(deps);
}

const cli = meow(`
	${colors.green('Usage')}
	  $ ${colors.bold('starring')} ${colors.yellow('[input]')}

	${colors.green('Options')}
	  ${colors.bold.yellow('--all')}  Star all the local packages listed in the package.json from current project. [Default: false]
		${colors.bold.yellow('--global')} Star global packages.

	${colors.green('Examples')}
	  $ ${colors.yellow.bold('starring')}
	  presents UI to select the packages you want to star.
	  $ ${colors.yellow.bold('starring colors')}
	  stars colors npm package on GitHub.
`);

function selectSomePackages(token, npmPackageNames) {
	inquirer.prompt({
		type: 'checkbox',
		name: 'npmPackageNames',
		message: 'Select packages you want to star \n',
		choices: () => {
			return npmPackageNames.map(x => ({
				name: colors.green.bold(x),
				value: x
			}))
		},
	}).then(answers => {
		starRepos(token, answers.npmPackageNames)
	})
}

function selectAllPackages(token, npmPackageNames) {
	inquirer.prompt({
		type: 'confirm',
		name: 'confirmStarring',
		message: `Are you sure you want to star all the ${npmPackageNames.length} repos ?`,
		default: false
	}).then(answers => {
		if (answers.confirmStarring) {
			starRepos(token, npmPackageNames)
		} else {
			selectSomePackages(token, npmPackageNames)
		}
	})
}

function init(token) {
	loadPkg(async function (err, pkg) {
		if (err) {
			console.log('🚨 No package.json file present in current directory.')
		}
		const packageNames = getPackageNames(pkg);

		if (cli.flags.all) {
			selectAllPackages(token, packageNames)
		} else {
			selectSomePackages(token, packageNames)
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

	if (cli.flags.global) {
		try {
			const globalPkgs = await globalPackages()
			if (cli.flags.all) {
				selectAllPackages(authData.token, globalPkgs)
			} else {
				selectSomePackages(authData.token, globalPkgs)
			}
		} catch (e) {
			console.log(e)
		}
		return;
	}

	init(authData.token)
})
