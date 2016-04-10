// Gruntfile.js
module.exports = function(grunt) {
  grunt.initConfig({
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/img'
        }]
      }
    },
    sprite: {
      all: {
        src: 'src/img/sprites/*.png',
        dest: 'dist/img/sprites/img.png',
        destCss: 'src/sass/sprite.css'
      }
    },
    jshint: {
      all: ['src/js/*.js']
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: ['*.scss'],
          dest: 'dist/css',
          ext: '.css'
        }]
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['> 1%'],
            remove: false
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css'],
          dest: 'dist/css'
        }]
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'dist/js'
        }]
      }
    },
    watch: {
      css: {
        files: ['src/sass/**/*.scss'],
        tasks: ['sass', 'postcss', 'cssmin'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['*.html'],
        options: {
          livereload: true
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['watch']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask('default', ['imagemin', 'sprite', 'sass', 'postcss', 'cssmin', 'jshint', 'uglify', 'concurrent']);

};
