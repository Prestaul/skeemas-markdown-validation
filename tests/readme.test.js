var skeemas = require('skeemas'),
	skeemasMarkdownValidation = require('../');

skeemas.use(skeemasMarkdownValidation);

describe('README.md', function() {
	it('should have valid json', function() {
		var validator = skeemas();
		validator.addRef(require('./schemas/foo-new.schema'));
		validator.validateMarkdown(__dirname + '/../README.md');
	});
});
