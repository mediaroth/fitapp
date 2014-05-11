module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.repository %>)\n' +
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
        src: ['<%= pkg.paths.src.js %>/**/*.js'],
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
          '<%= pkg.paths.build.css %>/<%= pkg.name %>.css': '<%= pkg.paths.src.css %>/styles.less'
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
          // {expand: true,flatten: true,src:['bower_components/angular/*'],dest:'public/lib/',filter:'isFile'},
          // {expand: true,flatten: true,src:['bower_components/angular-route/*'],dest:'public/lib/',filter:'isFile'},
          // {expand: true,flatten: true,src:['bower_components/angular-cookies/*'],dest:'public/lib/',filter:'isFile'},
          // {expand: true,flatten: true,src:['bower_components/jquery/dist/*'],dest:'public/lib/',filter:'isFile'},
          // {expand: true,flatten: true,src:['bower_components/lodash/dist/*'],dest:'public/lib/',filter:'isFile'},
          // {expand: true,flatten: true,src:['bower_components/restangular/*'],dest:'public/lib/',filter:'isFile'},
        ]
      }
    },
    bowerInstall: {
      target: {

        // needs manual edit for the correct public/ path in index.php
        src: [
          'public/views/index.php',   // .html support...
        ],

        // Optional:
        // ---------
        cwd: '',
        dependencies: true,
        devDependencies: false,
        exclude: [],
        fileTypes: {},
        ignorePath: ''
      }
    },
    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'jscs:src', 'concat', 'uglify'],
        options: {
          // livereload: true
        }
      },
      bootstrap: {
        files: ['<%= pkg.paths.src.css %>/**/*.less'],
        tasks: 'less',
        options: {
          // livereload: true
        }
      },
      main: {
        files: ['public/**/*.html','public/**/*.php','backend/app/**/*.*'],
        options: {
          // livereload: true
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
  grunt.loadNpmTasks('grunt-bower-install');

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