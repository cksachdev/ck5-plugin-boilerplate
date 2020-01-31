const cleanCSS = require('gulp-clean-css');  // npm install gulp-clean-css --save-dev
var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('css', () => {

return gulp.src('assets/styles/*.css')
  .pipe(cleanCSS({
      debug: true,
      compatibility: 'ie8',
      level: {
          1: {
              specialComments: 0,
          },
      },
  }))
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(rename({
      basename: 'main-styles',
      suffix: '.min',
  }))
  .pipe(gulp.dest('dist/assets/styles/'))

});
gulp.task('default', 'css');