var fs = require('fs');
var path = require('path');
var imgParser = require('imagesize').Parser;
var mustache = require('mustache');
var through = require('through');
var gutil = require('gulp-util');
var mime = require('mime');
var SVGO = require('svgo');
var svgo = new SVGO();

module.exports = function(opts) {
	var tpl = fs.readFileSync(opts.styleTemplate).toString();
	var buffer = [];
	var svgs = [];

	var bufferContents = function(file) {
		var parser = new imgParser();
		var type = mime.lookup(file.path);
		var imgData;

		if(type !== 'image/svg+xml' && parser.parse(file.contents) === imgParser.DONE) {
			imgData = parser.getResult();
			imgData.data = [
				'url(data:',
				mime.lookup(imgData.format),
				';base64,',
				file.contents.toString('base64'),
				')'
			].join('');
			imgData.name = path.basename(file.path, '.' + imgData.format);
			buffer.push(imgData);
		} else if(type === 'image/svg+xml') {
			svgo.optimize(file.contents.toString(), function(res) {
				imgData = {
					width: res.info.width,
					height: res.info.height,
					data: [
						'url(data:image/svg+xml;charset=utf8,',
						encodeURIComponent(res.data),
						')'
					].join(''),
					format: 'svg',
					name: path.basename(file.path, '.svg')
				};
				buffer.push(imgData);
			});
		}
	};

	var endStream = function() {
		this.emit('data', new gutil.File({
			  contents: new Buffer(mustache.render(tpl, {
				  items: buffer
			  }), 'utf8'),
			  path: opts.styleName
		  }));
		this.emit('end');
	};

	return new through(bufferContents, endStream);
};
