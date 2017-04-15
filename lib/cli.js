#!/usr/bin/env node
'use strict';
const meow = require('meow');
const ghAuth = require('ghauth');
const loadPkg = require('load-pkg');
const starRepos = require('./starRepos');
const updateNotifier = require('update-notifier');
const inquirer = require('inquirer');
const colors = require('colors/safe');
const globalPackages = require('global-packages');
const pluralize = require('pluralize');
const getPackageDetails = require('./getPackageDetails');
const pkg = require('../package.json');
const Star = require('./Star');
const selectSomePackages = require('./selectSomePackages');
const selectAllPackages = require('./selectAllPackages');
const getRepoNames = require('./getRepoNamesFromPackage');

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

async function handleStarring(token, packageNames) {

	const packageDetails = await getPackageDetails(packageNames)

	const repoNames = getRepoNames(packageDetails)

	const star = new Star(repoNames, token, packageDetails)

	const starredLength = await star.getStarredLength()

	const starredPackages = await star.getStarred();
	const unStarredPackages = packageDetails.filter((pd, i) => !starredPackages[i]);

	if (starredLength) {
		console.log(colors.yellow.bold(
			`👍  You have already starred${(starredLength === repoNames.length) ? ' all the' : ''} ${starredLength} ${pluralize('dependency', starredLength)}.`
		));
	}

	if(starredLength === repoNames.length) return;

	if (cli.flags.all) {
		selectAllPackages(token, unStarredPackages)
	} else {
		selectSomePackages(token, unStarredPackages)
	}
}

async function init(token) {
	loadPkg(async function (err, pkg) {
		if (err) {
			console.log('🚨 No package.json file present in current directory.')
		}
		const packageNames = getPackageNames(pkg);
		handleStarring(token, packageNames)
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
			handleStarring(authData.token, globalPkgs)
		} catch (e) {
			console.log(e)
		}
		return;
	}

	init(authData.token)
})
