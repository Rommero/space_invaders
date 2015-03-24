class Soundy
	constructor : ->
		@sounds = {}

	setSound : (name, sound)->
		@sounds[name] = sound

	setSounds : (soundsData)->
		_.each soundsData, (soundData)=>
			@setSound soundData.name, soundData.sound	

	getSoundCopy : (name)->
		@sounds[name].cloneNode()		

	playSound : (name)->
		@sounds[name].play()

	stopSound : (name)->
		@sounds[name].pause()			


window.Soundy = Soundy		