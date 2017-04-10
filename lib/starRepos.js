const ghGot = require('gh-got');
const getRepoNamesFromPackage = require('./getRepoNamesFromPackage');
const pSettle = require('p-settle');

async function starRepos(token, pkg) {
	const packageRepoNames = await getRepoNamesFromPackage(pkg);

	const mapper = packageRepoNames.map(repoName => ghGot(`user/starred/${repoName}`, { token, method: 'PUT' }))

	const response = await pSettle(mapper)
	console.log('DONE', response)
}

module.exports = starRepos;
