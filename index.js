var path = require('path'),
	fs = require('fs');


// Recursively remove array continuation objects (...) from an array in json docs
function cleanArray(array) {
	// If the last item in array has a "..." prop then remove it
	if('...' in array[array.length - 1]) array.pop();

	array.forEach(clean);

	return array;
}


// Recursively remove continuation properties (...) from an object in json docs
function clean(obj) {
	if(Array.isArray(obj)) return cleanArray(obj);

	if(obj && typeof obj === 'object') {
		Object.keys(obj).forEach(function(key) {
			// If the property ends with ... then delete it, otherwise clean the value
			if(/\.\.\.$/.test(key))
				delete obj[key];
			else
				clean(obj[key]);
		});
	}

	return obj;
}


module.exports = function(protoValidator) {
	protoValidator.markdownTests = function(file) {
		if(!(file && typeof file === 'string')) throw new Error('skeemas.markdownTests called without a file');

		var validator = this,
			filePath = path.dirname(file),
			markdown = fs.readFileSync(file).toString();

		// Given a char offset in the file find the line number
		function lineNumFromOffset(offset) {
			return markdown.substr(0, offset).split('\n').length;
		}

		function executeTest() {
			var test = this,
				json, result;

			// Attempt to parse the json
			try {
				json = JSON.parse(test.json.text);
			} catch(e) {
				throw new Error('Unable to parse JSON (' + file + ':' + test.json.line + '): ' + e.message);
			}

			// Remove any placeholder/continuation objects or properties from the json
			clean(json);

			// Attempt to validate the json
			try {
				result = validator.validate(json, test.schema.body);
			} catch(e) {
				throw new Error(e.message + ' (' + file + ':' + test.schema.line + ')');
			}

			// Verify that it was valid
			if(!result.valid)
				throw new Error('Failed validation against schema ' + test.schema.path + ' (' + file + ':' + test.json.line + '):\n' + result.errors[0].message + ' @ ' + result.errors[0].context);

			// If we made it here then this block was validated
		}

		var re = /\[[^\]\n]+?\]\((\S+?\.js(?:on)?)\)|```json([\s\S]+?)```/gi,
			validations = [],
			m, schema;

		// Parse markdown and find json blocks with schema links above them
		while(m = re.exec(markdown)) { // jshint ignore:line
			if(m[1]) {
				// We found a schema link...
				schema = {
					body: require(path.resolve(filePath, m[1])),
					path: m[1],
					line: lineNumFromOffset(re.lastIndex - m[0].length)
				};
			} else {
				// We found a json block...
				// If we have a valid schema/json pair then add to our list of validations
				if(schema) validations.push({
					schema: schema,
					json: {
						text: m[2],
						line: lineNumFromOffset(re.lastIndex - m[0].length)
					},
					execute: executeTest
				});

				// Start looking for the next pair
				schema = null;
			}
		}

		return validations;
	};

	protoValidator.validateMarkdown = function(file) {
		if(!(file && typeof file === 'string')) throw new Error('skeemas.validateMarkdown called without a file');

		this.markdownTests(file).forEach(function(test) {
			test.execute();
		});

		return this;
	};
};
