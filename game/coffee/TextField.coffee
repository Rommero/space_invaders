class TextField
	constructor : (@text, @font, @fontSize, @color, @posX, @posY)->

	render : (ctx)->
		bckpFontData = backupFontData(ctx)

		ctx.font = "#{@fontSize} #{@font}"
		ctx.fillStyle = @color

		ctx.fillText @text, @posX, @posY

		restoreFontData(ctx, bckpFontData)

	backupFontData = (ctx)->
		data = 
			font : ctx.font
			fillStyle : ctx.fillStyle	

	restoreFontData = (ctx, backupData)->
		_.merge(ctx, backupData)

window.TextField = TextField