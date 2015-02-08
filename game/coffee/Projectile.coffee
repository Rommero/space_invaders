class Projectile extends Destroyable

	@WIDTH = 3
	@HEIGHT = 15

	@COLOR = "#ffffff"

	constructor : (@x, @y, @owner, @velocity, @bounds, @scale)->
		# TODO: create class 'Displayble' to handle the scale easier without copy\paste   
		@displayWidth = Projectile.WIDTH * @scale
		@displayHeight = Projectile.HEIGHT * @scale

		super()

	update : (animationFrame)->
		super

		if @isDestroyed()
			return 

		@y += @velocity.y

		if @checkProjectileOutOfBounds()
			@destroy()

	checkProjectileOutOfBounds : ->
		checkY = (@y < @bounds.y.min) or (@y + @displayHeight > @bounds.y.max) 
		checkX = (@x < @bounds.x.min) or (@x + @displayWidth > @bounds.x.max)
		checkX or checkY

	render : (ctx)->
		if @isDestroyed()
			return 
		# bckupFillStyle = ctx.fillStyle
		ctx.fillStyle = Projectile.COLOR
		ctx.fillRect @x - @displayWidth/2, @y, @displayWidth, @displayHeight	
		# ctx.fillStyle = bckupFillStyle

window.Projectile = Projectile