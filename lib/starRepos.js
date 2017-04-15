const ghGot = require('gh-got');
const colors = require('colors/safe');
const boxen = require('boxen');
const pSettle = require('p-settle');
const arrayToSentence = require('array-to-sentence');
const pluralize = require('pluralize');
const parseUrl = require('parse-github-url');
const getRepoNamesFromPackage = require('./getRepoNamesFromPackage');
const getPackageNames = require('./getNpmPackageNames');
const store = require('./store');

async function starRepos(token, packageDetails) {
	const packageNames = getPackageNames(packageDetails)

	const packageRepoNames = packageDetails.map(pd => parseUrl(pd.value.body.collected.metadata.links.repository).repo);
	const mapper = packageRepoNames.map(repoName => ghGot(`user/starred/${repoName}`, { token, method: 'PUT' }))
	const response = await pSettle(mapper)

	const successfulStars = response.filter((resp, i) => {
		const isSuccessful = resp.isFulfilled && resp.value.statusCode === 204;
		if(!isSuccessful) store.setErrorRepos(packageNames[i])
		return (resp.isFulfilled && resp.value.statusCode === 204);
	});

	let log = '';


	if(successfulStars.length) {
		log += `🌟  Successfully starred ${successfulStars.length} ${pluralize('repo', successfulStars.length)}.\n`
	}

	if(packageDetails.length !== successfulStars.length) {
		log += `${colors.red.bold('✖')} Error starring ${colors.yellow(arrayToSentence(store.errorRepos))} ${pluralize('repo', store.errorRepos.length)}`
	}

	console.log(colors.blue(boxen(log, {
		padding: 1
	})))
}

module.exports = starRepos;
