// хотів зробити для мультипроектів але чет завяла ідея

var gulp = require('gulp'),
    concat = require('gulp-concat'),// Склейка файлов
    browserSync  = require('browser-sync'), // BrowserSync
    pug = require('gulp-pug'), // Pug обработчик html
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'), //Минификация CSS
    autoprefixer = require('gulp-autoprefixer'), // Автопрефиксы CSS
    imagemin = require('gulp-imagemin'),// Сжатие JPG, PNG, SVG, GIF
    uglify = require('gulp-uglify'), // Минификация JS
    plumber = require('gulp-plumber'),
    shorthand = require('gulp-shorthand'), // шорт код
    uncss = require('gulp-uncss'), // удаление не используемых стилей
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    changed = require('gulp-changed'),
    rigger = require('gulp-rigger'), // іморт файлів в файл like //="../../../bower_components/...
    gcmq = require('gulp-group-css-media-queries'), // обєднує media з однаковими breakpoint
    zip = require('gulp-zip'), // обєднує media з однаковими breakpoint
    clean = require('gulp-clean'); // очистка папок

var path = {
    clearPath: 'build/',  // папка для очистки
    projectsPath: 'projects/',
    projects: ['boiler/'], // список папок для проектів, масив як архів
    name: '',   //
    // name: '',   //
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        server: 'build/',
        html: 'build/',
        js: 'build/js/',
        jsVendor: 'build/js/vendor/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/css/fonts/',
        favicon: 'build/favicon/'
    },
    src: { //Пути откуда брать исходники
        pug: [this.name+'src/pug/*.pug','!'+this.name+'src/pug/_*.pug'], //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: this.name+'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        jsVendor: this.name+'src/js/vendor/*.js',//В стилях и скриптах нам понадобятся только main файлы
        scss: this.name+'src/sass/**/*.scss',
        img: [this.name+'src/img/**/*.*','!'+this.name+'src/img/**/*.tmp'],//  Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: this.name+'src/fonts/*',
        favicon: this.name+'src/favicon/*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        pug: this.name+'src/pug/**/*.pug',
        pugIncludes: this.name+'./src/pug/_includes/**/*.pug',
        js: this.name+'src/js/*.js',
        jsVendor: this.name+'src/js/vendor/*.js',
        scss: [this.name+'src/sass/**/*.scss', this.name+'src/sass/_*.scss'],
        img: this.name+'src/img/**/*',
        favicon: this.name+'src/favicon/*',
        fonts: this.name+'src/fonts/*'
    }
};

// очистка папки
gulp.task('cleanFolder', function () {
    return gulp.src(path.clearPath, {read: false})
        .pipe(clean());
});

// робимо архів нашого білда
gulp.task('zip', () => {
    return gulp.src([path.build.server+'**/*','!'+path.build.server+'**/*.zip'])
        .pipe(zip('build_'+path.name+'.zip'))
        .pipe(gulp.dest(path.build.server));
});
// очищаемо від невикористовуваних стилів
gulp.task('uncss', function() {
  return gulp.src('build/css/styles.css')
    .pipe(uncss({
      html: ['build/*.html']
    }))
    //.pipe(gcmq())
    .pipe(shorthand())
    .pipe(rename('main.css'))
    .pipe(gulp.dest(path.build.css));
});
//Собираем Pug ( html )
gulp.task('pug-includes', function() {
  return gulp.src(path.src.pug)
    .pipe(plumber())
    .pipe(pug({
       pretty: true
    }))
    .on('error', console.log)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
  });
//Собираем только изменившийся файл Pug ( html )
gulp.task('pug-templates', function() {
  return gulp.src(path.src.pug)
    .pipe(changed(path.build.html, {extension: '.html'}))
    .pipe(plumber())
    .pipe(pug({
    }))
    .on('error', console.log)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
  });
// Собираем CSS из SASS файлов
gulp.task('sass-dev', function() {
  return gulp.src(path.src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true,
      sourcemaps : false
      }))
    .pipe(gcmq())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: true
     }))
    .pipe(cssnano({
        discardComments: {
          removeAll: true
        }
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});
//Сжатие изображений
gulp.task('img', function() {
  return gulp.src(path.src.img)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true}))
    .pipe(gulp.dest(path.build.img));
});
//Копируем JS
gulp.task('js', function(){
  return gulp.src(path.src.js)
  .pipe(plumber())
  .pipe(rigger())
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest(path.build.js))
  .pipe(browserSync.stream());
});
//Копируем JS-vendor
gulp.task('js-vendor', function(){
  return gulp.src(path.src.jsVendor)
  .pipe(plumber())
  .pipe(rigger())
  .pipe(uglify())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(path.build.jsVendor))
  .pipe(browserSync.stream());
});
// Favicon
gulp.task('favicon', function(){
  return gulp.src(path.src.favicon)
  .pipe(changed(path.build.favicon))
  .pipe(plumber())
  .pipe(gulp.dest(path.build.favicon))
  .pipe(browserSync.stream());
});
// Fonts
gulp.task('fonts', function(){
  return gulp.src(path.src.fonts)
  .pipe(changed(path.build.fonts))
  .pipe(plumber())
  .pipe(gulp.dest(path.build.fonts))
  .pipe(browserSync.stream());
});

// WATCH
gulp.task('default', ['cleanFolder','pug-includes','sass-dev','img','js-vendor','js','favicon','fonts'], function () {

    browserSync.init({
      server : path.build.server
    });
    watch(path.watch.pugIncludes, function() {
      gulp.start('pug-includes');
    });

    watch(path.watch.pug, function() {
      gulp.start('pug-templates');
      // gulp.start('uncss');
    });

    watch(path.watch.scss, function() {
      gulp.start('sass-dev');
    });

    watch(path.watch.js, function() {
      gulp.start('js');
    });

    watch(path.watch.jsVendor, function() {
      gulp.start('js-vendor');
    });

    watch(path.watch.img, function() {
      gulp.start('img');
    });

    watch(path.watch.favicon, function() {
      gulp.start('favicon');
    });

    watch(path.watch.fonts, function() {
      gulp.start('fonts');
    });
});