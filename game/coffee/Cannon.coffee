class Cannon extends Sprite
	@SPRITE_WIDTH = 49
	@SPRITE_HEIGHT = 30

	@DIRECTION_LEFT = 1
	@DIRECTION_RIGHT = 0

	CANNON_DEPLOYMENT_DELAY = 60 # Animation frames before the cannon appears
	SPEED_MULTIPLIER = 4

	DEATH_ANIMATION_DURATION = 60
	DEATH_ANIMATION_FRAME_DURATION = DEATH_ANIMATION_DURATION / 10
	DEATH_ANIMATION_OFFSET = 30

	CANNON_CHARGE_STRENGTH = 10

	CANNON_RECHARGE_TIME = 35 # Frames to recharge cannon. One cannot simply pew-pew like a machine gun

	constructor : (@img, @x, @y, @bounds, @scale)->
		@displayWidth = Cannon.SPRITE_WIDTH * @scale
		@displayHeight = Cannon.SPRITE_HEIGHT * @scale

		@init = false

		@cannonRechargeStep = 0

		@loadCannon()

		super(@img, 
			0,
			0,
			Cannon.SPRITE_WIDTH, 
			Cannon.SPRITE_HEIGHT,
			@x,
			@y,
			@displayWidth,
			@displayHeight
		)		

		@deathAnimationFrame = 1
		@deathAnimationFrameStep = 0
		@setDeathTimer DEATH_ANIMATION_DURATION

	fire : (animationFrame)->
		unless @isReloaded()
			return
		barrelCoords = @getCannonBarrelCoords()	
		projectile = new CannonProjectile(
			barrelCoords.x, 
			barrelCoords.y, 
			@,
			{ x : 0, y : -CANNON_CHARGE_STRENGTH}, 
			@bounds,
			@scale
		)
		
		projectile.setSound("fire",@getSoundCopy("fire"))
		@loadCannon()				
		return projectile

	getCannonBarrelCoords : ->
		coords = 	
			x : @x + @displayWidth/ 2
			y : @y		

	isReloaded : ->
		@_isReloaded		

	loadCannon : ->
		@cannonRechargeStep = CANNON_RECHARGE_TIME
		@_isReloaded = false

	checkReload : ->
		if @isReloaded()
			return

		@cannonRechargeStep--
		if @cannonRechargeStep <= 0 
			@_isReloaded = true


	update : (animationFrame, direction)->
		super()
		unless @init
			return

		if @isDestroyed()			
			return

		if @isDying()
			@playSound "death"
			if @deathAnimationFrameStep-- == 0
				@deathAnimationFrameStep = DEATH_ANIMATION_FRAME_DURATION
				@deathAnimationFrame = 1 - @deathAnimationFrame						
				@setSpritePos 
					y : Cannon.SPRITE_HEIGHT * ( @deathAnimationFrame + 1 )				
				return

		@checkReload()


		if _.isUndefined(direction)
			return 

		@x += Math.pow(-1, direction) * SPEED_MULTIPLIER

		@x = @bounds.x.min if @x < @bounds.x.min
		@x = @bounds.x.max - @displayWidth if @x + @displayWidth > @bounds.x.max

	render : (ctx,animationFrame)->
		unless animationFrame > CANNON_DEPLOYMENT_DELAY
			return 
		@init = true		
		super


window.Cannon = Cannon	