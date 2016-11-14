var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;

gulp.task('wire:styles', function() {
  return gulp.src("app/styles/main.styl")
    .pipe(wiredep({
      directory: "app/bower_components",
      fileTypes: {
        styl: {
          block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            css: /@import\s['"](.+)['"]/gi,
            styl: /(@import|@require)\s['"](.+)['"]/gi
          },
          replace: {
            css: '@import "{{filePath}}"',
            styl: '@require "{{filePath}}"'
          }
        }
      }
    }))
    .pipe($.inject(gulp.src(["app/components/**/*.styl","app/styles/*.styl","!app/styles/main.styl"], {read:false}), {
          starttag: "// inject:styles",
          endtag: "// endinject",
          addRootSlash: false,
          ignorePath: 'app/',
          transform: function(filepath) {
            return '@import \'../'+filepath.replace(/\.styl$/g,'\.css')+'\''
          }
        }))
    .pipe(gulp.dest("app/styles"));
});

gulp.task('wire:scripts-to-templates', function() {
  return gulp.src("app/*.pug")
    .pipe(wiredep({
      directory: "app/bower_components"
    }))
    .pipe($.inject(gulp.src(["app/components/**/*.ts"], {read:false}), {
          starttag: "// inject:scripts",
          endtag: "// endinject",
          addRootSlash: false,
          ignorePath: 'app/',
          transform: function(filepath) {
            return 'script(src="'+filepath.replace(/\.ts$/g,'\.js')+'")'
          }
        }))
    .pipe(gulp.dest("app"));
});

gulp.task('wire', ['wire:styles', 'wire:scripts-to-templates'])
