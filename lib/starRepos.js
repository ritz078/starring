const ghGot = require('gh-got');
const getRepoNamesFromPackage = require('./getRepoNamesFromPackage');
const pSettle = require('p-settle');

async function starRepos(token, packageNames) {
	const packageRepoNames = await getRepoNamesFromPackage(packageNames);
	const mapper = packageRepoNames.map(repoName => ghGot(`user/starred/${repoName}`, { token, method: 'PUT' }))
	const response = await pSettle(mapper)
	const successfulStars = response.filter(resp => (resp.isFulfilled && resp.value.statusCode === 204));

	console.log(`🌟  Successfully starred ${successfulStars.length} ${successfulStars.length > 1 ? 'repos' : 'repo'}.`)
}

module.exports = starRepos;
