const inquirer = require('inquirer');
const colors = require('colors/safe');
const capitalize = require('capitalize');
const starRepos = require('./star-repos');

function selectSomePackages(token, packageDetails) {
	inquirer.prompt({
		type: 'checkbox',
		name: 'npmPackageNames',
		message: 'Select unstarred packages you want to star \n',
		choices: () => {
			return packageDetails.map(x => {
				return ({
					name: `${colors.green.bold(x.name)}${x.author ? ` by ${colors.blue(capitalize.words(x.author))}` : ''}`,
					value: x
				});
			});
		}
	}).then(answers => {
		starRepos(token, answers.npmPackageNames);
	});
}

module.exports = selectSomePackages;
