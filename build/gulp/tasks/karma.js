/* jshint browser:false, node:true, esnext: true, loopfunc: true */
var karma = require('karma');
var gulp = require('gulp');
var glob = require('glob');
var path = require('path');
var argv = require('yargs').argv;
var meta = require("../../kendo-meta.js");

// all files (including subfiles like editor/main.js etc.)
const allKendoFiles = () => meta.loadAll().map((f) => path.join('dist', 'dev', 'js', f));

// support different test sets for public|private repo
var TESTS = require(glob.sync('../../test-paths-*.js', { cwd: __dirname })[0]);

var browserOption = argv.browser;
var testsOption = argv.tests;
var jqueryOption = argv.jquery || '3.7.0';

var tests, browsers;

if (testsOption) {
    tests = [ testsOption ];
} else {
    tests = [ "tests/!(download-builder)/**/*.js" ];
}

let jquery = "http://code.jquery.com/jquery-" + jqueryOption + ".min.js";

if (browserOption) {
    browsers = [ browserOption ];
} else {
    browsers = ['Chrome'];
}

TESTS.beforeTestFiles.push(jquery);
TESTS.beforeTestFiles.push('tests/jquery.mockjax.js');
TESTS.beforeTestFiles.push('src/angular.js');
TESTS.beforeTestFiles.push('tests/angular-route.js');
TESTS.beforeTestFiles.push('tests/jasmine.js');
TESTS.beforeTestFiles.push('tests/jasmine-boot.js');
TESTS.beforeTestFiles.push('node_modules/axe-core/axe.js');

var defaultOptions = {
    reportSlowerThan: 500,
    basePath: '',
    frameworks: ['mocha', 'chai'],
    preprocessors: {
        'tests/**/.html': [],
        'tests/**/*-fixture.html': ['html2js']
    },
    reporters: ['spec'],
    colors: true,
    autoWatch: true,
    browsers: browsers,
    client: {
        mocha: {
            timeout: 10000
        }
    },
    junitReporter: {
      outputDir: '.',
      outputFile: argv['junit-results']
    },
    captureTimeout: 60000,
    browserNoActivityTimeout: 30000,
    singleRun: argv['single-run']
};

var flavours = {
    ci: {
        reporters: ['dots', 'junit'],
        singleRun: true,
        browsers: [ 'ChromeHeadless' ],

        files: [].concat(
            TESTS.beforeTestFiles,
            TESTS.ciFiles,
            TESTS.afterTestFiles,
            tests
        )
    },
    mocha: {
        files: [].concat(
            TESTS.beforeTestFiles,
            allKendoFiles(),
            'dist/dev/js/cultures/kendo.culture.de-DE.js',
            'dist/dev/js/cultures/kendo.culture.bg-BG.js',
            'dist/dev/js/cultures/kendo.culture.en-ZA.js',
            'dist/dev/js/cultures/kendo.culture.es-ES.js',
            'dist/dev/js/kendo.timezones.js',
            TESTS.afterTestFiles,
            tests
        )
    }
};

for (var flavour in flavours) {
    (function(flavour) {
        gulp.task('karma-' + flavour, function(done) {
            new karma.Server(Object.assign({}, defaultOptions, flavours[flavour]), done).start();
        });
    })(flavour);
}
