module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'dev/js/libs/*.js',
                    'dev/js/*.js'
                ],
                dest: 'production/js/script.js',
            }
        },

        uglify: {
            build: {
                src: 'production/js/script.js',
                dest: 'production/js/script.min.js'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'dev/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'production/img/'
                }]
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dev/scss',
                    src: ['*.scss'],
                    dest: 'dev/css/scss_css',
                    ext: '.css'
                }]
            }
        },

        cssmin: {
            options: {
                banner: '/* Production by Denis Balyko (denisbalyko.com); */'
            },
            combine: {
                files: {
                    'production/css/style.min.css': [
                    'dev/css/reset.css', 
                    'dev/css/clearfix.css', 
                    'dev/css/scss_css/global.css',
                    ],
                }
            }
        },

        watch: {
            options: { 
                livereload: true,
                port: 9000,
            },
            scripts: {
                files: ['dev/js/*.js', 'dev/js/libs/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            html: {
                files: ['*.html'],
                tasks: [],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['dev/scss/*.scss', 'dev/css/*.css', 'dev/scss_css/*.css'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false,
                }
            },
            img: {
                files: ['dev/img/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin']
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
    grunt.registerTask('css', ['sass', 'cssmin', 'watch']);

};