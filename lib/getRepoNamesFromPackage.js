const npmToGitHub = require('npm-to-github');
const pSettle = require('p-settle');
const ora = require('ora');

async function getRepoNamesFromPackage(packageNames) {
	const repoNames = packageNames.map(packageName => npmToGitHub.getRepositoryName(packageName));
	const results = await pSettle(repoNames);
	return results.filter(repo => repo.isFulfilled).map(repo => repo.value)
}

module.exports = getRepoNamesFromPackage;
