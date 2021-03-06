# skeemas-markdown-validation
Easily write tests to validate json code blocks in your markdown documentation. This utility is a plugin for the [skeemas](https://github.com/Prestaul/skeemas) validation library.

## Install
```js
npm install skeemas-markdown-validation --save
```

This will install skeemas-markdown-validation, and also install [skeemas](https://github.com/Prestaul/skeemas) as a peerDependency if you haven't already installed it.

## Usage
From within your markdown files you can provide relative links to schemas above each json code block:

`./docs.md`:
<pre>
# My API Docs

## Creating Foos
`POST /foos`

Request ([see the new foo schema](tests/schemas/foo-new.schema.js)):
```json
{
    "fooName": "johnson",
    "fooAge": 35
}
```

200 Response ([see the foo schema](tests/schemas/foo.schema.json)):
```json
{
    "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
    "fooName": "johnson",
    "fooAge": 35
}
```

## Array Docs
You can also document arrays using the "array-continuation" syntax ([see the foo-list schema](tests/schemas/foo-list.schema.json)):
```json
[{
    "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
    "fooName": "johnson",
    "fooAge": 35
}, {
    "...": "Additional foos..."
}]
```

Objects with a single property named `...` will be removed from arrays before validation.
</pre>

Add the plugin to `skeemas` and then validate your markdown files:
```js
var skeemas = require('skeemas'),
    skeemasMarkdownValidation = require('skeemas-markdown-validation');

skeemas.use(skeemasMarkdownValidation);

// Use any test harness, validateMarkdown just throws errors on invalid json
describe('API Documentation -', function() {
    it('main documentation should have correct JSON', function() {
        // Validate your markdown
        var validator = skeemas();
        validator.validateMarkdown('./docs.md');
    });
});
```

For more examples look at the docs in our [tests](tests/docs).


## Running Independent Code Block Validations
If you use `skeemas.validateMarkdown` then an error will be thrown on the first case of invalid json. If you would prefer to see all the errors you have the option of running a test for each code block yourself:

```js
var skeemas = require('skeemas'),
    skeemasMarkdownValidation = require('skeemas-markdown-validation');

skeemas.use(skeemasMarkdownValidation);

// Use any test harness, validateMarkdown just throws errors on invalid json
describe('API Documentation -', function() {
    // Get an array containing test details for each json code block
    var validator = skeemas(),
        tests = validator.markdownTests('./docs.md');

    tests.forEach(function(test) {
        // Create a test case for each schema-linked json block
        it('docs.md:' + test.json.line, test.execute.bind(test));
    });
});
```


## Using References
If you want to use `$ref`s in your schemas you will need to create a schema validator instance and add your references to it:

```js
var skeemas = require('skeemas'),
    skeemasMarkdownValidation = require('skeemas-markdown-validation');

skeemas.use(skeemasMarkdownValidation);

var validator = skeemas();

// Add a reference
validator.addRef('/foo-base', require('./schemas/foo-base.schema.json'));

// Validate your markdown
skeemas.validateMarkdown('./docs.md');
```
