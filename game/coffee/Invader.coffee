class Invader extends Sprite
	@SPRITE_WIDTH = 50
	@SPRITE_HEIGHT = 35	

	@INVADER_TYPE_LARGE = 2
	@INVADER_TYPE_MEDIUM = 1
	@INVADER_TYPE_SMALL = 0

	DEFAULT_ANIMATION_STEP = 0
	ANIMATION_STEP_DURATION = 1 # Updates every ANIMATION_STEP_DURATION'th frame
	DEATH_ANIMATION_DURATION = 10 # Frames for death animation duration

	

	# In frames. Lesser the time, faster the Invader, therefore harder the game
	# When set to 1 invaders go Zoidberg-style (\/)(;,.;)(\/) - (|)(;,.;)(|) - (\/)(;,.;)(\/)
	DEFAULT_INVADER_REST_TIME = 60/2

	DEFAULT_H_VELOCITY = Invader.SPRITE_WIDTH / 15
	DEFAULT_W_VELOCITY = 0
	W_VELOCITY_MULTIPLIER = .7
	VELOCITY_INERTIA_MULTIPLIER = .5
	# Velocity {x : float,y : float}, pixels per animation frame 

	INVADER_DELAY_MULTIPLIER  = 1
	INVADER_DELAY_MAGIC = 5

	INVADER_CANNON_CHARGE_STRENGTH = 2
	#TODO make fire chande independent of invader rest time
	INVADER_FIRE_CHANCE = .03

	INVADER_SPRITE_EXPLOSION_OFFSET = 
		x : 0
		y : 3 * 35

	constructor : (@img, @type, @rank, @x, @y, @bounds, @scale)->		
		@animationStep = 0 # 2 Animation Steps

		types = [Invader.INVADER_TYPE_SMALL,Invader.INVADER_TYPE_MEDIUM,Invader.INVADER_TYPE_LARGE]

		unless types.indexOf(@type) >= 0
			# console.log types
			@type = Invader.INVADER_TYPE_SMALL	

		@restTimeLeft = DEFAULT_INVADER_REST_TIME
		@restTime = DEFAULT_INVADER_REST_TIME

		@velocity = { x : DEFAULT_H_VELOCITY, y : 0 } 

		@displayWidth = Invader.SPRITE_WIDTH * @scale
		@displayHeight = Invader.SPRITE_HEIGHT * @scale

		super( 
			@img, 
			@animationStep * Invader.SPRITE_WIDTH,
			@type * Invader.SPRITE_HEIGHT,
			Invader.SPRITE_WIDTH, 
			Invader.SPRITE_HEIGHT,
			@x,
			@y,
			@displayWidth,
			@displayHeight
		)

		@setDeathTimer DEATH_ANIMATION_DURATION

	setDeathSound : (@deathSound)->		

	update : (animationFrame,advanceFlag)->		
		super()

		if @isDestroyed()			
			return

		if @isDying()
			@deathSound.play()
			@setSpritePos INVADER_SPRITE_EXPLOSION_OFFSET
			return 
		# Bug when using delay when velocity is high. Need to handle croud behaviour more precisely
		invaderRankDelay = (INVADER_DELAY_MAGIC - @rank) * INVADER_DELAY_MULTIPLIER			
		if animationFrame <= invaderRankDelay
			return 	
		unless @restTimeLeft-- is 0
			@idle = true
			return 
		@idle = false
		@restTimeLeft = @restTime	

		@updateVelocity advanceFlag
		@x += @velocity.x
		@y += @velocity.y

		if @isReloaded()
			evilExtraterrestrialProjectile = @fire()

		unless animationFrame % ANIMATION_STEP_DURATION == 0
			return evilExtraterrestrialProjectile || null
		@animationStep = 1 - @animationStep
		@spriteX = @animationStep * Invader.SPRITE_WIDTH
		return evilExtraterrestrialProjectile || null

	isReloaded : ->
		Math.random() < INVADER_FIRE_CHANCE

	fire : ->
		barrelCoords = @getCannonBarrelCoords()	

		return new Projectile(
			barrelCoords.x, 
		 	barrelCoords.y, 
			@,
			{ x : 0, y : INVADER_CANNON_CHARGE_STRENGTH}, 
			@bounds,
			@scale
		)	

	# Why not poly Invader of Cannon then?
	# TODO: Create class 'Shoota' able to fire. Inherit Invader and Cannon from Shoota 
	getCannonBarrelCoords : ->
		coords = 	
			x : @x + @displayWidth/ 2
			y : @y	



	# Invaders are qiute fearful creatures. 
	# They advance only if one of them decides to and wait for the last one in rank to make such a decision
	checkAdvance : (rank)->
		return (@x + @displayWidth*sign(@velocity.x) + @velocity.x >= @bounds.x.max) or 
			(@x + @displayWidth*sign(@velocity.x) + @velocity.x <= @bounds.x.min)

	updateVelocity : (advanceFlag)->
		@velocity.y = 0
		# if advanceFlags[@rank] 
		if advanceFlag
			@velocity.x = - @velocity.x
			@velocity.y = W_VELOCITY_MULTIPLIER * @displayHeight		

	sign = (num)->
		if num >= 0
			return 1
		return -1
window.Invader = Invader