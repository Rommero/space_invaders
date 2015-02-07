$(document).ready ->
	$("body").on "mouseenter",".tv-interaction-btn-default", ->
		$(this).toggleClass("tv-interaction-btn-default")
		$(this).toggleClass("tv-interaction-btn-follow")

	$("body").on "mouseleave",".tv-interaction-btn-follow", ->		
		$(this).toggleClass("tv-interaction-btn-default")
		$(this).toggleClass("tv-interaction-btn-follow")	

	$("body").on "click",".tv-interaction-btn-follow", ->	
		$(this).toggleClass("tv-interaction-btn-follow")
		$(this).toggleClass("tv-interaction-btn-unfollow")

	$("body").on "click",".tv-interaction-btn-unfollow", ->	
		$(this).toggleClass("tv-interaction-btn-follow")
		$(this).toggleClass("tv-interaction-btn-unfollow")	

	$("body").on "mouseenter",".tv-interaction-btn-following", ->
		$(this).toggleClass("tv-interaction-btn-following")
		$(this).toggleClass("tv-interaction-btn-unfollow")

	$("body").on "mouseleave",".tv-interaction-btn-unfollow", ->		
		$(this).toggleClass("tv-interaction-btn-following")
		$(this).toggleClass("tv-interaction-btn-unfollow")				

	tpl = $("#tv-usercard-template").html()

	names = ["John","Kevin","James","Andrew"]
	lastNames = ["Adams","Malcolm","Madison","Jackson"]

	console.log tpl

	for i in [1..10]
		$(".tv-table tbody").append _.template tpl, 
			ava : parseInt(Math.ceil(Math.rand()*5)
			username : [names[Math.floor Math.rand()*names.length],lastNames[Math.floor Math.rand()*lastNames.length]].join(" ")
			rating : parseInt Math.rand()*1000
			ideas : parseInt Math.rand()*1000
			following : parseInt Math.rand()*1000
			followers : parseInt Math.rand()*1000