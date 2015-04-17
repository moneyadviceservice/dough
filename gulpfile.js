var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc'),
    livereload = require('gulp-livereload'),
    docsSrcDir = './assets/js/components/*.js',
    docsDestDir = './docs/js',
    jsDocTask;

jsDocTask = function() {
  return gulp.src(docsSrcDir)
    .pipe(jsdoc.parser({
      plugins: ['plugins/markdown']
    }))
    .pipe(jsdoc.generator(docsDestDir, {
      path: 'ink-docstrap',
      systemName: '',
      footer: '',
      copyright: 'Copyright Money Advice Service &copy;',
      navType: 'vertical',
      theme: 'flatly',
      linenums: true,
      collapseSymbols: false,
      inverseNav: false
    }));
};

gulp.task('jsdoc', jsDocTask);

gulp.task('watch', function() {
  jsDocTask();
  gulp.watch(docsSrcDir, ['jsdoc']);
});
