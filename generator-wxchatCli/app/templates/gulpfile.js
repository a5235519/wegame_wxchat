var fs = require('fs');
var path = require('path');

var gulp = require('gulp'),
    sass    = require('gulp-sass'),
    watch = require('gulp-watch'),
    replace      = require('gulp-replace'),
    webpack = require('webpack'),
    imagemin   = require('gulp-imagemin'),
    pngquant   = require('imagemin-pngquant'),
    concatCSS = require('gulp-concat-css'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    spritesmash = require('gulp-spritesmash'),
    spritesmith = require('gulp.spritesmith'),
    contentIncluder = require('gulp-content-includer'),

    gutil = require('gulp-util'),
    changed = require('gulp-changed'),

    webpackConfig = require('./config/webpack.config.js')

var ipath = {
    staticPath: './static',
    prdPath: './src/assets',
}

//sass文件监控
gulp.task('static_watch', function () {
    gulp.watch([ipath.staticPath+'/css/*.scss',ipath.staticPath+'/images/sprite/*.png'], function(){
        gulp.run('sass'); //实时刷新浏览器
        gulp.run('sprite');
    });
});

//雪碧图
gulp.task('sprite', function () {    
    gulp.src(ipath.staticPath + '/images/sprite/*.png')
      .pipe(spritesmith({
        imgName: ipath.staticPath+'/images/sprite.png',
        cssName: ipath.staticPath+'/css/_sprite.scss',
        padding: 2,
        algorithm: 'binary-tree',
        cssTemplate:function(data){
          let arr = [],
              width = data.spritesheet.px.width,
              height = data.spritesheet.px.height,
              url =  data.spritesheet.image
          // console.log(data)
          data.sprites.forEach(function(sprite) {
              arr.push(
                  ".icon-"+sprite.name+
                  "{"+
                      "background: url('"+url+"') "+
                      "no-repeat "+
                      sprite.px.offset_x+" "+sprite.px.offset_y+";"+
                      "background-size: "+ width+" "+height+";"+
                      "width: "+sprite.px.width+";"+                       
                      "height: "+sprite.px.height+";"+
                      "display: inline-block;" +
                  "}\n"
              )
          })
          return arr.join("");
        }
      }))
      .pipe(spritesmash())
      .pipe(gulp.dest('./'));
});

gulp.task('sass', function(){
    gulp.src(ipath.staticPath+'/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(ipath.staticPath+'/css'))
        .pipe(browserSync.reload({stream:true}));
})

// 启动服务，监听
gulp.task('bs', function() {
    var files = [
        ipath.staticPath + '/images/*.+(png|jpg|gif)',
        ipath.staticPath + '/css/*.css',
        ipath.staticPath + '/*.html'
    ];

    browserSync.init(files, {
      // 本地
       server: { 
          baseDir: ipath.staticPath + '/',
       }
    });
});

// 重构开发模式
gulp.task('static',['sprite', 'sass'], function(){
  gulp.run('static_watch'); // 监听项目
  gulp.run('bs'); //实时刷新浏览器  不支持活动专题gbk格式
});

gulp.task('movecss', function () {
  var cssFile = ipath.staticPath + '/css/*.css';
  var outputCssFile = ipath.prdPath + '/css/';

  return gulp.src(cssFile)
      .pipe(changed(outputCssFile))
      .pipe(concatCSS("style.css"))
      .pipe(minifyCSS({
          advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
          compatibility: '*',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
          keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
          keepSpecialComments: '*'
      }))
      .pipe(gulp.dest(outputCssFile));
});

// 发布模式：图片移动并压缩
gulp.task('moveimg', function () {
  var outputImgFile = ipath.prdPath + '/images/';
  gulp.src(ipath.staticPath +'/images/*.{jpg,gif,png,jpeg,ico}')
    .pipe(changed(outputImgFile))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(outputImgFile));

  gulp.src(ipath.staticPath+'/images/tab/*')
    .pipe(changed(outputImgFile+'tab'))
    .pipe(gulp.dest(outputImgFile+'tab'));
});

// 发布模式：HTML打包
gulp.task('devhtml', function(){
  gulp.src(ipath.staticPath + '/*.html')
    .pipe(contentIncluder({
          includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g,
          deepConcat: true
    }))
   .pipe(gulp.dest(ipath.prdPath + '/'))
})

// 项目部署
gulp.task('dev', function(){
    gulp.run('movecss');
    gulp.run('moveimg');
    gulp.run('devhtml');
});

// 开发模式:webpack打包
gulp.task('webpack', function(callback){
    webpack(webpackConfig).run((err, stats)=>{
        if(err) throw new gutil.PluginError("webpack", err);
        // gutil.log("[webpack]", stats.toString());
        gulp.run('imageAssets');
        callback();
    });
})

gulp.task('imageAssets', function() {
    return gulp.src('./src/assets/images/tab/*').pipe(gulp.dest('./dist/static/images/tab'))
});

// 前端开发模式监听
gulp.task('watch', ['webpack'], () => {
    var prdWatch = [
        './src/*',
        './src/**/*',
        './src/**/**/*',
        './src/**/**/**/*'
    ];

    gulp.watch(prdWatch, () => {
        gulp.run('webpack');
        // gulp.run('config');
        // gulp.run('imageAssets');
    });
})