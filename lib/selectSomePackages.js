const inquirer = require('inquirer');
const colors = require('colors');
const capitalize = require('capitalize');
const starRepos = require('./starRepos');
const getNpmPackageNames = require('./getNpmPackageNames');

function selectSomePackages(token, packageDetails) {
	const packageNames = getNpmPackageNames(packageDetails);

	inquirer.prompt({
		type: 'checkbox',
		name: 'npmPackageNames',
		message: 'Select unstarred packages you want to star \n',
		choices: () => {
			return packageDetails.map((x, i) => {
				let author = x.value.body.collected.metadata.author;
				let name;
				if(author) {
					name = author.name;
				}

				return ({
					name: `${colors.green.bold(packageNames[i])}${name ? ` by ${colors.blue(capitalize.words(name))}` : ''}`,
					value: x
				});
			})
		},
	}).then(answers => {
		starRepos(token, answers.npmPackageNames)
	})
}

module.exports = selectSomePackages
