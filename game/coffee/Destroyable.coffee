class Destroyable extends Soundy
	constructor : (deathTime = 0)->	
		super()
		@deathTimer = deathTime
		@_isDestroyed = false
		@_isDying = false

	setDeathTimer : (deathTime)->	
		@deathTimer = deathTime


	checkPulse : -> # True when alive and not dying (painfully)

		if @isDestroyed()
			return false
			
		if @isDying()	
			@dieSlowly()
			return false

		return true	

	dieSlowly : ->  # And painfully
		@deathTimer--				
		if @deathTimer <= 0
			@_isDestroyed = true

	destroy : ->		
		@_isDying = true
		@dieSlowly()

	update : ->	
		@checkPulse()

	isDestroyed : ->
		@_isDestroyed	

	isDying : -> # Once again, slowly and painfully
		@_isDying

window.Destroyable = Destroyable