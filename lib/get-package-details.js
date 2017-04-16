const pSettle = require('p-settle');
const got = require('got');
const ghGot = require('gh-got');
const ora = require('ora');
const parseUrl = require('parse-github-url');

function decorateDetails(packageNames, details) {
	return details.map((detail, i) => {
		const x = {
			name: packageNames[i],
			success: detail.isFulfilled
		};

		if (detail.value) {
			const {links, author, description} = detail.value.body.collected.metadata;

			x.description = description;
			x.repo = Boolean(links.repository) && parseUrl(links.repository).repo;
			x.author = (author && author.name);
		}

		return x;
	});
}

async function getPackageDetails(token, packageNames) {
	const spinner = ora('Fetching details').start();

	const repoNames = packageNames.map(packageName => got(`https://api.npms.io/v2/package/${packageName}`, {json: true}));
	const results = await pSettle(repoNames);

	const details = decorateDetails(packageNames, results);

	const mapper = details.map(({repo}) => ghGot(`user/starred/${repo}`, {token, method: 'GET'}));
	const starResults = await pSettle(mapper);

	spinner.succeed('Details Fetched');

	details.forEach(function (d, i) {
		d.starred = (starResults[i].isFulfilled && (starResults[i].value.statusCode === 204));
	});
	return details;
}

module.exports = getPackageDetails;
