gulp-baseimg
============
> [Gulp](https://github.com/wearefractal/gulp) plugin for generate data uri stylesheet from set of images.


##Usage
```shell
npm install gulp-baseimg --save-dev
```

###Example config
```javascript
gulp.task('imgBase', function() {
    gulp.src('./images/data/*.png')
        .pipe(baseimg({
            styleTemplate: 'scss/data_gen.scss.mustache',
            styleName: '_data_gen.scss'
        }))
        .pipe(gulp.dest('./scss'));
});
```

###Options

####styleTemplate
Path to mustache template

####styleName
Result file name

###Template variables
####items
Array of images data

####items[i].name
Image filename without extension

####items[i].width & items[i].height
Image width and height in pixels

####items[i].data
Data URI string
