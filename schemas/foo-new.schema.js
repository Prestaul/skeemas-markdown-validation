module.exports = {
	id: '/foo-new',
	describe: 'A schema describing a new "foo"',
	type: 'object',
	properties: {
		fooName: {
			type: 'string',
			required: true
		},
		fooAge: {
			type: 'integer',
			minimum: 0,
			required: true
		}
	}
};
