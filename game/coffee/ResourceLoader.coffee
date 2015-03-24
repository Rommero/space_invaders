class ResourceLoader extends EventEmitter2

	@RESOURCE_TYPE_IMG = "img"

	@RESOURCE_TYPE_SOUND = "sound"

	constructor : (resourceList,callback)->
		if _.isArray(resourceList)
			check = true 
			for recourceData in resourceList
				check *= (_.isObject(recourceData) and _.has(recourceData,'url') and _.has(recourceData,'type')) 
			unless check
				throw "ResourceLoader :: ResourceLoader accepts only valid recource objects"

		@images = {}
		@sounds = {}

		@loadResources resourceList, callback
		
	loadResources : (resourceList,callback=->)->
		async.each resourceList, (recourceData,eCallback)=>			
			if recourceData.type is ResourceLoader.RESOURCE_TYPE_IMG
				img = new Image()
				img.onload = =>
					@images[recourceData.id || recourceData.url] = img
					eCallback null
				img.src = recourceData.url
			if recourceData.type is ResourceLoader.RESOURCE_TYPE_SOUND
				sound = new Audio recourceData.url
				@sounds[recourceData.id || recourceData.url] = sound
				eCallback null
		, (err)=>
			callback()
			@emit "ready"

	getImage : (resId)->
		unless _.has @images, resId
			throw "ResourceLoader :: Resource not loaded"
		@images[resId]

	getSound : (resId)->
		unless _.has @sounds, resId
			throw "ResourceLoader :: Resource not loaded"
		@sounds[resId].cloneNode()	

window.ResourceLoader = ResourceLoader




		
		

