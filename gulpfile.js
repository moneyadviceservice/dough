var docco = require("gulp-docco");
var gulp = require('gulp');
var markdox = require("gulp-markdox");
var jsdoc = require("gulp-jsdoc");

gulp.task("doc", function(){
  gulp.src("./js/components/*.js")
    .pipe(docco())
    .pipe(gulp.dest('./doc'))
});

gulp.task('default', ['doc']);
