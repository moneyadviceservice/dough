var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc'),
    docsSrcDir = './assets/js/components/*.js',
    docsDestDir = './docs/js',
    jsDocTask;

jsDocTask = function() {
  return gulp.src(docsSrcDir)
    .pipe(jsdoc.parser())
    .pipe(jsdoc.generator(docsDestDir));
};

gulp.task('jsdoc', jsDocTask);

gulp.task('watch', function() {
  jsDocTask();
  gulp.watch(docsSrcDir, ['jsdoc']);
});
