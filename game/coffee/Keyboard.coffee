
class Keyboard
	@KEY_CODE_LEFT = 37
	@KEY_CODE_RIGHT = 39
	@KEY_CODE_SPACE = 32

	constructor : ->
		@keysDown = {}
		@keysPressed = {}

		document.addEventListener "keydown", (event)=>		
			@keysDown[event.keyCode] = true 			
		document.addEventListener "keyup", (event)=>						
			delete @keysDown[event.keyCode]

	isDown : (keyCode)->	
		return _.has(@keysDown,keyCode)

window.Keyboard = Keyboard