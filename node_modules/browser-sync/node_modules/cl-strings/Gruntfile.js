'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js', '!lib/browser-sync-client.min.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        watch: {
            tests: {
                files: ['tests/*.js', 'index.js'],
                tasks: ['jasmine_node']
            }
        },
        jasmine_node: {
            specNameMatcher: "Spec", // load only specs containing specNameMatcher
            projectRoot: "tests/",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                savePath: "./build/reports/jasmine/",
                useDotNotation: true,
                consolidate: true
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // Default task.
    grunt.registerTask('default', ['jasmine_node']);

};