class Sprite extends Destroyable
	constructor : (@img, @spriteX = 0, @spriteY = 0, @w = 0, @h = 0, @x = 0, @y = 0, @displayWidth, @displayHeight)->
		super()

	setSpritePos : (coords)->
		@spriteX = coords.x if _.has(coords,"x")
		@spriteY = coords.y if _.has(coords,"y")

	render : (ctx)->	
		ctx.drawImage @img, @spriteX, @spriteY, @w, @h, @x, @y, @displayWidth, @displayHeight


		
window.Sprite = Sprite