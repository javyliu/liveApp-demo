module.exports = function (grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);

    grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),

        //公共元数据
        meta : {
            banner: '/* \n'+ 
                    ' * <%= pkg.author %> \n' + 
                    ' * <%= pkg.email %> \n' + 
                    ' * <%= pkg.homepage %>\n' + 
                    ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' */'
        },

        transport : {
            options : {
                paths : ['.'],
                alias: '<%= pkg.spm.alias %>',
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },

            widget : {
                options : {
                    idleading : 'dist/component/widget/'
                },

                files : [
                    {
                        cwd : 'component/widget/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/component/widget'
                    }
                ]
            },

            component : {
                options : {
                    idleading : 'dist/component/'
                },

                files : [
                    {
                        cwd : 'component/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/component'
                    }
                ]
            },

            component_module : {
                options : {
                    idleading : 'dist/component_module/'
                },

                files : [
                    {
                        cwd : 'component_module/',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/component_module'
                    }
                ]
            },

            app : {
                options : {
                    idleading : 'dist/view/'
                },

                files : [
                    {
                        cwd : 'view/',
                        src : '**/*.js',
                        filter : 'isFile',
                        dest : '.build/view'
                    }
                ]
            }
        },
        concat : {
            options : {
                paths : ['.'],
                include : 'relative'
            },

            widget : {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['component/widget/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },

            component : {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['component/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },

            component_module : {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['component_module/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },

            app : {
                options : {
                    include : 'all'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['view/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        uglify : {
            widget : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['component/widget/**/*.js', '!component/widget/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },

            component : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['component/**/*.js', '!component/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },

            component_module : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['component_module/**/*.js', '!component_module/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },

            app : {
                options : {
                    banner : '<%= meta.banner %>\n',   //头部注释
                },

                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['view/**/*.js', '!view/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },

        cssmin : {
            appCSS: {
                options : {
                    banner : '<%= meta.banner %>\n',   //头部注释
                },

                files: [{
                    expand: true,
                    cwd: 'view/',
                    src: ['**/*.css', '!**/*-min.css'],
                    dest: 'view/',
                    ext: '-min.css'
                }]
            }
        },

        clean : {
            // spm : ['.build']
            spm : ['.build', "dist/component", "dist/component_module", "dist/view/**/js", "dist/view/**/*-debug.js"]
        }
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // grunt.registerTask('build-s', ['cssmin']);
    // grunt.registerTask('build-w', ['transport:widget', 'concat:widget', 'uglify:widget', 'clean']);
    // grunt.registerTask('build-c', ['transport:component', 'concat:component', 'uglify:component', 'clean']);
    // grunt.registerTask('build-cm', ['transport:component_module', 'concat:component_module', 'uglify:component_module', 'clean']);
    // grunt.registerTask('build-app', ['transport:app', 'concat:app', 'uglify:app', 'clean']);
    grunt.registerTask('default', [
        'cssmin:appCSS',
        'transport:widget', 'concat:widget', 'uglify:widget',
        'transport:component', 'concat:component', 'uglify:component',
        'transport:component_module', 'concat:component_module', 'uglify:component_module',
        'transport:app', 'concat:app', 'uglify:app', 'clean'
    ]);
};