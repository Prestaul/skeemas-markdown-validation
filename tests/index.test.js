var assert = require('chai').assert,
	skeemas = require('skeemas'),
	skeemasMarkdownValidation = require('../');

skeemas.use(skeemasMarkdownValidation);

describe('skeemas-markdown-validation plugin', function() {

	it('should attach to validator instance', function() {
		var validator = skeemas();
		assert.isFunction(validator.validateMarkdown);
		assert.isFunction(validator.markdownTests);
	});

	it('should error if called without file path', function() {
		var validator = skeemas();
		assert.throws(function() {
			validator.validateMarkdown();
		});
	});
});
