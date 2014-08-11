module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-dox');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      components: {
        files: ['assets/js/components/*.js'],
        tasks: ['dox']
      }
    },
    dox: {
      options: {
        title: 'MAS Frontend Assets'
      },
      files: {
        src: ['assets/js/components/'],
        dest: 'docs'
      }
    }
  });

  grunt.registerTask('default', ['dox']);
  grunt.registerTask('watch:js', ['dox', 'watch']);
};
