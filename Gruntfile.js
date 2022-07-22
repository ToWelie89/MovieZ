module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                cleancss: true
            },
            all: {
                files: [{
                    src: 'frontend/less/main.less',
                    dest: 'frontend/dist/main.css'
                }]
            }
        },
        browserify: {
            build: {
                files: {
                    'js/dist/app.js': 'js/main.js'
                },
                options: {
                    transform: [['babelify', { presets: ["es2015"] }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    // destination for transpiled js : source js
                    'frontend/dist/app.js': 'frontend/js/main.js'
                },
                options: {
                    transform: [['babelify', { presets: "es2015" }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        watch: {
            files: ['frontend/less/**/*.less', 'frontend/js/*.js'],
            tasks: ['default'],
            options: {
                spawn: false
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-bump');

    // Default task for building
    grunt.registerTask('default', [
        'less', // Compile CSS files and put them in build folder
        'browserify:dist' // Compile JS
    ]);
};