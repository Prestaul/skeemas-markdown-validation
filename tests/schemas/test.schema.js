module.exports = {
	id: '/test',
	description: 'schema defining the structure of a "test"',
	type: 'object',
	properties: {
		schema: {
			type: 'object',
			properties: {
				body: {
					type: 'object',
					required: true
				},
				path: {
					type: 'string',
					required: true
				},
				line: {
					type: 'integer',
					minimum: 1,
					required: true
				}
			},
			additionalProperties: false
		},
		json: {
			type: 'object',
			properties: {
				text: {
					type: 'string',
					required: true
				},
				line: {
					type: 'integer',
					minimum: 1,
					required: true
				}
			},
			additionalProperties: false
		}
	}
};
