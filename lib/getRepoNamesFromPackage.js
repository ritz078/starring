const npmToGitHub = require('npm-to-github');
const pSettle = require('p-settle');

function getPackageNames(pkg) {
	const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
	return Object.keys(deps);
}

async function getRepoNamesFromPackage(pkg) {
	const repoNames = getPackageNames(pkg).map(packageName => npmToGitHub.getRepositoryName(packageName));

	const results = await pSettle(repoNames)
	return results.filter(repo => repo.isFulfilled).map(repo => repo.value)
}

module.exports = getRepoNamesFromPackage;
