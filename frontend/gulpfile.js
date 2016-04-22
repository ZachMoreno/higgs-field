var gulp        = require('gulp'),
    webserver   = require('gulp-webserver'),
    del         = require('del'),
    jshint      = require('gulp-jshint'),
    sourcemaps  = require('gulp-sourcemaps'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify'),
    gutil       = require('gulp-util'),
    ngAnnotate  = require('browserify-ngannotate'),
    CacheBuster = require('gulp-cachebust'),
    cachebust   = new CacheBuster();

// cleans build output
gulp.task('clean', function(cb) {
    del([ 'dist' ], cb);
});

// returns template cache
gulp.task('build-template-cache', [], function() {
    var ngHtml2Js = require("gulp-ng-html2js"),
        concat    = require("gulp-concat");

    return  gulp.src('./pages/**/*.html')
            .pipe(ngHtml2Js({
                moduleName: 'higgsFieldPages',
                prefix: '/pages/'
            }))
            .pipe(concat('templateCachePages.js'))
            .pipe(gulp.dest('./dist'));
});

// reports js info
gulp.task('jshint', function() {
    gulp.src(['./pages/**/*.js',
              './serverics.js',
              './higgs-field.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//
gulp.task('build-css', function() {
    gulp.src('./higgs-field.css')
        .pipe(cachebust.resources())
        .pipe(gulp.dest('./dist'));
});

// build a minified js bundle
gulp.task('build-js', [], function() {
    var b = browserify({
        entries: './higgs-field.js',
        debug: true,
        paths: ['./pages/add',
                './pages/dashboard',
                './pages/login',
                './pgaes/microservice'],
        transform: [ngAnnotate]
    });

    return  b.bundle()
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(cachebust.resources())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .on('error', gutil.log)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js'));
});

// outputs full build
gulp.task('build', ['jshint', 'build-template-cache', 'build-css', 'build-js'], function() {
    return  gulp.src('./index.html')
            .pipe(cachebust.references())
            .pipe(gulp.dest('./dist'));
});

// watches assets & triggers build on modification
gulp.task('watch', function() {
    return gulp.watch([ './index.html',
                        './higgs-field.js',
                        './services.js',
                        './pages/**/.html',
                        './pages/**/*.js'],
                        ['build']);
});

// launches a webserver
gulp.task('webserver', ['watch', 'build'], function() {
    gulp.src('./dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: 'http://localhost:3030/index.html'
        }));
});

// launch a build upon modification and publish it to a running server
gulp.task('dev', ['watch', 'webserver']);

// build everything
gulp.task('default', ['build']);
