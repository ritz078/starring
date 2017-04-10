#!/usr/bin/env node
'use strict';
const meow = require('meow');
const ghAuth = require('ghauth');
const loadPkg = require('load-pkg');
const npmToGitHub = require('npm-to-github');
const pSettle = require('p-settle');
const ghGot = require('gh-got');

function getPackageNames(pkg) {
	const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
	return Object.keys(deps);
}

async function getPackageRepoNames(pkg) {
	const repoNames = getPackageNames(pkg).map(packageName => npmToGitHub.getRepositoryName(packageName));

	const results = await pSettle(repoNames)
	return results.filter(repo => repo.isFulfilled).map(repo => repo.value)
}

async function starRepos(token, pkg) {
	const packageRepoNames = await getPackageRepoNames(pkg);

	const mapper = packageRepoNames.map(repoName => ghGot(`user/starred/${repoName}`, { token, method: 'PUT' }))

	const response = await pSettle(mapper)
	console.log('DONE', response)
}

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
