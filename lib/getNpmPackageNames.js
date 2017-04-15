function getNpmPackageNames(packageDetails) {
	return packageDetails.map(pd => (pd.value && pd.value.body.collected.metadata.name))
}

module.exports = getNpmPackageNames;
