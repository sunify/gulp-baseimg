var baseimg = require('../');
var gutil = require('gulp-util');
var should = require('should');
require('mocha');

describe('gulp-baseimg', function() {

  describe('baseimg()', function() {
    it('should compile couple images in signle stylesheet', function() {

      var stream = baseimg({
        styleTemplate: 'fixtures/tmp.css.mustache'
      });

      var img1 = new gutil.File({
        path: './fixtures/icon1.png'
      });

      var img2 = new gutil.File({
        path: './fixtures/icon2.png'
      });

      stream.on('data', function(newFile) {

      });

      stream.on('end', function() {

      });

      stream.write(img1);
      stream.write(img2);

    });
  });

});
