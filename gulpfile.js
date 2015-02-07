gulp = require("gulp");
watch = require("gulp-watch");
coffee = require("gulp-coffee");
stylus = require("gulp-stylus");
concat = require("gulp-concat");

src = {
	game : {
		coffee : "game/coffee/*.coffee",
		js : "game/js/*.js",
		libs : "game/js/libs/**/*.coffee"
	},
	example : {
		coffee  : "example/js/coffee/*.coffee",
		stylus : "example/style/stylus/*.styl"
	}
}

dest = {
	game : {
		js : "game/js",
		concatFolder : "game/",
		concatFile : "SpaceInvaders.js"
	},
	example : {
		js : "example/js/", 
		css : "example/style/css"
	}
}

gulp.task('example-coffee',function(){
	return gulp.src(src.example.coffee)
	.pipe(coffee())
	.pipe(gulp.dest(dest.example.js));
})

gulp.task('example-stylus',function(){
	return gulp.src(src.example.stylus)
	.pipe(stylus())
	.pipe(gulp.dest(dest.example.css));
})

gulp.task('game-coffee',function(){
	return gulp.src(src.game.coffee)
	.pipe(coffee())
	.pipe(gulp.dest(dest.game.js));
})

gulp.task('game-concat',function(){
	return gulp.src([src.game.js,""])
	.pipe(concat(dest.game.concatFile))
	.pipe(gulp.dest(dest.game.concatFolder));
})

gulp.task('watch', function() {
  gulp.watch(src.example.coffee, ['example-coffee']);
  gulp.watch(src.example.stylus, ['example-stylus']);
  gulp.watch(src.game.coffee, ['game-coffee']);
  gulp.watch(src.game.js, ['game-concat']);
});

gulp.task('default', ['watch']);