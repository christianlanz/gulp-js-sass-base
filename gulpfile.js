var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var del = require('del');
var notify = require('gulp-notify');


/* ----- Generic ----- */

gulp.task('clean', function() {
  del('./assets/css');
  del('./out');
});


/* ----- Development ----- */

gulp.task('sass', function() {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass().on('error', notify.onError(function(error) {
      return error.message;
    })))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('sass:watch', function() {
  return gulp
    .watch('./assets/scss/**/*.scss', ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', transpiling ...');
    });
});

gulp.task('default', ['sass', 'sass:watch']);


/* ----- Production ----- */

gulp.task('html', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }).on('error', notify.onError(function(error) {
      return error.message;
    })))
    .pipe(gulp.dest('./out'));
});

gulp.task('css', function() {
  return gulp.src('./assets/css/*.css')
    .pipe(cleancss({
      keepSpecialComments: 0
    }).on('error', notify.onError(function(error) {
      return error.message;
    })))
    .pipe(gulp.dest('./out/assets/css'));
});

gulp.task('fonts', function() {
  return gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./out/assets/fonts'));
});

gulp.task('js', function() {
  return gulp.src('./assets/js/**/*.js')
    .pipe(uglify().on('error', notify.onError(function(error) {
      return error.message;
    })))
    .pipe(gulp.dest('./out/assets/js'));
});

gulp.task('images', function() {
  return gulp.src('./assets/images/**/*')
    .pipe(imagemin().on('error', notify.onError(function(error) {
      return error.message;
    })))
    .pipe(gulp.dest('./out/assets/images'));
});

gulp.task('favicons', function() {
  return gulp.src('./assets/favicons/**/*')
    .pipe(gulp.dest('./out/assets/favicons'));
});

gulp.task('files', function() {
  return gulp.src('./assets/files/**/*')
    .pipe(gulp.dest('./out/assets/files'));
});

gulp.task('production', ['html', 'fonts', 'js', 'images', 'favicons', 'files'], function() {
  // TODO: Replaced with gulp.series when updating to gulp v4.0
  // Run sass and css task after one another
  runSequence('sass', 'css');
});
