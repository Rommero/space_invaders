class SpaceInvadersInterface
	constructor : (@font, @fontSize, @color)->
		@score = 0

		@textFields = [
			new TextField("SCORE<1> HI-SCORE SCORE<2>", @font, @fontSize, @color, 0, 100)
		]

	update : (newScore)->
		@score = newScore	

	render : (ctx)->
		for textField in @textFields
			textField.render(ctx)

window.SpaceInvadersInterface = SpaceInvadersInterface	
	