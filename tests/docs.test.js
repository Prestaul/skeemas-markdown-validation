var assert = require('chai').assert,
	skeemas = require('skeemas'),
	skeemasMarkdownValidation = require('../');

skeemas.use(skeemasMarkdownValidation);

var validator = skeemas();
validator.addRef(require('./schemas/foo-new.schema'));

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

	});

});
