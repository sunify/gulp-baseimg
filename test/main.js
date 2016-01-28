var baseimg = require('../');
var gutil = require('gulp-util');
var should = require('should');
var fs = require('fs');
var postcss = require('postcss');
require('mocha');

var loadFile = function(path) {
	return new gutil.File({
		path: path,
		contents: fs.readFileSync(path)
	});
};

var testCssSelector = function(rule, expect) {
	return rule._selector === expect;
};

describe('gulp-baseimg', function() {

	describe('baseimg()', function() {
		it('should compile three images in signle stylesheet', function() {
			var stream = baseimg({
				styleTemplate: './test/fixtures/tmp.css.mustache'
			});
			var img1 = loadFile('./test/fixtures/icon1.png');
			var img2 = loadFile('./test/fixtures/icon2.png');
			var img3 = loadFile('./test/fixtures/icon3.svg');
			var img4 = loadFile('./test/fixtures/icon4.svg');
			var sizes = [
				{width: '18px', height: '15px'},
				{width: '18px', height: '15px'},
				{width: '14px', height: '13px'},
				{width: '14px', height: '13px'},
			];

			stream.on('data', function(newFile) {
				var css = postcss.parse(newFile.contents.toString());

				describe('css', function() {
					it('should have right selectors', function() {
						for(var i = 0; i < 4; i += 1) {
							should(testCssSelector(css.rules[i], '.icon' + (i + 1))).be.ok;
						}
					});

					it('should have right width and height', function() {
						css.rules[0].decls.map(function(item, i) {
							if(sizes[i][item.prop]) {
								item._value.should.be.exactly(sizes[i][item.prop]);
							}
						});
					});

				});

			});

			stream.write(img1);
			stream.write(img2);
			stream.write(img3);
			stream.write(img4);
			stream.end();
		});
	});

});
