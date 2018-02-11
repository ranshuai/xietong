
var gulp = require('gulp');
var replace = require('gulp-replace');


  // gulp.task('moveCss', function() {
  //   console.log(1);
  //   return gulp.src('./src/pages/gouxiangke/css/*.scss')      //压缩的文件

  //   .pipe(gulp.dest('./src/pages/gouxiangke/css/dist'))   //输出文件夹

  // });
  gulp.task('templates', function(){ 
     gulp.src(['./src/pages/gouxiangke/user-common/pay-password-modal/**/*.scss'])
       .pipe(replace(/(\-|\+)?(\d+)px|(\-|\+)?\d+(\.\d+)?px/g, function(match, p1, offset, string) {
        // Replaces instances of "filename" with "file.txt" 
        // this.file is also available for regex replace 
        // See https://github.com/gulpjs/vinyl#instance-properties for details on available properties 
        //'pxrem('+match.substring(0,match.length-2)+')' //匹配  80px =》pxrem(80); 
            //-10px
        
         
        //  return '|' + match
         return 'pxrem('+match.substring(0,match.length-2)+')' 
      })) 
      .pipe(gulp.dest('./src/pages/gouxiangke/user-common/pay-password-modal'));
  });
gulp.task('default', function () {
  gulp.start('templates');
});