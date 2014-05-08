module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-dox');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      components: {
        files: ['javascript/components/*.js'],
        tasks: ['dox']
      }
    },
    dox: {
      options: {
        title: 'MAS Frontend Assets'
      },
      files: {
        ignore: [''],
        src: ['public/js/src/', 'routes', 'modules'],
        dest: 'docs'
      }
    }
  });

  grunt.registerTask('watch', ['dox', 'watch']);
  grunt.registerTask('docs', ['dox']);
};
