(function () {
    'use strict'

    let gulp = require('gulp'),
        sass = require('gulp-sass'),
        htmlmin = require('gulp-htmlmin'),
        cleanCSS = require('gulp-clean-css'),
        uglify = require('gulp-uglify'),
        pump = require('pump'),
        browserSync = require('browser-sync'),
        historyApiFallback = require('connect-history-api-fallback'),
        autoprefixer = require('gulp-autoprefixer'),
        concat = require('gulp-concat'),
        reload = browserSync.reload,
        plumber = require('gulp-plumber'),
        babel = require('gulp-babel');

    let autoprefixerOptions = {
        browsers: ['last 2 versions', '> 5%', 'IE 8'],
        cascade: false
    };

    let cleancssOptions = {
        compatibility: 'ie8'
    };

    gulp.task('style', () => {
        gulp.src(['src/app/*.scss'])
            .pipe(concat('main.scss'))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(cleanCSS(cleancssOptions))
            .pipe(gulp.dest('./public/style'))
            .pipe(browserSync.stream())
        gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/style/main.css'])
            .pipe(concat('style.css'))
            .pipe(autoprefixer(autoprefixerOptions))
            .pipe(cleanCSS(cleancssOptions))
            .pipe(gulp.dest('./public/style'))
        return gulp.src(['node_modules/bootstrap/dist/fonts/**']).pipe(gulp.dest('./public/fonts'));
    });

    gulp.task('htmlmin', () => {
        gulp.src('src/app/*.html')
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest('./public/app/'))
            .pipe(browserSync.stream());
        return gulp.src('src/app/*.html', { read: true })
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest('./public/'))
            .pipe(browserSync.stream());
    });

    gulp.task('jsmin', () => {
        return gulp.src(['src/app/*.js',
        ])
            .pipe(plumber())
            .pipe(concat('app.js', { newLine: ';' }))
            .pipe(babel())
            .on('error', console.error.bind(console))
            .pipe(uglify({ mangle: false }))
            .pipe(plumber.stop())
            .pipe(gulp.dest('./public/'))
            .pipe(browserSync.stream());
    });

    gulp.task('watcher', () => {
        gulp.watch(['src/app/*.scss'], ['style']);
        gulp.watch(['src/app/*.js'], ['jsmin']);
        gulp.watch(['src/app/*.html'], ['htmlmin']);
        gulp.watch(['src/app/index.html']).on('change', browserSync.reload);
    });

    gulp.task('serve', ['style', 'htmlmin', 'jsmin', 'watcher'], () => {
        return browserSync({
            proxy: 'http://localhost:3000/',
            port: 3000
        });
    });
})();
