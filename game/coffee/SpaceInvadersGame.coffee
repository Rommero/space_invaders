

class SpaceInvadersGame extends EventEmitter2
	CANVAS_HEIGHT = 640
	CANVAS_WIDTH = 640
	INVADER_SPRITE = "sprites/invaders.png"
	CANNON_SPRITE = "sprites/cannon.png"
	BG_COLOR = "#000"
	GAME_OVER_COLOR = "#FF0000"
	REDRAW_RATE = 1

	HEADER_HEIGHT = 100
	FOOTER_HEIGHT = 75
	SIDE_OFFSET = 25

	FONT = "SpaceInvaders"
	FONT_SIZE = "16px"
	FONT_COLOR = "#ffffff"

	# TODO SoundEmitter class to handle sounds
	SOUNDS = {
		bgSounds : ["sounds/bg1.mp3", "sounds/bg2.mp3", "sounds/bg3.mp3", "sounds/bg4.mp3"]
		projectile : "sounds/projectile.mp3"
		invaderDeath : "sounds/invader_death.mp3"
		cannonDeath : "sounds/cannon_death.mp3"
	}

	BGSOUND_FRAME_DELAY = 60	
	BGSOUND_SPEED_MULTIPLIER = 400

	INVADERS_PER_RANK = 11 # Yeah, ranks. Like in real army

	FREE_H_SPACE = 4 # Free space (1 unit = 1 Invader display width) for Invaders to move. 

	H_SPACE_PER_INVADER_MULTIPLIER = 1.4
	W_SPACE_PER_INVADER_MULTIPLIER = 2

	CLEAR_SCALE = .3 

	constructor : (@dest)->
		currentDir = getJsFileDir "SpaceInvaders.js"

		@resources = new ResourceLoader [
			{url : currentDir + INVADER_SPRITE, id : INVADER_SPRITE, type : ResourceLoader.RESOURCE_TYPE_IMG}
			{url : currentDir + CANNON_SPRITE, id : CANNON_SPRITE, type : ResourceLoader.RESOURCE_TYPE_IMG}
			{url : currentDir + SOUNDS.bgSounds[0], id : SOUNDS.bgSounds[0], type : ResourceLoader.RESOURCE_TYPE_SOUND}
			{url : currentDir + SOUNDS.bgSounds[1], id : SOUNDS.bgSounds[1], type : ResourceLoader.RESOURCE_TYPE_SOUND}
			{url : currentDir + SOUNDS.bgSounds[2], id : SOUNDS.bgSounds[2], type : ResourceLoader.RESOURCE_TYPE_SOUND}
			{url : currentDir + SOUNDS.bgSounds[3], id : SOUNDS.bgSounds[3], type : ResourceLoader.RESOURCE_TYPE_SOUND}
			{url : currentDir + SOUNDS.projectile, id : SOUNDS.projectile, type : ResourceLoader.RESOURCE_TYPE_SOUND}
			{url : currentDir + SOUNDS.invaderDeath, id : SOUNDS.invaderDeath, type : ResourceLoader.RESOURCE_TYPE_SOUND}
			{url : currentDir + SOUNDS.cannonDeath, id : SOUNDS.cannonDeath, type : ResourceLoader.RESOURCE_TYPE_SOUND}
		], =>			
			@init()

	init : ->		
		$(@dest).append "<canvas id='SpaceInvadersGame'></canvas>"
		@initGameField()
		@canvas = document.getElementById("SpaceInvadersGame")
		@ctx = @canvas.getContext("2d")

		@controls = new Keyboard()

		@ctx.globalAlpha = 1 

		@gameOver = false

		@currentSoundId = 0

		@interface = new SpaceInvadersInterface(FONT,FONT_SIZE,FONT_COLOR)

		

		@startGame()

	initGameField : ->

		#TODO Dynamic game field based on screen width
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

				invader = new Invader(
					@resources.getImage(INVADER_SPRITE),
					type, 
					rank,				
					@gameField.x + i * @hSpacePerInvader, 
					@gameField.y + rank * @wSpacePerInvader,
					@gameFieldBounds,
					@invaderScale
				) 

				invader.setSound "death", @resources.getSound SOUNDS.invaderDeath

				@invaders.push invader

	vivaLaResistance : ->
		@cannon = new Cannon(
			@resources.getImage(CANNON_SPRITE),
			@gameField.x,
			@gameField.y + @gameField.height - Cannon.SPRITE_HEIGHT * @invaderScale,
			@gameFieldBounds,
			@invaderScale
		)

		@cannon.setSounds [ 
			{ name : "fire", sound : @resources.getSound SOUNDS.projectile }
			{ name : "death", sound : @resources.getSound SOUNDS.cannonDeath }
		]

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
	
	playMusic : (frame)->
		@musicFrameCounter = @musicFrameCounter || 0
		@musicFrameCounter++

		@musicFrameDelay = BGSOUND_FRAME_DELAY - Math.floor(frame/BGSOUND_SPEED_MULTIPLIER)
		if @musicFrameCounter >= @musicFrameDelay
			@resources.getSound(SOUNDS.bgSounds[@currentSoundId]).play()	
			@currentSoundId = if @currentSoundId >= 3 then 0 else @currentSoundId + 1
			@musicFrameCounter = 0	

	clearGameField : ->
		@ctx.clearRect 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
		# @ctx.clearRect @gameField.x, @gameField.y, @gameField.width, @gameField.height

	update : ->
		# TODO - make it prettier		

		@frame++ 
		
		@playMusic(@frame)

		unless @frame % REDRAW_RATE == 0
			return

		if @gameOver
			return

		
		@animationFrame++ 

		for projectile in @projectiles
			projectile.update()		


		#TODO create class 'MasterMind' to handle invaders croud behavior
		# Very very bad code here. Very bad code.
		# currentMaximumInvaderRank = 0
		# for invader in @invaders
		# 	currentMaximumInvaderRank = Math.max currentMaximumInvaderRank, invader.rank

		# advanceFlags = []
		# for rankId in @invaderRanks
		# 	advanceFlags[rankId] = rankId > currentMaximumInvaderRank 

		# for invader in @invaders
		# 	advanceFlags[invader.rank] = advanceFlags[invader.rank] or invader.checkAdvance(invader.rank)	

		# for flag1,idx1 in advanceFlags.slice(-1)
		# 	console.log flag1,idx1
		# 	for flag2, idx2 in advanceFlags[idx1..].slice(-1)
		# 		advanceFlags[idx1] = false if advanceFlags[idx2] == false

		advanceFlag = false
		for invader in @invaders
			advanceFlag = advanceFlag or invader.checkAdvance()

		for invader in @invaders
			invaderMoveOutcome = invader.update @animationFrame, advanceFlag
			if invaderMoveOutcome instanceof Projectile
				@projectiles.push invaderMoveOutcome

		# Bad code ends here

		@checkCollisions()	

		@handleKeyboardInteraction()

		@checkDestroyedObjects()

		@checkGameOver()

	checkGameOver : ->
		unless @cannon
			@gameOver = true
			return true
		for invader in @invaders
			if invader.y + invader.displayHeight > @cannon.y
				@gameOver = true

	checkCollisions : ->
		for projectile in @projectiles
			for invader in @invaders
				if checkProjectileCollision(projectile,invader)
					invader.destroy() 
					projectile.destroy()
			unless @cannon
				continue		
			if checkProjectileCollision projectile, @cannon
				projectile.destroy()
				@cannon.destroy()

	checkProjectileCollision = (projectile,target)->
		collision = checkCollision(projectile,target)
		unless collision
			return false

		return getObjectClass(projectile.owner) != getObjectClass(target)

	#Horrible Piece of bullshit for IE. The game will NOT support IE in further versions
	getObjectClass = (obj)->
        if obj and obj.constructor and obj.constructor.toString()
            if obj.constructor.name 
                return obj.constructor.name
            
            str = obj.constructor.toString()
           
            if str.charAt(0) == '['
            	arr = str.match(/\[\w+\s*(\w+)\]/)
            else
            	arr = str.match(/function\s*(\w+)/)
            
            if arr and arr.length == 2
               return arr[1]                                 
     	
     	
   


	# TODO: create class 'Collidable' to handle collisions easier
	checkCollision = (a,b)->
		horizontalCheck = (a.x + a.displayWidth < b.x) or (b.x + b.displayWidth < a.x)
		verticalCheck = (a.y + a.displayHeight < b.y) or (b.y + b.displayHeight < a.y)

		not (horizontalCheck or verticalCheck)

	checkDestroyedObjects : ->
		@projectiles = _.filter @projectiles,(projectile)-> not projectile.isDestroyed()

		@invaders = _.filter @invaders,(invader)-> not invader.isDestroyed()

		unless @cannon
			return
		if @cannon.isDestroyed() 
			@cannon = null 
			@gameOver = true

	handleKeyboardInteraction : ->
		unless @cannon
			return		
		if @controls.isDown(Keyboard.KEY_CODE_LEFT)
			@cannon.update @animationFrame, Cannon.DIRECTION_LEFT
		else if @controls.isDown(Keyboard.KEY_CODE_RIGHT)
			@cannon.update @animationFrame, Cannon.DIRECTION_RIGHT
		else 
			@cannon.update @animationFrame
		if @controls.isDown(Keyboard.KEY_CODE_SPACE)			
			@projectiles.push @cannon.fire @animationFrame if @cannon.isReloaded()
	
	render : ->
		@clearGameField()	

		@interface.render @ctx

		if @gameOver
			@ctx.fillStyle = GAME_OVER_COLOR
			@ctx.fillRect Math.floor(Math.random()*CANVAS_WIDTH),
				Math.floor(Math.random()*CANVAS_HEIGHT),5,5

		for projectile in @projectiles			
			projectile.render @ctx 

		for invader in @invaders
			invader.render @ctx

		if @cannon
			@cannon.render @ctx, @animationFrame

	getJsFileDir = (filename)->
		reg = ".*#{filename}.*"
		$("script[src]").filter(->this.src.match new RegExp(reg)).last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/'
		
window.SpaceInvadersGame = SpaceInvadersGame

