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
var nib = require('nib');
var browserSync = require('browser-sync').create();

const paths = {
    devjs: './dev/js/',
    projs: './production/js/',
    devstyl: './dev/styl/',
    procss: './production/css/',
};

const serverUrl = 'localhost';

gulp.task('stylus', () => {
    return gulp.src('./dev/styl/global.styl')
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
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
});

gulp.task('scripts', () => {
    return gulp.src([paths.devjs + 'libs/*.js', paths.devjs + '*.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(paths.projs))
        .pipe(rename('scripts.min.js'))
        //.pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(paths.projs))
		.pipe(browserSync.stream());
});

gulp.task('browserSync', () => {
    browserSync.init({
		server: {
			baseDir: './'
		}
    });
});

gulp.task('default', ['stylus', 'scripts', 'lint', 'browserSync'], () => {
    gulp.watch(paths.devstyl + '**/*.styl', ['stylus']);
    gulp.watch(paths.devjs   + '**/*.js', ['scripts', 'lint']);
    gulp.watch('./**/*.html').on('change', browserSync.reload);
});

