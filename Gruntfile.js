module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-dox');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      components: {
        files: ['app/assets/javascripts/dough/components/*.js'],
        tasks: ['dox']
      }
    },
    dox: {
      options: {
        title: 'MAS Frontend Assets'
      },
      files: {
        src: ['app/assets/javascripts/dough/components/'],
        dest: 'docs'
      }
    }
  });

  grunt.registerTask('default', ['dox']);
  grunt.registerTask('watch:js', ['dox', 'watch']);
};
