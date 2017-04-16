#!/usr/bin/env node

/* eslint-disable no-tabs */
'use strict';
const meow = require('meow');
const ghAuth = require('ghauth');
const loadPkg = require('load-pkg');
const updateNotifier = require('update-notifier');
const inquirer = require('inquirer');
const isNpm = require('is-npm');
const arrayToSentence = require('array-to-sentence');
const colors = require('colors/safe');
const globalPackages = require('global-packages');
const pluralize = require('pluralize');
const pkg = require('../package.json');
const starRepos = require('./star-repos');
const getPackageDetails = require('./get-package-details');
const selectSomePackages = require('./select-some-packages');

updateNotifier({pkg}).notify();

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

async function handleStarring(token, packageNames, starAll = false) {
	const packageDetails = await getPackageDetails(token, packageNames);
	const ghRepoNames = packageDetails.map(pd => pd.name);
	const starredName = packageDetails.filter(pd => pd.starred).map(pd => pd.name);
	const unStarredPackages = packageDetails.filter(pd => !pd.starred);

	if (starredName.length > 0) {
		if (starAll) {
			console.log(colors.yellow.bold(
				`👍  You have already starred ${colors.cyan(arrayToSentence(starredName))}`
			));
		} else {
			console.log(colors.yellow.bold(
				`👍  You have already starred${(starredName.length === ghRepoNames.length) ? ' all the' : ''} ${starredName.length} ${pluralize('dependency', starredName.length)}.\n`
			));
		}
	}

	if (unStarredPackages.length === 0) {
		return;
	}

	if (isNpm) {
		starNpmPackage(token, unStarredPackages);
	}

	if (cli.flags.all || starAll) {
		starRepos(token, unStarredPackages);
	} else {
		selectSomePackages(token, unStarredPackages);
	}
}

async function init(token) {
	loadPkg(async function (err, pkg) {
		if (err) {
			console.log('🚨 No package.json file present in current directory.');
		}
		const packageNames = getPackageNames(pkg);
		handleStarring(token, packageNames);
	});
}

const opts = {
	configName: 'starring',
	scopes: ['public_repo'],
	note: 'Star github repos',
	userAgent: 'starring'
};

async function starGlobalPackages(token) {
	try {
		const globalPkgs = await globalPackages();
		handleStarring(token, globalPkgs);
	} catch (err) {
		console.log(err);
	}
}

function starNpmPackage(token, packageDetails) {
	inquirer.prompt({
		type: 'confirm',
		name: 'confirmStar',
		message: `Would you like to star ${arrayToSentence(packageDetails.map(pd => pd.name))} ?`
	}).then(answers => {
		if (answers.confirmStar) {
			starRepos(token, packageDetails);
		}
	});
}

ghAuth(opts, async function (err, {token}) {
	if (err) {
		console.log(err);
	}

	if (cli.input[0]) {
		handleStarring(token, cli.input, true);
		return;
	}

	if (cli.flags.global) {
		starGlobalPackages(token);
		return;
	}

	init(token);
});
