class Projectile extends Destroyable

	@WIDTH = 3
	@HEIGHT = 15

	@COLOR = "#ffffff"

	constructor : (@x, @y, @owner, @velocity, @bounds, @scale)->
		@displayWidth = Projectile.WIDTH * @scale
		@displayHeight = Projectile.HEIGHT * @scale

		super()

	update : (animationFrame)->
		super()

		if @isDestroyed()
			return 

		@y += @velocity.y

		if @y < @bounds.y.min
			@destroy()

	render : (ctx)->
		if @isDestroyed()
			return 
		# bckupFillStyle = ctx.fillStyle
		ctx.fillStyle = Projectile.COLOR
		ctx.fillRect @x - @displayWidth/2, @y, @displayWidth, @displayHeight	
		# ctx.fillStyle = bckupFillStyle

class Cannon extends Sprite
	@SPRITE_WIDTH = 49
	@SPRITE_HEIGHT = 30

	@DIRECTION_LEFT = 1
	@DIRECTION_RIGHT = 0

	CANNON_DEPLOYMENT_DELAY = 60 # Animation frames before the cannon appears
	SPEED_MULTIPLIER = 4

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

	fire : (animationFrame)->
		unless @isReloaded()
			return
		barrelCoords = @getCannonBarrelCoords()	
		projectile = new Projectile(
			barrelCoords.x, 
			barrelCoords.y, 
			@,
			{ x : 0, y : -CANNON_CHARGE_STRENGTH}, 
			@bounds,
			@scale
		)
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
		unless @init
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
		super ctx


window.Cannon = Cannon	