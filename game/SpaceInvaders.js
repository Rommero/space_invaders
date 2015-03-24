(function() {
  var Soundy;

  Soundy = (function() {
    function Soundy() {
      this.sounds = {};
    }

    Soundy.prototype.setSound = function(name, sound) {
      return this.sounds[name] = sound;
    };

    Soundy.prototype.setSounds = function(soundsData) {
      return _.each(soundsData, (function(_this) {
        return function(soundData) {
          return _this.setSound(soundData.name, soundData.sound);
        };
      })(this));
    };

    Soundy.prototype.getSoundCopy = function(name) {
      return this.sounds[name].cloneNode();
    };

    Soundy.prototype.playSound = function(name) {
      return this.sounds[name].play();
    };

    Soundy.prototype.stopSound = function(name) {
      return this.sounds[name].pause();
    };

    return Soundy;

  })();

  window.Soundy = Soundy;

}).call(this);

(function() {
  var Destroyable,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Destroyable = (function(_super) {
    __extends(Destroyable, _super);

    function Destroyable(deathTime) {
      if (deathTime == null) {
        deathTime = 0;
      }
      Destroyable.__super__.constructor.call(this);
      this.deathTimer = deathTime;
      this._isDestroyed = false;
      this._isDying = false;
    }

    Destroyable.prototype.setDeathTimer = function(deathTime) {
      return this.deathTimer = deathTime;
    };

    Destroyable.prototype.checkPulse = function() {
      if (this.isDestroyed()) {
        return false;
      }
      if (this.isDying()) {
        this.dieSlowly();
        return false;
      }
      return true;
    };

    Destroyable.prototype.dieSlowly = function() {
      this.deathTimer--;
      if (this.deathTimer <= 0) {
        return this._isDestroyed = true;
      }
    };

    Destroyable.prototype.destroy = function() {
      this._isDying = true;
      return this.dieSlowly();
    };

    Destroyable.prototype.update = function() {
      return this.checkPulse();
    };

    Destroyable.prototype.isDestroyed = function() {
      return this._isDestroyed;
    };

    Destroyable.prototype.isDying = function() {
      return this._isDying;
    };

    return Destroyable;

  })(Soundy);

  window.Destroyable = Destroyable;

}).call(this);

(function() {
  var CannonProjectile, Projectile,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Projectile = (function(_super) {
    __extends(Projectile, _super);

    Projectile.WIDTH = 3;

    Projectile.HEIGHT = 15;

    Projectile.COLOR = "#ffffff";

    function Projectile(_at_x, _at_y, _at_owner, _at_velocity, _at_bounds, _at_scale) {
      this.x = _at_x;
      this.y = _at_y;
      this.owner = _at_owner;
      this.velocity = _at_velocity;
      this.bounds = _at_bounds;
      this.scale = _at_scale;
      this.displayWidth = Projectile.WIDTH * this.scale;
      this.displayHeight = Projectile.HEIGHT * this.scale;
      Projectile.__super__.constructor.call(this);
    }

    Projectile.prototype.update = function(animationFrame) {
      Projectile.__super__.update.apply(this, arguments);
      if (this.isDestroyed()) {
        return;
      }
      this.y += this.velocity.y;
      if (this.checkProjectileOutOfBounds()) {
        return this.destroy();
      }
    };

    Projectile.prototype.checkProjectileOutOfBounds = function() {
      var checkX, checkY;
      checkY = (this.y < this.bounds.y.min) || (this.y + this.displayHeight > this.bounds.y.max);
      checkX = (this.x < this.bounds.x.min) || (this.x + this.displayWidth > this.bounds.x.max);
      return checkX || checkY;
    };

    Projectile.prototype.render = function(ctx) {
      if (this.isDestroyed()) {
        return;
      }
      ctx.fillStyle = Projectile.COLOR;
      return ctx.fillRect(this.x - this.displayWidth / 2, this.y, this.displayWidth, this.displayHeight);
    };

    return Projectile;

  })(Destroyable);

  CannonProjectile = (function(_super) {
    __extends(CannonProjectile, _super);

    function CannonProjectile() {
      return CannonProjectile.__super__.constructor.apply(this, arguments);
    }

    CannonProjectile.prototype.update = function() {
      CannonProjectile.__super__.update.apply(this, arguments);
      return this.playSound("fire");
    };

    CannonProjectile.prototype.destroy = function() {
      CannonProjectile.__super__.destroy.apply(this, arguments);
      return this.stopSound("fire");
    };

    return CannonProjectile;

  })(Projectile);

  window.Projectile = Projectile;

  window.CannonProjectile = CannonProjectile;

}).call(this);

(function() {
  var Sprite,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Sprite = (function(_super) {
    __extends(Sprite, _super);

    function Sprite(_at_img, _at_spriteX, _at_spriteY, _at_w, _at_h, _at_x, _at_y, _at_displayWidth, _at_displayHeight) {
      this.img = _at_img;
      this.spriteX = _at_spriteX != null ? _at_spriteX : 0;
      this.spriteY = _at_spriteY != null ? _at_spriteY : 0;
      this.w = _at_w != null ? _at_w : 0;
      this.h = _at_h != null ? _at_h : 0;
      this.x = _at_x != null ? _at_x : 0;
      this.y = _at_y != null ? _at_y : 0;
      this.displayWidth = _at_displayWidth;
      this.displayHeight = _at_displayHeight;
      Sprite.__super__.constructor.call(this);
    }

    Sprite.prototype.setSpritePos = function(coords) {
      if (_.has(coords, "x")) {
        this.spriteX = coords.x;
      }
      if (_.has(coords, "y")) {
        return this.spriteY = coords.y;
      }
    };

    Sprite.prototype.render = function(ctx) {
      return ctx.drawImage(this.img, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.displayWidth, this.displayHeight);
    };

    return Sprite;

  })(Destroyable);

  window.Sprite = Sprite;

}).call(this);

(function() {
  var Cannon,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Cannon = (function(_super) {
    var CANNON_CHARGE_STRENGTH, CANNON_DEPLOYMENT_DELAY, CANNON_RECHARGE_TIME, DEATH_ANIMATION_DURATION, DEATH_ANIMATION_FRAME_DURATION, DEATH_ANIMATION_OFFSET, SPEED_MULTIPLIER;

    __extends(Cannon, _super);

    Cannon.SPRITE_WIDTH = 49;

    Cannon.SPRITE_HEIGHT = 30;

    Cannon.DIRECTION_LEFT = 1;

    Cannon.DIRECTION_RIGHT = 0;

    CANNON_DEPLOYMENT_DELAY = 60;

    SPEED_MULTIPLIER = 3;

    DEATH_ANIMATION_DURATION = 60;

    DEATH_ANIMATION_FRAME_DURATION = DEATH_ANIMATION_DURATION / 10;

    DEATH_ANIMATION_OFFSET = 30;

    CANNON_CHARGE_STRENGTH = 10;

    CANNON_RECHARGE_TIME = 35;

    function Cannon(_at_img, _at_x, _at_y, _at_bounds, _at_scale) {
      this.img = _at_img;
      this.x = _at_x;
      this.y = _at_y;
      this.bounds = _at_bounds;
      this.scale = _at_scale;
      this.displayWidth = Cannon.SPRITE_WIDTH * this.scale;
      this.displayHeight = Cannon.SPRITE_HEIGHT * this.scale;
      this.init = false;
      this.cannonRechargeStep = 0;
      this.loadCannon();
      Cannon.__super__.constructor.call(this, this.img, 0, 0, Cannon.SPRITE_WIDTH, Cannon.SPRITE_HEIGHT, this.x, this.y, this.displayWidth, this.displayHeight);
      this.deathAnimationFrame = 1;
      this.deathAnimationFrameStep = 0;
      this.setDeathTimer(DEATH_ANIMATION_DURATION);
    }

    Cannon.prototype.fire = function(animationFrame) {
      var barrelCoords, projectile;
      if (!this.isReloaded()) {
        return;
      }
      barrelCoords = this.getCannonBarrelCoords();
      projectile = new CannonProjectile(barrelCoords.x, barrelCoords.y, this, {
        x: 0,
        y: -CANNON_CHARGE_STRENGTH
      }, this.bounds, this.scale);
      projectile.setSound("fire", this.getSoundCopy("fire"));
      this.loadCannon();
      return projectile;
    };

    Cannon.prototype.getCannonBarrelCoords = function() {
      var coords;
      return coords = {
        x: this.x + this.displayWidth / 2,
        y: this.y
      };
    };

    Cannon.prototype.isReloaded = function() {
      return this._isReloaded;
    };

    Cannon.prototype.loadCannon = function() {
      this.cannonRechargeStep = CANNON_RECHARGE_TIME;
      return this._isReloaded = false;
    };

    Cannon.prototype.checkReload = function() {
      if (this.isReloaded()) {
        return;
      }
      this.cannonRechargeStep--;
      if (this.cannonRechargeStep <= 0) {
        return this._isReloaded = true;
      }
    };

    Cannon.prototype.update = function(animationFrame, direction) {
      Cannon.__super__.update.call(this);
      if (!this.init) {
        return;
      }
      if (this.isDestroyed()) {
        return;
      }
      if (this.isDying()) {
        this.playSound("death");
        if (this.deathAnimationFrameStep-- === 0) {
          this.deathAnimationFrameStep = DEATH_ANIMATION_FRAME_DURATION;
          this.deathAnimationFrame = 1 - this.deathAnimationFrame;
          this.setSpritePos({
            y: Cannon.SPRITE_HEIGHT * (this.deathAnimationFrame + 1)
          });
          return;
        }
        return;
      }
      this.checkReload();
      if (_.isUndefined(direction)) {
        return;
      }
      this.x += Math.pow(-1, direction) * SPEED_MULTIPLIER;
      if (this.x < this.bounds.x.min) {
        this.x = this.bounds.x.min;
      }
      if (this.x + this.displayWidth > this.bounds.x.max) {
        return this.x = this.bounds.x.max - this.displayWidth;
      }
    };

    Cannon.prototype.render = function(ctx, animationFrame) {
      if (!(animationFrame > CANNON_DEPLOYMENT_DELAY)) {
        return;
      }
      this.init = true;
      return Cannon.__super__.render.apply(this, arguments);
    };

    return Cannon;

  })(Sprite);

  window.Cannon = Cannon;

}).call(this);

(function() {
  var Invader,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  Invader = (function(_super) {
    var ANIMATION_STEP_DURATION, DEATH_ANIMATION_DURATION, DEFAULT_ANIMATION_STEP, DEFAULT_H_VELOCITY, DEFAULT_INVADER_REST_TIME, DEFAULT_W_VELOCITY, INVADER_CANNON_CHARGE_STRENGTH, INVADER_DELAY_MAGIC, INVADER_DELAY_MULTIPLIER, INVADER_FIRE_CHANCE, INVADER_SPRITE_EXPLOSION_OFFSET, VELOCITY_INERTIA_MULTIPLIER, W_VELOCITY_MULTIPLIER, sign;

    __extends(Invader, _super);

    Invader.SPRITE_WIDTH = 50;

    Invader.SPRITE_HEIGHT = 35;

    Invader.INVADER_TYPE_LARGE = 2;

    Invader.INVADER_TYPE_MEDIUM = 1;

    Invader.INVADER_TYPE_SMALL = 0;

    DEFAULT_ANIMATION_STEP = 0;

    ANIMATION_STEP_DURATION = 1;

    DEATH_ANIMATION_DURATION = 10;

    DEFAULT_INVADER_REST_TIME = 60 / 2;

    DEFAULT_H_VELOCITY = Invader.SPRITE_WIDTH / 15;

    DEFAULT_W_VELOCITY = 0;

    W_VELOCITY_MULTIPLIER = .7;

    VELOCITY_INERTIA_MULTIPLIER = .5;

    INVADER_DELAY_MULTIPLIER = 1;

    INVADER_DELAY_MAGIC = 5;

    INVADER_CANNON_CHARGE_STRENGTH = 2;

    INVADER_FIRE_CHANCE = .03;

    INVADER_SPRITE_EXPLOSION_OFFSET = {
      x: 0,
      y: 3 * 35
    };

    function Invader(_at_img, _at_type, _at_rank, _at_x, _at_y, _at_bounds, _at_scale) {
      var types;
      this.img = _at_img;
      this.type = _at_type;
      this.rank = _at_rank;
      this.x = _at_x;
      this.y = _at_y;
      this.bounds = _at_bounds;
      this.scale = _at_scale;
      this.animationStep = 0;
      types = [Invader.INVADER_TYPE_SMALL, Invader.INVADER_TYPE_MEDIUM, Invader.INVADER_TYPE_LARGE];
      if (!(types.indexOf(this.type) >= 0)) {
        this.type = Invader.INVADER_TYPE_SMALL;
      }
      this.restTimeLeft = DEFAULT_INVADER_REST_TIME;
      this.restTime = DEFAULT_INVADER_REST_TIME;
      this.velocity = {
        x: DEFAULT_H_VELOCITY,
        y: 0
      };
      this.displayWidth = Invader.SPRITE_WIDTH * this.scale;
      this.displayHeight = Invader.SPRITE_HEIGHT * this.scale;
      Invader.__super__.constructor.call(this, this.img, this.animationStep * Invader.SPRITE_WIDTH, this.type * Invader.SPRITE_HEIGHT, Invader.SPRITE_WIDTH, Invader.SPRITE_HEIGHT, this.x, this.y, this.displayWidth, this.displayHeight);
      this.setDeathTimer(DEATH_ANIMATION_DURATION);
    }

    Invader.prototype.update = function(animationFrame, advanceFlag) {
      var evilExtraterrestrialProjectile, invaderRankDelay;
      Invader.__super__.update.call(this);
      if (this.isDestroyed()) {
        return;
      }
      if (this.isDying()) {
        this.playSound("death");
        this.setSpritePos(INVADER_SPRITE_EXPLOSION_OFFSET);
        return;
      }
      invaderRankDelay = (INVADER_DELAY_MAGIC - this.rank) * INVADER_DELAY_MULTIPLIER;
      if (animationFrame <= invaderRankDelay) {
        return;
      }
      if (this.restTimeLeft-- !== 0) {
        this.idle = true;
        return;
      }
      this.idle = false;
      this.restTimeLeft = this.restTime;
      this.updateVelocity(advanceFlag);
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      if (this.isReloaded()) {
        evilExtraterrestrialProjectile = this.fire();
      }
      if (animationFrame % ANIMATION_STEP_DURATION !== 0) {
        return evilExtraterrestrialProjectile || null;
      }
      this.animationStep = 1 - this.animationStep;
      this.spriteX = this.animationStep * Invader.SPRITE_WIDTH;
      return evilExtraterrestrialProjectile || null;
    };

    Invader.prototype.isReloaded = function() {
      return Math.random() < INVADER_FIRE_CHANCE;
    };

    Invader.prototype.fire = function() {
      var barrelCoords;
      barrelCoords = this.getCannonBarrelCoords();
      return new Projectile(barrelCoords.x, barrelCoords.y, this, {
        x: 0,
        y: INVADER_CANNON_CHARGE_STRENGTH
      }, this.bounds, this.scale);
    };

    Invader.prototype.getCannonBarrelCoords = function() {
      var coords;
      return coords = {
        x: this.x + this.displayWidth / 2,
        y: this.y
      };
    };

    Invader.prototype.checkAdvance = function(rank) {
      return (this.x + this.displayWidth * sign(this.velocity.x) + this.velocity.x >= this.bounds.x.max) || (this.x + this.displayWidth * sign(this.velocity.x) + this.velocity.x <= this.bounds.x.min);
    };

    Invader.prototype.updateVelocity = function(advanceFlag) {
      this.velocity.y = 0;
      if (advanceFlag) {
        this.velocity.x = -this.velocity.x;
        return this.velocity.y = W_VELOCITY_MULTIPLIER * this.displayHeight;
      }
    };

    sign = function(num) {
      if (num >= 0) {
        return 1;
      }
      return -1;
    };

    return Invader;

  })(Sprite);

  window.Invader = Invader;

}).call(this);

(function() {
  var Keyboard;

  Keyboard = (function() {
    Keyboard.KEY_CODE_LEFT = 37;

    Keyboard.KEY_CODE_RIGHT = 39;

    Keyboard.KEY_CODE_SPACE = 32;

    function Keyboard() {
      this.keysDown = {};
      this.keysPressed = {};
      document.addEventListener("keydown", (function(_this) {
        return function(event) {
          return _this.keysDown[event.keyCode] = true;
        };
      })(this));
      document.addEventListener("keyup", (function(_this) {
        return function(event) {
          return delete _this.keysDown[event.keyCode];
        };
      })(this));
    }

    Keyboard.prototype.isDown = function(keyCode) {
      return _.has(this.keysDown, keyCode);
    };

    return Keyboard;

  })();

  window.Keyboard = Keyboard;

}).call(this);

(function() {
  var ResourceLoader,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  ResourceLoader = (function(_super) {
    __extends(ResourceLoader, _super);

    ResourceLoader.RESOURCE_TYPE_IMG = "img";

    ResourceLoader.RESOURCE_TYPE_SOUND = "sound";

    function ResourceLoader(resourceList, callback) {
      var check, recourceData, _i, _len;
      if (_.isArray(resourceList)) {
        check = true;
        for (_i = 0, _len = resourceList.length; _i < _len; _i++) {
          recourceData = resourceList[_i];
          check *= _.isObject(recourceData) && _.has(recourceData, 'url') && _.has(recourceData, 'type');
        }
        if (!check) {
          throw "ResourceLoader :: ResourceLoader accepts only valid recource objects";
        }
      }
      this.images = {};
      this.sounds = {};
      this.loadResources(resourceList, callback);
    }

    ResourceLoader.prototype.loadResources = function(resourceList, callback) {
      if (callback == null) {
        callback = function() {};
      }
      return async.each(resourceList, (function(_this) {
        return function(recourceData, eCallback) {
          var img, sound;
          if (recourceData.type === ResourceLoader.RESOURCE_TYPE_IMG) {
            img = new Image();
            img.onload = function() {
              _this.images[recourceData.id || recourceData.url] = img;
              return eCallback(null);
            };
            img.src = recourceData.url;
          }
          if (recourceData.type === ResourceLoader.RESOURCE_TYPE_SOUND) {
            sound = new Audio(recourceData.url);
            _this.sounds[recourceData.id || recourceData.url] = sound;
            return eCallback(null);
          }
        };
      })(this), (function(_this) {
        return function(err) {
          callback();
          return _this.emit("ready");
        };
      })(this));
    };

    ResourceLoader.prototype.getImage = function(resId) {
      if (!_.has(this.images, resId)) {
        throw "ResourceLoader :: Resource not loaded";
      }
      return this.images[resId];
    };

    ResourceLoader.prototype.getSound = function(resId) {
      if (!_.has(this.sounds, resId)) {
        throw "ResourceLoader :: Resource not loaded";
      }
      return this.sounds[resId].cloneNode();
    };

    return ResourceLoader;

  })(EventEmitter2);

  window.ResourceLoader = ResourceLoader;

}).call(this);

(function() {
  var SpaceInvadersGame,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  SpaceInvadersGame = (function(_super) {
    var BGSOUND_FRAME_DELAY, BGSOUND_SPEED_MULTIPLIER, BG_COLOR, CANNON_SPRITE, CANVAS_HEIGHT, CANVAS_WIDTH, CLEAR_SCALE, FOOTER_HEIGHT, FREE_H_SPACE, GAME_OVER_COLOR, HEADER_HEIGHT, H_SPACE_PER_INVADER_MULTIPLIER, INVADERS_PER_RANK, INVADER_SPRITE, REDRAW_RATE, SIDE_OFFSET, SOUNDS, W_SPACE_PER_INVADER_MULTIPLIER, checkCollision, checkProjectileCollision, getJsFileDir, getObjectClass;

    __extends(SpaceInvadersGame, _super);

    CANVAS_HEIGHT = 640;

    CANVAS_WIDTH = 640;

    INVADER_SPRITE = "sprites/invaders.png";

    CANNON_SPRITE = "sprites/cannon.png";

    BG_COLOR = "#000";

    GAME_OVER_COLOR = "#FF0000";

    REDRAW_RATE = 1;

    HEADER_HEIGHT = 100;

    FOOTER_HEIGHT = 75;

    SIDE_OFFSET = 25;

    SOUNDS = {
      bgSounds: ["sounds/bg1.mp3", "sounds/bg2.mp3", "sounds/bg3.mp3", "sounds/bg4.mp3"],
      projectile: "sounds/projectile.mp3",
      invaderDeath: "sounds/invader_death.mp3",
      cannonDeath: "sounds/cannon_death.mp3"
    };

    BGSOUND_FRAME_DELAY = 60;

    BGSOUND_SPEED_MULTIPLIER = 400;

    INVADERS_PER_RANK = 11;

    FREE_H_SPACE = 4;

    H_SPACE_PER_INVADER_MULTIPLIER = 1.4;

    W_SPACE_PER_INVADER_MULTIPLIER = 2;

    CLEAR_SCALE = .3;

    function SpaceInvadersGame(_at_dest) {
      var currentDir;
      this.dest = _at_dest;
      currentDir = getJsFileDir("SpaceInvaders.js");
      this.resources = new ResourceLoader([
        {
          url: currentDir + INVADER_SPRITE,
          id: INVADER_SPRITE,
          type: ResourceLoader.RESOURCE_TYPE_IMG
        }, {
          url: currentDir + CANNON_SPRITE,
          id: CANNON_SPRITE,
          type: ResourceLoader.RESOURCE_TYPE_IMG
        }, {
          url: currentDir + SOUNDS.bgSounds[0],
          id: SOUNDS.bgSounds[0],
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }, {
          url: currentDir + SOUNDS.bgSounds[1],
          id: SOUNDS.bgSounds[1],
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }, {
          url: currentDir + SOUNDS.bgSounds[2],
          id: SOUNDS.bgSounds[2],
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }, {
          url: currentDir + SOUNDS.bgSounds[3],
          id: SOUNDS.bgSounds[3],
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }, {
          url: currentDir + SOUNDS.projectile,
          id: SOUNDS.projectile,
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }, {
          url: currentDir + SOUNDS.invaderDeath,
          id: SOUNDS.invaderDeath,
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }, {
          url: currentDir + SOUNDS.cannonDeath,
          id: SOUNDS.cannonDeath,
          type: ResourceLoader.RESOURCE_TYPE_SOUND
        }
      ], (function(_this) {
        return function() {
          return _this.init();
        };
      })(this));
    }

    SpaceInvadersGame.prototype.init = function() {
      $(this.dest).append("<canvas id='SpaceInvadersGame'></canvas>");
      this.initGameField();
      this.canvas = document.getElementById("SpaceInvadersGame");
      this.ctx = this.canvas.getContext("2d");
      this.controls = new Keyboard();
      this.ctx.globalAlpha = 1;
      this.gameOver = false;
      this.currentSoundId = 0;
      return this.startGame();
    };

    SpaceInvadersGame.prototype.initGameField = function() {
      var prefix, prefixes, _i, _len, _results;
      this.gameField = {
        x: SIDE_OFFSET,
        y: HEADER_HEIGHT,
        width: CANVAS_WIDTH - SIDE_OFFSET * 2,
        height: CANVAS_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT
      };
      this.gameFieldBounds = {
        x: {
          min: this.gameField.x,
          max: this.gameField.x + this.gameField.width
        },
        y: {
          min: this.gameField.y,
          max: this.gameField.y + this.gameField.height
        }
      };
      $("#SpaceInvadersGame").attr("height", CANVAS_HEIGHT);
      $("#SpaceInvadersGame").attr("width", CANVAS_WIDTH);
      $("#SpaceInvadersGame").css("background-color", BG_COLOR);
      $("#SpaceInvadersGame").css("-webkit-touch-callout", "none");
      prefixes = ["-webkit-", "-khtml-", "-moz-", "-ms-", ""];
      _results = [];
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        prefix = prefixes[_i];
        _results.push($("#SpaceInvadersGame").css(prefix + "user-select", "none"));
      }
      return _results;
    };

    SpaceInvadersGame.prototype.invade = function() {
      var i, invader, rank, type, _i, _len, _ref, _results;
      this.invaderRanks = [Invader.INVADER_TYPE_SMALL, Invader.INVADER_TYPE_MEDIUM, Invader.INVADER_TYPE_MEDIUM, Invader.INVADER_TYPE_LARGE, Invader.INVADER_TYPE_LARGE];
      this.invaderScale = this.gameField.width / (INVADERS_PER_RANK + FREE_H_SPACE) / (Invader.SPRITE_WIDTH * H_SPACE_PER_INVADER_MULTIPLIER);
      this.hSpacePerInvader = Invader.SPRITE_WIDTH * H_SPACE_PER_INVADER_MULTIPLIER * this.invaderScale;
      this.wSpacePerInvader = Invader.SPRITE_HEIGHT * W_SPACE_PER_INVADER_MULTIPLIER * this.invaderScale;
      _ref = this.invaderRanks;
      _results = [];
      for (rank = _i = 0, _len = _ref.length; _i < _len; rank = ++_i) {
        type = _ref[rank];
        _results.push((function() {
          var _j, _ref1, _results1;
          _results1 = [];
          for (i = _j = 0, _ref1 = INVADERS_PER_RANK - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
            invader = new Invader(this.resources.getImage(INVADER_SPRITE), type, rank, this.gameField.x + i * this.hSpacePerInvader, this.gameField.y + rank * this.wSpacePerInvader, this.gameFieldBounds, this.invaderScale);
            invader.setSound("death", this.resources.getSound(SOUNDS.invaderDeath));
            _results1.push(this.invaders.push(invader));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SpaceInvadersGame.prototype.vivaLaResistance = function() {
      this.cannon = new Cannon(this.resources.getImage(CANNON_SPRITE), this.gameField.x, this.gameField.y + this.gameField.height - Cannon.SPRITE_HEIGHT * this.invaderScale, this.gameFieldBounds, this.invaderScale);
      return this.cannon.setSounds([
        {
          name: "fire",
          sound: this.resources.getSound(SOUNDS.projectile)
        }, {
          name: "death",
          sound: this.resources.getSound(SOUNDS.cannonDeath)
        }
      ]);
    };

    SpaceInvadersGame.prototype.startGame = function() {
      var gameStep;
      this.invaders = [];
      this.projectiles = [];
      this.invade();
      this.vivaLaResistance();
      this.frame = 0;
      this.animationFrame = 0;
      gameStep = (function(_this) {
        return function() {
          _this.update();
          _this.render();
          return window.requestAnimationFrame(gameStep, _this.canvas);
        };
      })(this);
      return window.requestAnimationFrame(gameStep, this.canvas);
    };

    SpaceInvadersGame.prototype.playMusic = function(frame) {
      this.musicFrameCounter = this.musicFrameCounter || 0;
      this.musicFrameCounter++;
      this.musicFrameDelay = BGSOUND_FRAME_DELAY - Math.floor(frame / BGSOUND_SPEED_MULTIPLIER);
      if (this.musicFrameCounter >= this.musicFrameDelay) {
        this.resources.getSound(SOUNDS.bgSounds[this.currentSoundId]).play();
        this.currentSoundId = this.currentSoundId >= 3 ? 0 : this.currentSoundId + 1;
        return this.musicFrameCounter = 0;
      }
    };

    SpaceInvadersGame.prototype.clearGameField = function() {
      return this.ctx.clearRect(this.gameField.x, this.gameField.y, this.gameField.width, this.gameField.height);
    };

    SpaceInvadersGame.prototype.update = function() {
      var advanceFlag, invader, invaderMoveOutcome, projectile, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      this.frame++;
      this.playMusic(this.frame);
      if (this.frame % REDRAW_RATE !== 0) {
        return;
      }
      if (this.gameOver) {
        return;
      }
      this.clearGameField();
      this.animationFrame++;
      _ref = this.projectiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        projectile = _ref[_i];
        projectile.update();
      }
      advanceFlag = false;
      _ref1 = this.invaders;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        invader = _ref1[_j];
        advanceFlag = advanceFlag || invader.checkAdvance();
      }
      _ref2 = this.invaders;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        invader = _ref2[_k];
        invaderMoveOutcome = invader.update(this.animationFrame, advanceFlag);
        if (invaderMoveOutcome instanceof Projectile) {
          this.projectiles.push(invaderMoveOutcome);
        }
      }
      this.checkCollisions();
      this.handleKeyboardInteraction();
      this.checkDestroyedObjects();
      return this.checkGameOver();
    };

    SpaceInvadersGame.prototype.checkGameOver = function() {
      var invader, _i, _len, _ref, _results;
      if (!this.cannon) {
        this.gameOver = true;
        return true;
      }
      _ref = this.invaders;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        invader = _ref[_i];
        if (invader.y + invader.displayHeight > this.cannon.y) {
          _results.push(this.gameOver = true);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SpaceInvadersGame.prototype.checkCollisions = function() {
      var invader, projectile, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.projectiles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        projectile = _ref[_i];
        _ref1 = this.invaders;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          invader = _ref1[_j];
          if (checkProjectileCollision(projectile, invader)) {
            invader.destroy();
            projectile.destroy();
          }
        }
        if (!this.cannon) {
          continue;
        }
        if (checkProjectileCollision(projectile, this.cannon)) {
          projectile.destroy();
          _results.push(this.cannon.destroy());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    checkProjectileCollision = function(projectile, target) {
      var collision;
      collision = checkCollision(projectile, target);
      if (!collision) {
        return false;
      }
      return getObjectClass(projectile.owner) !== getObjectClass(target);
    };

    getObjectClass = function(obj) {
      var arr, str;
      if (obj && obj.constructor && obj.constructor.toString()) {
        if (obj.constructor.name) {
          return obj.constructor.name;
        }
        str = obj.constructor.toString();
        if (str.charAt(0) === '[') {
          arr = str.match(/\[\w+\s*(\w+)\]/);
        } else {
          arr = str.match(/function\s*(\w+)/);
        }
        if (arr && arr.length === 2) {
          return arr[1];
        }
      }
    };

    checkCollision = function(a, b) {
      var horizontalCheck, verticalCheck;
      horizontalCheck = (a.x + a.displayWidth < b.x) || (b.x + b.displayWidth < a.x);
      verticalCheck = (a.y + a.displayHeight < b.y) || (b.y + b.displayHeight < a.y);
      return !(horizontalCheck || verticalCheck);
    };

    SpaceInvadersGame.prototype.checkDestroyedObjects = function() {
      this.projectiles = _.filter(this.projectiles, function(projectile) {
        return !projectile.isDestroyed();
      });
      this.invaders = _.filter(this.invaders, function(invader) {
        return !invader.isDestroyed();
      });
      if (!this.cannon) {
        return;
      }
      if (this.cannon.isDestroyed()) {
        this.cannon = null;
        return this.gameOver = true;
      }
    };

    SpaceInvadersGame.prototype.handleKeyboardInteraction = function() {
      if (!this.cannon) {
        return;
      }
      if (this.controls.isDown(Keyboard.KEY_CODE_LEFT)) {
        this.cannon.update(this.animationFrame, Cannon.DIRECTION_LEFT);
      } else if (this.controls.isDown(Keyboard.KEY_CODE_RIGHT)) {
        this.cannon.update(this.animationFrame, Cannon.DIRECTION_RIGHT);
      } else {
        this.cannon.update(this.animationFrame);
      }
      if (this.controls.isDown(Keyboard.KEY_CODE_SPACE)) {
        if (this.cannon.isReloaded()) {
          return this.projectiles.push(this.cannon.fire(this.animationFrame));
        }
      }
    };

    SpaceInvadersGame.prototype.render = function() {
      var invader, projectile, _i, _j, _len, _len1, _ref, _ref1;
      if (this.gameOver) {
        this.ctx.fillStyle = GAME_OVER_COLOR;
        this.ctx.fillRect(Math.floor(Math.random() * CANVAS_WIDTH), Math.floor(Math.random() * CANVAS_HEIGHT), 5, 5);
      }
      _ref = this.projectiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        projectile = _ref[_i];
        projectile.render(this.ctx);
      }
      _ref1 = this.invaders;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        invader = _ref1[_j];
        invader.render(this.ctx);
      }
      if (this.cannon) {
        return this.cannon.render(this.ctx, this.animationFrame);
      }
    };

    getJsFileDir = function(filename) {
      var reg;
      reg = ".*" + filename + ".*";
      return $("script[src]").filter(function() {
        return this.src.match(new RegExp(reg));
      }).last().attr("src").split('?')[0].split('/').slice(0, -1).join('/') + '/';
    };

    return SpaceInvadersGame;

  })(EventEmitter2);

  window.SpaceInvadersGame = SpaceInvadersGame;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdW5keS5jb2ZmZWUiLCJEZXN0cm95YWJsZS5jb2ZmZWUiLCJQcm9qZWN0aWxlLmNvZmZlZSIsIlNwcml0ZS5jb2ZmZWUiLCJDYW5ub24uY29mZmVlIiwiSW52YWRlci5jb2ZmZWUiLCJLZXlib2FyZC5jb2ZmZWUiLCJSZXNvdXJjZUxvYWRlci5jb2ZmZWUiLCJTcGFjZUludmFkZXJzR2FtZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEsZ0JBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxFQUFWLENBRGE7SUFBQSxDQUFkOztBQUFBLHFCQUdBLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7YUFDVixJQUFDLENBQUEsTUFBTyxDQUFBLElBQUEsQ0FBUixHQUFnQixNQUROO0lBQUEsQ0FIWCxDQUFBOztBQUFBLHFCQU1BLFNBQUEsR0FBWSxTQUFDLFVBQUQsR0FBQTthQUNYLENBQUMsQ0FBQyxJQUFGLENBQU8sVUFBUCxFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxTQUFELEdBQUE7aUJBQ2xCLEtBQUMsQ0FBQSxRQUFELENBQVUsU0FBUyxDQUFDLElBQXBCLEVBQTBCLFNBQVMsQ0FBQyxLQUFwQyxFQURrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLEVBRFc7SUFBQSxDQU5aLENBQUE7O0FBQUEscUJBVUEsWUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO2FBQ2QsSUFBQyxDQUFBLE1BQU8sQ0FBQSxJQUFBLENBQUssQ0FBQyxTQUFkLENBQUEsRUFEYztJQUFBLENBVmYsQ0FBQTs7QUFBQSxxQkFhQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsTUFBTyxDQUFBLElBQUEsQ0FBSyxDQUFDLElBQWQsQ0FBQSxFQURXO0lBQUEsQ0FiWixDQUFBOztBQUFBLHFC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aVVBLE1BQU0sQ0FBQyxpQkFBUCxHQUEyQixpQkFqVTNCLENBQUE7QUFBQSIsImZpbGUiOiJTcGFjZUludmFkZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU291bmR5XHJcblx0Y29uc3RydWN0b3IgOiAtPlxyXG5cdFx0QHNvdW5kcyA9IHt9XHJcblxyXG5cdHNldFNvdW5kIDogKG5hbWUsIHNvdW5kKS0+XHJcblx0XHRAc291bmRzW25hbWVdID0gc291bmRcclxuXHJcblx0c2V0U291bmRzIDogKHNvdW5kc0RhdGEpLT5cclxuXHRcdF8uZWFjaCBzb3VuZHNEYXRhLCAoc291bmREYXRhKT0+XHJcblx0XHRcdEBzZXRTb3VuZCBzb3VuZERhdGEubmFtZSwgc291bmREYXRhLnNvdW5kXHRcclxuXHJcblx0Z2V0U291bmRDb3B5IDogKG5hbWUpLT5cclxuXHRcdEBzb3VuZHNbbmFtZV0uY2xvbmVOb2RlKClcdFx0XHJcblxyXG5cdHBsYXlTb3VuZCA6IChuYW1lKS0+XHJcblx0XHRAc291bmRzW25hbWVdLnBsYXkoKVxyXG5cclxuXHRzdG9wU291bmQgOiAobmFtZSktPlxyXG5cdFx0QHNvdW5kc1tuYW1lXS5wYXVzZSgpXHRcdFx0XHJcblxyXG5cclxud2luZG93LlNvdW5keSA9IFNvdW5keVx0XHQiLCJjbGFzcyBEZXN0cm95YWJsZSBleHRlbmRzIFNvdW5keVxyXG5cdGNvbnN0cnVjdG9yIDogKGRlYXRoVGltZSA9IDApLT5cdFxyXG5cdFx0c3VwZXIoKVxyXG5cdFx0QGRlYXRoVGltZXIgPSBkZWF0aFRpbWVcclxuXHRcdEBfaXNEZXN0cm95ZWQgPSBmYWxzZVxyXG5cdFx0QF9pc0R5aW5nID0gZmFsc2VcclxuXHJcblx0c2V0RGVhdGhUaW1lciA6IChkZWF0aFRpbWUpLT5cdFxyXG5cdFx0QGRlYXRoVGltZXIgPSBkZWF0aFRpbWVcclxuXHJcblxyXG5cdGNoZWNrUHVsc2UgOiAtPiAjIFRydWUgd2hlbiBhbGl2ZSBhbmQgbm90IGR5aW5nIChwYWluZnVsbHkpXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdFxyXG5cdFx0aWYgQGlzRHlpbmcoKVx0XHJcblx0XHRcdEBkaWVTbG93bHkoKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVx0XHJcblxyXG5cdGRpZVNsb3dseSA6IC0+ICAjIEFuZCBwYWluZnVsbHlcclxuXHRcdEBkZWF0aFRpbWVyLS1cdFx0XHRcdFxyXG5cdFx0aWYgQGRlYXRoVGltZXIgPD0gMFxyXG5cdFx0XHRAX2lzRGVzdHJveWVkID0gdHJ1ZVxyXG5cclxuXHRkZXN0cm95IDogLT5cdFx0XHJcblx0XHRAX2lzRHlpbmcgPSB0cnVlXHJcblx0XHRAZGllU2xvd2x5KClcclxuXHJcblx0dXBkYXRlIDogLT5cdFxyXG5cdFx0QGNoZWNrUHVsc2UoKVxyXG5cclxuXHRpc0Rlc3Ryb3llZCA6IC0+XHJcblx0XHRAX2lzRGVzdHJveWVkXHRcclxuXHJcblx0aXNEeWluZyA6IC0+ICMgT25jZSBhZ2Fpbiwgc2xvd2x5IGFuZCBwYWluZnVsbHlcclxuXHRcdEBfaXNEeWluZ1xyXG5cclxud2luZG93LkRlc3Ryb3lhYmxlID0gRGVzdHJveWFibGUiLCJjbGFzcyBQcm9qZWN0aWxlIGV4dGVuZHMgRGVzdHJveWFibGVcclxuXHJcblx0QFdJRFRIID0gM1xyXG5cdEBIRUlHSFQgPSAxNVxyXG5cclxuXHRAQ09MT1IgPSBcIiNmZmZmZmZcIlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IChAeCwgQHksIEBvd25lciwgQHZlbG9jaXR5LCBAYm91bmRzLCBAc2NhbGUpLT5cclxuXHRcdCMgVE9ETzogY3JlYXRlIGNsYXNzICdEaXNwbGF5YmxlJyB0byBoYW5kbGUgdGhlIHNjYWxlIGVhc2llciB3aXRob3V0IGNvcHlcXHBhc3RlICAgXHJcblx0XHRAZGlzcGxheVdpZHRoID0gUHJvamVjdGlsZS5XSURUSCAqIEBzY2FsZVxyXG5cdFx0QGRpc3BsYXlIZWlnaHQgPSBQcm9qZWN0aWxlLkhFSUdIVCAqIEBzY2FsZVxyXG5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0dXBkYXRlIDogKGFuaW1hdGlvbkZyYW1lKS0+XHJcblx0XHRzdXBlclxyXG5cclxuXHRcdGlmIEBpc0Rlc3Ryb3llZCgpXHJcblx0XHRcdHJldHVybiBcclxuXHJcblx0XHRAeSArPSBAdmVsb2NpdHkueVxyXG5cclxuXHRcdGlmIEBjaGVja1Byb2plY3RpbGVPdXRPZkJvdW5kcygpXHJcblx0XHRcdEBkZXN0cm95KClcclxuXHJcblx0Y2hlY2tQcm9qZWN0aWxlT3V0T2ZCb3VuZHMgOiAtPlxyXG5cdFx0Y2hlY2tZID0gKEB5IDwgQGJvdW5kcy55Lm1pbikgb3IgKEB5ICsgQGRpc3BsYXlIZWlnaHQgPiBAYm91bmRzLnkubWF4KSBcclxuXHRcdGNoZWNrWCA9IChAeCA8IEBib3VuZHMueC5taW4pIG9yIChAeCArIEBkaXNwbGF5V2lkdGggPiBAYm91bmRzLngubWF4KVxyXG5cdFx0Y2hlY2tYIG9yIGNoZWNrWVxyXG5cclxuXHRyZW5kZXIgOiAoY3R4KS0+XHJcblx0XHRpZiBAaXNEZXN0cm95ZWQoKVxyXG5cdFx0XHRyZXR1cm4gXHJcblx0XHQjIGJja3VwRmlsbFN0eWxlID0gY3R4LmZpbGxTdHlsZVxyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFByb2plY3RpbGUuQ09MT1JcclxuXHRcdGN0eC5maWxsUmVjdCBAeCAtIEBkaXNwbGF5V2lkdGgvMiwgQHksIEBkaXNwbGF5V2lkdGgsIEBkaXNwbGF5SGVpZ2h0XHRcclxuXHRcdCMgY3R4LmZpbGxTdHlsZSA9IGJja3VwRmlsbFN0eWxlXHJcblxyXG5jbGFzcyBDYW5ub25Qcm9qZWN0aWxlIGV4dGVuZHMgUHJvamVjdGlsZVxyXG5cdHVwZGF0ZSA6IC0+XHJcblx0XHRzdXBlciBcclxuXHRcdEBwbGF5U291bmQgXCJmaXJlXCJcclxuXHRkZXN0cm95IDogLT5cclxuXHRcdHN1cGVyXHJcblx0XHRAc3RvcFNvdW5kIFwiZmlyZVwiXHJcblxyXG53aW5kb3cuUHJvamVjdGlsZSA9IFByb2plY3RpbGVcclxud2luZG93LkNhbm5vblByb2plY3RpbGUgPSBDYW5ub25Qcm9qZWN0aWxlIiwiY2xhc3MgU3ByaXRlIGV4dGVuZHMgRGVzdHJveWFibGVcclxuXHRjb25zdHJ1Y3RvciA6IChAaW1nLCBAc3ByaXRlWCA9IDAsIEBzcHJpdGVZID0gMCwgQHcgPSAwLCBAaCA9IDAsIEB4ID0gMCwgQHkgPSAwLCBAZGlzcGxheVdpZHRoLCBAZGlzcGxheUhlaWdodCktPlxyXG5cdFx0c3VwZXIoKVxyXG5cclxuXHRzZXRTcHJpdGVQb3MgOiAoY29vcmRzKS0+XHJcblx0XHRAc3ByaXRlWCA9IGNvb3Jkcy54IGlmIF8uaGFzKGNvb3JkcyxcInhcIilcclxuXHRcdEBzcHJpdGVZID0gY29vcmRzLnkgaWYgXy5oYXMoY29vcmRzLFwieVwiKVxyXG5cclxuXHRyZW5kZXIgOiAoY3R4KS0+XHRcclxuXHRcdGN0eC5kcmF3SW1hZ2UgQGltZywgQHNwcml0ZVgsIEBzcHJpdGVZLCBAdywgQGgsIEB4LCBAeSwgQGRpc3BsYXlXaWR0aCwgQGRpc3BsYXlIZWlnaHRcclxuXHJcblxyXG5cdFx0XHJcbndpbmRvdy5TcHJpdGUgPSBTcHJpdGUiLCJjbGFzcyBDYW5ub24gZXh0ZW5kcyBTcHJpdGVcclxuXHRAU1BSSVRFX1dJRFRIID0gNDlcclxuXHRAU1BSSVRFX0hFSUdIVCA9IDMwXHJcblxyXG5cdEBESVJFQ1RJT05fTEVGVCA9IDFcclxuXHRARElSRUNUSU9OX1JJR0hUID0gMFxyXG5cclxuXHRDQU5OT05fREVQTE9ZTUVOVF9ERUxBWSA9IDYwICMgQW5pbWF0aW9uIGZyYW1lcyBiZWZvcmUgdGhlIGNhbm5vbiBhcHBlYXJzXHJcblx0U1BFRURfTVVMVElQTElFUiA9IDNcclxuXHJcblx0REVBVEhfQU5JTUFUSU9OX0RVUkFUSU9OID0gNjBcclxuXHRERUFUSF9BTklNQVRJT05fRlJBTUVfRFVSQVRJT04gPSBERUFUSF9BTklNQVRJT05fRFVSQVRJT04gLyAxMFxyXG5cdERFQVRIX0FOSU1BVElPTl9PRkZTRVQgPSAzMFxyXG5cclxuXHRDQU5OT05fQ0hBUkdFX1NUUkVOR1RIID0gMTBcclxuXHJcblx0Q0FOTk9OX1JFQ0hBUkdFX1RJTUUgPSAzNSAjIEZyYW1lcyB0byByZWNoYXJnZSBjYW5ub24uIE9uZSBjYW5ub3Qgc2ltcGx5IHBldy1wZXcgbGlrZSBhIG1hY2hpbmUgZ3VuXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogKEBpbWcsIEB4LCBAeSwgQGJvdW5kcywgQHNjYWxlKS0+XHJcblx0XHRAZGlzcGxheVdpZHRoID0gQ2Fubm9uLlNQUklURV9XSURUSCAqIEBzY2FsZVxyXG5cdFx0QGRpc3BsYXlIZWlnaHQgPSBDYW5ub24uU1BSSVRFX0hFSUdIVCAqIEBzY2FsZVxyXG5cclxuXHRcdEBpbml0ID0gZmFsc2VcclxuXHJcblx0XHRAY2Fubm9uUmVjaGFyZ2VTdGVwID0gMFxyXG5cclxuXHRcdEBsb2FkQ2Fubm9uKClcclxuXHJcblx0XHRzdXBlcihAaW1nLCBcclxuXHRcdFx0MCxcclxuXHRcdFx0MCxcclxuXHRcdFx0Q2Fubm9uLlNQUklURV9XSURUSCwgXHJcblx0XHRcdENhbm5vbi5TUFJJVEVfSEVJR0hULFxyXG5cdFx0XHRAeCxcclxuXHRcdFx0QHksXHJcblx0XHRcdEBkaXNwbGF5V2lkdGgsXHJcblx0XHRcdEBkaXNwbGF5SGVpZ2h0XHJcblx0XHQpXHRcdFxyXG5cclxuXHRcdEBkZWF0aEFuaW1hdGlvbkZyYW1lID0gMVxyXG5cdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWVTdGVwID0gMFxyXG5cdFx0QHNldERlYXRoVGltZXIgREVBVEhfQU5JTUFUSU9OX0RVUkFUSU9OXHJcblxyXG5cdGZpcmUgOiAoYW5pbWF0aW9uRnJhbWUpLT5cclxuXHRcdHVubGVzcyBAaXNSZWxvYWRlZCgpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0YmFycmVsQ29vcmRzID0gQGdldENhbm5vbkJhcnJlbENvb3JkcygpXHRcclxuXHRcdHByb2plY3RpbGUgPSBuZXcgQ2Fubm9uUHJvamVjdGlsZShcclxuXHRcdFx0YmFycmVsQ29vcmRzLngsIFxyXG5cdFx0XHRiYXJyZWxDb29yZHMueSwgXHJcblx0XHRcdEAsXHJcblx0XHRcdHsgeCA6IDAsIHkgOiAtQ0FOTk9OX0NIQVJHRV9TVFJFTkdUSH0sIFxyXG5cdFx0XHRAYm91bmRzLFxyXG5cdFx0XHRAc2NhbGVcclxuXHRcdClcclxuXHRcdFxyXG5cdFx0cHJvamVjdGlsZS5zZXRTb3VuZChcImZpcmVcIixAZ2V0U291bmRDb3B5KFwiZmlyZVwiKSlcclxuXHRcdEBsb2FkQ2Fubm9uKClcdFx0XHRcdFxyXG5cdFx0cmV0dXJuIHByb2plY3RpbGVcclxuXHJcblx0Z2V0Q2Fubm9uQmFycmVsQ29vcmRzIDogLT5cclxuXHRcdGNvb3JkcyA9IFx0XHJcblx0XHRcdHggOiBAeCArIEBkaXNwbGF5V2lkdGgvIDJcclxuXHRcdFx0eSA6IEB5XHRcdFxyXG5cclxuXHRpc1JlbG9hZGVkIDogLT5cclxuXHRcdEBfaXNSZWxvYWRlZFx0XHRcclxuXHJcblx0bG9hZENhbm5vbiA6IC0+XHJcblx0XHRAY2Fubm9uUmVjaGFyZ2VTdGVwID0gQ0FOTk9OX1JFQ0hBUkdFX1RJTUVcclxuXHRcdEBfaXNSZWxvYWRlZCA9IGZhbHNlXHJcblxyXG5cdGNoZWNrUmVsb2FkIDogLT5cclxuXHRcdGlmIEBpc1JlbG9hZGVkKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0QGNhbm5vblJlY2hhcmdlU3RlcC0tXHJcblx0XHRpZiBAY2Fubm9uUmVjaGFyZ2VTdGVwIDw9IDAgXHJcblx0XHRcdEBfaXNSZWxvYWRlZCA9IHRydWVcclxuXHJcblxyXG5cdHVwZGF0ZSA6IChhbmltYXRpb25GcmFtZSwgZGlyZWN0aW9uKS0+XHJcblx0XHRzdXBlcigpXHJcblx0XHR1bmxlc3MgQGluaXRcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcdFx0XHRcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgQGlzRHlpbmcoKVxyXG5cdFx0XHRAcGxheVNvdW5kIFwiZGVhdGhcIlxyXG5cdFx0XHRpZiBAZGVhdGhBbmltYXRpb25GcmFtZVN0ZXAtLSA9PSAwXHJcblx0XHRcdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWVTdGVwID0gREVBVEhfQU5JTUFUSU9OX0ZSQU1FX0RVUkFUSU9OXHJcblx0XHRcdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWUgPSAxIC0gQGRlYXRoQW5pbWF0aW9uRnJhbWVcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRAc2V0U3ByaXRlUG9zIFxyXG5cdFx0XHRcdFx0eSA6IENhbm5vbi5TUFJJVEVfSEVJR0hUICogKCBAZGVhdGhBbmltYXRpb25GcmFtZSArIDEgKVx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdHJldHVyblx0XHRcclxuXHJcblx0XHRAY2hlY2tSZWxvYWQoKVxyXG5cclxuXHJcblx0XHRpZiBfLmlzVW5kZWZpbmVkKGRpcmVjdGlvbilcclxuXHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdEB4ICs9IE1hdGgucG93KC0xLCBkaXJlY3Rpb24pICogU1BFRURfTVVMVElQTElFUlxyXG5cclxuXHRcdEB4ID0gQGJvdW5kcy54Lm1pbiBpZiBAeCA8IEBib3VuZHMueC5taW5cclxuXHRcdEB4ID0gQGJvdW5kcy54Lm1heCAtIEBkaXNwbGF5V2lkdGggaWYgQHggKyBAZGlzcGxheVdpZHRoID4gQGJvdW5kcy54Lm1heFxyXG5cclxuXHRyZW5kZXIgOiAoY3R4LGFuaW1hdGlvbkZyYW1lKS0+XHJcblx0XHR1bmxlc3MgYW5pbWF0aW9uRnJhbWUgPiBDQU5OT05fREVQTE9ZTUVOVF9ERUxBWVxyXG5cdFx0XHRyZXR1cm4gXHJcblx0XHRAaW5pdCA9IHRydWVcdFx0XHJcblx0XHRzdXBlclxyXG5cclxuXHJcbndpbmRvdy5DYW5ub24gPSBDYW5ub25cdCIsImNsYXNzIEludmFkZXIgZXh0ZW5kcyBTcHJpdGVcclxuXHRAU1BSSVRFX1dJRFRIID0gNTBcclxuXHRAU1BSSVRFX0hFSUdIVCA9IDM1XHRcclxuXHJcblx0QElOVkFERVJfVFlQRV9MQVJHRSA9IDJcclxuXHRASU5WQURFUl9UWVBFX01FRElVTSA9IDFcclxuXHRASU5WQURFUl9UWVBFX1NNQUxMID0gMFxyXG5cclxuXHRERUZBVUxUX0FOSU1BVElPTl9TVEVQID0gMFxyXG5cdEFOSU1BVElPTl9TVEVQX0RVUkFUSU9OID0gMSAjIFVwZGF0ZXMgZXZlcnkgQU5JTUFUSU9OX1NURVBfRFVSQVRJT04ndGggZnJhbWVcclxuXHRERUFUSF9BTklNQVRJT05fRFVSQVRJT04gPSAxMCAjIEZyYW1lcyBmb3IgZGVhdGggYW5pbWF0aW9uIGR1cmF0aW9uXHJcblxyXG5cdFxyXG5cclxuXHQjIEluIGZyYW1lcy4gTGVzc2VyIHRoZSB0aW1lLCBmYXN0ZXIgdGhlIEludmFkZXIsIHRoZXJlZm9yZSBoYXJkZXIgdGhlIGdhbWVcclxuXHQjIFdoZW4gc2V0IHRvIDEgaW52YWRlcnMgZ28gWm9pZGJlcmctc3R5bGUgKFxcLykoOywuOykoXFwvKSAtICh8KSg7LC47KSh8KSAtIChcXC8pKDssLjspKFxcLylcclxuXHRERUZBVUxUX0lOVkFERVJfUkVTVF9USU1FID0gNjAvMlxyXG5cclxuXHRERUZBVUxUX0hfVkVMT0NJVFkgPSBJbnZhZGVyLlNQUklURV9XSURUSCAvIDE1XHJcblx0REVGQVVMVF9XX1ZFTE9DSVRZID0gMFxyXG5cdFdfVkVMT0NJVFlfTVVMVElQTElFUiA9IC43XHJcblx0VkVMT0NJVFlfSU5FUlRJQV9NVUxUSVBMSUVSID0gLjVcclxuXHQjIFZlbG9jaXR5IHt4IDogZmxvYXQseSA6IGZsb2F0fSwgcGl4ZWxzIHBlciBhbmltYXRpb24gZnJhbWUgXHJcblxyXG5cdElOVkFERVJfREVMQVlfTVVMVElQTElFUiAgPSAxXHJcblx0SU5WQURFUl9ERUxBWV9NQUdJQyA9IDVcclxuXHJcblx0SU5WQURFUl9DQU5OT05fQ0hBUkdFX1NUUkVOR1RIID0gMlxyXG5cdCNUT0RPIG1ha2UgZmlyZSBjaGFuZGUgaW5kZXBlbmRlbnQgb2YgaW52YWRlciByZXN0IHRpbWVcclxuXHRJTlZBREVSX0ZJUkVfQ0hBTkNFID0gLjAzXHJcblxyXG5cdElOVkFERVJfU1BSSVRFX0VYUExPU0lPTl9PRkZTRVQgPSBcclxuXHRcdHggOiAwXHJcblx0XHR5IDogMyAqIDM1XHJcblxyXG5cdGNvbnN0cnVjdG9yIDogKEBpbWcsIEB0eXBlLCBAcmFuaywgQHgsIEB5LCBAYm91bmRzLCBAc2NhbGUpLT5cdFx0XHJcblx0XHRAYW5pbWF0aW9uU3RlcCA9IDAgIyAyIEFuaW1hdGlvbiBTdGVwc1xyXG5cclxuXHRcdHR5cGVzID0gW0ludmFkZXIuSU5WQURFUl9UWVBFX1NNQUxMLEludmFkZXIuSU5WQURFUl9UWVBFX01FRElVTSxJbnZhZGVyLklOVkFERVJfVFlQRV9MQVJHRV1cclxuXHJcblx0XHR1bmxlc3MgdHlwZXMuaW5kZXhPZihAdHlwZSkgPj0gMFxyXG5cdFx0XHQjIGNvbnNvbGUubG9nIHR5cGVzXHJcblx0XHRcdEB0eXBlID0gSW52YWRlci5JTlZBREVSX1RZUEVfU01BTExcdFxyXG5cclxuXHRcdEByZXN0VGltZUxlZnQgPSBERUZBVUxUX0lOVkFERVJfUkVTVF9USU1FXHJcblx0XHRAcmVzdFRpbWUgPSBERUZBVUxUX0lOVkFERVJfUkVTVF9USU1FXHJcblxyXG5cdFx0QHZlbG9jaXR5ID0geyB4IDogREVGQVVMVF9IX1ZFTE9DSVRZLCB5IDogMCB9IFxyXG5cclxuXHRcdEBkaXNwbGF5V2lkdGggPSBJbnZhZGVyLlNQUklURV9XSURUSCAqIEBzY2FsZVxyXG5cdFx0QGRpc3BsYXlIZWlnaHQgPSBJbnZhZGVyLlNQUklURV9IRUlHSFQgKiBAc2NhbGVcclxuXHJcblx0XHRzdXBlciggXHJcblx0XHRcdEBpbWcsIFxyXG5cdFx0XHRAYW5pbWF0aW9uU3RlcCAqIEludmFkZXIuU1BSSVRFX1dJRFRILFxyXG5cdFx0XHRAdHlwZSAqIEludmFkZXIuU1BSSVRFX0hFSUdIVCxcclxuXHRcdFx0SW52YWRlci5TUFJJVEVfV0lEVEgsIFxyXG5cdFx0XHRJbnZhZGVyLlNQUklURV9IRUlHSFQsXHJcblx0XHRcdEB4LFxyXG5cdFx0XHRAeSxcclxuXHRcdFx0QGRpc3BsYXlXaWR0aCxcclxuXHRcdFx0QGRpc3BsYXlIZWlnaHRcclxuXHRcdClcclxuXHJcblx0XHRAc2V0RGVhdGhUaW1lciBERUFUSF9BTklNQVRJT05fRFVSQVRJT05cclxuXHJcblx0dXBkYXRlIDogKGFuaW1hdGlvbkZyYW1lLGFkdmFuY2VGbGFnKS0+XHRcdFxyXG5cdFx0c3VwZXIoKVxyXG5cclxuXHRcdGlmIEBpc0Rlc3Ryb3llZCgpXHRcdFx0XHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIEBpc0R5aW5nKClcclxuXHRcdFx0QHBsYXlTb3VuZCBcImRlYXRoXCJcclxuXHRcdFx0QHNldFNwcml0ZVBvcyBJTlZBREVSX1NQUklURV9FWFBMT1NJT05fT0ZGU0VUXHJcblx0XHRcdHJldHVybiBcclxuXHRcdCMgQnVnIHdoZW4gdXNpbmcgZGVsYXkgd2hlbiB2ZWxvY2l0eSBpcyBoaWdoLiBOZWVkIHRvIGhhbmRsZSBjcm91ZCBiZWhhdmlvdXIgbW9yZSBwcmVjaXNlbHlcclxuXHRcdGludmFkZXJSYW5rRGVsYXkgPSAoSU5WQURFUl9ERUxBWV9NQUdJQyAtIEByYW5rKSAqIElOVkFERVJfREVMQVlfTVVMVElQTElFUlx0XHRcdFxyXG5cdFx0aWYgYW5pbWF0aW9uRnJhbWUgPD0gaW52YWRlclJhbmtEZWxheVxyXG5cdFx0XHRyZXR1cm4gXHRcclxuXHRcdHVubGVzcyBAcmVzdFRpbWVMZWZ0LS0gaXMgMFxyXG5cdFx0XHRAaWRsZSA9IHRydWVcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0QGlkbGUgPSBmYWxzZVxyXG5cdFx0QHJlc3RUaW1lTGVmdCA9IEByZXN0VGltZVx0XHJcblxyXG5cdFx0QHVwZGF0ZVZlbG9jaXR5IGFkdmFuY2VGbGFnXHJcblx0XHRAeCArPSBAdmVsb2NpdHkueFxyXG5cdFx0QHkgKz0gQHZlbG9jaXR5LnlcclxuXHJcblx0XHRpZiBAaXNSZWxvYWRlZCgpXHJcblx0XHRcdGV2aWxFeHRyYXRlcnJlc3RyaWFsUHJvamVjdGlsZSA9IEBmaXJlKClcclxuXHJcblx0XHR1bmxlc3MgYW5pbWF0aW9uRnJhbWUgJSBBTklNQVRJT05fU1RFUF9EVVJBVElPTiA9PSAwXHJcblx0XHRcdHJldHVybiBldmlsRXh0cmF0ZXJyZXN0cmlhbFByb2plY3RpbGUgfHwgbnVsbFxyXG5cdFx0QGFuaW1hdGlvblN0ZXAgPSAxIC0gQGFuaW1hdGlvblN0ZXBcclxuXHRcdEBzcHJpdGVYID0gQGFuaW1hdGlvblN0ZXAgKiBJbnZhZGVyLlNQUklURV9XSURUSFxyXG5cdFx0cmV0dXJuIGV2aWxFeHRyYXRlcnJlc3RyaWFsUHJvamVjdGlsZSB8fCBudWxsXHJcblxyXG5cdGlzUmVsb2FkZWQgOiAtPlxyXG5cdFx0TWF0aC5yYW5kb20oKSA8IElOVkFERVJfRklSRV9DSEFOQ0VcclxuXHJcblx0ZmlyZSA6IC0+XHJcblx0XHRiYXJyZWxDb29yZHMgPSBAZ2V0Q2Fubm9uQmFycmVsQ29vcmRzKClcdFxyXG5cclxuXHRcdHJldHVybiBuZXcgUHJvamVjdGlsZShcclxuXHRcdFx0YmFycmVsQ29vcmRzLngsIFxyXG5cdFx0IFx0YmFycmVsQ29vcmRzLnksIFxyXG5cdFx0XHRALFxyXG5cdFx0XHR7IHggOiAwLCB5IDogSU5WQURFUl9DQU5OT05fQ0hBUkdFX1NUUkVOR1RIfSwgXHJcblx0XHRcdEBib3VuZHMsXHJcblx0XHRcdEBzY2FsZVxyXG5cdFx0KVx0XHJcblxyXG5cdCMgV2h5IG5vdCBwb2x5IEludmFkZXIgb2YgQ2Fubm9uIHRoZW4/XHJcblx0IyBUT0RPOiBDcmVhdGUgY2xhc3MgJ1Nob290YScgYWJsZSB0byBmaXJlLiBJbmhlcml0IEludmFkZXIgYW5kIENhbm5vbiBmcm9tIFNob290YSBcclxuXHRnZXRDYW5ub25CYXJyZWxDb29yZHMgOiAtPlxyXG5cdFx0Y29vcmRzID0gXHRcclxuXHRcdFx0eCA6IEB4ICsgQGRpc3BsYXlXaWR0aC8gMlxyXG5cdFx0XHR5IDogQHlcdFxyXG5cclxuXHJcblxyXG5cdCMgSW52YWRlcnMgYXJlIHFpdXRlIGZlYXJmdWwgY3JlYXR1cmVzLiBcclxuXHQjIFRoZXkgYWR2YW5jZSBvbmx5IGlmIG9uZSBvZiB0aGVtIGRlY2lkZXMgdG8gYW5kIHdhaXQgZm9yIHRoZSBsYXN0IG9uZSBpbiByYW5rIHRvIG1ha2Ugc3VjaCBhIGRlY2lzaW9uXHJcblx0Y2hlY2tBZHZhbmNlIDogKHJhbmspLT5cclxuXHRcdHJldHVybiAoQHggKyBAZGlzcGxheVdpZHRoKnNpZ24oQHZlbG9jaXR5LngpICsgQHZlbG9jaXR5LnggPj0gQGJvdW5kcy54Lm1heCkgb3IgXHJcblx0XHRcdChAeCArIEBkaXNwbGF5V2lkdGgqc2lnbihAdmVsb2NpdHkueCkgKyBAdmVsb2NpdHkueCA8PSBAYm91bmRzLngubWluKVxyXG5cclxuXHR1cGRhdGVWZWxvY2l0eSA6IChhZHZhbmNlRmxhZyktPlxyXG5cdFx0QHZlbG9jaXR5LnkgPSAwXHJcblx0XHQjIGlmIGFkdmFuY2VGbGFnc1tAcmFua10gXHJcblx0XHRpZiBhZHZhbmNlRmxhZ1xyXG5cdFx0XHRAdmVsb2NpdHkueCA9IC0gQHZlbG9jaXR5LnhcclxuXHRcdFx0QHZlbG9jaXR5LnkgPSBXX1ZFTE9DSVRZX01VTFRJUExJRVIgKiBAZGlzcGxheUhlaWdodFx0XHRcclxuXHJcblx0c2lnbiA9IChudW0pLT5cclxuXHRcdGlmIG51bSA+PSAwXHJcblx0XHRcdHJldHVybiAxXHJcblx0XHRyZXR1cm4gLTFcclxud2luZG93LkludmFkZXIgPSBJbnZhZGVyIiwiXHJcbmNsYXNzIEtleWJvYXJkXHJcblx0QEtFWV9DT0RFX0xFRlQgPSAzN1xyXG5cdEBLRVlfQ09ERV9SSUdIVCA9IDM5XHJcblx0QEtFWV9DT0RFX1NQQUNFID0gMzJcclxuXHJcblx0Y29uc3RydWN0b3IgOiAtPlxyXG5cdFx0QGtleXNEb3duID0ge31cclxuXHRcdEBrZXlzUHJlc3NlZCA9IHt9XHJcblxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImtleWRvd25cIiwgKGV2ZW50KT0+XHRcdFxyXG5cdFx0XHRAa2V5c0Rvd25bZXZlbnQua2V5Q29kZV0gPSB0cnVlIFx0XHRcdFxyXG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImtleXVwXCIsIChldmVudCk9Plx0XHRcdFx0XHRcdFxyXG5cdFx0XHRkZWxldGUgQGtleXNEb3duW2V2ZW50LmtleUNvZGVdXHJcblxyXG5cdGlzRG93biA6IChrZXlDb2RlKS0+XHRcclxuXHRcdHJldHVybiBfLmhhcyhAa2V5c0Rvd24sa2V5Q29kZSlcclxuXHJcbndpbmRvdy5LZXlib2FyZCA9IEtleWJvYXJkIiwiY2xhc3MgUmVzb3VyY2VMb2FkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIyXHJcblxyXG5cdEBSRVNPVVJDRV9UWVBFX0lNRyA9IFwiaW1nXCJcclxuXHJcblx0QFJFU09VUkNFX1RZUEVfU09VTkQgPSBcInNvdW5kXCJcclxuXHJcblx0Y29uc3RydWN0b3IgOiAocmVzb3VyY2VMaXN0LGNhbGxiYWNrKS0+XHJcblx0XHRpZiBfLmlzQXJyYXkocmVzb3VyY2VMaXN0KVxyXG5cdFx0XHRjaGVjayA9IHRydWUgXHJcblx0XHRcdGZvciByZWNvdXJjZURhdGEgaW4gcmVzb3VyY2VMaXN0XHJcblx0XHRcdFx0Y2hlY2sgKj0gKF8uaXNPYmplY3QocmVjb3VyY2VEYXRhKSBhbmQgXy5oYXMocmVjb3VyY2VEYXRhLCd1cmwnKSBhbmQgXy5oYXMocmVjb3VyY2VEYXRhLCd0eXBlJykpIFxyXG5cdFx0XHR1bmxlc3MgY2hlY2tcclxuXHRcdFx0XHR0aHJvdyBcIlJlc291cmNlTG9hZGVyIDo6IFJlc291cmNlTG9hZGVyIGFjY2VwdHMgb25seSB2YWxpZCByZWNvdXJjZSBvYmplY3RzXCJcclxuXHJcblx0XHRAaW1hZ2VzID0ge31cclxuXHRcdEBzb3VuZHMgPSB7fVxyXG5cclxuXHRcdEBsb2FkUmVzb3VyY2VzIHJlc291cmNlTGlzdCwgY2FsbGJhY2tcclxuXHRcdFxyXG5cdGxvYWRSZXNvdXJjZXMgOiAocmVzb3VyY2VMaXN0LGNhbGxiYWNrPS0+KS0+XHJcblx0XHRhc3luYy5lYWNoIHJlc291cmNlTGlzdCwgKHJlY291cmNlRGF0YSxlQ2FsbGJhY2spPT5cdFx0XHRcclxuXHRcdFx0aWYgcmVjb3VyY2VEYXRhLnR5cGUgaXMgUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9JTUdcclxuXHRcdFx0XHRpbWcgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0XHRcdGltZy5vbmxvYWQgPSA9PlxyXG5cdFx0XHRcdFx0QGltYWdlc1tyZWNvdXJjZURhdGEuaWQgfHwgcmVjb3VyY2VEYXRhLnVybF0gPSBpbWdcclxuXHRcdFx0XHRcdGVDYWxsYmFjayBudWxsXHJcblx0XHRcdFx0aW1nLnNyYyA9IHJlY291cmNlRGF0YS51cmxcclxuXHRcdFx0aWYgcmVjb3VyY2VEYXRhLnR5cGUgaXMgUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORFxyXG5cdFx0XHRcdHNvdW5kID0gbmV3IEF1ZGlvIHJlY291cmNlRGF0YS51cmxcclxuXHRcdFx0XHRAc291bmRzW3JlY291cmNlRGF0YS5pZCB8fCByZWNvdXJjZURhdGEudXJsXSA9IHNvdW5kXHJcblx0XHRcdFx0ZUNhbGxiYWNrIG51bGxcclxuXHRcdCwgKGVycik9PlxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblx0XHRcdEBlbWl0IFwicmVhZHlcIlxyXG5cclxuXHRnZXRJbWFnZSA6IChyZXNJZCktPlxyXG5cdFx0dW5sZXNzIF8uaGFzIEBpbWFnZXMsIHJlc0lkXHJcblx0XHRcdHRocm93IFwiUmVzb3VyY2VMb2FkZXIgOjogUmVzb3VyY2Ugbm90IGxvYWRlZFwiXHJcblx0XHRAaW1hZ2VzW3Jlc0lkXVxyXG5cclxuXHRnZXRTb3VuZCA6IChyZXNJZCktPlxyXG5cdFx0dW5sZXNzIF8uaGFzIEBzb3VuZHMsIHJlc0lkXHJcblx0XHRcdHRocm93IFwiUmVzb3VyY2VMb2FkZXIgOjogUmVzb3VyY2Ugbm90IGxvYWRlZFwiXHJcblx0XHRAc291bmRzW3Jlc0lkXS5jbG9uZU5vZGUoKVx0XHJcblxyXG53aW5kb3cuUmVzb3VyY2VMb2FkZXIgPSBSZXNvdXJjZUxvYWRlclxyXG5cclxuXHJcblxyXG5cclxuXHRcdFxyXG5cdFx0XHJcblxyXG4iLCJcclxuXHJcbmNsYXNzIFNwYWNlSW52YWRlcnNHYW1lIGV4dGVuZHMgRXZlbnRFbWl0dGVyMlxyXG5cdENBTlZBU19IRUlHSFQgPSA2NDBcclxuXHRDQU5WQVNfV0lEVEggPSA2NDBcclxuXHRJTlZBREVSX1NQUklURSA9IFwic3ByaXRlcy9pbnZhZGVycy5wbmdcIlxyXG5cdENBTk5PTl9TUFJJVEUgPSBcInNwcml0ZXMvY2Fubm9uLnBuZ1wiXHJcblx0QkdfQ09MT1IgPSBcIiMwMDBcIlxyXG5cdEdBTUVfT1ZFUl9DT0xPUiA9IFwiI0ZGMDAwMFwiXHJcblx0UkVEUkFXX1JBVEUgPSAxXHJcblxyXG5cdEhFQURFUl9IRUlHSFQgPSAxMDBcclxuXHRGT09URVJfSEVJR0hUID0gNzVcclxuXHRTSURFX09GRlNFVCA9IDI1XHJcblxyXG5cclxuXHQjIFRPRE8gU291bmRFbWl0dGVyIGNsYXNzIHRvIGhhbmRsZSBzb3VuZHNcclxuXHRTT1VORFMgPSB7XHJcblx0XHRiZ1NvdW5kcyA6IFtcInNvdW5kcy9iZzEubXAzXCIsIFwic291bmRzL2JnMi5tcDNcIiwgXCJzb3VuZHMvYmczLm1wM1wiLCBcInNvdW5kcy9iZzQubXAzXCJdXHJcblx0XHRwcm9qZWN0aWxlIDogXCJzb3VuZHMvcHJvamVjdGlsZS5tcDNcIlxyXG5cdFx0aW52YWRlckRlYXRoIDogXCJzb3VuZHMvaW52YWRlcl9kZWF0aC5tcDNcIlxyXG5cdFx0Y2Fubm9uRGVhdGggOiBcInNvdW5kcy9jYW5ub25fZGVhdGgubXAzXCJcclxuXHR9XHJcblxyXG5cdEJHU09VTkRfRlJBTUVfREVMQVkgPSA2MFx0XHJcblx0QkdTT1VORF9TUEVFRF9NVUxUSVBMSUVSID0gNDAwXHJcblxyXG5cdElOVkFERVJTX1BFUl9SQU5LID0gMTEgIyBZZWFoLCByYW5rcy4gTGlrZSBpbiByZWFsIGFybXlcclxuXHJcblx0RlJFRV9IX1NQQUNFID0gNCAjIEZyZWUgc3BhY2UgKDEgdW5pdCA9IDEgSW52YWRlciBkaXNwbGF5IHdpZHRoKSBmb3IgSW52YWRlcnMgdG8gbW92ZS4gXHJcblxyXG5cdEhfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUiA9IDEuNFxyXG5cdFdfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUiA9IDJcclxuXHJcblx0Q0xFQVJfU0NBTEUgPSAuMyBcclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQGRlc3QpLT5cclxuXHRcdGN1cnJlbnREaXIgPSBnZXRKc0ZpbGVEaXIgXCJTcGFjZUludmFkZXJzLmpzXCJcclxuXHJcblx0XHRAcmVzb3VyY2VzID0gbmV3IFJlc291cmNlTG9hZGVyIFtcclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBJTlZBREVSX1NQUklURSwgaWQgOiBJTlZBREVSX1NQUklURSwgdHlwZSA6IFJlc291cmNlTG9hZGVyLlJFU09VUkNFX1RZUEVfSU1HfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIENBTk5PTl9TUFJJVEUsIGlkIDogQ0FOTk9OX1NQUklURSwgdHlwZSA6IFJlc291cmNlTG9hZGVyLlJFU09VUkNFX1RZUEVfSU1HfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIFNPVU5EUy5iZ1NvdW5kc1swXSwgaWQgOiBTT1VORFMuYmdTb3VuZHNbMF0sIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIFNPVU5EUy5iZ1NvdW5kc1sxXSwgaWQgOiBTT1VORFMuYmdTb3VuZHNbMV0sIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIFNPVU5EUy5iZ1NvdW5kc1syXSwgaWQgOiBTT1VORFMuYmdTb3VuZHNbMl0sIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIFNPVU5EUy5iZ1NvdW5kc1szXSwgaWQgOiBTT1VORFMuYmdTb3VuZHNbM10sIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIFNPVU5EUy5wcm9qZWN0aWxlLCBpZCA6IFNPVU5EUy5wcm9qZWN0aWxlLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuaW52YWRlckRlYXRoLCBpZCA6IFNPVU5EUy5pbnZhZGVyRGVhdGgsIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIFNPVU5EUy5jYW5ub25EZWF0aCwgaWQgOiBTT1VORFMuY2Fubm9uRGVhdGgsIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EfVxyXG5cdFx0XSwgPT5cdFx0XHRcclxuXHRcdFx0QGluaXQoKVxyXG5cclxuXHRpbml0IDogLT5cdFx0XHJcblx0XHQkKEBkZXN0KS5hcHBlbmQgXCI8Y2FudmFzIGlkPSdTcGFjZUludmFkZXJzR2FtZSc+PC9jYW52YXM+XCJcclxuXHRcdEBpbml0R2FtZUZpZWxkKClcclxuXHRcdEBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlNwYWNlSW52YWRlcnNHYW1lXCIpXHJcblx0XHRAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuXHJcblx0XHRAY29udHJvbHMgPSBuZXcgS2V5Ym9hcmQoKVxyXG5cclxuXHRcdEBjdHguZ2xvYmFsQWxwaGEgPSAxIFxyXG5cclxuXHRcdEBnYW1lT3ZlciA9IGZhbHNlXHJcblxyXG5cdFx0QGN1cnJlbnRTb3VuZElkID0gMFxyXG5cclxuXHRcdEBzdGFydEdhbWUoKVxyXG5cclxuXHRpbml0R2FtZUZpZWxkIDogLT5cclxuXHJcblx0XHQjVE9ETyBEeW5hbWljIGdhbWUgZmllbGQgYmFzZWQgb24gc2NyZWVuIHdpZHRoXHJcblx0XHRAZ2FtZUZpZWxkID0gXHJcblx0XHRcdHggOiBTSURFX09GRlNFVFxyXG5cdFx0XHR5IDogSEVBREVSX0hFSUdIVFxyXG5cdFx0XHR3aWR0aCA6IENBTlZBU19XSURUSCAtIFNJREVfT0ZGU0VUICogMlxyXG5cdFx0XHRoZWlnaHQgOiBDQU5WQVNfSEVJR0hUIC0gSEVBREVSX0hFSUdIVCAtIEZPT1RFUl9IRUlHSFRcclxuXHJcblx0XHRAZ2FtZUZpZWxkQm91bmRzID1cclxuXHRcdFx0eCA6IFxyXG5cdFx0XHRcdG1pbiA6IEBnYW1lRmllbGQueFxyXG5cdFx0XHRcdG1heCA6IEBnYW1lRmllbGQueCArIEBnYW1lRmllbGQud2lkdGhcclxuXHRcdFx0eSA6IFxyXG5cdFx0XHRcdG1pbiA6IEBnYW1lRmllbGQueVxyXG5cdFx0XHRcdG1heCA6IEBnYW1lRmllbGQueSArIEBnYW1lRmllbGQuaGVpZ2h0XHRcclxuXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmF0dHIgXCJoZWlnaHRcIixDQU5WQVNfSEVJR0hUXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmF0dHIgXCJ3aWR0aFwiLENBTlZBU19XSURUSFxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MgXCJiYWNrZ3JvdW5kLWNvbG9yXCIgLCBCR19DT0xPUlxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MgXCItd2Via2l0LXRvdWNoLWNhbGxvdXRcIiAsIFwibm9uZVwiXHJcblx0XHRwcmVmaXhlcyA9IFtcIi13ZWJraXQtXCIsXCIta2h0bWwtXCIsXCItbW96LVwiLFwiLW1zLVwiLFwiXCJdXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmNzcyhcIiN7cHJlZml4fXVzZXItc2VsZWN0XCIsIFwibm9uZVwiKSBmb3IgcHJlZml4IGluIHByZWZpeGVzXHJcblxyXG5cclxuXHRpbnZhZGUgOiAtPlxyXG5cdFx0QGludmFkZXJSYW5rcyA9IFtcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfU01BTEwsXHJcblx0XHRcdEludmFkZXIuSU5WQURFUl9UWVBFX01FRElVTSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTUVESVVNLFxyXG5cdFx0XHRJbnZhZGVyLklOVkFERVJfVFlQRV9MQVJHRSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTEFSR0VcclxuXHRcdF1cdFx0XHRcclxuXHJcblx0XHRAaW52YWRlclNjYWxlID0gXHJcblx0XHRcdEBnYW1lRmllbGQud2lkdGggLyAoSU5WQURFUlNfUEVSX1JBTksgKyBGUkVFX0hfU1BBQ0UpIC8gXHJcblx0XHRcdChJbnZhZGVyLlNQUklURV9XSURUSCAqIEhfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUilcclxuXHJcblx0XHRAaFNwYWNlUGVySW52YWRlciA9IEludmFkZXIuU1BSSVRFX1dJRFRIICogSF9TUEFDRV9QRVJfSU5WQURFUl9NVUxUSVBMSUVSICogQGludmFkZXJTY2FsZVxyXG5cdFx0QHdTcGFjZVBlckludmFkZXIgPSBJbnZhZGVyLlNQUklURV9IRUlHSFQgKiBXX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgKiBAaW52YWRlclNjYWxlXHJcblxyXG5cdFx0Zm9yIHR5cGUscmFuayBpbiBAaW52YWRlclJhbmtzXHJcblx0XHRcdGZvciBpIGluIFswLi5JTlZBREVSU19QRVJfUkFOSy0xXVxyXG5cclxuXHRcdFx0XHRpbnZhZGVyID0gbmV3IEludmFkZXIoXHJcblx0XHRcdFx0XHRAcmVzb3VyY2VzLmdldEltYWdlKElOVkFERVJfU1BSSVRFKSxcclxuXHRcdFx0XHRcdHR5cGUsIFxyXG5cdFx0XHRcdFx0cmFuayxcdFx0XHRcdFxyXG5cdFx0XHRcdFx0QGdhbWVGaWVsZC54ICsgaSAqIEBoU3BhY2VQZXJJbnZhZGVyLCBcclxuXHRcdFx0XHRcdEBnYW1lRmllbGQueSArIHJhbmsgKiBAd1NwYWNlUGVySW52YWRlcixcclxuXHRcdFx0XHRcdEBnYW1lRmllbGRCb3VuZHMsXHJcblx0XHRcdFx0XHRAaW52YWRlclNjYWxlXHJcblx0XHRcdFx0KSBcclxuXHJcblx0XHRcdFx0aW52YWRlci5zZXRTb3VuZCBcImRlYXRoXCIsIEByZXNvdXJjZXMuZ2V0U291bmQgU09VTkRTLmludmFkZXJEZWF0aFxyXG5cclxuXHRcdFx0XHRAaW52YWRlcnMucHVzaCBpbnZhZGVyXHJcblxyXG5cdHZpdmFMYVJlc2lzdGFuY2UgOiAtPlxyXG5cdFx0QGNhbm5vbiA9IG5ldyBDYW5ub24oXHJcblx0XHRcdEByZXNvdXJjZXMuZ2V0SW1hZ2UoQ0FOTk9OX1NQUklURSksXHJcblx0XHRcdEBnYW1lRmllbGQueCxcclxuXHRcdFx0QGdhbWVGaWVsZC55ICsgQGdhbWVGaWVsZC5oZWlnaHQgLSBDYW5ub24uU1BSSVRFX0hFSUdIVCAqIEBpbnZhZGVyU2NhbGUsXHJcblx0XHRcdEBnYW1lRmllbGRCb3VuZHMsXHJcblx0XHRcdEBpbnZhZGVyU2NhbGVcclxuXHRcdClcclxuXHJcblx0XHRAY2Fubm9uLnNldFNvdW5kcyBbIFxyXG5cdFx0XHR7IG5hbWUgOiBcImZpcmVcIiwgc291bmQgOiBAcmVzb3VyY2VzLmdldFNvdW5kIFNPVU5EUy5wcm9qZWN0aWxlIH1cclxuXHRcdFx0eyBuYW1lIDogXCJkZWF0aFwiLCBzb3VuZCA6IEByZXNvdXJjZXMuZ2V0U291bmQgU09VTkRTLmNhbm5vbkRlYXRoIH1cclxuXHRcdF1cclxuXHJcblx0c3RhcnRHYW1lIDogLT5cclxuXHRcdEBpbnZhZGVycyA9IFtdXHJcblx0XHRAcHJvamVjdGlsZXMgPSBbXVxyXG5cclxuXHRcdEBpbnZhZGUoKVxyXG5cclxuXHRcdEB2aXZhTGFSZXNpc3RhbmNlKClcclxuXHJcblx0XHRAZnJhbWUgPSAwXHJcblx0XHRAYW5pbWF0aW9uRnJhbWUgPSAwXHJcblxyXG5cdFx0Z2FtZVN0ZXAgPSA9PlxyXG5cdFx0XHRAdXBkYXRlKClcclxuXHRcdFx0QHJlbmRlcigpXHJcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZ2FtZVN0ZXAsIEBjYW52YXNcdFxyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBnYW1lU3RlcCwgQGNhbnZhc1xyXG5cdFxyXG5cdHBsYXlNdXNpYyA6IChmcmFtZSktPlxyXG5cdFx0QG11c2ljRnJhbWVDb3VudGVyID0gQG11c2ljRnJhbWVDb3VudGVyIHx8IDBcclxuXHRcdEBtdXNpY0ZyYW1lQ291bnRlcisrXHJcblxyXG5cdFx0QG11c2ljRnJhbWVEZWxheSA9IEJHU09VTkRfRlJBTUVfREVMQVkgLSBNYXRoLmZsb29yKGZyYW1lL0JHU09VTkRfU1BFRURfTVVMVElQTElFUilcclxuXHRcdGlmIEBtdXNpY0ZyYW1lQ291bnRlciA+PSBAbXVzaWNGcmFtZURlbGF5XHJcblx0XHRcdEByZXNvdXJjZXMuZ2V0U291bmQoU09VTkRTLmJnU291bmRzW0BjdXJyZW50U291bmRJZF0pLnBsYXkoKVx0XHJcblx0XHRcdEBjdXJyZW50U291bmRJZCA9IGlmIEBjdXJyZW50U291bmRJZCA+PSAzIHRoZW4gMCBlbHNlIEBjdXJyZW50U291bmRJZCArIDFcclxuXHRcdFx0QG11c2ljRnJhbWVDb3VudGVyID0gMFx0XHJcblxyXG5cdGNsZWFyR2FtZUZpZWxkIDogLT5cclxuXHRcdEBjdHguY2xlYXJSZWN0IEBnYW1lRmllbGQueCwgQGdhbWVGaWVsZC55LCBAZ2FtZUZpZWxkLndpZHRoLCBAZ2FtZUZpZWxkLmhlaWdodFxyXG5cclxuXHR1cGRhdGUgOiAtPlxyXG5cdFx0IyBUT0RPIC0gbWFrZSBpdCBwcmV0dGllclx0XHRcclxuXHJcblx0XHRAZnJhbWUrKyBcclxuXHRcdFxyXG5cdFx0QHBsYXlNdXNpYyhAZnJhbWUpXHJcblxyXG5cdFx0dW5sZXNzIEBmcmFtZSAlIFJFRFJBV19SQVRFID09IDBcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgQGdhbWVPdmVyXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdEBjbGVhckdhbWVGaWVsZCgpXHRcclxuXHRcdEBhbmltYXRpb25GcmFtZSsrIFxyXG5cclxuXHRcdGZvciBwcm9qZWN0aWxlIGluIEBwcm9qZWN0aWxlc1xyXG5cdFx0XHRwcm9qZWN0aWxlLnVwZGF0ZSgpXHRcdFxyXG5cclxuXHJcblx0XHQjVE9ETyBjcmVhdGUgY2xhc3MgJ01hc3Rlck1pbmQnIHRvIGhhbmRsZSBpbnZhZGVycyBjcm91ZCBiZWhhdmlvclxyXG5cdFx0IyBWZXJ5IHZlcnkgYmFkIGNvZGUgaGVyZS4gVmVyeSBiYWQgY29kZS5cclxuXHRcdCMgY3VycmVudE1heGltdW1JbnZhZGVyUmFuayA9IDBcclxuXHRcdCMgZm9yIGludmFkZXIgaW4gQGludmFkZXJzXHJcblx0XHQjIFx0Y3VycmVudE1heGltdW1JbnZhZGVyUmFuayA9IE1hdGgubWF4IGN1cnJlbnRNYXhpbXVtSW52YWRlclJhbmssIGludmFkZXIucmFua1xyXG5cclxuXHRcdCMgYWR2YW5jZUZsYWdzID0gW11cclxuXHRcdCMgZm9yIHJhbmtJZCBpbiBAaW52YWRlclJhbmtzXHJcblx0XHQjIFx0YWR2YW5jZUZsYWdzW3JhbmtJZF0gPSByYW5rSWQgPiBjdXJyZW50TWF4aW11bUludmFkZXJSYW5rIFxyXG5cclxuXHRcdCMgZm9yIGludmFkZXIgaW4gQGludmFkZXJzXHJcblx0XHQjIFx0YWR2YW5jZUZsYWdzW2ludmFkZXIucmFua10gPSBhZHZhbmNlRmxhZ3NbaW52YWRlci5yYW5rXSBvciBpbnZhZGVyLmNoZWNrQWR2YW5jZShpbnZhZGVyLnJhbmspXHRcclxuXHJcblx0XHQjIGZvciBmbGFnMSxpZHgxIGluIGFkdmFuY2VGbGFncy5zbGljZSgtMSlcclxuXHRcdCMgXHRjb25zb2xlLmxvZyBmbGFnMSxpZHgxXHJcblx0XHQjIFx0Zm9yIGZsYWcyLCBpZHgyIGluIGFkdmFuY2VGbGFnc1tpZHgxLi5dLnNsaWNlKC0xKVxyXG5cdFx0IyBcdFx0YWR2YW5jZUZsYWdzW2lkeDFdID0gZmFsc2UgaWYgYWR2YW5jZUZsYWdzW2lkeDJdID09IGZhbHNlXHJcblxyXG5cdFx0YWR2YW5jZUZsYWcgPSBmYWxzZVxyXG5cdFx0Zm9yIGludmFkZXIgaW4gQGludmFkZXJzXHJcblx0XHRcdGFkdmFuY2VGbGFnID0gYWR2YW5jZUZsYWcgb3IgaW52YWRlci5jaGVja0FkdmFuY2UoKVxyXG5cclxuXHRcdGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0XHRpbnZhZGVyTW92ZU91dGNvbWUgPSBpbnZhZGVyLnVwZGF0ZSBAYW5pbWF0aW9uRnJhbWUsIGFkdmFuY2VGbGFnXHJcblx0XHRcdGlmIGludmFkZXJNb3ZlT3V0Y29tZSBpbnN0YW5jZW9mIFByb2plY3RpbGVcclxuXHRcdFx0XHRAcHJvamVjdGlsZXMucHVzaCBpbnZhZGVyTW92ZU91dGNvbWVcclxuXHJcblx0XHQjIEJhZCBjb2RlIGVuZHMgaGVyZVxyXG5cclxuXHRcdEBjaGVja0NvbGxpc2lvbnMoKVx0XHJcblxyXG5cdFx0QGhhbmRsZUtleWJvYXJkSW50ZXJhY3Rpb24oKVxyXG5cclxuXHRcdEBjaGVja0Rlc3Ryb3llZE9iamVjdHMoKVxyXG5cclxuXHRcdEBjaGVja0dhbWVPdmVyKClcclxuXHJcblx0Y2hlY2tHYW1lT3ZlciA6IC0+XHJcblx0XHR1bmxlc3MgQGNhbm5vblxyXG5cdFx0XHRAZ2FtZU92ZXIgPSB0cnVlXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0aWYgaW52YWRlci55ICsgaW52YWRlci5kaXNwbGF5SGVpZ2h0ID4gQGNhbm5vbi55XHJcblx0XHRcdFx0QGdhbWVPdmVyID0gdHJ1ZVxyXG5cclxuXHRjaGVja0NvbGxpc2lvbnMgOiAtPlxyXG5cdFx0Zm9yIHByb2plY3RpbGUgaW4gQHByb2plY3RpbGVzXHJcblx0XHRcdGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0XHRcdGlmIGNoZWNrUHJvamVjdGlsZUNvbGxpc2lvbihwcm9qZWN0aWxlLGludmFkZXIpXHJcblx0XHRcdFx0XHRpbnZhZGVyLmRlc3Ryb3koKSBcclxuXHRcdFx0XHRcdHByb2plY3RpbGUuZGVzdHJveSgpXHJcblx0XHRcdHVubGVzcyBAY2Fubm9uXHJcblx0XHRcdFx0Y29udGludWVcdFx0XHJcblx0XHRcdGlmIGNoZWNrUHJvamVjdGlsZUNvbGxpc2lvbiBwcm9qZWN0aWxlLCBAY2Fubm9uXHJcblx0XHRcdFx0cHJvamVjdGlsZS5kZXN0cm95KClcclxuXHRcdFx0XHRAY2Fubm9uLmRlc3Ryb3koKVxyXG5cclxuXHRjaGVja1Byb2plY3RpbGVDb2xsaXNpb24gPSAocHJvamVjdGlsZSx0YXJnZXQpLT5cclxuXHRcdGNvbGxpc2lvbiA9IGNoZWNrQ29sbGlzaW9uKHByb2plY3RpbGUsdGFyZ2V0KVxyXG5cdFx0dW5sZXNzIGNvbGxpc2lvblxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRyZXR1cm4gZ2V0T2JqZWN0Q2xhc3MocHJvamVjdGlsZS5vd25lcikgIT0gZ2V0T2JqZWN0Q2xhc3ModGFyZ2V0KVxyXG5cclxuXHQjSG9ycmlibGUgUGllY2Ugb2YgYnVsbHNoaXQgZm9yIElFLiBUaGUgZ2FtZSB3aWxsIE5PVCBzdXBwb3J0IElFIGluIGZ1cnRoZXIgdmVyc2lvbnNcclxuXHRnZXRPYmplY3RDbGFzcyA9IChvYmopLT5cclxuICAgICAgICBpZiBvYmogYW5kIG9iai5jb25zdHJ1Y3RvciBhbmQgb2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgaWYgb2JqLmNvbnN0cnVjdG9yLm5hbWUgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHN0ciA9IG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIHN0ci5jaGFyQXQoMCkgPT0gJ1snXHJcbiAgICAgICAgICAgIFx0YXJyID0gc3RyLm1hdGNoKC9cXFtcXHcrXFxzKihcXHcrKVxcXS8pXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgXHRhcnIgPSBzdHIubWF0Y2goL2Z1bmN0aW9uXFxzKihcXHcrKS8pXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiBhcnIgYW5kIGFyci5sZW5ndGggPT0gMlxyXG4gICAgICAgICAgICAgICByZXR1cm4gYXJyWzFdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgXHRcclxuICAgICBcdFxyXG4gICBcclxuXHJcblxyXG5cdCMgVE9ETzogY3JlYXRlIGNsYXNzICdDb2xsaWRhYmxlJyB0byBoYW5kbGUgY29sbGlzaW9ucyBlYXNpZXJcclxuXHRjaGVja0NvbGxpc2lvbiA9IChhLGIpLT5cclxuXHRcdGhvcml6b250YWxDaGVjayA9IChhLnggKyBhLmRpc3BsYXlXaWR0aCA8IGIueCkgb3IgKGIueCArIGIuZGlzcGxheVdpZHRoIDwgYS54KVxyXG5cdFx0dmVydGljYWxDaGVjayA9IChhLnkgKyBhLmRpc3BsYXlIZWlnaHQgPCBiLnkpIG9yIChiLnkgKyBiLmRpc3BsYXlIZWlnaHQgPCBhLnkpXHJcblxyXG5cdFx0bm90IChob3Jpem9udGFsQ2hlY2sgb3IgdmVydGljYWxDaGVjaylcclxuXHJcblx0Y2hlY2tEZXN0cm95ZWRPYmplY3RzIDogLT5cclxuXHRcdEBwcm9qZWN0aWxlcyA9IF8uZmlsdGVyIEBwcm9qZWN0aWxlcywocHJvamVjdGlsZSktPiBub3QgcHJvamVjdGlsZS5pc0Rlc3Ryb3llZCgpXHJcblxyXG5cdFx0QGludmFkZXJzID0gXy5maWx0ZXIgQGludmFkZXJzLChpbnZhZGVyKS0+IG5vdCBpbnZhZGVyLmlzRGVzdHJveWVkKClcclxuXHJcblx0XHR1bmxlc3MgQGNhbm5vblxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGlmIEBjYW5ub24uaXNEZXN0cm95ZWQoKSBcclxuXHRcdFx0QGNhbm5vbiA9IG51bGwgXHJcblx0XHRcdEBnYW1lT3ZlciA9IHRydWVcclxuXHJcblx0aGFuZGxlS2V5Ym9hcmRJbnRlcmFjdGlvbiA6IC0+XHJcblx0XHR1bmxlc3MgQGNhbm5vblxyXG5cdFx0XHRyZXR1cm5cdFx0XHJcblx0XHRpZiBAY29udHJvbHMuaXNEb3duKEtleWJvYXJkLktFWV9DT0RFX0xFRlQpXHJcblx0XHRcdEBjYW5ub24udXBkYXRlIEBhbmltYXRpb25GcmFtZSwgQ2Fubm9uLkRJUkVDVElPTl9MRUZUXHJcblx0XHRlbHNlIGlmIEBjb250cm9scy5pc0Rvd24oS2V5Ym9hcmQuS0VZX0NPREVfUklHSFQpXHJcblx0XHRcdEBjYW5ub24udXBkYXRlIEBhbmltYXRpb25GcmFtZSwgQ2Fubm9uLkRJUkVDVElPTl9SSUdIVFxyXG5cdFx0ZWxzZSBcclxuXHRcdFx0QGNhbm5vbi51cGRhdGUgQGFuaW1hdGlvbkZyYW1lXHJcblx0XHRpZiBAY29udHJvbHMuaXNEb3duKEtleWJvYXJkLktFWV9DT0RFX1NQQUNFKVx0XHRcdFxyXG5cdFx0XHRAcHJvamVjdGlsZXMucHVzaCBAY2Fubm9uLmZpcmUgQGFuaW1hdGlvbkZyYW1lIGlmIEBjYW5ub24uaXNSZWxvYWRlZCgpXHJcblx0XHJcblx0cmVuZGVyIDogLT5cclxuXHRcdGlmIEBnYW1lT3ZlclxyXG5cdFx0XHRAY3R4LmZpbGxTdHlsZSA9IEdBTUVfT1ZFUl9DT0xPUlxyXG5cdFx0XHRAY3R4LmZpbGxSZWN0IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpDQU5WQVNfV0lEVEgpLFxyXG5cdFx0XHRcdE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpDQU5WQVNfSEVJR0hUKSw1LDVcclxuXHJcblx0XHRmb3IgcHJvamVjdGlsZSBpbiBAcHJvamVjdGlsZXNcdFx0XHRcclxuXHRcdFx0cHJvamVjdGlsZS5yZW5kZXIgQGN0eCBcclxuXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0aW52YWRlci5yZW5kZXIgQGN0eFxyXG5cclxuXHRcdGlmIEBjYW5ub25cclxuXHRcdFx0QGNhbm5vbi5yZW5kZXIgQGN0eCwgQGFuaW1hdGlvbkZyYW1lXHJcblxyXG5cdGdldEpzRmlsZURpciA9IChmaWxlbmFtZSktPlxyXG5cdFx0cmVnID0gXCIuKiN7ZmlsZW5hbWV9LipcIlxyXG5cdFx0JChcInNjcmlwdFtzcmNdXCIpLmZpbHRlcigtPnRoaXMuc3JjLm1hdGNoIG5ldyBSZWdFeHAocmVnKSkubGFzdCgpLmF0dHIoXCJzcmNcIikuc3BsaXQoJz8nKVswXS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJykrJy8nXHJcblx0XHRcclxud2luZG93LlNwYWNlSW52YWRlcnNHYW1lID0gU3BhY2VJbnZhZGVyc0dhbWVcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==