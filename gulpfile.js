var gulp = require('gulp'),
  concat = require('gulp-concat'),// Склейка файлов
  browserSync = require('browser-sync'), // BrowserSync
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
  // SVG
  svgSprite = require('gulp-svg-sprite'),
  svgmin = require('gulp-svgmin'),
  cheerio = require('gulp-cheerio'),
  replace = require('gulp-replace'),
  filter    = require('gulp-filter'),
  svg2png   = require('gulp-svg2png');

var path = {
  name: "boiler",
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    server: 'build/',
    html: 'build/',
    js: 'build/js/',
    jsVendor: 'build/js/vendor/',
    css: 'build/css/',
    img: 'build/img/',
    svg_sprite: 'build/img/sprites',
    fonts: 'build/css/fonts/',
    favicon: 'build/favicon/'
  },
  src: { //Пути откуда брать исходники
    pug: ['src/pug/*.pug', '!src/pug/_*.pug'], //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    js: 'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
    jsVendor: 'src/js/vendor/*.js',//В стилях и скриптах нам понадобятся только main файлы
    scss: 'src/sass/**/*.scss',
    img: ['src/img/**/*.*', '!src/img/**/*.tmp*'],//  Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    fonts: 'src/fonts/*',
    favicon: 'src/favicon/*',
    // svg
    svg: 'src/svg_sprite/*.svg',
    svgStyles: '../sass/base/_spriteSvg.scss',
    templates: 'src/sass/templates/_sprite_template.scss'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    pug: './src/pug/**/*.pug',
    pugIncludes: './src/pug/_includes/**/*.pug',
    js: './src/js/*.js',
    jsVendor: './src/js/vendor/*.js',
    scss: ["./src/sass/**/*.scss", './src/sass/_*.scss'],
    img: './src/img/**/*',
    favicon: './src/favicon/*',
    fonts: './src/fonts/*',
    svg: 'src/svg_sprite/*.svg'
  }
};


svgConfig = {
	shape				: {
		dimension		: {			// Set maximum dimensions
			maxWidth	: 32,
			maxHeight	: 32
		},
		spacing			: {			// Add padding
			padding		: 10
		},
		dest			: 'out/intermediate-svg'	// Keep the intermediate files
	},
	mode				: {
		view			: {			// Activate the «view» mode
			bust		: false,
			render		: {
				scss	: true		// Activate Sass output (with default options)
			}
		},
		symbol			: true		// Activate the «symbol» mode
	}
  // mode					: {
	// 	css					: false,		// Create a «css» sprite
  //   view				: {		// Create a «view» sprite
  //     bust		: false,
	// 		render		: {
	// 			scss	: true		// Activate Sass output (with default options)
  //     }
  //   },
	// 	defs				: false,		// Create a «defs» sprite
	// 	symbol			: true,		// Create a «symbol» sprite
	// 	stack				: true		// Create a «stack» sprite
	// }
}


// робимо архів нашого білда
gulp.task('zip', () => {
  return gulp.src([path.build.server + '**/*', '!' + path.build.server + '**/*.zip'])
    .pipe(zip('build_' + path.name + '.zip'))
    .pipe(gulp.dest(path.build.server));
});
// очищаемо від невикористовуваних стилів
gulp.task('uncss', function () {
  return gulp.src('build/css/styles.css')
    .pipe(uncss({
      html: ['build/*.html']
    }))
    .pipe(gcmq())
    .pipe(shorthand())
    .pipe(rename('main.css'))
    .pipe(gulp.dest(path.build.css));
});
//Собираем Pug ( html )
gulp.task('pug-includes', function () {
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
gulp.task('pug-templates', function () {
  return gulp.src(path.src.pug)
    .pipe(changed(path.build.html, { extension: '.html' }))
    .pipe(plumber())
    .pipe(pug({
    }))
    .on('error', console.log)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
});
// Собираем CSS из SASS файлов
gulp.task('sass-dev', function () {
  return gulp.src(path.src.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true,
      sourcemaps: false
    }))
    // .pipe(gcmq())
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

gulp.task('svgSpriteBuild', function () {
  return gulp.src(path.src.svg)
// minify svg
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  // remove all fill, style and stroke declarations in out shapes
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {xmlMode: true}
  }))
   // cheerio plugin create unnecessary string '&gt;', so replace it.
  .pipe(replace('&gt;', '>'))
  // build svg sprite
  .pipe(svgSprite({
    // svg: {
    //   sprite: '../img/sprites/sprite.svg',
    // }
    mode: {
      inline: true,
      symbol: {
        // куда покласти сам спрайт
        inline: true,
        sprite: '../img/sprites/sprite.svg',
        render: {
          scss: {
            dimensions: '-dms',
            // куда покласти стилі для спрайта
            dest: path.src.svgStyles,
            // шаблон за яким будуть створені стилі
            template: path.src.templates
          }
        }
      }
    }
  }))
  .pipe(gulp.dest('src/'));
});

gulp.task('svgSpritePNG', function () {
  return gulp.src('src/img/sprites/sprite.svg')
    // .pipe(svg2png())
    // .pipe(gulp.dest(path.build.svg_sprite));
});

gulp.task('svgSprite', ['svgSpriteBuild','svgSpritePNG','img']);


//Сжатие изображений
gulp.task('img', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true }))
    .pipe(gulp.dest(path.build.img));
});
//Копируем JS
gulp.task('js', function () {
  return gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});
//Копируем JS-vendor
gulp.task('js-vendor', function () {
  return gulp.src(path.src.jsVendor)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.build.jsVendor))
    .pipe(browserSync.stream());
});
// Favicon
gulp.task('favicon', function () {
  return gulp.src(path.src.favicon)
    .pipe(changed(path.build.favicon))
    .pipe(plumber())
    .pipe(gulp.dest(path.build.favicon))
    .pipe(browserSync.stream());
});
// Fonts
gulp.task('fonts', function () {
  return gulp.src(path.src.fonts)
    .pipe(changed(path.build.fonts))
    .pipe(plumber())
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browserSync.stream());
});

// WATCH
gulp.task('default', ['pug-includes', 'sass-dev', 'img', 'svgSprite', 'js-vendor', 'js', 'favicon', 'fonts'], function () {

  browserSync.init({
    server: path.build.server
  });
  watch(path.watch.pugIncludes, function () {
    gulp.start('pug-includes');
  });

  watch(path.watch.svg, function () {
    gulp.start('svgSprite');
  });

  watch(path.watch.pug, function () {
    gulp.start('pug-templates');
    // gulp.start('uncss');
  });

  watch(path.watch.scss, function () {
    gulp.start('sass-dev');
  });

  watch(path.watch.js, function () {
    gulp.start('js');
  });

  watch(path.watch.jsVendor, function () {
    gulp.start('js-vendor');
  });

  watch(path.watch.img, function () {
    gulp.start('img');
  });

  watch(path.watch.favicon, function () {
    gulp.start('favicon');
  });

  watch(path.watch.fonts, function () {
    gulp.start('fonts');
  });
});