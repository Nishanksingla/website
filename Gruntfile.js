'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
      concat: {
          dist: {
              src: ['assets/css/Footer.css', 'assets/css/ngProgress.css', 'assets/css/RegistrationCSS.css'],
              dest: 'assets/css/Styles.css',
          },
      },
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat']);
};
