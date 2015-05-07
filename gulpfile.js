var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc'),
    ghPages = require('gulp-gh-pages'),
    docsSrcDir = './assets/js/**/*.js',
    docsDestDir = './docs/js',
    jsDocTask;

jsDocTask = function() {
  return gulp.src([docsSrcDir, './README.md'])
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

gulp.task('deploy', ['jsdoc'], function() {
  return gulp.src(docsDestDir + '/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['jsdoc']);

gulp.task('build', ['deploy']);

gulp.task('jsdoc', jsDocTask);

gulp.task('watch', function() {
  jsDocTask();
  gulp.watch(docsSrcDir, ['jsdoc']);
});
