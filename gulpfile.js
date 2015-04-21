var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc'),
    docsSrcDir = './assets/js/**/*.js',
    docsDestDir = './docs/js',
    jsDocTask;

jsDocTask = function() {
  return gulp.src(docsSrcDir)
    .pipe(
      jsdoc(docsDestDir,
        {
          path: './node_modules/jaguarjs-jsdoc',
          applicationName: 'Dough JavaScript',
          cleverLinks: true,
          copyright: 'Copyright Money Advice Service &copy;',
          linenums: true,
          collapseSymbols: false
        },
        {
          plugins: ['plugins/markdown'],
        }
      )
    );
};

gulp.task('jsdoc', jsDocTask);

gulp.task('watch', function() {
  jsDocTask();
  gulp.watch(docsSrcDir, ['jsdoc']);
});
