(function() {
  var Destroyable;

  Destroyable = (function() {
    function Destroyable(deathTime) {
      if (deathTime == null) {
        deathTime = 0;
      }
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

  })();

  window.Destroyable = Destroyable;

}).call(this);

(function() {
  var Projectile,
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

  window.Projectile = Projectile;

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

    SPEED_MULTIPLIER = 4;

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

    Cannon.prototype.setFireSound = function(_at_fireSound) {
      this.fireSound = _at_fireSound;
    };

    Cannon.prototype.setDeathSound = function(_at_deathSound) {
      this.deathSound = _at_deathSound;
    };

    Cannon.prototype.fire = function(animationFrame) {
      var barrelCoords, projectile;
      if (!this.isReloaded()) {
        return;
      }
      barrelCoords = this.getCannonBarrelCoords();
      projectile = new Projectile(barrelCoords.x, barrelCoords.y, this, {
        x: 0,
        y: -CANNON_CHARGE_STRENGTH
      }, this.bounds, this.scale);
      this.fireSound.play();
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
        this.deathSound.play();
        if (this.deathAnimationFrameStep-- === 0) {
          this.deathAnimationFrameStep = DEATH_ANIMATION_FRAME_DURATION;
          this.deathAnimationFrame = 1 - this.deathAnimationFrame;
          this.setSpritePos({
            y: Cannon.SPRITE_HEIGHT * (this.deathAnimationFrame + 1)
          });
          return;
        }
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

    Invader.prototype.setDeathSound = function(_at_deathSound) {
      this.deathSound = _at_deathSound;
    };

    Invader.prototype.update = function(animationFrame, advanceFlag) {
      var evilExtraterrestrialProjectile, invaderRankDelay;
      Invader.__super__.update.call(this);
      if (this.isDestroyed()) {
        return;
      }
      if (this.isDying()) {
        this.deathSound.play();
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
      this.resources = {};
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
              _this.resources[recourceData.id || recourceData.url] = img;
              return eCallback(null);
            };
            img.src = recourceData.url;
          }
          if (recourceData.type === ResourceLoader.RESOURCE_TYPE_SOUND) {
            sound = new Audio(recourceData.url);
            _this.resources[recourceData.id || recourceData.url] = sound;
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

    ResourceLoader.prototype.get = function(resId) {
      if (!_.has(this.resources, resId)) {
        throw "ResourceLoader :: Resource not loaded";
      }
      return this.resources[resId];
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
    var BG_COLOR, CANNON_SPRITE, CANVAS_HEIGHT, CANVAS_WIDTH, CLEAR_SCALE, FOOTER_HEIGHT, FREE_H_SPACE, GAME_OVER_COLOR, HEADER_HEIGHT, H_SPACE_PER_INVADER_MULTIPLIER, INVADERS_PER_RANK, INVADER_SPRITE, REDRAW_RATE, SIDE_OFFSET, SOUNDS, W_SPACE_PER_INVADER_MULTIPLIER, checkCollision, checkProjectileCollision, getJsFileDir, getObjectClass;

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
            invader = new Invader(this.resources.get(INVADER_SPRITE), type, rank, this.gameField.x + i * this.hSpacePerInvader, this.gameField.y + rank * this.wSpacePerInvader, this.gameFieldBounds, this.invaderScale);
            invader.setDeathSound(this.resources.get(SOUNDS.invaderDeath));
            _results1.push(this.invaders.push(invader));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SpaceInvadersGame.prototype.vivaLaResistance = function() {
      this.cannon = new Cannon(this.resources.get(CANNON_SPRITE), this.gameField.x, this.gameField.y + this.gameField.height - Cannon.SPRITE_HEIGHT * this.invaderScale, this.gameFieldBounds, this.invaderScale);
      this.cannon.setFireSound(this.resources.get(SOUNDS.projectile));
      return this.cannon.setDeathSound(this.resources.get(SOUNDS.cannonDeath));
    };

    SpaceInvadersGame.prototype.startGame = function() {
      var gameStep, timeForBgSound;
      this.invaders = [];
      this.projectiles = [];
      this.invade();
      this.vivaLaResistance();
      this.frame = 0;
      this.animationFrame = 0;
      timeForBgSound = 900;
      setInterval((function(_this) {
        return function() {
          _this.resources.get(SOUNDS.bgSounds[0]).play();
          return setTimeout(function() {
            _this.resources.get(SOUNDS.bgSounds[1]).play();
            return setTimeout(function() {
              _this.resources.get(SOUNDS.bgSounds[2]).play();
              return setTimeout(function() {
                return _this.resources.get(SOUNDS.bgSounds[3]).play();
              }, timeForBgSound);
            }, timeForBgSound);
          }, timeForBgSound);
        };
      })(this), timeForBgSound * 4);
      gameStep = (function(_this) {
        return function() {
          _this.update();
          _this.render();
          return window.requestAnimationFrame(gameStep, _this.canvas);
        };
      })(this);
      return window.requestAnimationFrame(gameStep, this.canvas);
    };

    SpaceInvadersGame.prototype.clearGameField = function() {
      return this.ctx.clearRect(this.gameField.x, this.gameField.y, this.gameField.width, this.gameField.height);
    };

    SpaceInvadersGame.prototype.update = function() {
      var advanceFlag, invader, invaderMoveOutcome, projectile, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      this.frame++;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRlc3Ryb3lhYmxlLmNvZmZlZSIsIlByb2plY3RpbGUuY29mZmVlIiwiU3ByaXRlLmNvZmZlZSIsIkNhbm5vbi5jb2ZmZWUiLCJJbnZhZGVyLmNvZmZlZSIsIktleWJvYXJkLmNvZmZlZSIsIlJlc291cmNlTG9hZGVyLmNvZmZlZSIsIlNwYWNlSW52YWRlcnNHYW1lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFNO0FBQ1MsSUFBQSxxQkFBQyxTQUFELEdBQUE7O1FBQUMsWUFBWTtPQUMxQjtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxTQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBRGhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FGWixDQURhO0lBQUEsQ0FBZDs7QUFBQSwwQkFLQSxhQUFBLEdBQWdCLFNBQUMsU0FBRCxHQUFBO2FBQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYyxVQURDO0lBQUEsQ0FMaEIsQ0FBQTs7QUFBQSwwQkFTQSxVQUFBLEdBQWEsU0FBQSxHQUFBO0FBRVosTUFBQSxJQUFHLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBSDtBQUNDLGVBQU8sS0FBUCxDQUREO09BQUE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFIO0FBQ0MsUUFBQSxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUEsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQUZEO09BSEE7QUFPQSxhQUFPLElBQVAsQ0FUWTtJQUFBLENBVGIsQ0FBQTs7QUFBQSwwQkFvQkEsU0FBQSxHQUFZLFNBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFVBQUQsRUFBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsQ0FBbEI7ZUFDQyxJQUFDLENBQUEsWUFBRCxHQUFnQixLQURqQjtPQUZXO0lBQUEsQ0FwQlosQ0FBQTs7QUFB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LElBQUEsR0FBSSxRQUFKLEdBQWEsSUFBcEIsQ0FBQTthQUNBLENBQUEsQ0FBRyxhQUFILENBQWdCLENBQUMsTUFBakIsQ0FBd0IsU0FBQSxHQUFBO2VBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFULENBQW1CLElBQUEsTUFBQSxDQUFPLEdBQVAsQ0FBbkIsRUFBRjtNQUFBLENBQXhCLENBQXlELENBQUMsSUFBMUQsQ0FBQSxDQUFnRSxDQUFDLElBQWpFLENBQXVFLEtBQXZFLENBQTRFLENBQUMsS0FBN0UsQ0FBb0YsR0FBcEYsQ0FBd0YsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUEzRixDQUFrRyxHQUFsRyxDQUFxRyxDQUFDLEtBQXRHLENBQTRHLENBQTVHLEVBQStHLENBQUEsQ0FBL0csQ0FBa0gsQ0FBQyxJQUFuSCxDQUF5SCxHQUF6SCxDQUFBLEdBQThILElBRmhIO0lBQUEsQ0F2VGYsQ0FBQTs7NkJBQUE7O0tBRCtCLGNBQWhDLENBQUE7O0FBQUEsRUE0VEEsTUFBTSxDQUFDLGlCQUFQLEdBQTJCLGlCQTVUM0IsQ0FBQTtBQUFBIiwiZmlsZSI6IlNwYWNlSW52YWRlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBEZXN0cm95YWJsZVxyXG5cdGNvbnN0cnVjdG9yIDogKGRlYXRoVGltZSA9IDApLT5cdFxyXG5cdFx0QGRlYXRoVGltZXIgPSBkZWF0aFRpbWVcclxuXHRcdEBfaXNEZXN0cm95ZWQgPSBmYWxzZVxyXG5cdFx0QF9pc0R5aW5nID0gZmFsc2VcclxuXHJcblx0c2V0RGVhdGhUaW1lciA6IChkZWF0aFRpbWUpLT5cdFxyXG5cdFx0QGRlYXRoVGltZXIgPSBkZWF0aFRpbWVcclxuXHJcblxyXG5cdGNoZWNrUHVsc2UgOiAtPiAjIFRydWUgd2hlbiBhbGl2ZSBhbmQgbm90IGR5aW5nIChwYWluZnVsbHkpXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdFxyXG5cdFx0aWYgQGlzRHlpbmcoKVx0XHJcblx0XHRcdEBkaWVTbG93bHkoKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRyZXR1cm4gdHJ1ZVx0XHJcblxyXG5cdGRpZVNsb3dseSA6IC0+ICAjIEFuZCBwYWluZnVsbHlcclxuXHRcdEBkZWF0aFRpbWVyLS1cdFx0XHRcdFxyXG5cdFx0aWYgQGRlYXRoVGltZXIgPD0gMFxyXG5cdFx0XHRAX2lzRGVzdHJveWVkID0gdHJ1ZVxyXG5cclxuXHRkZXN0cm95IDogLT5cdFx0XHJcblx0XHRAX2lzRHlpbmcgPSB0cnVlXHJcblx0XHRAZGllU2xvd2x5KClcclxuXHJcblx0dXBkYXRlIDogLT5cdFxyXG5cdFx0QGNoZWNrUHVsc2UoKVxyXG5cclxuXHRpc0Rlc3Ryb3llZCA6IC0+XHJcblx0XHRAX2lzRGVzdHJveWVkXHRcclxuXHJcblx0aXNEeWluZyA6IC0+ICMgT25jZSBhZ2Fpbiwgc2xvd2x5IGFuZCBwYWluZnVsbHlcclxuXHRcdEBfaXNEeWluZ1xyXG5cclxud2luZG93LkRlc3Ryb3lhYmxlID0gRGVzdHJveWFibGUiLCJjbGFzcyBQcm9qZWN0aWxlIGV4dGVuZHMgRGVzdHJveWFibGVcclxuXHJcblx0QFdJRFRIID0gM1xyXG5cdEBIRUlHSFQgPSAxNVxyXG5cclxuXHRAQ09MT1IgPSBcIiNmZmZmZmZcIlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IChAeCwgQHksIEBvd25lciwgQHZlbG9jaXR5LCBAYm91bmRzLCBAc2NhbGUpLT5cclxuXHRcdCMgVE9ETzogY3JlYXRlIGNsYXNzICdEaXNwbGF5YmxlJyB0byBoYW5kbGUgdGhlIHNjYWxlIGVhc2llciB3aXRob3V0IGNvcHlcXHBhc3RlICAgXHJcblx0XHRAZGlzcGxheVdpZHRoID0gUHJvamVjdGlsZS5XSURUSCAqIEBzY2FsZVxyXG5cdFx0QGRpc3BsYXlIZWlnaHQgPSBQcm9qZWN0aWxlLkhFSUdIVCAqIEBzY2FsZVxyXG5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0dXBkYXRlIDogKGFuaW1hdGlvbkZyYW1lKS0+XHJcblx0XHRzdXBlclxyXG5cclxuXHRcdGlmIEBpc0Rlc3Ryb3llZCgpXHJcblx0XHRcdHJldHVybiBcclxuXHJcblx0XHRAeSArPSBAdmVsb2NpdHkueVxyXG5cclxuXHRcdGlmIEBjaGVja1Byb2plY3RpbGVPdXRPZkJvdW5kcygpXHJcblx0XHRcdEBkZXN0cm95KClcclxuXHJcblx0Y2hlY2tQcm9qZWN0aWxlT3V0T2ZCb3VuZHMgOiAtPlxyXG5cdFx0Y2hlY2tZID0gKEB5IDwgQGJvdW5kcy55Lm1pbikgb3IgKEB5ICsgQGRpc3BsYXlIZWlnaHQgPiBAYm91bmRzLnkubWF4KSBcclxuXHRcdGNoZWNrWCA9IChAeCA8IEBib3VuZHMueC5taW4pIG9yIChAeCArIEBkaXNwbGF5V2lkdGggPiBAYm91bmRzLngubWF4KVxyXG5cdFx0Y2hlY2tYIG9yIGNoZWNrWVxyXG5cclxuXHRyZW5kZXIgOiAoY3R4KS0+XHJcblx0XHRpZiBAaXNEZXN0cm95ZWQoKVxyXG5cdFx0XHRyZXR1cm4gXHJcblx0XHQjIGJja3VwRmlsbFN0eWxlID0gY3R4LmZpbGxTdHlsZVxyXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IFByb2plY3RpbGUuQ09MT1JcclxuXHRcdGN0eC5maWxsUmVjdCBAeCAtIEBkaXNwbGF5V2lkdGgvMiwgQHksIEBkaXNwbGF5V2lkdGgsIEBkaXNwbGF5SGVpZ2h0XHRcclxuXHRcdCMgY3R4LmZpbGxTdHlsZSA9IGJja3VwRmlsbFN0eWxlXHJcblxyXG53aW5kb3cuUHJvamVjdGlsZSA9IFByb2plY3RpbGUiLCJjbGFzcyBTcHJpdGUgZXh0ZW5kcyBEZXN0cm95YWJsZVxyXG5cdGNvbnN0cnVjdG9yIDogKEBpbWcsIEBzcHJpdGVYID0gMCwgQHNwcml0ZVkgPSAwLCBAdyA9IDAsIEBoID0gMCwgQHggPSAwLCBAeSA9IDAsIEBkaXNwbGF5V2lkdGgsIEBkaXNwbGF5SGVpZ2h0KS0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdHNldFNwcml0ZVBvcyA6IChjb29yZHMpLT5cclxuXHRcdEBzcHJpdGVYID0gY29vcmRzLnggaWYgXy5oYXMoY29vcmRzLFwieFwiKVxyXG5cdFx0QHNwcml0ZVkgPSBjb29yZHMueSBpZiBfLmhhcyhjb29yZHMsXCJ5XCIpXHJcblxyXG5cdHJlbmRlciA6IChjdHgpLT5cdFxyXG5cdFx0Y3R4LmRyYXdJbWFnZSBAaW1nLCBAc3ByaXRlWCwgQHNwcml0ZVksIEB3LCBAaCwgQHgsIEB5LCBAZGlzcGxheVdpZHRoLCBAZGlzcGxheUhlaWdodFxyXG5cclxuXHJcblx0XHRcclxud2luZG93LlNwcml0ZSA9IFNwcml0ZSIsImNsYXNzIENhbm5vbiBleHRlbmRzIFNwcml0ZVxyXG5cdEBTUFJJVEVfV0lEVEggPSA0OVxyXG5cdEBTUFJJVEVfSEVJR0hUID0gMzBcclxuXHJcblx0QERJUkVDVElPTl9MRUZUID0gMVxyXG5cdEBESVJFQ1RJT05fUklHSFQgPSAwXHJcblxyXG5cdENBTk5PTl9ERVBMT1lNRU5UX0RFTEFZID0gNjAgIyBBbmltYXRpb24gZnJhbWVzIGJlZm9yZSB0aGUgY2Fubm9uIGFwcGVhcnNcclxuXHRTUEVFRF9NVUxUSVBMSUVSID0gNFxyXG5cclxuXHRERUFUSF9BTklNQVRJT05fRFVSQVRJT04gPSA2MFxyXG5cdERFQVRIX0FOSU1BVElPTl9GUkFNRV9EVVJBVElPTiA9IERFQVRIX0FOSU1BVElPTl9EVVJBVElPTiAvIDEwXHJcblx0REVBVEhfQU5JTUFUSU9OX09GRlNFVCA9IDMwXHJcblxyXG5cdENBTk5PTl9DSEFSR0VfU1RSRU5HVEggPSAxMFxyXG5cclxuXHRDQU5OT05fUkVDSEFSR0VfVElNRSA9IDM1ICMgRnJhbWVzIHRvIHJlY2hhcmdlIGNhbm5vbi4gT25lIGNhbm5vdCBzaW1wbHkgcGV3LXBldyBsaWtlIGEgbWFjaGluZSBndW5cclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQGltZywgQHgsIEB5LCBAYm91bmRzLCBAc2NhbGUpLT5cclxuXHRcdEBkaXNwbGF5V2lkdGggPSBDYW5ub24uU1BSSVRFX1dJRFRIICogQHNjYWxlXHJcblx0XHRAZGlzcGxheUhlaWdodCA9IENhbm5vbi5TUFJJVEVfSEVJR0hUICogQHNjYWxlXHJcblxyXG5cdFx0QGluaXQgPSBmYWxzZVxyXG5cclxuXHRcdEBjYW5ub25SZWNoYXJnZVN0ZXAgPSAwXHJcblxyXG5cdFx0QGxvYWRDYW5ub24oKVxyXG5cclxuXHRcdHN1cGVyKEBpbWcsIFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHRDYW5ub24uU1BSSVRFX1dJRFRILCBcclxuXHRcdFx0Q2Fubm9uLlNQUklURV9IRUlHSFQsXHJcblx0XHRcdEB4LFxyXG5cdFx0XHRAeSxcclxuXHRcdFx0QGRpc3BsYXlXaWR0aCxcclxuXHRcdFx0QGRpc3BsYXlIZWlnaHRcclxuXHRcdClcdFx0XHJcblxyXG5cdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWUgPSAxXHJcblx0XHRAZGVhdGhBbmltYXRpb25GcmFtZVN0ZXAgPSAwXHJcblx0XHRAc2V0RGVhdGhUaW1lciBERUFUSF9BTklNQVRJT05fRFVSQVRJT05cclxuXHJcblx0c2V0RmlyZVNvdW5kIDogKEBmaXJlU291bmQpLT5cclxuXHJcblx0c2V0RGVhdGhTb3VuZCA6IChAZGVhdGhTb3VuZCktPlxyXG5cclxuXHRmaXJlIDogKGFuaW1hdGlvbkZyYW1lKS0+XHJcblx0XHR1bmxlc3MgQGlzUmVsb2FkZWQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGJhcnJlbENvb3JkcyA9IEBnZXRDYW5ub25CYXJyZWxDb29yZHMoKVx0XHJcblx0XHRwcm9qZWN0aWxlID0gbmV3IFByb2plY3RpbGUoXHJcblx0XHRcdGJhcnJlbENvb3Jkcy54LCBcclxuXHRcdFx0YmFycmVsQ29vcmRzLnksIFxyXG5cdFx0XHRALFxyXG5cdFx0XHR7IHggOiAwLCB5IDogLUNBTk5PTl9DSEFSR0VfU1RSRU5HVEh9LCBcclxuXHRcdFx0QGJvdW5kcyxcclxuXHRcdFx0QHNjYWxlXHJcblx0XHQpXHJcblx0XHRAZmlyZVNvdW5kLnBsYXkoKVxyXG5cdFx0QGxvYWRDYW5ub24oKVx0XHRcdFx0XHJcblx0XHRyZXR1cm4gcHJvamVjdGlsZVxyXG5cclxuXHRnZXRDYW5ub25CYXJyZWxDb29yZHMgOiAtPlxyXG5cdFx0Y29vcmRzID0gXHRcclxuXHRcdFx0eCA6IEB4ICsgQGRpc3BsYXlXaWR0aC8gMlxyXG5cdFx0XHR5IDogQHlcdFx0XHJcblxyXG5cdGlzUmVsb2FkZWQgOiAtPlxyXG5cdFx0QF9pc1JlbG9hZGVkXHRcdFxyXG5cclxuXHRsb2FkQ2Fubm9uIDogLT5cclxuXHRcdEBjYW5ub25SZWNoYXJnZVN0ZXAgPSBDQU5OT05fUkVDSEFSR0VfVElNRVxyXG5cdFx0QF9pc1JlbG9hZGVkID0gZmFsc2VcclxuXHJcblx0Y2hlY2tSZWxvYWQgOiAtPlxyXG5cdFx0aWYgQGlzUmVsb2FkZWQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRAY2Fubm9uUmVjaGFyZ2VTdGVwLS1cclxuXHRcdGlmIEBjYW5ub25SZWNoYXJnZVN0ZXAgPD0gMCBcclxuXHRcdFx0QF9pc1JlbG9hZGVkID0gdHJ1ZVxyXG5cclxuXHJcblx0dXBkYXRlIDogKGFuaW1hdGlvbkZyYW1lLCBkaXJlY3Rpb24pLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdHVubGVzcyBAaW5pdFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBAaXNEZXN0cm95ZWQoKVx0XHRcdFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBAaXNEeWluZygpXHJcblx0XHRcdEBkZWF0aFNvdW5kLnBsYXkoKVx0XHRcdFxyXG5cdFx0XHRpZiBAZGVhdGhBbmltYXRpb25GcmFtZVN0ZXAtLSA9PSAwXHJcblx0XHRcdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWVTdGVwID0gREVBVEhfQU5JTUFUSU9OX0ZSQU1FX0RVUkFUSU9OXHJcblx0XHRcdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWUgPSAxIC0gQGRlYXRoQW5pbWF0aW9uRnJhbWVcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRAc2V0U3ByaXRlUG9zIFxyXG5cdFx0XHRcdFx0eSA6IENhbm5vbi5TUFJJVEVfSEVJR0hUICogKCBAZGVhdGhBbmltYXRpb25GcmFtZSArIDEgKVx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0QGNoZWNrUmVsb2FkKClcclxuXHJcblxyXG5cdFx0aWYgXy5pc1VuZGVmaW5lZChkaXJlY3Rpb24pXHJcblx0XHRcdHJldHVybiBcclxuXHJcblx0XHRAeCArPSBNYXRoLnBvdygtMSwgZGlyZWN0aW9uKSAqIFNQRUVEX01VTFRJUExJRVJcclxuXHJcblx0XHRAeCA9IEBib3VuZHMueC5taW4gaWYgQHggPCBAYm91bmRzLngubWluXHJcblx0XHRAeCA9IEBib3VuZHMueC5tYXggLSBAZGlzcGxheVdpZHRoIGlmIEB4ICsgQGRpc3BsYXlXaWR0aCA+IEBib3VuZHMueC5tYXhcclxuXHJcblx0cmVuZGVyIDogKGN0eCxhbmltYXRpb25GcmFtZSktPlxyXG5cdFx0dW5sZXNzIGFuaW1hdGlvbkZyYW1lID4gQ0FOTk9OX0RFUExPWU1FTlRfREVMQVlcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0QGluaXQgPSB0cnVlXHRcdFxyXG5cdFx0c3VwZXJcclxuXHJcblxyXG53aW5kb3cuQ2Fubm9uID0gQ2Fubm9uXHQiLCJjbGFzcyBJbnZhZGVyIGV4dGVuZHMgU3ByaXRlXHJcblx0QFNQUklURV9XSURUSCA9IDUwXHJcblx0QFNQUklURV9IRUlHSFQgPSAzNVx0XHJcblxyXG5cdEBJTlZBREVSX1RZUEVfTEFSR0UgPSAyXHJcblx0QElOVkFERVJfVFlQRV9NRURJVU0gPSAxXHJcblx0QElOVkFERVJfVFlQRV9TTUFMTCA9IDBcclxuXHJcblx0REVGQVVMVF9BTklNQVRJT05fU1RFUCA9IDBcclxuXHRBTklNQVRJT05fU1RFUF9EVVJBVElPTiA9IDEgIyBVcGRhdGVzIGV2ZXJ5IEFOSU1BVElPTl9TVEVQX0RVUkFUSU9OJ3RoIGZyYW1lXHJcblx0REVBVEhfQU5JTUFUSU9OX0RVUkFUSU9OID0gMTAgIyBGcmFtZXMgZm9yIGRlYXRoIGFuaW1hdGlvbiBkdXJhdGlvblxyXG5cclxuXHRcclxuXHJcblx0IyBJbiBmcmFtZXMuIExlc3NlciB0aGUgdGltZSwgZmFzdGVyIHRoZSBJbnZhZGVyLCB0aGVyZWZvcmUgaGFyZGVyIHRoZSBnYW1lXHJcblx0IyBXaGVuIHNldCB0byAxIGludmFkZXJzIGdvIFpvaWRiZXJnLXN0eWxlIChcXC8pKDssLjspKFxcLykgLSAofCkoOywuOykofCkgLSAoXFwvKSg7LC47KShcXC8pXHJcblx0REVGQVVMVF9JTlZBREVSX1JFU1RfVElNRSA9IDYwLzJcclxuXHJcblx0REVGQVVMVF9IX1ZFTE9DSVRZID0gSW52YWRlci5TUFJJVEVfV0lEVEggLyAxNVxyXG5cdERFRkFVTFRfV19WRUxPQ0lUWSA9IDBcclxuXHRXX1ZFTE9DSVRZX01VTFRJUExJRVIgPSAuN1xyXG5cdFZFTE9DSVRZX0lORVJUSUFfTVVMVElQTElFUiA9IC41XHJcblx0IyBWZWxvY2l0eSB7eCA6IGZsb2F0LHkgOiBmbG9hdH0sIHBpeGVscyBwZXIgYW5pbWF0aW9uIGZyYW1lIFxyXG5cclxuXHRJTlZBREVSX0RFTEFZX01VTFRJUExJRVIgID0gMVxyXG5cdElOVkFERVJfREVMQVlfTUFHSUMgPSA1XHJcblxyXG5cdElOVkFERVJfQ0FOTk9OX0NIQVJHRV9TVFJFTkdUSCA9IDJcclxuXHQjVE9ETyBtYWtlIGZpcmUgY2hhbmRlIGluZGVwZW5kZW50IG9mIGludmFkZXIgcmVzdCB0aW1lXHJcblx0SU5WQURFUl9GSVJFX0NIQU5DRSA9IC4wM1xyXG5cclxuXHRJTlZBREVSX1NQUklURV9FWFBMT1NJT05fT0ZGU0VUID0gXHJcblx0XHR4IDogMFxyXG5cdFx0eSA6IDMgKiAzNVxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IChAaW1nLCBAdHlwZSwgQHJhbmssIEB4LCBAeSwgQGJvdW5kcywgQHNjYWxlKS0+XHRcdFxyXG5cdFx0QGFuaW1hdGlvblN0ZXAgPSAwICMgMiBBbmltYXRpb24gU3RlcHNcclxuXHJcblx0XHR0eXBlcyA9IFtJbnZhZGVyLklOVkFERVJfVFlQRV9TTUFMTCxJbnZhZGVyLklOVkFERVJfVFlQRV9NRURJVU0sSW52YWRlci5JTlZBREVSX1RZUEVfTEFSR0VdXHJcblxyXG5cdFx0dW5sZXNzIHR5cGVzLmluZGV4T2YoQHR5cGUpID49IDBcclxuXHRcdFx0IyBjb25zb2xlLmxvZyB0eXBlc1xyXG5cdFx0XHRAdHlwZSA9IEludmFkZXIuSU5WQURFUl9UWVBFX1NNQUxMXHRcclxuXHJcblx0XHRAcmVzdFRpbWVMZWZ0ID0gREVGQVVMVF9JTlZBREVSX1JFU1RfVElNRVxyXG5cdFx0QHJlc3RUaW1lID0gREVGQVVMVF9JTlZBREVSX1JFU1RfVElNRVxyXG5cclxuXHRcdEB2ZWxvY2l0eSA9IHsgeCA6IERFRkFVTFRfSF9WRUxPQ0lUWSwgeSA6IDAgfSBcclxuXHJcblx0XHRAZGlzcGxheVdpZHRoID0gSW52YWRlci5TUFJJVEVfV0lEVEggKiBAc2NhbGVcclxuXHRcdEBkaXNwbGF5SGVpZ2h0ID0gSW52YWRlci5TUFJJVEVfSEVJR0hUICogQHNjYWxlXHJcblxyXG5cdFx0c3VwZXIoIFxyXG5cdFx0XHRAaW1nLCBcclxuXHRcdFx0QGFuaW1hdGlvblN0ZXAgKiBJbnZhZGVyLlNQUklURV9XSURUSCxcclxuXHRcdFx0QHR5cGUgKiBJbnZhZGVyLlNQUklURV9IRUlHSFQsXHJcblx0XHRcdEludmFkZXIuU1BSSVRFX1dJRFRILCBcclxuXHRcdFx0SW52YWRlci5TUFJJVEVfSEVJR0hULFxyXG5cdFx0XHRAeCxcclxuXHRcdFx0QHksXHJcblx0XHRcdEBkaXNwbGF5V2lkdGgsXHJcblx0XHRcdEBkaXNwbGF5SGVpZ2h0XHJcblx0XHQpXHJcblxyXG5cdFx0QHNldERlYXRoVGltZXIgREVBVEhfQU5JTUFUSU9OX0RVUkFUSU9OXHJcblxyXG5cdHNldERlYXRoU291bmQgOiAoQGRlYXRoU291bmQpLT5cdFx0XHJcblxyXG5cdHVwZGF0ZSA6IChhbmltYXRpb25GcmFtZSxhZHZhbmNlRmxhZyktPlx0XHRcclxuXHRcdHN1cGVyKClcclxuXHJcblx0XHRpZiBAaXNEZXN0cm95ZWQoKVx0XHRcdFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBAaXNEeWluZygpXHJcblx0XHRcdEBkZWF0aFNvdW5kLnBsYXkoKVxyXG5cdFx0XHRAc2V0U3ByaXRlUG9zIElOVkFERVJfU1BSSVRFX0VYUExPU0lPTl9PRkZTRVRcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0IyBCdWcgd2hlbiB1c2luZyBkZWxheSB3aGVuIHZlbG9jaXR5IGlzIGhpZ2guIE5lZWQgdG8gaGFuZGxlIGNyb3VkIGJlaGF2aW91ciBtb3JlIHByZWNpc2VseVxyXG5cdFx0aW52YWRlclJhbmtEZWxheSA9IChJTlZBREVSX0RFTEFZX01BR0lDIC0gQHJhbmspICogSU5WQURFUl9ERUxBWV9NVUxUSVBMSUVSXHRcdFx0XHJcblx0XHRpZiBhbmltYXRpb25GcmFtZSA8PSBpbnZhZGVyUmFua0RlbGF5XHJcblx0XHRcdHJldHVybiBcdFxyXG5cdFx0dW5sZXNzIEByZXN0VGltZUxlZnQtLSBpcyAwXHJcblx0XHRcdEBpZGxlID0gdHJ1ZVxyXG5cdFx0XHRyZXR1cm4gXHJcblx0XHRAaWRsZSA9IGZhbHNlXHJcblx0XHRAcmVzdFRpbWVMZWZ0ID0gQHJlc3RUaW1lXHRcclxuXHJcblx0XHRAdXBkYXRlVmVsb2NpdHkgYWR2YW5jZUZsYWdcclxuXHRcdEB4ICs9IEB2ZWxvY2l0eS54XHJcblx0XHRAeSArPSBAdmVsb2NpdHkueVxyXG5cclxuXHRcdGlmIEBpc1JlbG9hZGVkKClcclxuXHRcdFx0ZXZpbEV4dHJhdGVycmVzdHJpYWxQcm9qZWN0aWxlID0gQGZpcmUoKVxyXG5cclxuXHRcdHVubGVzcyBhbmltYXRpb25GcmFtZSAlIEFOSU1BVElPTl9TVEVQX0RVUkFUSU9OID09IDBcclxuXHRcdFx0cmV0dXJuIGV2aWxFeHRyYXRlcnJlc3RyaWFsUHJvamVjdGlsZSB8fCBudWxsXHJcblx0XHRAYW5pbWF0aW9uU3RlcCA9IDEgLSBAYW5pbWF0aW9uU3RlcFxyXG5cdFx0QHNwcml0ZVggPSBAYW5pbWF0aW9uU3RlcCAqIEludmFkZXIuU1BSSVRFX1dJRFRIXHJcblx0XHRyZXR1cm4gZXZpbEV4dHJhdGVycmVzdHJpYWxQcm9qZWN0aWxlIHx8IG51bGxcclxuXHJcblx0aXNSZWxvYWRlZCA6IC0+XHJcblx0XHRNYXRoLnJhbmRvbSgpIDwgSU5WQURFUl9GSVJFX0NIQU5DRVxyXG5cclxuXHRmaXJlIDogLT5cclxuXHRcdGJhcnJlbENvb3JkcyA9IEBnZXRDYW5ub25CYXJyZWxDb29yZHMoKVx0XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBQcm9qZWN0aWxlKFxyXG5cdFx0XHRiYXJyZWxDb29yZHMueCwgXHJcblx0XHQgXHRiYXJyZWxDb29yZHMueSwgXHJcblx0XHRcdEAsXHJcblx0XHRcdHsgeCA6IDAsIHkgOiBJTlZBREVSX0NBTk5PTl9DSEFSR0VfU1RSRU5HVEh9LCBcclxuXHRcdFx0QGJvdW5kcyxcclxuXHRcdFx0QHNjYWxlXHJcblx0XHQpXHRcclxuXHJcblx0IyBXaHkgbm90IHBvbHkgSW52YWRlciBvZiBDYW5ub24gdGhlbj9cclxuXHQjIFRPRE86IENyZWF0ZSBjbGFzcyAnU2hvb3RhJyBhYmxlIHRvIGZpcmUuIEluaGVyaXQgSW52YWRlciBhbmQgQ2Fubm9uIGZyb20gU2hvb3RhIFxyXG5cdGdldENhbm5vbkJhcnJlbENvb3JkcyA6IC0+XHJcblx0XHRjb29yZHMgPSBcdFxyXG5cdFx0XHR4IDogQHggKyBAZGlzcGxheVdpZHRoLyAyXHJcblx0XHRcdHkgOiBAeVx0XHJcblxyXG5cclxuXHJcblx0IyBJbnZhZGVycyBhcmUgcWl1dGUgZmVhcmZ1bCBjcmVhdHVyZXMuIFxyXG5cdCMgVGhleSBhZHZhbmNlIG9ubHkgaWYgb25lIG9mIHRoZW0gZGVjaWRlcyB0byBhbmQgd2FpdCBmb3IgdGhlIGxhc3Qgb25lIGluIHJhbmsgdG8gbWFrZSBzdWNoIGEgZGVjaXNpb25cclxuXHRjaGVja0FkdmFuY2UgOiAocmFuayktPlxyXG5cdFx0cmV0dXJuIChAeCArIEBkaXNwbGF5V2lkdGgqc2lnbihAdmVsb2NpdHkueCkgKyBAdmVsb2NpdHkueCA+PSBAYm91bmRzLngubWF4KSBvciBcclxuXHRcdFx0KEB4ICsgQGRpc3BsYXlXaWR0aCpzaWduKEB2ZWxvY2l0eS54KSArIEB2ZWxvY2l0eS54IDw9IEBib3VuZHMueC5taW4pXHJcblxyXG5cdHVwZGF0ZVZlbG9jaXR5IDogKGFkdmFuY2VGbGFnKS0+XHJcblx0XHRAdmVsb2NpdHkueSA9IDBcclxuXHRcdCMgaWYgYWR2YW5jZUZsYWdzW0ByYW5rXSBcclxuXHRcdGlmIGFkdmFuY2VGbGFnXHJcblx0XHRcdEB2ZWxvY2l0eS54ID0gLSBAdmVsb2NpdHkueFxyXG5cdFx0XHRAdmVsb2NpdHkueSA9IFdfVkVMT0NJVFlfTVVMVElQTElFUiAqIEBkaXNwbGF5SGVpZ2h0XHRcdFxyXG5cclxuXHRzaWduID0gKG51bSktPlxyXG5cdFx0aWYgbnVtID49IDBcclxuXHRcdFx0cmV0dXJuIDFcclxuXHRcdHJldHVybiAtMVxyXG53aW5kb3cuSW52YWRlciA9IEludmFkZXIiLCJcclxuY2xhc3MgS2V5Ym9hcmRcclxuXHRAS0VZX0NPREVfTEVGVCA9IDM3XHJcblx0QEtFWV9DT0RFX1JJR0hUID0gMzlcclxuXHRAS0VZX0NPREVfU1BBQ0UgPSAzMlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IC0+XHJcblx0XHRAa2V5c0Rvd24gPSB7fVxyXG5cdFx0QGtleXNQcmVzc2VkID0ge31cclxuXHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwia2V5ZG93blwiLCAoZXZlbnQpPT5cdFx0XHJcblx0XHRcdEBrZXlzRG93bltldmVudC5rZXlDb2RlXSA9IHRydWUgXHRcdFx0XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwia2V5dXBcIiwgKGV2ZW50KT0+XHRcdFx0XHRcdFx0XHJcblx0XHRcdGRlbGV0ZSBAa2V5c0Rvd25bZXZlbnQua2V5Q29kZV1cclxuXHJcblx0aXNEb3duIDogKGtleUNvZGUpLT5cdFxyXG5cdFx0cmV0dXJuIF8uaGFzKEBrZXlzRG93bixrZXlDb2RlKVxyXG5cclxud2luZG93LktleWJvYXJkID0gS2V5Ym9hcmQiLCJjbGFzcyBSZXNvdXJjZUxvYWRlciBleHRlbmRzIEV2ZW50RW1pdHRlcjJcclxuXHJcblx0QFJFU09VUkNFX1RZUEVfSU1HID0gXCJpbWdcIlxyXG5cclxuXHRAUkVTT1VSQ0VfVFlQRV9TT1VORCA9IFwic291bmRcIlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IChyZXNvdXJjZUxpc3QsY2FsbGJhY2spLT5cclxuXHRcdGlmIF8uaXNBcnJheShyZXNvdXJjZUxpc3QpXHJcblx0XHRcdGNoZWNrID0gdHJ1ZSBcclxuXHRcdFx0Zm9yIHJlY291cmNlRGF0YSBpbiByZXNvdXJjZUxpc3RcclxuXHRcdFx0XHRjaGVjayAqPSAoXy5pc09iamVjdChyZWNvdXJjZURhdGEpIGFuZCBfLmhhcyhyZWNvdXJjZURhdGEsJ3VybCcpIGFuZCBfLmhhcyhyZWNvdXJjZURhdGEsJ3R5cGUnKSkgXHJcblx0XHRcdHVubGVzcyBjaGVja1xyXG5cdFx0XHRcdHRocm93IFwiUmVzb3VyY2VMb2FkZXIgOjogUmVzb3VyY2VMb2FkZXIgYWNjZXB0cyBvbmx5IHZhbGlkIHJlY291cmNlIG9iamVjdHNcIlxyXG5cclxuXHRcdEByZXNvdXJjZXMgPSB7fVxyXG5cclxuXHRcdEBsb2FkUmVzb3VyY2VzIHJlc291cmNlTGlzdCwgY2FsbGJhY2tcclxuXHRcdFxyXG5cdGxvYWRSZXNvdXJjZXMgOiAocmVzb3VyY2VMaXN0LGNhbGxiYWNrPS0+KS0+XHJcblx0XHRhc3luYy5lYWNoIHJlc291cmNlTGlzdCwgKHJlY291cmNlRGF0YSxlQ2FsbGJhY2spPT5cdFx0XHRcclxuXHRcdFx0aWYgcmVjb3VyY2VEYXRhLnR5cGUgaXMgUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9JTUdcclxuXHRcdFx0XHRpbWcgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0XHRcdGltZy5vbmxvYWQgPSA9PlxyXG5cdFx0XHRcdFx0QHJlc291cmNlc1tyZWNvdXJjZURhdGEuaWQgfHwgcmVjb3VyY2VEYXRhLnVybF0gPSBpbWdcclxuXHRcdFx0XHRcdGVDYWxsYmFjayBudWxsXHJcblx0XHRcdFx0aW1nLnNyYyA9IHJlY291cmNlRGF0YS51cmxcclxuXHRcdFx0aWYgcmVjb3VyY2VEYXRhLnR5cGUgaXMgUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORFxyXG5cdFx0XHRcdHNvdW5kID0gbmV3IEF1ZGlvIHJlY291cmNlRGF0YS51cmxcclxuXHRcdFx0XHRAcmVzb3VyY2VzW3JlY291cmNlRGF0YS5pZCB8fCByZWNvdXJjZURhdGEudXJsXSA9IHNvdW5kXHJcblx0XHRcdFx0ZUNhbGxiYWNrIG51bGxcclxuXHRcdCwgKGVycik9PlxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblx0XHRcdEBlbWl0IFwicmVhZHlcIlxyXG5cclxuXHRnZXQgOiAocmVzSWQpLT5cclxuXHRcdHVubGVzcyBfLmhhcyBAcmVzb3VyY2VzLCByZXNJZFxyXG5cdFx0XHR0aHJvdyBcIlJlc291cmNlTG9hZGVyIDo6IFJlc291cmNlIG5vdCBsb2FkZWRcIlxyXG5cdFx0QHJlc291cmNlc1tyZXNJZF1cclxuXHJcbndpbmRvdy5SZXNvdXJjZUxvYWRlciA9IFJlc291cmNlTG9hZGVyXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHJcblx0XHRcclxuXHJcbiIsIlxyXG5cclxuY2xhc3MgU3BhY2VJbnZhZGVyc0dhbWUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIyXHJcblx0Q0FOVkFTX0hFSUdIVCA9IDY0MFxyXG5cdENBTlZBU19XSURUSCA9IDY0MFxyXG5cdElOVkFERVJfU1BSSVRFID0gXCJzcHJpdGVzL2ludmFkZXJzLnBuZ1wiXHJcblx0Q0FOTk9OX1NQUklURSA9IFwic3ByaXRlcy9jYW5ub24ucG5nXCJcclxuXHRCR19DT0xPUiA9IFwiIzAwMFwiXHJcblx0R0FNRV9PVkVSX0NPTE9SID0gXCIjRkYwMDAwXCJcclxuXHRSRURSQVdfUkFURSA9IDFcclxuXHJcblx0SEVBREVSX0hFSUdIVCA9IDEwMFxyXG5cdEZPT1RFUl9IRUlHSFQgPSA3NVxyXG5cdFNJREVfT0ZGU0VUID0gMjVcclxuXHJcblxyXG5cdCMgVE9ETyBTb3VuZEVtaXR0ZXIgY2xhc3MgdG8gaGFuZGxlIHNvdW5kc1xyXG5cdFNPVU5EUyA9IHtcclxuXHRcdGJnU291bmRzIDogW1wic291bmRzL2JnMS5tcDNcIiwgXCJzb3VuZHMvYmcyLm1wM1wiLCBcInNvdW5kcy9iZzMubXAzXCIsIFwic291bmRzL2JnNC5tcDNcIl1cclxuXHRcdHByb2plY3RpbGUgOiBcInNvdW5kcy9wcm9qZWN0aWxlLm1wM1wiXHJcblx0XHRpbnZhZGVyRGVhdGggOiBcInNvdW5kcy9pbnZhZGVyX2RlYXRoLm1wM1wiXHJcblx0XHRjYW5ub25EZWF0aCA6IFwic291bmRzL2Nhbm5vbl9kZWF0aC5tcDNcIlxyXG5cdH1cdFxyXG5cclxuXHRJTlZBREVSU19QRVJfUkFOSyA9IDExICMgWWVhaCwgcmFua3MuIExpa2UgaW4gcmVhbCBhcm15XHJcblxyXG5cdEZSRUVfSF9TUEFDRSA9IDQgIyBGcmVlIHNwYWNlICgxIHVuaXQgPSAxIEludmFkZXIgZGlzcGxheSB3aWR0aCkgZm9yIEludmFkZXJzIHRvIG1vdmUuIFxyXG5cclxuXHRIX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgPSAxLjRcclxuXHRXX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgPSAyXHJcblxyXG5cdENMRUFSX1NDQUxFID0gLjMgXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogKEBkZXN0KS0+XHJcblx0XHRjdXJyZW50RGlyID0gZ2V0SnNGaWxlRGlyIFwiU3BhY2VJbnZhZGVycy5qc1wiXHJcblxyXG5cdFx0QHJlc291cmNlcyA9IG5ldyBSZXNvdXJjZUxvYWRlciBbXHJcblx0XHRcdHt1cmwgOiBjdXJyZW50RGlyICsgSU5WQURFUl9TUFJJVEUsIGlkIDogSU5WQURFUl9TUFJJVEUsIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX0lNR31cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBDQU5OT05fU1BSSVRFLCBpZCA6IENBTk5PTl9TUFJJVEUsIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX0lNR31cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbMF0sIGlkIDogU09VTkRTLmJnU291bmRzWzBdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbMV0sIGlkIDogU09VTkRTLmJnU291bmRzWzFdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbMl0sIGlkIDogU09VTkRTLmJnU291bmRzWzJdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbM10sIGlkIDogU09VTkRTLmJnU291bmRzWzNdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMucHJvamVjdGlsZSwgaWQgOiBTT1VORFMucHJvamVjdGlsZSwgdHlwZSA6IFJlc291cmNlTG9hZGVyLlJFU09VUkNFX1RZUEVfU09VTkR9XHJcblx0XHRcdHt1cmwgOiBjdXJyZW50RGlyICsgU09VTkRTLmludmFkZXJEZWF0aCwgaWQgOiBTT1VORFMuaW52YWRlckRlYXRoLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuY2Fubm9uRGVhdGgsIGlkIDogU09VTkRTLmNhbm5vbkRlYXRoLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdF0sID0+XHRcdFx0XHJcblx0XHRcdEBpbml0KClcclxuXHJcblx0aW5pdCA6IC0+XHRcdFxyXG5cdFx0JChAZGVzdCkuYXBwZW5kIFwiPGNhbnZhcyBpZD0nU3BhY2VJbnZhZGVyc0dhbWUnPjwvY2FudmFzPlwiXHJcblx0XHRAaW5pdEdhbWVGaWVsZCgpXHJcblx0XHRAY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTcGFjZUludmFkZXJzR2FtZVwiKVxyXG5cdFx0QGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcblxyXG5cdFx0QGNvbnRyb2xzID0gbmV3IEtleWJvYXJkKClcclxuXHJcblx0XHRAY3R4Lmdsb2JhbEFscGhhID0gMSBcclxuXHJcblx0XHRAZ2FtZU92ZXIgPSBmYWxzZVxyXG5cclxuXHRcdEBzdGFydEdhbWUoKVxyXG5cclxuXHRpbml0R2FtZUZpZWxkIDogLT5cclxuXHJcblx0XHQjVE9ETyBEeW5hbWljIGdhbWUgZmllbGQgYmFzZWQgb24gc2NyZWVuIHdpZHRoXHJcblx0XHRAZ2FtZUZpZWxkID0gXHJcblx0XHRcdHggOiBTSURFX09GRlNFVFxyXG5cdFx0XHR5IDogSEVBREVSX0hFSUdIVFxyXG5cdFx0XHR3aWR0aCA6IENBTlZBU19XSURUSCAtIFNJREVfT0ZGU0VUICogMlxyXG5cdFx0XHRoZWlnaHQgOiBDQU5WQVNfSEVJR0hUIC0gSEVBREVSX0hFSUdIVCAtIEZPT1RFUl9IRUlHSFRcclxuXHJcblx0XHRAZ2FtZUZpZWxkQm91bmRzID1cclxuXHRcdFx0eCA6IFxyXG5cdFx0XHRcdG1pbiA6IEBnYW1lRmllbGQueFxyXG5cdFx0XHRcdG1heCA6IEBnYW1lRmllbGQueCArIEBnYW1lRmllbGQud2lkdGhcclxuXHRcdFx0eSA6IFxyXG5cdFx0XHRcdG1pbiA6IEBnYW1lRmllbGQueVxyXG5cdFx0XHRcdG1heCA6IEBnYW1lRmllbGQueSArIEBnYW1lRmllbGQuaGVpZ2h0XHRcclxuXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmF0dHIgXCJoZWlnaHRcIixDQU5WQVNfSEVJR0hUXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmF0dHIgXCJ3aWR0aFwiLENBTlZBU19XSURUSFxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MgXCJiYWNrZ3JvdW5kLWNvbG9yXCIgLCBCR19DT0xPUlxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MgXCItd2Via2l0LXRvdWNoLWNhbGxvdXRcIiAsIFwibm9uZVwiXHJcblx0XHRwcmVmaXhlcyA9IFtcIi13ZWJraXQtXCIsXCIta2h0bWwtXCIsXCItbW96LVwiLFwiLW1zLVwiLFwiXCJdXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmNzcyhcIiN7cHJlZml4fXVzZXItc2VsZWN0XCIsIFwibm9uZVwiKSBmb3IgcHJlZml4IGluIHByZWZpeGVzXHJcblxyXG5cclxuXHRpbnZhZGUgOiAtPlxyXG5cdFx0QGludmFkZXJSYW5rcyA9IFtcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfU01BTEwsXHJcblx0XHRcdEludmFkZXIuSU5WQURFUl9UWVBFX01FRElVTSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTUVESVVNLFxyXG5cdFx0XHRJbnZhZGVyLklOVkFERVJfVFlQRV9MQVJHRSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTEFSR0VcclxuXHRcdF1cdFx0XHRcclxuXHJcblx0XHRAaW52YWRlclNjYWxlID0gXHJcblx0XHRcdEBnYW1lRmllbGQud2lkdGggLyAoSU5WQURFUlNfUEVSX1JBTksgKyBGUkVFX0hfU1BBQ0UpIC8gXHJcblx0XHRcdChJbnZhZGVyLlNQUklURV9XSURUSCAqIEhfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUilcclxuXHJcblx0XHRAaFNwYWNlUGVySW52YWRlciA9IEludmFkZXIuU1BSSVRFX1dJRFRIICogSF9TUEFDRV9QRVJfSU5WQURFUl9NVUxUSVBMSUVSICogQGludmFkZXJTY2FsZVxyXG5cdFx0QHdTcGFjZVBlckludmFkZXIgPSBJbnZhZGVyLlNQUklURV9IRUlHSFQgKiBXX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgKiBAaW52YWRlclNjYWxlXHJcblxyXG5cdFx0Zm9yIHR5cGUscmFuayBpbiBAaW52YWRlclJhbmtzXHJcblx0XHRcdGZvciBpIGluIFswLi5JTlZBREVSU19QRVJfUkFOSy0xXVxyXG5cclxuXHRcdFx0XHRpbnZhZGVyID0gbmV3IEludmFkZXIoXHJcblx0XHRcdFx0XHRAcmVzb3VyY2VzLmdldChJTlZBREVSX1NQUklURSksXHJcblx0XHRcdFx0XHR0eXBlLCBcclxuXHRcdFx0XHRcdHJhbmssXHRcdFx0XHRcclxuXHRcdFx0XHRcdEBnYW1lRmllbGQueCArIGkgKiBAaFNwYWNlUGVySW52YWRlciwgXHJcblx0XHRcdFx0XHRAZ2FtZUZpZWxkLnkgKyByYW5rICogQHdTcGFjZVBlckludmFkZXIsXHJcblx0XHRcdFx0XHRAZ2FtZUZpZWxkQm91bmRzLFxyXG5cdFx0XHRcdFx0QGludmFkZXJTY2FsZVxyXG5cdFx0XHRcdCkgXHJcblxyXG5cdFx0XHRcdGludmFkZXIuc2V0RGVhdGhTb3VuZCBAcmVzb3VyY2VzLmdldCBTT1VORFMuaW52YWRlckRlYXRoXHJcblxyXG5cdFx0XHRcdEBpbnZhZGVycy5wdXNoIGludmFkZXJcclxuXHJcblx0dml2YUxhUmVzaXN0YW5jZSA6IC0+XHJcblx0XHRAY2Fubm9uID0gbmV3IENhbm5vbihcclxuXHRcdFx0QHJlc291cmNlcy5nZXQoQ0FOTk9OX1NQUklURSksXHJcblx0XHRcdEBnYW1lRmllbGQueCxcclxuXHRcdFx0QGdhbWVGaWVsZC55ICsgQGdhbWVGaWVsZC5oZWlnaHQgLSBDYW5ub24uU1BSSVRFX0hFSUdIVCAqIEBpbnZhZGVyU2NhbGUsXHJcblx0XHRcdEBnYW1lRmllbGRCb3VuZHMsXHJcblx0XHRcdEBpbnZhZGVyU2NhbGVcclxuXHRcdClcclxuXHJcblx0XHRAY2Fubm9uLnNldEZpcmVTb3VuZCBAcmVzb3VyY2VzLmdldCBTT1VORFMucHJvamVjdGlsZVxyXG5cdFx0QGNhbm5vbi5zZXREZWF0aFNvdW5kIEByZXNvdXJjZXMuZ2V0IFNPVU5EUy5jYW5ub25EZWF0aFxyXG5cclxuXHRzdGFydEdhbWUgOiAtPlxyXG5cdFx0QGludmFkZXJzID0gW11cclxuXHRcdEBwcm9qZWN0aWxlcyA9IFtdXHJcblxyXG5cdFx0QGludmFkZSgpXHJcblxyXG5cdFx0QHZpdmFMYVJlc2lzdGFuY2UoKVxyXG5cclxuXHRcdEBmcmFtZSA9IDBcclxuXHRcdEBhbmltYXRpb25GcmFtZSA9IDBcclxuXHJcblx0XHR0aW1lRm9yQmdTb3VuZCA9IDkwMFxyXG5cdFx0c2V0SW50ZXJ2YWwgPT5cclxuXHRcdFx0QHJlc291cmNlcy5nZXQoU09VTkRTLmJnU291bmRzWzBdKS5wbGF5KClcclxuXHRcdFx0c2V0VGltZW91dCA9PlxyXG5cdFx0XHRcdEByZXNvdXJjZXMuZ2V0KFNPVU5EUy5iZ1NvdW5kc1sxXSkucGxheSgpXHJcblx0XHRcdFx0c2V0VGltZW91dCA9PlxyXG5cdFx0XHRcdFx0QHJlc291cmNlcy5nZXQoU09VTkRTLmJnU291bmRzWzJdKS5wbGF5KClcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQgPT5cclxuXHRcdFx0XHRcdFx0QHJlc291cmNlcy5nZXQoU09VTkRTLmJnU291bmRzWzNdKS5wbGF5KClcclxuXHRcdFx0XHRcdCwgdGltZUZvckJnU291bmRcclxuXHRcdFx0XHQsIHRpbWVGb3JCZ1NvdW5kXHJcblx0XHRcdCwgdGltZUZvckJnU291bmRcclxuXHRcdCwgdGltZUZvckJnU291bmQqNFxyXG5cdFxyXG5cdFx0Z2FtZVN0ZXAgPSA9PlxyXG5cdFx0XHRAdXBkYXRlKClcclxuXHRcdFx0QHJlbmRlcigpXHJcblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZ2FtZVN0ZXAsIEBjYW52YXNcdFxyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBnYW1lU3RlcCwgQGNhbnZhc1xyXG5cdFx0XHRcclxuXHRjbGVhckdhbWVGaWVsZCA6IC0+XHJcblx0XHRAY3R4LmNsZWFyUmVjdCBAZ2FtZUZpZWxkLngsIEBnYW1lRmllbGQueSwgQGdhbWVGaWVsZC53aWR0aCwgQGdhbWVGaWVsZC5oZWlnaHRcclxuXHJcblx0dXBkYXRlIDogLT5cclxuXHRcdCMgVE9ETyAtIG1ha2UgaXQgcHJldHRpZXJcdFx0XHJcblxyXG5cdFx0QGZyYW1lKysgXHJcblx0XHRcclxuXHRcdHVubGVzcyBAZnJhbWUgJSBSRURSQVdfUkFURSA9PSAwXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIEBnYW1lT3ZlclxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRAY2xlYXJHYW1lRmllbGQoKVx0XHJcblx0XHRAYW5pbWF0aW9uRnJhbWUrKyBcclxuXHJcblx0XHRmb3IgcHJvamVjdGlsZSBpbiBAcHJvamVjdGlsZXNcclxuXHRcdFx0cHJvamVjdGlsZS51cGRhdGUoKVx0XHRcclxuXHJcblxyXG5cdFx0I1RPRE8gY3JlYXRlIGNsYXNzICdNYXN0ZXJNaW5kJyB0byBoYW5kbGUgaW52YWRlcnMgY3JvdWQgYmVoYXZpb3JcclxuXHRcdCMgVmVyeSB2ZXJ5IGJhZCBjb2RlIGhlcmUuIFZlcnkgYmFkIGNvZGUuXHJcblx0XHQjIGN1cnJlbnRNYXhpbXVtSW52YWRlclJhbmsgPSAwXHJcblx0XHQjIGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0IyBcdGN1cnJlbnRNYXhpbXVtSW52YWRlclJhbmsgPSBNYXRoLm1heCBjdXJyZW50TWF4aW11bUludmFkZXJSYW5rLCBpbnZhZGVyLnJhbmtcclxuXHJcblx0XHQjIGFkdmFuY2VGbGFncyA9IFtdXHJcblx0XHQjIGZvciByYW5rSWQgaW4gQGludmFkZXJSYW5rc1xyXG5cdFx0IyBcdGFkdmFuY2VGbGFnc1tyYW5rSWRdID0gcmFua0lkID4gY3VycmVudE1heGltdW1JbnZhZGVyUmFuayBcclxuXHJcblx0XHQjIGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0IyBcdGFkdmFuY2VGbGFnc1tpbnZhZGVyLnJhbmtdID0gYWR2YW5jZUZsYWdzW2ludmFkZXIucmFua10gb3IgaW52YWRlci5jaGVja0FkdmFuY2UoaW52YWRlci5yYW5rKVx0XHJcblxyXG5cdFx0IyBmb3IgZmxhZzEsaWR4MSBpbiBhZHZhbmNlRmxhZ3Muc2xpY2UoLTEpXHJcblx0XHQjIFx0Y29uc29sZS5sb2cgZmxhZzEsaWR4MVxyXG5cdFx0IyBcdGZvciBmbGFnMiwgaWR4MiBpbiBhZHZhbmNlRmxhZ3NbaWR4MS4uXS5zbGljZSgtMSlcclxuXHRcdCMgXHRcdGFkdmFuY2VGbGFnc1tpZHgxXSA9IGZhbHNlIGlmIGFkdmFuY2VGbGFnc1tpZHgyXSA9PSBmYWxzZVxyXG5cclxuXHRcdGFkdmFuY2VGbGFnID0gZmFsc2VcclxuXHRcdGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0XHRhZHZhbmNlRmxhZyA9IGFkdmFuY2VGbGFnIG9yIGludmFkZXIuY2hlY2tBZHZhbmNlKClcclxuXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0aW52YWRlck1vdmVPdXRjb21lID0gaW52YWRlci51cGRhdGUgQGFuaW1hdGlvbkZyYW1lLCBhZHZhbmNlRmxhZ1xyXG5cdFx0XHRpZiBpbnZhZGVyTW92ZU91dGNvbWUgaW5zdGFuY2VvZiBQcm9qZWN0aWxlXHJcblx0XHRcdFx0QHByb2plY3RpbGVzLnB1c2ggaW52YWRlck1vdmVPdXRjb21lXHJcblxyXG5cdFx0IyBCYWQgY29kZSBlbmRzIGhlcmVcclxuXHJcblx0XHRAY2hlY2tDb2xsaXNpb25zKClcdFxyXG5cclxuXHRcdEBoYW5kbGVLZXlib2FyZEludGVyYWN0aW9uKClcclxuXHJcblx0XHRAY2hlY2tEZXN0cm95ZWRPYmplY3RzKClcclxuXHJcblx0XHRAY2hlY2tHYW1lT3ZlcigpXHJcblxyXG5cdGNoZWNrR2FtZU92ZXIgOiAtPlxyXG5cdFx0dW5sZXNzIEBjYW5ub25cclxuXHRcdFx0QGdhbWVPdmVyID0gdHJ1ZVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0Zm9yIGludmFkZXIgaW4gQGludmFkZXJzXHJcblx0XHRcdGlmIGludmFkZXIueSArIGludmFkZXIuZGlzcGxheUhlaWdodCA+IEBjYW5ub24ueVxyXG5cdFx0XHRcdEBnYW1lT3ZlciA9IHRydWVcclxuXHJcblx0Y2hlY2tDb2xsaXNpb25zIDogLT5cclxuXHRcdGZvciBwcm9qZWN0aWxlIGluIEBwcm9qZWN0aWxlc1xyXG5cdFx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0XHRpZiBjaGVja1Byb2plY3RpbGVDb2xsaXNpb24ocHJvamVjdGlsZSxpbnZhZGVyKVxyXG5cdFx0XHRcdFx0aW52YWRlci5kZXN0cm95KCkgXHJcblx0XHRcdFx0XHRwcm9qZWN0aWxlLmRlc3Ryb3koKVxyXG5cdFx0XHR1bmxlc3MgQGNhbm5vblxyXG5cdFx0XHRcdGNvbnRpbnVlXHRcdFxyXG5cdFx0XHRpZiBjaGVja1Byb2plY3RpbGVDb2xsaXNpb24gcHJvamVjdGlsZSwgQGNhbm5vblxyXG5cdFx0XHRcdHByb2plY3RpbGUuZGVzdHJveSgpXHJcblx0XHRcdFx0QGNhbm5vbi5kZXN0cm95KClcclxuXHJcblx0Y2hlY2tQcm9qZWN0aWxlQ29sbGlzaW9uID0gKHByb2plY3RpbGUsdGFyZ2V0KS0+XHJcblx0XHRjb2xsaXNpb24gPSBjaGVja0NvbGxpc2lvbihwcm9qZWN0aWxlLHRhcmdldClcclxuXHRcdHVubGVzcyBjb2xsaXNpb25cclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0cmV0dXJuIGdldE9iamVjdENsYXNzKHByb2plY3RpbGUub3duZXIpICE9IGdldE9iamVjdENsYXNzKHRhcmdldClcclxuXHJcblx0I0hvcnJpYmxlIFBpZWNlIG9mIGJ1bGxzaGl0IGZvciBJRS4gVGhlIGdhbWUgd2lsbCBOT1Qgc3VwcG9ydCBJRSBpbiBmdXJ0aGVyIHZlcnNpb25zXHJcblx0Z2V0T2JqZWN0Q2xhc3MgPSAob2JqKS0+XHJcbiAgICAgICAgaWYgb2JqIGFuZCBvYmouY29uc3RydWN0b3IgYW5kIG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpXHJcbiAgICAgICAgICAgIGlmIG9iai5jb25zdHJ1Y3Rvci5uYW1lIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdHIgPSBvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKVxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiBzdHIuY2hhckF0KDApID09ICdbJ1xyXG4gICAgICAgICAgICBcdGFyciA9IHN0ci5tYXRjaCgvXFxbXFx3K1xccyooXFx3KylcXF0vKVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIFx0YXJyID0gc3RyLm1hdGNoKC9mdW5jdGlvblxccyooXFx3KykvKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgYXJyIGFuZCBhcnIubGVuZ3RoID09IDJcclxuICAgICAgICAgICAgICAgcmV0dXJuIGFyclsxXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgIFx0XHJcbiAgICAgXHRcclxuICAgXHJcblxyXG5cclxuXHQjIFRPRE86IGNyZWF0ZSBjbGFzcyAnQ29sbGlkYWJsZScgdG8gaGFuZGxlIGNvbGxpc2lvbnMgZWFzaWVyXHJcblx0Y2hlY2tDb2xsaXNpb24gPSAoYSxiKS0+XHJcblx0XHRob3Jpem9udGFsQ2hlY2sgPSAoYS54ICsgYS5kaXNwbGF5V2lkdGggPCBiLngpIG9yIChiLnggKyBiLmRpc3BsYXlXaWR0aCA8IGEueClcclxuXHRcdHZlcnRpY2FsQ2hlY2sgPSAoYS55ICsgYS5kaXNwbGF5SGVpZ2h0IDwgYi55KSBvciAoYi55ICsgYi5kaXNwbGF5SGVpZ2h0IDwgYS55KVxyXG5cclxuXHRcdG5vdCAoaG9yaXpvbnRhbENoZWNrIG9yIHZlcnRpY2FsQ2hlY2spXHJcblxyXG5cdGNoZWNrRGVzdHJveWVkT2JqZWN0cyA6IC0+XHJcblx0XHRAcHJvamVjdGlsZXMgPSBfLmZpbHRlciBAcHJvamVjdGlsZXMsKHByb2plY3RpbGUpLT4gbm90IHByb2plY3RpbGUuaXNEZXN0cm95ZWQoKVxyXG5cclxuXHRcdEBpbnZhZGVycyA9IF8uZmlsdGVyIEBpbnZhZGVycywoaW52YWRlciktPiBub3QgaW52YWRlci5pc0Rlc3Ryb3llZCgpXHJcblxyXG5cdFx0dW5sZXNzIEBjYW5ub25cclxuXHRcdFx0cmV0dXJuXHJcblx0XHRpZiBAY2Fubm9uLmlzRGVzdHJveWVkKCkgXHJcblx0XHRcdEBjYW5ub24gPSBudWxsIFxyXG5cdFx0XHRAZ2FtZU92ZXIgPSB0cnVlXHJcblxyXG5cdGhhbmRsZUtleWJvYXJkSW50ZXJhY3Rpb24gOiAtPlxyXG5cdFx0dW5sZXNzIEBjYW5ub25cclxuXHRcdFx0cmV0dXJuXHRcdFxyXG5cdFx0aWYgQGNvbnRyb2xzLmlzRG93bihLZXlib2FyZC5LRVlfQ09ERV9MRUZUKVxyXG5cdFx0XHRAY2Fubm9uLnVwZGF0ZSBAYW5pbWF0aW9uRnJhbWUsIENhbm5vbi5ESVJFQ1RJT05fTEVGVFxyXG5cdFx0ZWxzZSBpZiBAY29udHJvbHMuaXNEb3duKEtleWJvYXJkLktFWV9DT0RFX1JJR0hUKVxyXG5cdFx0XHRAY2Fubm9uLnVwZGF0ZSBAYW5pbWF0aW9uRnJhbWUsIENhbm5vbi5ESVJFQ1RJT05fUklHSFRcclxuXHRcdGVsc2UgXHJcblx0XHRcdEBjYW5ub24udXBkYXRlIEBhbmltYXRpb25GcmFtZVxyXG5cdFx0aWYgQGNvbnRyb2xzLmlzRG93bihLZXlib2FyZC5LRVlfQ09ERV9TUEFDRSlcdFx0XHRcclxuXHRcdFx0QHByb2plY3RpbGVzLnB1c2ggQGNhbm5vbi5maXJlIEBhbmltYXRpb25GcmFtZSBpZiBAY2Fubm9uLmlzUmVsb2FkZWQoKVxyXG5cdFxyXG5cdHJlbmRlciA6IC0+XHJcblx0XHRpZiBAZ2FtZU92ZXJcclxuXHRcdFx0QGN0eC5maWxsU3R5bGUgPSBHQU1FX09WRVJfQ09MT1JcclxuXHRcdFx0QGN0eC5maWxsUmVjdCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqQ0FOVkFTX1dJRFRIKSxcclxuXHRcdFx0XHRNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqQ0FOVkFTX0hFSUdIVCksNSw1XHJcblxyXG5cdFx0Zm9yIHByb2plY3RpbGUgaW4gQHByb2plY3RpbGVzXHRcdFx0XHJcblx0XHRcdHByb2plY3RpbGUucmVuZGVyIEBjdHggXHJcblxyXG5cdFx0Zm9yIGludmFkZXIgaW4gQGludmFkZXJzXHJcblx0XHRcdGludmFkZXIucmVuZGVyIEBjdHhcclxuXHJcblx0XHRpZiBAY2Fubm9uXHJcblx0XHRcdEBjYW5ub24ucmVuZGVyIEBjdHgsIEBhbmltYXRpb25GcmFtZVxyXG5cclxuXHRnZXRKc0ZpbGVEaXIgPSAoZmlsZW5hbWUpLT5cclxuXHRcdHJlZyA9IFwiLioje2ZpbGVuYW1lfS4qXCJcclxuXHRcdCQoXCJzY3JpcHRbc3JjXVwiKS5maWx0ZXIoLT50aGlzLnNyYy5tYXRjaCBuZXcgUmVnRXhwKHJlZykpLmxhc3QoKS5hdHRyKFwic3JjXCIpLnNwbGl0KCc/JylbMF0uc3BsaXQoJy8nKS5zbGljZSgwLCAtMSkuam9pbignLycpKycvJ1xyXG5cdFx0XHJcbndpbmRvdy5TcGFjZUludmFkZXJzR2FtZSA9IFNwYWNlSW52YWRlcnNHYW1lXHJcblxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=