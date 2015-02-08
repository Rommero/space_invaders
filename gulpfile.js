gulp = require("gulp");
watch = require("gulp-watch");
coffee = require("gulp-coffee");
stylus = require("gulp-stylus");
concat = require("gulp-concat");
uglify = require("gulp-uglify");
sourcemaps = require("gulp-sourcemaps");
copy = require("gulp-copy");


src = {
	copy : {
		gameFiles : [
			"game/SpaceInvaders.js",
			"game/sprites/invaders.png",
			"game/sprites/cannon.png",
			"game/sounds/cannon.png",
			"game/sounds/bg1.mp3",
			"game/sounds/bg2.mp3",
			"game/sounds/bg3.mp3",
			"game/sounds/bg4.mp3",
			"game/sounds/projectile.mp3",
			"game/sounds/invader_death.mp3",
			"game/sounds/cannon_death.mp3",
		]		
	},
	game : {
		coffee : [
			"game/coffee/Destroyable.coffee",
			"game/coffee/Projectile.coffee",
			"game/coffee/Sprite.coffee",
			"game/coffee/Cannon.coffee",
			"game/coffee/Invader.coffee",
			"game/coffee/Keyboard.coffee",
			"game/coffee/ResourceLoader.coffee",
			"game/coffee/SpaceInvadersGame.coffee",
		],
		js : "game/js/*.js",
		compiled : "game/SpaceInvaders.js"
	},
	example : {
		coffee  : "example/js/coffee/*.coffee",
		stylus : "example/style/stylus/*.styl"
	}
}

dest = {
	gameCopy : "example/js/SpaceInvaders/",
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
	.pipe(sourcemaps.init())
	.pipe(coffee())
	.pipe(concat(dest.game.concatFile))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(dest.game.concatFolder));
})

// gulp.task('game-compress',function(){
// 	return gulp.src([src.game.libs, src.game.js])
// 	.pipe(sourcemaps.init())
// 	.pipe(concat(dest.game.concatFile))
// 	//.pipe(uglify())
// 	.pipe(sourcemaps.write())
// 	.pipe(gulp.dest(dest.game.concatFolder));
// })

gulp.task('example-copy-watch',  ["game-coffee"], function(){
	return gulp.src(src.copy.gameFiles)
	.pipe(copy(dest.gameCopy))
})

gulp.task('example-copy', ["game-coffee"], function(){
	return gulp.src(src.copy.gameFiles)
	.pipe(copy(dest.gameCopy))
})

gulp.task('make',['example-coffee','example-stylus','game-coffee','example-copy']);



gulp.task('watch', ['make'],function() {
  gulp.watch(src.example.coffee, ['example-coffee']);
  gulp.watch(src.example.stylus, ['example-stylus']);
  gulp.watch(src.game.coffee, ['game-coffee']);
  gulp.watch(src.game.compiled, ['example-copy-watch']);
});

gulp.task('default', ['watch']);