
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
			# delete @keysPressed[event.keyCode]

	isDown : (keyCode)->
		console.log @keysDown
		return _.has(@keysDown,keyCode)

	isPressed : (keyCode)->
		console.log @keysDown, @keysPressed
		if @isDown keyCode
			@keysPressed[keyCode] = true
			return true

		if _.has @keysPressed, keyCode
			return false
		return false

window.Keyboard = Keyboard