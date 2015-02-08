class ResourceLoader extends EventEmitter2
	constructor : (imageList,callback)->
		if _.isString imageList
			imageList = [{url : imageList, id : imageList}]
		if _.isArray(imageList)
			check = true 
			check *= (_.isObject(imageData) and _.has(imageData,'url')) for imageData in imageList
			unless check
				throw "ResourceLoader :: ResourceLoader accepts only String or String[]"

		@images = {}

		@loadImages imageList, callback
		
	loadImages : (imageList,callback=->)->
		async.each imageList, (imageData,eCallback)=>
			img = new Image()

			img.onload = =>
				@images[imageData.id || imageData.url] = img

				eCallback null
			img.src = imageData.url
		, (err)=>
			callback()
			@emit "ready"

	get : (imageId)->
		unless _.has @images, imageId
			throw "ResourceLoader :: Image not loaded"
		@images[imageId]

window.ResourceLoader = ResourceLoader




		
		

