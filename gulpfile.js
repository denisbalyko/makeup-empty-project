'use strict';

var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var stylus = require('gulp-stylus');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var nib = require('nib');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

const paths = {
    devjs: './dev/js/',
    projs: './production/js/',
    devstyl: './dev/styl/',
    procss: './production/css/',
    devimg: './dev/img/',
    proimg: './production/img/'
};

var onError = function (error) {
    notify.onError("ERROR: " + error.plugin)(error);
    console.log(error.toString());
};

const serverUrl = 'localhost';

gulp.task('stylus', () => {
    return gulp.src('./dev/styl/global.styl')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(stylus({
            'compress': true,
            'use': nib()
        }))
        .pipe(prefix(["last 8 version", "> 1%", "ie 8"]))
        .pipe(sourcemaps.write())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(paths.procss))
        .pipe(browserSync.stream());
});

gulp.task('lint', () => {
    return gulp.src(paths.devjs + '*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(browserSync.reload({
          stream: true
        }))
});

gulp.task('scripts', () => {
    return gulp.src([paths.devjs + 'libs/*.js', paths.devjs + '*.js'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(paths.projs))
        .pipe(rename('scripts.min.js'))
        //.pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(paths.projs))
        .pipe(browserSync.reload({
          stream: true
        }))
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('images', function(){
    return gulp.src('./dev/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(plumber({errorHandler: onError}))
        .pipe(cache(imagemin({
          interlaced: true
        })))
        .pipe(gulp.dest('production/img'))
        .pipe(browserSync.reload({
          stream: true
        }))
});

gulp.task('watch', function() {
    gulp.watch('dev/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
    gulp.watch(paths.devstyl + '**/*.styl', ['stylus']);
    gulp.watch(paths.devjs   + '**/*.js', ['scripts', 'lint']);
    gulp.watch('./**/*.html').on('change', browserSync.reload);
});

gulp.task('default', function(callback) {
  runSequence(['images', 'stylus', 'scripts', 'lint', 'browserSync', 'watch'],
    callback
  )
})
