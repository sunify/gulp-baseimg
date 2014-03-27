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
    it('should compile couple images in signle stylesheet', function() {
      var stream = baseimg({
        styleTemplate: './test/fixtures/tmp.css.mustache'
      });
      var img1 = loadFile('./test/fixtures/icon1.png');
      var img2 = loadFile('./test/fixtures/icon2.png');

      stream.on('data', function(newFile) {
        var css = postcss.parse(newFile.contents.toString());

        describe('css', function() {

          it('should have right selectors', function() {
            should(testCssSelector(css.rules[0], '.icon1')).be.ok;
            should(testCssSelector(css.rules[1], '.icon2')).be.ok;
          });

          it('should have right width and height', function() {

            css.rules[0].decls.map(function(item) {
              switch(item.prop) {
                case 'width':
                  item._value.should.be.exactly('18px');
                  break;

                case 'height':
                  item._value.should.be.exactly('15px');
                  break;
              }
            });
          });

        });

      });

      stream.write(img1);
      stream.write(img2);
      stream.end();
    });
  });

});
