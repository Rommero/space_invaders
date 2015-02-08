

class SpaceInvadersGame extends EventEmitter2
	CANVAS_HEIGHT = 640
	CANVAS_WIDTH = 640
	INVADER_SPRITE = "sprites/invaders.png"
	CANNON_SPRITE = "sprites/cannon.png"
	BG_COLOR = "#000"
	REDRAW_RATE = 1

	HEADER_HEIGHT = 100
	FOOTER_HEIGHT = 75
	SIDE_OFFSET = 25

	INVADERS_PER_RANK = 11 # Yeah, ranks. Like in real army

	FREE_H_SPACE = 4 # Free space (1 unit = 1 Invader display width) for Invaders to move. 

	H_SPACE_PER_INVADER_MULTIPLIER = 1.4
	W_SPACE_PER_INVADER_MULTIPLIER = 1.8

	CLEAR_SCALE = .3 

	constructor : (@dest)->
		currentDir = getJsFileDir "SpaceInvaders.js"

		@resources = new ResourceLoader [
			{url : currentDir + INVADER_SPRITE, id : INVADER_SPRITE}
			{url : currentDir + CANNON_SPRITE, id : CANNON_SPRITE}
		], =>
			@init()

	init : ->		
		$(@dest).append "<canvas id='SpaceInvadersGame'></canvas>"
		@initGameField()
		@canvas = document.getElementById("SpaceInvadersGame")
		@ctx = @canvas.getContext("2d")

		@controls = new Keyboard()

		@ctx.globalAlpha = 1 

		@startGame()

	initGameField : ->
		@gameField = 
			x : SIDE_OFFSET
			y : HEADER_HEIGHT
			width : CANVAS_WIDTH - SIDE_OFFSET * 2
			height : CANVAS_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT

		@gameFieldBounds =
			x : 
				min : @gameField.x
				max : @gameField.x + @gameField.width
			y : 
				min : @gameField.y
				max : @gameField.y + @gameField.height	

		$("#SpaceInvadersGame").attr "height",CANVAS_HEIGHT
		$("#SpaceInvadersGame").attr "width",CANVAS_WIDTH
		$("#SpaceInvadersGame").css "background-color" , BG_COLOR
		$("#SpaceInvadersGame").css "-webkit-touch-callout" , "none"
		prefixes = ["-webkit-","-khtml-","-moz-","-ms-",""]
		$("#SpaceInvadersGame").css("#{prefix}user-select", "none") for prefix in prefixes


	invade : ->
		@invaderRanks = [
			Invader.INVADER_TYPE_SMALL,
			Invader.INVADER_TYPE_MEDIUM,
			Invader.INVADER_TYPE_MEDIUM,
			Invader.INVADER_TYPE_LARGE,
			Invader.INVADER_TYPE_LARGE
		]			

		@invaderScale = 
			@gameField.width / (INVADERS_PER_RANK + FREE_H_SPACE) / 
			(Invader.SPRITE_WIDTH * H_SPACE_PER_INVADER_MULTIPLIER)

		@hSpacePerInvader = Invader.SPRITE_WIDTH * H_SPACE_PER_INVADER_MULTIPLIER * @invaderScale
		@wSpacePerInvader = Invader.SPRITE_HEIGHT * W_SPACE_PER_INVADER_MULTIPLIER * @invaderScale

		for type,rank in @invaderRanks
			for i in [0..INVADERS_PER_RANK-1]

				@invaders.push new Invader(
					@resources.get(INVADER_SPRITE),
					type, 
					rank,				
					@gameField.x + i * @hSpacePerInvader, 
					@gameField.y + rank * @wSpacePerInvader,
					@gameFieldBounds,
					@invaderScale
				) 

	vivaLaResistance : ->
		@cannon = new Cannon(
			@resources.get(CANNON_SPRITE),
			@gameField.x,
			@gameField.y + @gameField.height - Cannon.SPRITE_HEIGHT * @invaderScale,
			@gameFieldBounds,
			@invaderScale
		)

	startGame : ->
		@invaders = []
		@projectiles = []

		@invade()

		@vivaLaResistance()

		@frame = 0
		@animationFrame = 0
	
		gameStep = =>
			@update()
			@render()
			window.requestAnimationFrame gameStep, @canvas	
		window.requestAnimationFrame gameStep, @canvas
			
	clearGameField : ->
		@ctx.clearRect @gameField.x, @gameField.y, @gameField.width, @gameField.height

	update : ->
		@frame++ 
		
		unless @frame % REDRAW_RATE == 0
			return

		@clearGameField()	
		@animationFrame++ 

		for projectile in @projectiles
			projectile.update()	

		advanceFlags = []
		advanceFlags[rankId] = false for rankType,rankId in @invaderRanks

		for invader in @invaders
			advanceFlags[invader.rank] = advanceFlags[invader.rank] or invader.checkAdvance(invader.rank)	

		for invader in @invaders
			invader.update @animationFrame, advanceFlags


		@handleKeyboardInteraction()

	checkDestroyedObjects : ->
		@projectiles = _.filter @projectiles,(projectile)-> not projectile.isDestroyed()

		@invaders = _.filter @invaders,(invader)-> not invader.isDestroyed()

	handleKeyboardInteraction : ->		
		if @controls.isDown(Keyboard.KEY_CODE_LEFT)
			@cannon.update @animationFrame, Cannon.DIRECTION_LEFT
		else if @controls.isDown(Keyboard.KEY_CODE_RIGHT)
			@cannon.update @animationFrame, Cannon.DIRECTION_RIGHT
		else 
			@cannon.update @animationFrame
		if @controls.isDown(Keyboard.KEY_CODE_SPACE)			
			@projectiles.push @cannon.fire @animationFrame if @cannon.isReloaded()
	
	render : ->
		for projectile in @projectiles			
			projectile.render @ctx 

		for invader in @invaders
			invader.render @ctx

		@cannon.render @ctx, @animationFrame

	getJsFileDir = (filename)->
		reg = ".*#{filename}.*"
		$("script[src]").filter(->this.src.match new RegExp(reg)).last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/'
		
window.SpaceInvadersGame = SpaceInvadersGame

