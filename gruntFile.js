"use strict";

module.exports = function(grunt) {

    var _ = grunt.util._;
    var locales = ["fr"];
    var stagingDir = '.staging';
    var dir = __dirname;
    var buildDirs  = ['build/debug','build/deploy'];

    var config = {
        pkg: grunt.file.readJSON('package.json'),

        watch : {
            changes: {
                files: ['app.js','sass/**/*','etc/**/*', 'lib/**/*', 'var/**/*', 'compile/**/*','copy/**/*','translations/*.po'],
                tasks: ['build']
            }
        },

        clean: {
            build: {
                src: buildDirs.concat(stagingDir)
            }
        },

        compass: {
            build: {
                options: {
                    config: 'compass.rb'
                }
            }
        },

        uglify: {
            options: {
                mangle: {
                    except: ['jQuery']
                },
                sourceMap: false,
                sourceMapIncludeSources : false
            },
            app: {
                files: [{
                    expand: true,
                    cwd: stagingDir,
                    src: ['**/*.js'],
                    dest: stagingDir
                }]
            }
        },

        copy: {

            stage: {
                files: [
                    {
                        expand: true,
                        cwd: 'compile',
                        src: ['**'],
                        dest: stagingDir
                    }
                ]
            },

            pre: {
                files: [
                    {
                        expand: true,
                        cwd: stagingDir,
                        src: ['**'],
                        dest: buildDirs[0]
                    }
                ]
            },

            post: {
                files: [
                    {
                        expand: true,
                        cwd: stagingDir,
                        src: ['**'],
                        dest: buildDirs[1]
                    }
                ]
            }
        },

        xgettext: {
            target: {
                files: {
                    html: [stagingDir+'/**/*.html', stagingDir+'/**/*.js']
                },
                options: {
                    functionName: '_tr',
                    potFile: 'translations/messages.pot'
                }
            }
        },

        po2jsonEmbed: {
            target: {
                files : {
                    js : [stagingDir+'/**/*.html', stagingDir+'/**/*.js']
                },
                options: {
                    functionName: '_tr',
                    poFiles: 'translations',
                }
            }
        },

        shell: {
            msgmerge: {
                // todo: dynamic po file list would be better
              command: _.map(locales, function(locale) {
                var po = "translations/" + locale + ".po";
                return "if [ -f \"" + po + "\" ]; then\n" +
                       "    echo \"Updating " + po + "\"\n" +
                       "    msgmerge -v " + po + " translations/messages.pot > .new.po.tmp\n" +
                       "    exitCode=$?\n" +
                       "    if [ $exitCode -ne 0 ]; then\n" +
                       "        echo \"Msgmerge failed with exit code $?\"\n" +
                       "        exit $exitCode\n" +
                       "    fi\n" +
                       "    mv .new.po.tmp " + po + "\n" +
                       "fi\n";
              }).join("")
            },
            writeFlag: {
                command: "echo $(date) > .built"
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'node-inspector', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        'node-inspector': {
            dev: {}
        },

        nodemon : ['debug','deploy'].reduce(function(a,b,i) {
            a[b] = {
                script: 'app.js',
                options: {
                    args: [dir+"/etc/"+b+".json"],
                    nodeArgs: ['--debug='+(7010+i)],
                    cwd: __dirname,
                    watch: ['.built']
                }
            };
            return a;
        }, {}),

    };

    buildDirs.forEach(function(k) {

        config.copy.post.files.push({
            expand: true,
            cwd: 'copy', src: ['**'],
            dest: k
        });

    });

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-xgettext');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-po2json-embed');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-node-inspector');

    grunt.registerTask('build', ['clean:build','copy:stage','xgettext','shell:msgmerge','po2jsonEmbed','compass:build','copy:pre','uglify:app','copy:post','shell:writeFlag']);

    grunt.registerTask('default', ['build','concurrent']);
};
