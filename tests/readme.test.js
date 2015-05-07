var skeemas = require('skeemas'),
	skeemasMarkdownValidation = require('../');

skeemas.use(skeemasMarkdownValidation);

describe('README.md', function() {
	it('should have valid json', function() {
		skeemas()
			.addRef(require('./schemas/foo-new.schema'))
			.addRef(require('./schemas/foo.schema'))
			.validateMarkdown(__dirname + '/../README.md');
	});
});
