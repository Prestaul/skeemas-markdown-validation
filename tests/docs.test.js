var assert = require('chai').assert,
	skeemas = require('skeemas'),
	skeemasMarkdownValidation = require('../');

skeemas.use(skeemasMarkdownValidation);

var validator = skeemas();

validator
	.addRef(require('./schemas/foo-new.schema'))
	.addRef(require('./schemas/test.schema'))
	.addRef(require('./schemas/test-list.schema'));

describe('Markdown validation', function() {

	describe('validateMarkdown', function() {
		it('should validate a single json block', function() {
			validator.validateMarkdown(__dirname + '/docs/valid-one-block.md');
		});

		it('should validate multiple json blocks', function() {
			validator.validateMarkdown(__dirname + '/docs/valid-two-blocks.md');
		});
	});


	describe('markdownTests', function() {
		it('should return a test for one json block', function() {
			var tests = validator.markdownTests(__dirname + '/docs/valid-one-block.md');

			assert(validator.validate(tests, '/test-list').valid)
			assert.lengthOf(tests, 1);
		});

		it('should return a test for multiple json blocks', function() {
			var tests = validator.markdownTests(__dirname + '/docs/valid-two-blocks.md');

			assert(validator.validate(tests, '/test-list').valid)
			assert.lengthOf(tests, 2);
		});
	});

});
