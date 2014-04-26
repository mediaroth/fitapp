module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %>\n' +
            ' */\n',
    clean: {
      dist: ['public/css/', 'public/js/'],
      lib: ['public/lib/']
    },
    jshint: {
      options: {
        jshintrc: '<%= pkg.paths.src.js %>/.jshintrc'
      },
      src: {
        src: '<%= pkg.paths.src.js %>/**/*.js'
      }
    },
    jscs: {
      options: {
        config: '<%= pkg.paths.src.js %>/.jscsrc',
      },
      src: {
        src: '<%= pkg.paths.src.js %>/**/*.js'
      },
    },
    csslint: {
      options: {
        csslintrc: '<%= pkg.paths.src.css %>/.csslintrc'
      },
      src: [
        '<%= pkg.paths.build.css %>/<%= pkg.name %>.css'
      ]
    },
    concat: {
      options: {
        banner: '<%= banner %>\n',
        stripBanners: false
      },
      dist: {
        // the files to concatenate
        src: ['<%= pkg.src.js %>/**/*.js'],
        // the location of the resulting JS file
        dest: '<%= pkg.paths.build.js %>/<%= pkg.name %>.js'
      }
    },
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: false,
          outputSourceFiles: true
        },
        files: {
          '<%= pkg.paths.build.css %>/<%= pkg.name %>.css': '<%= pkg.paths.src.css %>/style.less'
        }
      },
      minify: {
        options: {
          cleancss: true,
          report: 'min'
        },
        files: {
          '<%= pkg.paths.build.css %>/<%= pkg.name %>.min.css': '<%= pkg.paths.build.css %>/<%= pkg.name %>.css'        }
      }
    },
    uglify: {
      options: {
        report: 'min'
      },
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        src: '<%= concat.dist.dest %>',
        dest: '<%= pkg.paths.build.js %>/<%= pkg.name %>.min.js'
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            '<%= pkg.paths.build.css %>/<%= pkg.name %>.css',
            '<%= pkg.paths.build.css %>/<%= pkg.name %>.min.css',
          ]
        }
      }
    },
    csscomb: {
      options: {
        config: '<%= pkg.paths.src.css %>/.csscomb.json'
      },
      dist: {
        files: {
          '<%= pkg.paths.build.css %>/<%= pkg.name %>.css': '<%= pkg.paths.build.css %>/<%= pkg.name %>.css',
        }
      }
    },
    copy: {
      lib: {
        files : [
          {expand: true,flatten: true,src:['assets/angular/angular.min.js'],dest:'public/lib/',filter:'isFile'},
          {expand: true,flatten: true,src:['assets/angular-route/angular-route.min.js'],dest:'public/lib/',filter:'isFile'},
          {expand: true,flatten: true,src:['assets/angular-cookies/angular-cookies.min.js'],dest:'public/lib/',filter:'isFile'},
          {expand: true,flatten: true,src:['assets/jquery/dist/jquery.min.js'],dest:'public/lib/',filter:'isFile'},
          {expand: true,flatten: true,src:['assets/lodash/dist/lodash.compat.min.js'],dest:'public/lib/',filter:'isFile'},
          {expand: true,flatten: true,src:['assets/restangular/dist/restangular.min.js'],dest:'public/lib/',filter:'isFile'},
        ]
      }
    },
    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'jscs:src', 'concat', 'uglify'],
        options: {
          livereload: true
        }
      },
      bootstrap: {
        files: 'public/assets/bootstrap/less/*.less',
        tasks: 'less',
        options: {
          livereload: true
        }
      },
      main: {
        files: 'public/index.html',
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-jscs-checker');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('make-jshint', ['jshint']);
  grunt.registerTask('make-csslint', ['csslint']);
  grunt.registerTask('make-jscs', ['jscs']);
  grunt.registerTask('make-less', ['less']);
  grunt.registerTask('make-clean', ['clean']);
  grunt.registerTask('make-concat', ['concat']);
  grunt.registerTask('make-usebanner', ['usebanner']);
  grunt.registerTask('make-csscomb', ['csscomb']);
  grunt.registerTask('make-copy', ['clean:lib','copy']);
  grunt.registerTask('default', ['clean','jshint','jscs','concat','uglify','less','csscomb','csslint','usebanner','copy']);


};