const pSettle = require('p-settle')
const ghGot = require('gh-got')

class Star {
	constructor(repoNames, token, packageDetails) {
		this.token = token;
		this.repoNames = repoNames;
		this.packageDetails = packageDetails;
	}

	async fetchStarred() {
		const mapper = this.repoNames.map(repoName => ghGot(`user/starred/${repoName}`, { token: this.token, method: 'GET' }))
		this.starred = await pSettle(mapper);
	}

	async getData() {
		if (this.starred) {
			return this.starred
		} else {
			return await this.fetchStarred();
		}
	}

	async getStarred() {
		if (!this.starred) {
			await this.fetchStarred()
		}
		return this.starred.map((resp) => {
			return (resp.isFulfilled && resp.value && resp.value.statusCode === 204);
		})
	}

	async getStarredLength() {
		if (!this.starred) {
			await this.fetchStarred()
		}
		return this.starred.filter(resp => (resp.isFulfilled && resp.value && resp.value.statusCode === 204)).length;
	}
}

module.exports = Star
