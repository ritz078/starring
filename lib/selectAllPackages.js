const inquirer = require('inquirer');
const starRepos = require('./starRepos');
const pluralize = require('pluralize');
const getNpmPackageNames = require('./getNpmPackageNames');

async function selectAllPackages(token, packageDetails) {
	const packageNames = getNpmPackageNames(packageDetails);

	const answers = await inquirer.prompt({
		type: 'confirm',
		name: 'confirmStarring',
		message: `Are you sure you want to star the remaining ${packageNames.length} ${pluralize('repo', packageNames.length)} ?`,
		default: false
	})

	if (answers.confirmStarring) {
		starRepos(token, packageDetails)
	}
}

module.exports = selectAllPackages
