module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'css/style.css': 'scss/style.scss'
                }
            }
        },

        concat: {
            'dest/a.js': ['src/aa.js', 'src/aaa.js']
            // 'dest/b.js': ['src/bb.js', 'src/bbb.js'],
        },

        bower: {
            dev: {
                dest: 'public/',

                js_dest: 'public/js/',
                css_dest: 'public/css/',
                fonts_dest: 'public/fonts/', //covers font types ['svg','eot', 'ttf', 'woff', 'woff2', 'otf']
                images_dest: 'public/images/', //covers image types ['jpeg', 'jpg', 'gif', 'png']
                options: {
                    expand: true
                }
            }
        },

        purifycss: {
            options: {},
            target: {
                src: ['test/fixtures/*.html', 'test/fixtures/*.js'],
                css: ['test/fixtures/*.css'],
                dest: 'tmp/purestyles.css'
            },
        },

        jshint: {
            files: ['Gruntfile.js', './*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.registerTask('default', ['sass']);
    grunt.loadNpmTasks('grunt-purifycss');
    //grunt.loadNpmTasks('grunt-contrib-sass');      "grunt-contrib-sass": "^1.0.0",
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
   // grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['jshint']);

};

