const pSettle = require('p-settle');
const got = require('got');
const colors = require('colors');
const ora = require('ora');
const arrayToSentence = require('array-to-sentence');
const store = require('./store');

async function getPackageDetails(packageNames) {
	const spinner = ora('Fetching details').start();

	const repoNames = packageNames.map(packageName => got(`https://api.npms.io/v2/package/${packageName}`, { json: true }));
	const results = await pSettle(repoNames);

	spinner.succeed('Details Fetched')

	const x = results.filter((result, i) => {
		const { repository } = result.isFulfilled && result.value.body.collected.metadata.links;
		if (!repository) {
			store.setWithoutGithubLink(packageNames[i])
		}
		return result.isFulfilled && (result.value.body.collected.metadata.links.repository);
	});

	if (store.withoutGithubLinks.length) {
		console.log(colors.blue(`${colors.red.bold('✖')} Can't find GitHub URLs for ${arrayToSentence(store.withoutGithubLinks)}.`))
	}

	return x;
}

module.exports = getPackageDetails;
