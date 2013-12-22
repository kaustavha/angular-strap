'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  // require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project meta
    pkg: require('./package.json'),
    bower: require('./bower.json'),
    // meta: {
    //   banner: '/**\n' +
    //   ' * <%= pkg.name %>\n' +
    //   ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    //   ' * @link <%= pkg.homepage %>\n' +
    //   ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
    //   ' * @license <%= props.license %> License, http://www.opensource.org/licenses/<%= props.license %>\n' +
    //   ' */\n'
    // },

    // Project settings
    yo: {
      // Configurable paths
      src: require('./bower.json').appPath || 'src',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['{.tmp,<%= yo.src %>}/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['{.dev,<%= yo.src %>}/styles/{,*/}*.less'],
        tasks: ['less:dev', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '{.dev,<%= yo.src %>}/{,*/}{,docs/}*.html',
          '{.dev,.tmp,<%= yo.src %>}/{,*/}*.css',
          '{.dev,.tmp,<%= yo.src %>}/{,*/}*.js',
          '<%= yo.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '.dev',
            '<%= yo.src %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yo.src %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yo.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yo.src %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yo.dist %>/*',
            '!<%= yo.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },


    // Compile less stylesheets
    less: {
      options: {
      },
      dev: {
        options: {
          dumpLineNumbers: 'comments',
        },
        files: [{
          src: '{.dev,<%= yo.src %>}/{,*/}*.less',
          dest: '.tmp/styles/main.css'
        }]
      },
      dist: {
        options: {
          cleancss: true,
          report: 'gzip'
        },
        files: [{
          src: '{.dev,<%= yo.src %>}/{,*/}*.less',
          dest: '.tmp/styles/main.css'
          // dest: '<%= yo.dist %>/styles/main.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yo.dist %>/scripts/{,*/}*.js',
            '<%= yo.dist %>/styles/{,*/}*.css',
            '<%= yo.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yo.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yo.src %>/index.html',
      options: {
        dest: '<%= yo.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yo.dist %>/{,*/}*.html'],
      css: ['<%= yo.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yo.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yo.src %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yo.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yo.src %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yo.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          // Optional configurations that you can uncomment to use
          // removeCommentsFromCDATA: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yo.src %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yo.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yo.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yo.src %>',
          dest: '<%= yo.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yo.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'less:dev'
      ],
      test: [
        'less:dev'
      ],
      dist: [
        'less:dist',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yo.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yo.src %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yo.dist %>/scripts/scripts.js': [
    //         '<%= yo.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      continuous: {
        autoWatch: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('ci', [
    // 'clean:server',
    // 'concurrent:test',
    // 'autoprefixer',
    // 'connect:test',
    'karma:continuous'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    // 'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
