const parseUrl = require('parse-github-url')

function getRepoNamesFromPackage(packageDetails) {
	return packageDetails.map(x => {
		const repository = x.value.body.collected.metadata.links.repository;
		return repository ? parseUrl(repository).repo : undefined;
	});
}

module.exports = getRepoNamesFromPackage;
