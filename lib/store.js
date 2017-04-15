module.exports = {
	errorRepos: [],
	withoutGithubLinks: [],
	setWithoutGithubLink(name) {
		this.withoutGithubLinks.push(name)
	},
	setErrorRepos(name) {
		this.errorRepos.push(name)
	}
}
