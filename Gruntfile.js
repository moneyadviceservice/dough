module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-dox');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      components: {
        files: ['js/components/*.js'],
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

  grunt.registerTask('default', ['dox']);
  grunt.registerTask('watch', ['dox', 'watch']);
};
