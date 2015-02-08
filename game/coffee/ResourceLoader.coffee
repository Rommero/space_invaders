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

		@resources = {}

		@loadResources resourceList, callback
		
	loadResources : (resourceList,callback=->)->
		async.each resourceList, (recourceData,eCallback)=>			
			if recourceData.type is ResourceLoader.RESOURCE_TYPE_IMG
				img = new Image()
				img.onload = =>
					@resources[recourceData.id || recourceData.url] = img
					eCallback null
				img.src = recourceData.url
			if recourceData.type is ResourceLoader.RESOURCE_TYPE_SOUND
				sound = new Audio recourceData.url
				@resources[recourceData.id || recourceData.url] = sound
				eCallback null
		, (err)=>
			callback()
			@emit "ready"

	get : (resId)->
		unless _.has @resources, resId
			throw "ResourceLoader :: Resource not loaded"
		@resources[resId]

window.ResourceLoader = ResourceLoader




		
		

