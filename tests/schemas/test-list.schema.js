module.exports = {
	id: '/test-list',
	description: 'a list of "tests"',
	type: 'array',
	items: {
		$ref: '/test'
	}
};
