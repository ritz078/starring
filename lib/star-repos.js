/* eslint-disable no-tabs */
const ghGot = require('gh-got');
const colors = require('colors/safe');
const pSettle = require('p-settle');
const arrayToSentence = require('array-to-sentence');
const pluralize = require('pluralize');
const store = require('./store');

async function starRepos(token, packageDetails) {
	const repos = packageDetails.map(pd => pd.repo);
	const mapper = repos.map(repoName => ghGot(`user/starred/${repoName}`, {token, method: 'PUT'}));
	const response = await pSettle(mapper);

	const successfulStars = response
		.map((x, i) => (Object.assign({}, x, {
			name: packageDetails[i].name
		})))
		.filter((resp, i) => {
			const isSuccessful = resp.isFulfilled && resp.value.statusCode === 204;
			if (!isSuccessful) {
				store.setErrorRepos(packageDetails[i].name);
			}
			return (resp.isFulfilled && resp.value.statusCode === 204);
		});

	const successfulStarNames = successfulStars.map(x => x.name);

	if (successfulStars.length > 0) {
		console.log(`🌟  Successfully starred ${successfulStars.length > 10 ? successfulStars.length : arrayToSentence(successfulStarNames)} ${successfulStars.length > 10 ? pluralize('repo', successfulStars.length) : ''}`);
	}
	if (store.errorRepos.length > 0) {
		console.log(`${colors.red.bold('✖')} Error starring ${colors.red(arrayToSentence(store.errorRepos))}`);
	}
}

module.exports = starRepos;
