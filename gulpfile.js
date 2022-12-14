const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename')

gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('templates:compile', function buildHTML(){
    return gulp.src('source/Templates/index.pug')
    .pipe(pug({
        pretty: true
    }))
  .pipe(gulp.dest('build'))
})

gulp.task('styles:compile',function() {
    return gulp.src('source/Styles/main.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(gulp.dest('build/css'));
  });

gulp.task('sprite',function(cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
}));

spriteData.img.pipe(gulp.dest('build/images/'));
spriteData.css.pipe(gulp.dest('source/styles/global/'));
cb();
})
gulp.task('clean', function del(cb){
    return rimraf('build',cb);
});

gulp.task('copy:fonts', function(){
    return gulp.src('.source/fonts/**/*.*')
    .pipe(gulp.dest('buld/fonts'))
});

gulp.task('copy:images', function(){
    return gulp.src('.source/images/**/*.*')
    .pipe(gulp.dest('buld/images'))
});

gulp.task('copy', gulp.parallel('copy:fonts','copy:images'))

gulp.task('watch',function(){
    gulp.watch('source/Templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/Styles/**/*.scss', gulp.series('styles:compile'));
})

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite','copy'),
    gulp.parallel('watch', 'server')
))