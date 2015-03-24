(function() {
  var TextField;

  TextField = (function() {
    var backupFontData, restoreFontData;

    function TextField(_at_text, _at_font, _at_fontSize, _at_color, _at_posX, _at_posY) {
      this.text = _at_text;
      this.font = _at_font;
      this.fontSize = _at_fontSize;
      this.color = _at_color;
      this.posX = _at_posX;
      this.posY = _at_posY;
    }

    TextField.prototype.render = function(ctx) {
      var bckpFontData;
      bckpFontData = backupFontData(ctx);
      ctx.font = this.fontSize + " " + this.font;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.posX, this.posY);
      return restoreFontData(ctx, bckpFontData);
    };

    backupFontData = function(ctx) {
      var data;
      return data = {
        font: ctx.font,
        fillStyle: ctx.fillStyle
      };
    };

    restoreFontData = function(ctx, backupData) {
      return _.merge(ctx, backupData);
    };

    return TextField;

  })();

  window.TextField = TextField;

}).call(this);

(function() {
  var SpaceInvadersInterface;

  SpaceInvadersInterface = (function() {
    function SpaceInvadersInterface(_at_font, _at_fontSize, _at_color) {
      this.font = _at_font;
      this.fontSize = _at_fontSize;
      this.color = _at_color;
      this.score = 0;
      this.textFields = [new TextField("SCORE<1> HI-SCORE SCORE<2>", this.font, this.fontSize, this.color, 0, 100)];
    }

    SpaceInvadersInterface.prototype.update = function(newScore) {
      return this.score = newScore;
    };

    SpaceInvadersInterface.prototype.render = function(ctx) {
      var textField, _i, _len, _ref, _results;
      _ref = this.textFields;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        textField = _ref[_i];
        _results.push(textField.render(ctx));
      }
      return _results;
    };

    return SpaceInvadersInterface;

  })();

  window.SpaceInvadersInterface = SpaceInvadersInterface;

}).call(this);

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
    var BGSOUND_FRAME_DELAY, BGSOUND_SPEED_MULTIPLIER, BG_COLOR, CANNON_SPRITE, CANVAS_HEIGHT, CANVAS_WIDTH, CLEAR_SCALE, FONT, FONT_COLOR, FONT_SIZE, FOOTER_HEIGHT, FREE_H_SPACE, GAME_OVER_COLOR, HEADER_HEIGHT, H_SPACE_PER_INVADER_MULTIPLIER, INVADERS_PER_RANK, INVADER_SPRITE, REDRAW_RATE, SIDE_OFFSET, SOUNDS, W_SPACE_PER_INVADER_MULTIPLIER, checkCollision, checkProjectileCollision, getJsFileDir, getObjectClass;

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

    FONT = "SpaceInvaders";

    FONT_SIZE = "16px";

    FONT_COLOR = "#ffffff";

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
      this["interface"] = new SpaceInvadersInterface(FONT, FONT_SIZE, FONT_COLOR);
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
      return this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
      this.clearGameField();
      this["interface"].render(this.ctx);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRleHRGaWVsZC5jb2ZmZWUiLCJTcGFjZUludmFkZXJzSW50ZXJmYWNlLmNvZmZlZSIsIlNvdW5keS5jb2ZmZWUiLCJEZXN0cm95YWJsZS5jb2ZmZWUiLCJQcm9qZWN0aWxlLmNvZmZlZSIsIlNwcml0ZS5jb2ZmZWUiLCJDYW5ub24uY29mZmVlIiwiSW52YWRlci5jb2ZmZWUiLCJLZXlib2FyZC5jb2ZmZWUiLCJSZXNvdXJjZUxvYWRlci5jb2ZmZWUiLCJTcGFjZUludmFkZXJzR2FtZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFNBQUE7O0FBQUEsRUFBTTtBQUNMLFFBQUEsK0JBQUE7O0FBQWMsSUFBQSxtQkFBQyxRQUFELEVBQVEsUUFBUixFQUFlLFlBQWYsRUFBMEIsU0FBMUIsRUFBa0MsUUFBbEMsRUFBeUMsUUFBekMsR0FBQTtBQUFnRCxNQUEvQyxJQUFDLENBQUEsT0FBRCxRQUErQyxDQUFBO0FBQUEsTUFBeEMsSUFBQyxDQUFBLE9BQUQsUUFBd0MsQ0FBQTtBQUFBLE1BQWpDLElBQUMsQ0FBQSxXQUFELFlBQWlDLENBQUE7QUFBQSxNQUF0QixJQUFDLENBQUEsUUFBRCxTQUFzQixDQUFBO0FBQUEsTUFBZCxJQUFDLENBQUEsT0FBRCxRQUFjLENBQUE7QUFBQSxNQUFQLElBQUMsQ0FBQSxPQUFELFFBQU8sQ0FBaEQ7SUFBQSxDQUFkOztBQUFBLHdCQUVBLE1BQUEsR0FBUyxTQUFDLEdBQUQsR0FBQTtBQUNSLFVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLGNBQUEsQ0FBZSxHQUFmLENBQWYsQ0FBQTtBQUFBLE1BRUEsR0FBRyxDQUFDLElBQUosR0FBYyxJQUFDLENBQUEsUUFBRixHQUFXLEdBQVgsR0FBYyxJQUFDLENBQUEsSUFGNUIsQ0FBQTtBQUFBLE1BR0EsR0FBRyxDQUFDLFNBQUosR0FBZ0IsSUFBQyxDQUFBLEtBSGpCLENBQUE7QUFBQSxNQUtBLEdBQUcsQ0FBQyxRQUFKLENBQWEsSUFBQyxD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QUF1RSxLQUF2RSxDQUE0RSxDQUFDLEtBQTdFLENBQW9GLEdBQXBGLENBQXdGLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBM0YsQ0FBa0csR0FBbEcsQ0FBcUcsQ0FBQyxLQUF0RyxDQUE0RyxDQUE1RyxFQUErRyxDQUFBLENBQS9HLENBQWtILENBQUMsSUFBbkgsQ0FBeUgsR0FBekgsQ0FBQSxHQUE4SCxJQUZoSDtJQUFBLENBeFVmLENBQUE7OzZCQUFBOztLQUQrQixjQUFoQyxDQUFBOztBQUFBLEVBNlVBLE1BQU0sQ0FBQyxpQkFBUCxHQUEyQixpQkE3VTNCLENBQUE7QUFBQSIsImZpbGUiOiJTcGFjZUludmFkZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgVGV4dEZpZWxkXHJcblx0Y29uc3RydWN0b3IgOiAoQHRleHQsIEBmb250LCBAZm9udFNpemUsIEBjb2xvciwgQHBvc1gsIEBwb3NZKS0+XHJcblxyXG5cdHJlbmRlciA6IChjdHgpLT5cclxuXHRcdGJja3BGb250RGF0YSA9IGJhY2t1cEZvbnREYXRhKGN0eClcclxuXHJcblx0XHRjdHguZm9udCA9IFwiI3tAZm9udFNpemV9ICN7QGZvbnR9XCJcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBAY29sb3JcclxuXHJcblx0XHRjdHguZmlsbFRleHQgQHRleHQsIEBwb3NYLCBAcG9zWVxyXG5cclxuXHRcdHJlc3RvcmVGb250RGF0YShjdHgsIGJja3BGb250RGF0YSlcclxuXHJcblx0YmFja3VwRm9udERhdGEgPSAoY3R4KS0+XHJcblx0XHRkYXRhID0gXHJcblx0XHRcdGZvbnQgOiBjdHguZm9udFxyXG5cdFx0XHRmaWxsU3R5bGUgOiBjdHguZmlsbFN0eWxlXHRcclxuXHJcblx0cmVzdG9yZUZvbnREYXRhID0gKGN0eCwgYmFja3VwRGF0YSktPlxyXG5cdFx0Xy5tZXJnZShjdHgsIGJhY2t1cERhdGEpXHJcblxyXG53aW5kb3cuVGV4dEZpZWxkID0gVGV4dEZpZWxkIiwiY2xhc3MgU3BhY2VJbnZhZGVyc0ludGVyZmFjZVxyXG5cdGNvbnN0cnVjdG9yIDogKEBmb250LCBAZm9udFNpemUsIEBjb2xvciktPlxyXG5cdFx0QHNjb3JlID0gMFxyXG5cclxuXHRcdEB0ZXh0RmllbGRzID0gW1xyXG5cdFx0XHRuZXcgVGV4dEZpZWxkKFwiU0NPUkU8MT4gSEktU0NPUkUgU0NPUkU8Mj5cIiwgQGZvbnQsIEBmb250U2l6ZSwgQGNvbG9yLCAwLCAxMDApXHJcblx0XHRdXHJcblxyXG5cdHVwZGF0ZSA6IChuZXdTY29yZSktPlxyXG5cdFx0QHNjb3JlID0gbmV3U2NvcmVcdFxyXG5cclxuXHRyZW5kZXIgOiAoY3R4KS0+XHJcblx0XHRmb3IgdGV4dEZpZWxkIGluIEB0ZXh0RmllbGRzXHJcblx0XHRcdHRleHRGaWVsZC5yZW5kZXIoY3R4KVxyXG5cclxud2luZG93LlNwYWNlSW52YWRlcnNJbnRlcmZhY2UgPSBTcGFjZUludmFkZXJzSW50ZXJmYWNlXHRcclxuXHQiLCJjbGFzcyBTb3VuZHlcclxuXHRjb25zdHJ1Y3RvciA6IC0+XHJcblx0XHRAc291bmRzID0ge31cclxuXHJcblx0c2V0U291bmQgOiAobmFtZSwgc291bmQpLT5cclxuXHRcdEBzb3VuZHNbbmFtZV0gPSBzb3VuZFxyXG5cclxuXHRzZXRTb3VuZHMgOiAoc291bmRzRGF0YSktPlxyXG5cdFx0Xy5lYWNoIHNvdW5kc0RhdGEsIChzb3VuZERhdGEpPT5cclxuXHRcdFx0QHNldFNvdW5kIHNvdW5kRGF0YS5uYW1lLCBzb3VuZERhdGEuc291bmRcdFxyXG5cclxuXHRnZXRTb3VuZENvcHkgOiAobmFtZSktPlxyXG5cdFx0QHNvdW5kc1tuYW1lXS5jbG9uZU5vZGUoKVx0XHRcclxuXHJcblx0cGxheVNvdW5kIDogKG5hbWUpLT5cclxuXHRcdEBzb3VuZHNbbmFtZV0ucGxheSgpXHJcblxyXG5cdHN0b3BTb3VuZCA6IChuYW1lKS0+XHJcblx0XHRAc291bmRzW25hbWVdLnBhdXNlKClcdFx0XHRcclxuXHJcblxyXG53aW5kb3cuU291bmR5ID0gU291bmR5XHRcdCIsImNsYXNzIERlc3Ryb3lhYmxlIGV4dGVuZHMgU291bmR5XHJcblx0Y29uc3RydWN0b3IgOiAoZGVhdGhUaW1lID0gMCktPlx0XHJcblx0XHRzdXBlcigpXHJcblx0XHRAZGVhdGhUaW1lciA9IGRlYXRoVGltZVxyXG5cdFx0QF9pc0Rlc3Ryb3llZCA9IGZhbHNlXHJcblx0XHRAX2lzRHlpbmcgPSBmYWxzZVxyXG5cclxuXHRzZXREZWF0aFRpbWVyIDogKGRlYXRoVGltZSktPlx0XHJcblx0XHRAZGVhdGhUaW1lciA9IGRlYXRoVGltZVxyXG5cclxuXHJcblx0Y2hlY2tQdWxzZSA6IC0+ICMgVHJ1ZSB3aGVuIGFsaXZlIGFuZCBub3QgZHlpbmcgKHBhaW5mdWxseSlcclxuXHJcblx0XHRpZiBAaXNEZXN0cm95ZWQoKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0XHJcblx0XHRpZiBAaXNEeWluZygpXHRcclxuXHRcdFx0QGRpZVNsb3dseSgpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHRcclxuXHJcblx0ZGllU2xvd2x5IDogLT4gICMgQW5kIHBhaW5mdWxseVxyXG5cdFx0QGRlYXRoVGltZXItLVx0XHRcdFx0XHJcblx0XHRpZiBAZGVhdGhUaW1lciA8PSAwXHJcblx0XHRcdEBfaXNEZXN0cm95ZWQgPSB0cnVlXHJcblxyXG5cdGRlc3Ryb3kgOiAtPlx0XHRcclxuXHRcdEBfaXNEeWluZyA9IHRydWVcclxuXHRcdEBkaWVTbG93bHkoKVxyXG5cclxuXHR1cGRhdGUgOiAtPlx0XHJcblx0XHRAY2hlY2tQdWxzZSgpXHJcblxyXG5cdGlzRGVzdHJveWVkIDogLT5cclxuXHRcdEBfaXNEZXN0cm95ZWRcdFxyXG5cclxuXHRpc0R5aW5nIDogLT4gIyBPbmNlIGFnYWluLCBzbG93bHkgYW5kIHBhaW5mdWxseVxyXG5cdFx0QF9pc0R5aW5nXHJcblxyXG53aW5kb3cuRGVzdHJveWFibGUgPSBEZXN0cm95YWJsZSIsImNsYXNzIFByb2plY3RpbGUgZXh0ZW5kcyBEZXN0cm95YWJsZVxyXG5cclxuXHRAV0lEVEggPSAzXHJcblx0QEhFSUdIVCA9IDE1XHJcblxyXG5cdEBDT0xPUiA9IFwiI2ZmZmZmZlwiXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogKEB4LCBAeSwgQG93bmVyLCBAdmVsb2NpdHksIEBib3VuZHMsIEBzY2FsZSktPlxyXG5cdFx0IyBUT0RPOiBjcmVhdGUgY2xhc3MgJ0Rpc3BsYXlibGUnIHRvIGhhbmRsZSB0aGUgc2NhbGUgZWFzaWVyIHdpdGhvdXQgY29weVxccGFzdGUgICBcclxuXHRcdEBkaXNwbGF5V2lkdGggPSBQcm9qZWN0aWxlLldJRFRIICogQHNjYWxlXHJcblx0XHRAZGlzcGxheUhlaWdodCA9IFByb2plY3RpbGUuSEVJR0hUICogQHNjYWxlXHJcblxyXG5cdFx0c3VwZXIoKVxyXG5cclxuXHR1cGRhdGUgOiAoYW5pbWF0aW9uRnJhbWUpLT5cclxuXHRcdHN1cGVyXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdEB5ICs9IEB2ZWxvY2l0eS55XHJcblxyXG5cdFx0aWYgQGNoZWNrUHJvamVjdGlsZU91dE9mQm91bmRzKClcclxuXHRcdFx0QGRlc3Ryb3koKVxyXG5cclxuXHRjaGVja1Byb2plY3RpbGVPdXRPZkJvdW5kcyA6IC0+XHJcblx0XHRjaGVja1kgPSAoQHkgPCBAYm91bmRzLnkubWluKSBvciAoQHkgKyBAZGlzcGxheUhlaWdodCA+IEBib3VuZHMueS5tYXgpIFxyXG5cdFx0Y2hlY2tYID0gKEB4IDwgQGJvdW5kcy54Lm1pbikgb3IgKEB4ICsgQGRpc3BsYXlXaWR0aCA+IEBib3VuZHMueC5tYXgpXHJcblx0XHRjaGVja1ggb3IgY2hlY2tZXHJcblxyXG5cdHJlbmRlciA6IChjdHgpLT5cclxuXHRcdGlmIEBpc0Rlc3Ryb3llZCgpXHJcblx0XHRcdHJldHVybiBcclxuXHRcdCMgYmNrdXBGaWxsU3R5bGUgPSBjdHguZmlsbFN0eWxlXHJcblx0XHRjdHguZmlsbFN0eWxlID0gUHJvamVjdGlsZS5DT0xPUlxyXG5cdFx0Y3R4LmZpbGxSZWN0IEB4IC0gQGRpc3BsYXlXaWR0aC8yLCBAeSwgQGRpc3BsYXlXaWR0aCwgQGRpc3BsYXlIZWlnaHRcdFxyXG5cdFx0IyBjdHguZmlsbFN0eWxlID0gYmNrdXBGaWxsU3R5bGVcclxuXHJcbmNsYXNzIENhbm5vblByb2plY3RpbGUgZXh0ZW5kcyBQcm9qZWN0aWxlXHJcblx0dXBkYXRlIDogLT5cclxuXHRcdHN1cGVyIFxyXG5cdFx0QHBsYXlTb3VuZCBcImZpcmVcIlxyXG5cdGRlc3Ryb3kgOiAtPlxyXG5cdFx0c3VwZXJcclxuXHRcdEBzdG9wU291bmQgXCJmaXJlXCJcclxuXHJcbndpbmRvdy5Qcm9qZWN0aWxlID0gUHJvamVjdGlsZVxyXG53aW5kb3cuQ2Fubm9uUHJvamVjdGlsZSA9IENhbm5vblByb2plY3RpbGUiLCJjbGFzcyBTcHJpdGUgZXh0ZW5kcyBEZXN0cm95YWJsZVxyXG5cdGNvbnN0cnVjdG9yIDogKEBpbWcsIEBzcHJpdGVYID0gMCwgQHNwcml0ZVkgPSAwLCBAdyA9IDAsIEBoID0gMCwgQHggPSAwLCBAeSA9IDAsIEBkaXNwbGF5V2lkdGgsIEBkaXNwbGF5SGVpZ2h0KS0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdHNldFNwcml0ZVBvcyA6IChjb29yZHMpLT5cclxuXHRcdEBzcHJpdGVYID0gY29vcmRzLnggaWYgXy5oYXMoY29vcmRzLFwieFwiKVxyXG5cdFx0QHNwcml0ZVkgPSBjb29yZHMueSBpZiBfLmhhcyhjb29yZHMsXCJ5XCIpXHJcblxyXG5cdHJlbmRlciA6IChjdHgpLT5cdFxyXG5cdFx0Y3R4LmRyYXdJbWFnZSBAaW1nLCBAc3ByaXRlWCwgQHNwcml0ZVksIEB3LCBAaCwgQHgsIEB5LCBAZGlzcGxheVdpZHRoLCBAZGlzcGxheUhlaWdodFxyXG5cclxuXHJcblx0XHRcclxud2luZG93LlNwcml0ZSA9IFNwcml0ZSIsImNsYXNzIENhbm5vbiBleHRlbmRzIFNwcml0ZVxyXG5cdEBTUFJJVEVfV0lEVEggPSA0OVxyXG5cdEBTUFJJVEVfSEVJR0hUID0gMzBcclxuXHJcblx0QERJUkVDVElPTl9MRUZUID0gMVxyXG5cdEBESVJFQ1RJT05fUklHSFQgPSAwXHJcblxyXG5cdENBTk5PTl9ERVBMT1lNRU5UX0RFTEFZID0gNjAgIyBBbmltYXRpb24gZnJhbWVzIGJlZm9yZSB0aGUgY2Fubm9uIGFwcGVhcnNcclxuXHRTUEVFRF9NVUxUSVBMSUVSID0gM1xyXG5cclxuXHRERUFUSF9BTklNQVRJT05fRFVSQVRJT04gPSA2MFxyXG5cdERFQVRIX0FOSU1BVElPTl9GUkFNRV9EVVJBVElPTiA9IERFQVRIX0FOSU1BVElPTl9EVVJBVElPTiAvIDEwXHJcblx0REVBVEhfQU5JTUFUSU9OX09GRlNFVCA9IDMwXHJcblxyXG5cdENBTk5PTl9DSEFSR0VfU1RSRU5HVEggPSAxMFxyXG5cclxuXHRDQU5OT05fUkVDSEFSR0VfVElNRSA9IDM1ICMgRnJhbWVzIHRvIHJlY2hhcmdlIGNhbm5vbi4gT25lIGNhbm5vdCBzaW1wbHkgcGV3LXBldyBsaWtlIGEgbWFjaGluZSBndW5cclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQGltZywgQHgsIEB5LCBAYm91bmRzLCBAc2NhbGUpLT5cclxuXHRcdEBkaXNwbGF5V2lkdGggPSBDYW5ub24uU1BSSVRFX1dJRFRIICogQHNjYWxlXHJcblx0XHRAZGlzcGxheUhlaWdodCA9IENhbm5vbi5TUFJJVEVfSEVJR0hUICogQHNjYWxlXHJcblxyXG5cdFx0QGluaXQgPSBmYWxzZVxyXG5cclxuXHRcdEBjYW5ub25SZWNoYXJnZVN0ZXAgPSAwXHJcblxyXG5cdFx0QGxvYWRDYW5ub24oKVxyXG5cclxuXHRcdHN1cGVyKEBpbWcsIFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHRDYW5ub24uU1BSSVRFX1dJRFRILCBcclxuXHRcdFx0Q2Fubm9uLlNQUklURV9IRUlHSFQsXHJcblx0XHRcdEB4LFxyXG5cdFx0XHRAeSxcclxuXHRcdFx0QGRpc3BsYXlXaWR0aCxcclxuXHRcdFx0QGRpc3BsYXlIZWlnaHRcclxuXHRcdClcdFx0XHJcblxyXG5cdFx0QGRlYXRoQW5pbWF0aW9uRnJhbWUgPSAxXHJcblx0XHRAZGVhdGhBbmltYXRpb25GcmFtZVN0ZXAgPSAwXHJcblx0XHRAc2V0RGVhdGhUaW1lciBERUFUSF9BTklNQVRJT05fRFVSQVRJT05cclxuXHJcblx0ZmlyZSA6IChhbmltYXRpb25GcmFtZSktPlxyXG5cdFx0dW5sZXNzIEBpc1JlbG9hZGVkKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRiYXJyZWxDb29yZHMgPSBAZ2V0Q2Fubm9uQmFycmVsQ29vcmRzKClcdFxyXG5cdFx0cHJvamVjdGlsZSA9IG5ldyBDYW5ub25Qcm9qZWN0aWxlKFxyXG5cdFx0XHRiYXJyZWxDb29yZHMueCwgXHJcblx0XHRcdGJhcnJlbENvb3Jkcy55LCBcclxuXHRcdFx0QCxcclxuXHRcdFx0eyB4IDogMCwgeSA6IC1DQU5OT05fQ0hBUkdFX1NUUkVOR1RIfSwgXHJcblx0XHRcdEBib3VuZHMsXHJcblx0XHRcdEBzY2FsZVxyXG5cdFx0KVxyXG5cdFx0XHJcblx0XHRwcm9qZWN0aWxlLnNldFNvdW5kKFwiZmlyZVwiLEBnZXRTb3VuZENvcHkoXCJmaXJlXCIpKVxyXG5cdFx0QGxvYWRDYW5ub24oKVx0XHRcdFx0XHJcblx0XHRyZXR1cm4gcHJvamVjdGlsZVxyXG5cclxuXHRnZXRDYW5ub25CYXJyZWxDb29yZHMgOiAtPlxyXG5cdFx0Y29vcmRzID0gXHRcclxuXHRcdFx0eCA6IEB4ICsgQGRpc3BsYXlXaWR0aC8gMlxyXG5cdFx0XHR5IDogQHlcdFx0XHJcblxyXG5cdGlzUmVsb2FkZWQgOiAtPlxyXG5cdFx0QF9pc1JlbG9hZGVkXHRcdFxyXG5cclxuXHRsb2FkQ2Fubm9uIDogLT5cclxuXHRcdEBjYW5ub25SZWNoYXJnZVN0ZXAgPSBDQU5OT05fUkVDSEFSR0VfVElNRVxyXG5cdFx0QF9pc1JlbG9hZGVkID0gZmFsc2VcclxuXHJcblx0Y2hlY2tSZWxvYWQgOiAtPlxyXG5cdFx0aWYgQGlzUmVsb2FkZWQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRAY2Fubm9uUmVjaGFyZ2VTdGVwLS1cclxuXHRcdGlmIEBjYW5ub25SZWNoYXJnZVN0ZXAgPD0gMCBcclxuXHRcdFx0QF9pc1JlbG9hZGVkID0gdHJ1ZVxyXG5cclxuXHJcblx0dXBkYXRlIDogKGFuaW1hdGlvbkZyYW1lLCBkaXJlY3Rpb24pLT5cclxuXHRcdHN1cGVyKClcclxuXHRcdHVubGVzcyBAaW5pdFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBAaXNEZXN0cm95ZWQoKVx0XHRcdFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBAaXNEeWluZygpXHJcblx0XHRcdEBwbGF5U291bmQgXCJkZWF0aFwiXHJcblx0XHRcdGlmIEBkZWF0aEFuaW1hdGlvbkZyYW1lU3RlcC0tID09IDBcclxuXHRcdFx0XHRAZGVhdGhBbmltYXRpb25GcmFtZVN0ZXAgPSBERUFUSF9BTklNQVRJT05fRlJBTUVfRFVSQVRJT05cclxuXHRcdFx0XHRAZGVhdGhBbmltYXRpb25GcmFtZSA9IDEgLSBAZGVhdGhBbmltYXRpb25GcmFtZVx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdEBzZXRTcHJpdGVQb3MgXHJcblx0XHRcdFx0XHR5IDogQ2Fubm9uLlNQUklURV9IRUlHSFQgKiAoIEBkZWF0aEFuaW1hdGlvbkZyYW1lICsgMSApXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0cmV0dXJuXHRcdFxyXG5cclxuXHRcdEBjaGVja1JlbG9hZCgpXHJcblxyXG5cclxuXHRcdGlmIF8uaXNVbmRlZmluZWQoZGlyZWN0aW9uKVxyXG5cdFx0XHRyZXR1cm4gXHJcblxyXG5cdFx0QHggKz0gTWF0aC5wb3coLTEsIGRpcmVjdGlvbikgKiBTUEVFRF9NVUxUSVBMSUVSXHJcblxyXG5cdFx0QHggPSBAYm91bmRzLngubWluIGlmIEB4IDwgQGJvdW5kcy54Lm1pblxyXG5cdFx0QHggPSBAYm91bmRzLngubWF4IC0gQGRpc3BsYXlXaWR0aCBpZiBAeCArIEBkaXNwbGF5V2lkdGggPiBAYm91bmRzLngubWF4XHJcblxyXG5cdHJlbmRlciA6IChjdHgsYW5pbWF0aW9uRnJhbWUpLT5cclxuXHRcdHVubGVzcyBhbmltYXRpb25GcmFtZSA+IENBTk5PTl9ERVBMT1lNRU5UX0RFTEFZXHJcblx0XHRcdHJldHVybiBcclxuXHRcdEBpbml0ID0gdHJ1ZVx0XHRcclxuXHRcdHN1cGVyXHJcblxyXG5cclxud2luZG93LkNhbm5vbiA9IENhbm5vblx0IiwiY2xhc3MgSW52YWRlciBleHRlbmRzIFNwcml0ZVxyXG5cdEBTUFJJVEVfV0lEVEggPSA1MFxyXG5cdEBTUFJJVEVfSEVJR0hUID0gMzVcdFxyXG5cclxuXHRASU5WQURFUl9UWVBFX0xBUkdFID0gMlxyXG5cdEBJTlZBREVSX1RZUEVfTUVESVVNID0gMVxyXG5cdEBJTlZBREVSX1RZUEVfU01BTEwgPSAwXHJcblxyXG5cdERFRkFVTFRfQU5JTUFUSU9OX1NURVAgPSAwXHJcblx0QU5JTUFUSU9OX1NURVBfRFVSQVRJT04gPSAxICMgVXBkYXRlcyBldmVyeSBBTklNQVRJT05fU1RFUF9EVVJBVElPTid0aCBmcmFtZVxyXG5cdERFQVRIX0FOSU1BVElPTl9EVVJBVElPTiA9IDEwICMgRnJhbWVzIGZvciBkZWF0aCBhbmltYXRpb24gZHVyYXRpb25cclxuXHJcblx0XHJcblxyXG5cdCMgSW4gZnJhbWVzLiBMZXNzZXIgdGhlIHRpbWUsIGZhc3RlciB0aGUgSW52YWRlciwgdGhlcmVmb3JlIGhhcmRlciB0aGUgZ2FtZVxyXG5cdCMgV2hlbiBzZXQgdG8gMSBpbnZhZGVycyBnbyBab2lkYmVyZy1zdHlsZSAoXFwvKSg7LC47KShcXC8pIC0gKHwpKDssLjspKHwpIC0gKFxcLykoOywuOykoXFwvKVxyXG5cdERFRkFVTFRfSU5WQURFUl9SRVNUX1RJTUUgPSA2MC8yXHJcblxyXG5cdERFRkFVTFRfSF9WRUxPQ0lUWSA9IEludmFkZXIuU1BSSVRFX1dJRFRIIC8gMTVcclxuXHRERUZBVUxUX1dfVkVMT0NJVFkgPSAwXHJcblx0V19WRUxPQ0lUWV9NVUxUSVBMSUVSID0gLjdcclxuXHRWRUxPQ0lUWV9JTkVSVElBX01VTFRJUExJRVIgPSAuNVxyXG5cdCMgVmVsb2NpdHkge3ggOiBmbG9hdCx5IDogZmxvYXR9LCBwaXhlbHMgcGVyIGFuaW1hdGlvbiBmcmFtZSBcclxuXHJcblx0SU5WQURFUl9ERUxBWV9NVUxUSVBMSUVSICA9IDFcclxuXHRJTlZBREVSX0RFTEFZX01BR0lDID0gNVxyXG5cclxuXHRJTlZBREVSX0NBTk5PTl9DSEFSR0VfU1RSRU5HVEggPSAyXHJcblx0I1RPRE8gbWFrZSBmaXJlIGNoYW5kZSBpbmRlcGVuZGVudCBvZiBpbnZhZGVyIHJlc3QgdGltZVxyXG5cdElOVkFERVJfRklSRV9DSEFOQ0UgPSAuMDNcclxuXHJcblx0SU5WQURFUl9TUFJJVEVfRVhQTE9TSU9OX09GRlNFVCA9IFxyXG5cdFx0eCA6IDBcclxuXHRcdHkgOiAzICogMzVcclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQGltZywgQHR5cGUsIEByYW5rLCBAeCwgQHksIEBib3VuZHMsIEBzY2FsZSktPlx0XHRcclxuXHRcdEBhbmltYXRpb25TdGVwID0gMCAjIDIgQW5pbWF0aW9uIFN0ZXBzXHJcblxyXG5cdFx0dHlwZXMgPSBbSW52YWRlci5JTlZBREVSX1RZUEVfU01BTEwsSW52YWRlci5JTlZBREVSX1RZUEVfTUVESVVNLEludmFkZXIuSU5WQURFUl9UWVBFX0xBUkdFXVxyXG5cclxuXHRcdHVubGVzcyB0eXBlcy5pbmRleE9mKEB0eXBlKSA+PSAwXHJcblx0XHRcdCMgY29uc29sZS5sb2cgdHlwZXNcclxuXHRcdFx0QHR5cGUgPSBJbnZhZGVyLklOVkFERVJfVFlQRV9TTUFMTFx0XHJcblxyXG5cdFx0QHJlc3RUaW1lTGVmdCA9IERFRkFVTFRfSU5WQURFUl9SRVNUX1RJTUVcclxuXHRcdEByZXN0VGltZSA9IERFRkFVTFRfSU5WQURFUl9SRVNUX1RJTUVcclxuXHJcblx0XHRAdmVsb2NpdHkgPSB7IHggOiBERUZBVUxUX0hfVkVMT0NJVFksIHkgOiAwIH0gXHJcblxyXG5cdFx0QGRpc3BsYXlXaWR0aCA9IEludmFkZXIuU1BSSVRFX1dJRFRIICogQHNjYWxlXHJcblx0XHRAZGlzcGxheUhlaWdodCA9IEludmFkZXIuU1BSSVRFX0hFSUdIVCAqIEBzY2FsZVxyXG5cclxuXHRcdHN1cGVyKCBcclxuXHRcdFx0QGltZywgXHJcblx0XHRcdEBhbmltYXRpb25TdGVwICogSW52YWRlci5TUFJJVEVfV0lEVEgsXHJcblx0XHRcdEB0eXBlICogSW52YWRlci5TUFJJVEVfSEVJR0hULFxyXG5cdFx0XHRJbnZhZGVyLlNQUklURV9XSURUSCwgXHJcblx0XHRcdEludmFkZXIuU1BSSVRFX0hFSUdIVCxcclxuXHRcdFx0QHgsXHJcblx0XHRcdEB5LFxyXG5cdFx0XHRAZGlzcGxheVdpZHRoLFxyXG5cdFx0XHRAZGlzcGxheUhlaWdodFxyXG5cdFx0KVxyXG5cclxuXHRcdEBzZXREZWF0aFRpbWVyIERFQVRIX0FOSU1BVElPTl9EVVJBVElPTlxyXG5cclxuXHR1cGRhdGUgOiAoYW5pbWF0aW9uRnJhbWUsYWR2YW5jZUZsYWcpLT5cdFx0XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcdFx0XHRcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgQGlzRHlpbmcoKVxyXG5cdFx0XHRAcGxheVNvdW5kIFwiZGVhdGhcIlxyXG5cdFx0XHRAc2V0U3ByaXRlUG9zIElOVkFERVJfU1BSSVRFX0VYUExPU0lPTl9PRkZTRVRcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0IyBCdWcgd2hlbiB1c2luZyBkZWxheSB3aGVuIHZlbG9jaXR5IGlzIGhpZ2guIE5lZWQgdG8gaGFuZGxlIGNyb3VkIGJlaGF2aW91ciBtb3JlIHByZWNpc2VseVxyXG5cdFx0aW52YWRlclJhbmtEZWxheSA9IChJTlZBREVSX0RFTEFZX01BR0lDIC0gQHJhbmspICogSU5WQURFUl9ERUxBWV9NVUxUSVBMSUVSXHRcdFx0XHJcblx0XHRpZiBhbmltYXRpb25GcmFtZSA8PSBpbnZhZGVyUmFua0RlbGF5XHJcblx0XHRcdHJldHVybiBcdFxyXG5cdFx0dW5sZXNzIEByZXN0VGltZUxlZnQtLSBpcyAwXHJcblx0XHRcdEBpZGxlID0gdHJ1ZVxyXG5cdFx0XHRyZXR1cm4gXHJcblx0XHRAaWRsZSA9IGZhbHNlXHJcblx0XHRAcmVzdFRpbWVMZWZ0ID0gQHJlc3RUaW1lXHRcclxuXHJcblx0XHRAdXBkYXRlVmVsb2NpdHkgYWR2YW5jZUZsYWdcclxuXHRcdEB4ICs9IEB2ZWxvY2l0eS54XHJcblx0XHRAeSArPSBAdmVsb2NpdHkueVxyXG5cclxuXHRcdGlmIEBpc1JlbG9hZGVkKClcclxuXHRcdFx0ZXZpbEV4dHJhdGVycmVzdHJpYWxQcm9qZWN0aWxlID0gQGZpcmUoKVxyXG5cclxuXHRcdHVubGVzcyBhbmltYXRpb25GcmFtZSAlIEFOSU1BVElPTl9TVEVQX0RVUkFUSU9OID09IDBcclxuXHRcdFx0cmV0dXJuIGV2aWxFeHRyYXRlcnJlc3RyaWFsUHJvamVjdGlsZSB8fCBudWxsXHJcblx0XHRAYW5pbWF0aW9uU3RlcCA9IDEgLSBAYW5pbWF0aW9uU3RlcFxyXG5cdFx0QHNwcml0ZVggPSBAYW5pbWF0aW9uU3RlcCAqIEludmFkZXIuU1BSSVRFX1dJRFRIXHJcblx0XHRyZXR1cm4gZXZpbEV4dHJhdGVycmVzdHJpYWxQcm9qZWN0aWxlIHx8IG51bGxcclxuXHJcblx0aXNSZWxvYWRlZCA6IC0+XHJcblx0XHRNYXRoLnJhbmRvbSgpIDwgSU5WQURFUl9GSVJFX0NIQU5DRVxyXG5cclxuXHRmaXJlIDogLT5cclxuXHRcdGJhcnJlbENvb3JkcyA9IEBnZXRDYW5ub25CYXJyZWxDb29yZHMoKVx0XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBQcm9qZWN0aWxlKFxyXG5cdFx0XHRiYXJyZWxDb29yZHMueCwgXHJcblx0XHQgXHRiYXJyZWxDb29yZHMueSwgXHJcblx0XHRcdEAsXHJcblx0XHRcdHsgeCA6IDAsIHkgOiBJTlZBREVSX0NBTk5PTl9DSEFSR0VfU1RSRU5HVEh9LCBcclxuXHRcdFx0QGJvdW5kcyxcclxuXHRcdFx0QHNjYWxlXHJcblx0XHQpXHRcclxuXHJcblx0IyBXaHkgbm90IHBvbHkgSW52YWRlciBvZiBDYW5ub24gdGhlbj9cclxuXHQjIFRPRE86IENyZWF0ZSBjbGFzcyAnU2hvb3RhJyBhYmxlIHRvIGZpcmUuIEluaGVyaXQgSW52YWRlciBhbmQgQ2Fubm9uIGZyb20gU2hvb3RhIFxyXG5cdGdldENhbm5vbkJhcnJlbENvb3JkcyA6IC0+XHJcblx0XHRjb29yZHMgPSBcdFxyXG5cdFx0XHR4IDogQHggKyBAZGlzcGxheVdpZHRoLyAyXHJcblx0XHRcdHkgOiBAeVx0XHJcblxyXG5cclxuXHJcblx0IyBJbnZhZGVycyBhcmUgcWl1dGUgZmVhcmZ1bCBjcmVhdHVyZXMuIFxyXG5cdCMgVGhleSBhZHZhbmNlIG9ubHkgaWYgb25lIG9mIHRoZW0gZGVjaWRlcyB0byBhbmQgd2FpdCBmb3IgdGhlIGxhc3Qgb25lIGluIHJhbmsgdG8gbWFrZSBzdWNoIGEgZGVjaXNpb25cclxuXHRjaGVja0FkdmFuY2UgOiAocmFuayktPlxyXG5cdFx0cmV0dXJuIChAeCArIEBkaXNwbGF5V2lkdGgqc2lnbihAdmVsb2NpdHkueCkgKyBAdmVsb2NpdHkueCA+PSBAYm91bmRzLngubWF4KSBvciBcclxuXHRcdFx0KEB4ICsgQGRpc3BsYXlXaWR0aCpzaWduKEB2ZWxvY2l0eS54KSArIEB2ZWxvY2l0eS54IDw9IEBib3VuZHMueC5taW4pXHJcblxyXG5cdHVwZGF0ZVZlbG9jaXR5IDogKGFkdmFuY2VGbGFnKS0+XHJcblx0XHRAdmVsb2NpdHkueSA9IDBcclxuXHRcdCMgaWYgYWR2YW5jZUZsYWdzW0ByYW5rXSBcclxuXHRcdGlmIGFkdmFuY2VGbGFnXHJcblx0XHRcdEB2ZWxvY2l0eS54ID0gLSBAdmVsb2NpdHkueFxyXG5cdFx0XHRAdmVsb2NpdHkueSA9IFdfVkVMT0NJVFlfTVVMVElQTElFUiAqIEBkaXNwbGF5SGVpZ2h0XHRcdFxyXG5cclxuXHRzaWduID0gKG51bSktPlxyXG5cdFx0aWYgbnVtID49IDBcclxuXHRcdFx0cmV0dXJuIDFcclxuXHRcdHJldHVybiAtMVxyXG53aW5kb3cuSW52YWRlciA9IEludmFkZXIiLCJcclxuY2xhc3MgS2V5Ym9hcmRcclxuXHRAS0VZX0NPREVfTEVGVCA9IDM3XHJcblx0QEtFWV9DT0RFX1JJR0hUID0gMzlcclxuXHRAS0VZX0NPREVfU1BBQ0UgPSAzMlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IC0+XHJcblx0XHRAa2V5c0Rvd24gPSB7fVxyXG5cdFx0QGtleXNQcmVzc2VkID0ge31cclxuXHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwia2V5ZG93blwiLCAoZXZlbnQpPT5cdFx0XHJcblx0XHRcdEBrZXlzRG93bltldmVudC5rZXlDb2RlXSA9IHRydWUgXHRcdFx0XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwia2V5dXBcIiwgKGV2ZW50KT0+XHRcdFx0XHRcdFx0XHJcblx0XHRcdGRlbGV0ZSBAa2V5c0Rvd25bZXZlbnQua2V5Q29kZV1cclxuXHJcblx0aXNEb3duIDogKGtleUNvZGUpLT5cdFxyXG5cdFx0cmV0dXJuIF8uaGFzKEBrZXlzRG93bixrZXlDb2RlKVxyXG5cclxud2luZG93LktleWJvYXJkID0gS2V5Ym9hcmQiLCJjbGFzcyBSZXNvdXJjZUxvYWRlciBleHRlbmRzIEV2ZW50RW1pdHRlcjJcclxuXHJcblx0QFJFU09VUkNFX1RZUEVfSU1HID0gXCJpbWdcIlxyXG5cclxuXHRAUkVTT1VSQ0VfVFlQRV9TT1VORCA9IFwic291bmRcIlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IChyZXNvdXJjZUxpc3QsY2FsbGJhY2spLT5cclxuXHRcdGlmIF8uaXNBcnJheShyZXNvdXJjZUxpc3QpXHJcblx0XHRcdGNoZWNrID0gdHJ1ZSBcclxuXHRcdFx0Zm9yIHJlY291cmNlRGF0YSBpbiByZXNvdXJjZUxpc3RcclxuXHRcdFx0XHRjaGVjayAqPSAoXy5pc09iamVjdChyZWNvdXJjZURhdGEpIGFuZCBfLmhhcyhyZWNvdXJjZURhdGEsJ3VybCcpIGFuZCBfLmhhcyhyZWNvdXJjZURhdGEsJ3R5cGUnKSkgXHJcblx0XHRcdHVubGVzcyBjaGVja1xyXG5cdFx0XHRcdHRocm93IFwiUmVzb3VyY2VMb2FkZXIgOjogUmVzb3VyY2VMb2FkZXIgYWNjZXB0cyBvbmx5IHZhbGlkIHJlY291cmNlIG9iamVjdHNcIlxyXG5cclxuXHRcdEBpbWFnZXMgPSB7fVxyXG5cdFx0QHNvdW5kcyA9IHt9XHJcblxyXG5cdFx0QGxvYWRSZXNvdXJjZXMgcmVzb3VyY2VMaXN0LCBjYWxsYmFja1xyXG5cdFx0XHJcblx0bG9hZFJlc291cmNlcyA6IChyZXNvdXJjZUxpc3QsY2FsbGJhY2s9LT4pLT5cclxuXHRcdGFzeW5jLmVhY2ggcmVzb3VyY2VMaXN0LCAocmVjb3VyY2VEYXRhLGVDYWxsYmFjayk9Plx0XHRcdFxyXG5cdFx0XHRpZiByZWNvdXJjZURhdGEudHlwZSBpcyBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX0lNR1xyXG5cdFx0XHRcdGltZyA9IG5ldyBJbWFnZSgpXHJcblx0XHRcdFx0aW1nLm9ubG9hZCA9ID0+XHJcblx0XHRcdFx0XHRAaW1hZ2VzW3JlY291cmNlRGF0YS5pZCB8fCByZWNvdXJjZURhdGEudXJsXSA9IGltZ1xyXG5cdFx0XHRcdFx0ZUNhbGxiYWNrIG51bGxcclxuXHRcdFx0XHRpbWcuc3JjID0gcmVjb3VyY2VEYXRhLnVybFxyXG5cdFx0XHRpZiByZWNvdXJjZURhdGEudHlwZSBpcyBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX1NPVU5EXHJcblx0XHRcdFx0c291bmQgPSBuZXcgQXVkaW8gcmVjb3VyY2VEYXRhLnVybFxyXG5cdFx0XHRcdEBzb3VuZHNbcmVjb3VyY2VEYXRhLmlkIHx8IHJlY291cmNlRGF0YS51cmxdID0gc291bmRcclxuXHRcdFx0XHRlQ2FsbGJhY2sgbnVsbFxyXG5cdFx0LCAoZXJyKT0+XHJcblx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0QGVtaXQgXCJyZWFkeVwiXHJcblxyXG5cdGdldEltYWdlIDogKHJlc0lkKS0+XHJcblx0XHR1bmxlc3MgXy5oYXMgQGltYWdlcywgcmVzSWRcclxuXHRcdFx0dGhyb3cgXCJSZXNvdXJjZUxvYWRlciA6OiBSZXNvdXJjZSBub3QgbG9hZGVkXCJcclxuXHRcdEBpbWFnZXNbcmVzSWRdXHJcblxyXG5cdGdldFNvdW5kIDogKHJlc0lkKS0+XHJcblx0XHR1bmxlc3MgXy5oYXMgQHNvdW5kcywgcmVzSWRcclxuXHRcdFx0dGhyb3cgXCJSZXNvdXJjZUxvYWRlciA6OiBSZXNvdXJjZSBub3QgbG9hZGVkXCJcclxuXHRcdEBzb3VuZHNbcmVzSWRdLmNsb25lTm9kZSgpXHRcclxuXHJcbndpbmRvdy5SZXNvdXJjZUxvYWRlciA9IFJlc291cmNlTG9hZGVyXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHJcblx0XHRcclxuXHJcbiIsIlxyXG5cclxuY2xhc3MgU3BhY2VJbnZhZGVyc0dhbWUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIyXHJcblx0Q0FOVkFTX0hFSUdIVCA9IDY0MFxyXG5cdENBTlZBU19XSURUSCA9IDY0MFxyXG5cdElOVkFERVJfU1BSSVRFID0gXCJzcHJpdGVzL2ludmFkZXJzLnBuZ1wiXHJcblx0Q0FOTk9OX1NQUklURSA9IFwic3ByaXRlcy9jYW5ub24ucG5nXCJcclxuXHRCR19DT0xPUiA9IFwiIzAwMFwiXHJcblx0R0FNRV9PVkVSX0NPTE9SID0gXCIjRkYwMDAwXCJcclxuXHRSRURSQVdfUkFURSA9IDFcclxuXHJcblx0SEVBREVSX0hFSUdIVCA9IDEwMFxyXG5cdEZPT1RFUl9IRUlHSFQgPSA3NVxyXG5cdFNJREVfT0ZGU0VUID0gMjVcclxuXHJcblx0Rk9OVCA9IFwiU3BhY2VJbnZhZGVyc1wiXHJcblx0Rk9OVF9TSVpFID0gXCIxNnB4XCJcclxuXHRGT05UX0NPTE9SID0gXCIjZmZmZmZmXCJcclxuXHJcblx0IyBUT0RPIFNvdW5kRW1pdHRlciBjbGFzcyB0byBoYW5kbGUgc291bmRzXHJcblx0U09VTkRTID0ge1xyXG5cdFx0YmdTb3VuZHMgOiBbXCJzb3VuZHMvYmcxLm1wM1wiLCBcInNvdW5kcy9iZzIubXAzXCIsIFwic291bmRzL2JnMy5tcDNcIiwgXCJzb3VuZHMvYmc0Lm1wM1wiXVxyXG5cdFx0cHJvamVjdGlsZSA6IFwic291bmRzL3Byb2plY3RpbGUubXAzXCJcclxuXHRcdGludmFkZXJEZWF0aCA6IFwic291bmRzL2ludmFkZXJfZGVhdGgubXAzXCJcclxuXHRcdGNhbm5vbkRlYXRoIDogXCJzb3VuZHMvY2Fubm9uX2RlYXRoLm1wM1wiXHJcblx0fVxyXG5cclxuXHRCR1NPVU5EX0ZSQU1FX0RFTEFZID0gNjBcdFxyXG5cdEJHU09VTkRfU1BFRURfTVVMVElQTElFUiA9IDQwMFxyXG5cclxuXHRJTlZBREVSU19QRVJfUkFOSyA9IDExICMgWWVhaCwgcmFua3MuIExpa2UgaW4gcmVhbCBhcm15XHJcblxyXG5cdEZSRUVfSF9TUEFDRSA9IDQgIyBGcmVlIHNwYWNlICgxIHVuaXQgPSAxIEludmFkZXIgZGlzcGxheSB3aWR0aCkgZm9yIEludmFkZXJzIHRvIG1vdmUuIFxyXG5cclxuXHRIX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgPSAxLjRcclxuXHRXX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgPSAyXHJcblxyXG5cdENMRUFSX1NDQUxFID0gLjMgXHJcblxyXG5cdGNvbnN0cnVjdG9yIDogKEBkZXN0KS0+XHJcblx0XHRjdXJyZW50RGlyID0gZ2V0SnNGaWxlRGlyIFwiU3BhY2VJbnZhZGVycy5qc1wiXHJcblxyXG5cdFx0QHJlc291cmNlcyA9IG5ldyBSZXNvdXJjZUxvYWRlciBbXHJcblx0XHRcdHt1cmwgOiBjdXJyZW50RGlyICsgSU5WQURFUl9TUFJJVEUsIGlkIDogSU5WQURFUl9TUFJJVEUsIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX0lNR31cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBDQU5OT05fU1BSSVRFLCBpZCA6IENBTk5PTl9TUFJJVEUsIHR5cGUgOiBSZXNvdXJjZUxvYWRlci5SRVNPVVJDRV9UWVBFX0lNR31cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbMF0sIGlkIDogU09VTkRTLmJnU291bmRzWzBdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbMV0sIGlkIDogU09VTkRTLmJnU291bmRzWzFdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbMl0sIGlkIDogU09VTkRTLmJnU291bmRzWzJdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuYmdTb3VuZHNbM10sIGlkIDogU09VTkRTLmJnU291bmRzWzNdLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMucHJvamVjdGlsZSwgaWQgOiBTT1VORFMucHJvamVjdGlsZSwgdHlwZSA6IFJlc291cmNlTG9hZGVyLlJFU09VUkNFX1RZUEVfU09VTkR9XHJcblx0XHRcdHt1cmwgOiBjdXJyZW50RGlyICsgU09VTkRTLmludmFkZXJEZWF0aCwgaWQgOiBTT1VORFMuaW52YWRlckRlYXRoLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdFx0e3VybCA6IGN1cnJlbnREaXIgKyBTT1VORFMuY2Fubm9uRGVhdGgsIGlkIDogU09VTkRTLmNhbm5vbkRlYXRoLCB0eXBlIDogUmVzb3VyY2VMb2FkZXIuUkVTT1VSQ0VfVFlQRV9TT1VORH1cclxuXHRcdF0sID0+XHRcdFx0XHJcblx0XHRcdEBpbml0KClcclxuXHJcblx0aW5pdCA6IC0+XHRcdFxyXG5cdFx0JChAZGVzdCkuYXBwZW5kIFwiPGNhbnZhcyBpZD0nU3BhY2VJbnZhZGVyc0dhbWUnPjwvY2FudmFzPlwiXHJcblx0XHRAaW5pdEdhbWVGaWVsZCgpXHJcblx0XHRAY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTcGFjZUludmFkZXJzR2FtZVwiKVxyXG5cdFx0QGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcblxyXG5cdFx0QGNvbnRyb2xzID0gbmV3IEtleWJvYXJkKClcclxuXHJcblx0XHRAY3R4Lmdsb2JhbEFscGhhID0gMSBcclxuXHJcblx0XHRAZ2FtZU92ZXIgPSBmYWxzZVxyXG5cclxuXHRcdEBjdXJyZW50U291bmRJZCA9IDBcclxuXHJcblx0XHRAaW50ZXJmYWNlID0gbmV3IFNwYWNlSW52YWRlcnNJbnRlcmZhY2UoRk9OVCxGT05UX1NJWkUsRk9OVF9DT0xPUilcclxuXHJcblx0XHRcclxuXHJcblx0XHRAc3RhcnRHYW1lKClcclxuXHJcblx0aW5pdEdhbWVGaWVsZCA6IC0+XHJcblxyXG5cdFx0I1RPRE8gRHluYW1pYyBnYW1lIGZpZWxkIGJhc2VkIG9uIHNjcmVlbiB3aWR0aFxyXG5cdFx0QGdhbWVGaWVsZCA9IFxyXG5cdFx0XHR4IDogU0lERV9PRkZTRVRcclxuXHRcdFx0eSA6IEhFQURFUl9IRUlHSFRcclxuXHRcdFx0d2lkdGggOiBDQU5WQVNfV0lEVEggLSBTSURFX09GRlNFVCAqIDJcclxuXHRcdFx0aGVpZ2h0IDogQ0FOVkFTX0hFSUdIVCAtIEhFQURFUl9IRUlHSFQgLSBGT09URVJfSEVJR0hUXHJcblxyXG5cdFx0QGdhbWVGaWVsZEJvdW5kcyA9XHJcblx0XHRcdHggOiBcclxuXHRcdFx0XHRtaW4gOiBAZ2FtZUZpZWxkLnhcclxuXHRcdFx0XHRtYXggOiBAZ2FtZUZpZWxkLnggKyBAZ2FtZUZpZWxkLndpZHRoXHJcblx0XHRcdHkgOiBcclxuXHRcdFx0XHRtaW4gOiBAZ2FtZUZpZWxkLnlcclxuXHRcdFx0XHRtYXggOiBAZ2FtZUZpZWxkLnkgKyBAZ2FtZUZpZWxkLmhlaWdodFx0XHJcblxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5hdHRyIFwiaGVpZ2h0XCIsQ0FOVkFTX0hFSUdIVFxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5hdHRyIFwid2lkdGhcIixDQU5WQVNfV0lEVEhcclxuXHRcdCQoXCIjU3BhY2VJbnZhZGVyc0dhbWVcIikuY3NzIFwiYmFja2dyb3VuZC1jb2xvclwiICwgQkdfQ09MT1JcclxuXHRcdCQoXCIjU3BhY2VJbnZhZGVyc0dhbWVcIikuY3NzIFwiLXdlYmtpdC10b3VjaC1jYWxsb3V0XCIgLCBcIm5vbmVcIlxyXG5cdFx0cHJlZml4ZXMgPSBbXCItd2Via2l0LVwiLFwiLWtodG1sLVwiLFwiLW1vei1cIixcIi1tcy1cIixcIlwiXVxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MoXCIje3ByZWZpeH11c2VyLXNlbGVjdFwiLCBcIm5vbmVcIikgZm9yIHByZWZpeCBpbiBwcmVmaXhlc1xyXG5cclxuXHJcblx0aW52YWRlIDogLT5cclxuXHRcdEBpbnZhZGVyUmFua3MgPSBbXHJcblx0XHRcdEludmFkZXIuSU5WQURFUl9UWVBFX1NNQUxMLFxyXG5cdFx0XHRJbnZhZGVyLklOVkFERVJfVFlQRV9NRURJVU0sXHJcblx0XHRcdEludmFkZXIuSU5WQURFUl9UWVBFX01FRElVTSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTEFSR0UsXHJcblx0XHRcdEludmFkZXIuSU5WQURFUl9UWVBFX0xBUkdFXHJcblx0XHRdXHRcdFx0XHJcblxyXG5cdFx0QGludmFkZXJTY2FsZSA9IFxyXG5cdFx0XHRAZ2FtZUZpZWxkLndpZHRoIC8gKElOVkFERVJTX1BFUl9SQU5LICsgRlJFRV9IX1NQQUNFKSAvIFxyXG5cdFx0XHQoSW52YWRlci5TUFJJVEVfV0lEVEggKiBIX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIpXHJcblxyXG5cdFx0QGhTcGFjZVBlckludmFkZXIgPSBJbnZhZGVyLlNQUklURV9XSURUSCAqIEhfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUiAqIEBpbnZhZGVyU2NhbGVcclxuXHRcdEB3U3BhY2VQZXJJbnZhZGVyID0gSW52YWRlci5TUFJJVEVfSEVJR0hUICogV19TUEFDRV9QRVJfSU5WQURFUl9NVUxUSVBMSUVSICogQGludmFkZXJTY2FsZVxyXG5cclxuXHRcdGZvciB0eXBlLHJhbmsgaW4gQGludmFkZXJSYW5rc1xyXG5cdFx0XHRmb3IgaSBpbiBbMC4uSU5WQURFUlNfUEVSX1JBTkstMV1cclxuXHJcblx0XHRcdFx0aW52YWRlciA9IG5ldyBJbnZhZGVyKFxyXG5cdFx0XHRcdFx0QHJlc291cmNlcy5nZXRJbWFnZShJTlZBREVSX1NQUklURSksXHJcblx0XHRcdFx0XHR0eXBlLCBcclxuXHRcdFx0XHRcdHJhbmssXHRcdFx0XHRcclxuXHRcdFx0XHRcdEBnYW1lRmllbGQueCArIGkgKiBAaFNwYWNlUGVySW52YWRlciwgXHJcblx0XHRcdFx0XHRAZ2FtZUZpZWxkLnkgKyByYW5rICogQHdTcGFjZVBlckludmFkZXIsXHJcblx0XHRcdFx0XHRAZ2FtZUZpZWxkQm91bmRzLFxyXG5cdFx0XHRcdFx0QGludmFkZXJTY2FsZVxyXG5cdFx0XHRcdCkgXHJcblxyXG5cdFx0XHRcdGludmFkZXIuc2V0U291bmQgXCJkZWF0aFwiLCBAcmVzb3VyY2VzLmdldFNvdW5kIFNPVU5EUy5pbnZhZGVyRGVhdGhcclxuXHJcblx0XHRcdFx0QGludmFkZXJzLnB1c2ggaW52YWRlclxyXG5cclxuXHR2aXZhTGFSZXNpc3RhbmNlIDogLT5cclxuXHRcdEBjYW5ub24gPSBuZXcgQ2Fubm9uKFxyXG5cdFx0XHRAcmVzb3VyY2VzLmdldEltYWdlKENBTk5PTl9TUFJJVEUpLFxyXG5cdFx0XHRAZ2FtZUZpZWxkLngsXHJcblx0XHRcdEBnYW1lRmllbGQueSArIEBnYW1lRmllbGQuaGVpZ2h0IC0gQ2Fubm9uLlNQUklURV9IRUlHSFQgKiBAaW52YWRlclNjYWxlLFxyXG5cdFx0XHRAZ2FtZUZpZWxkQm91bmRzLFxyXG5cdFx0XHRAaW52YWRlclNjYWxlXHJcblx0XHQpXHJcblxyXG5cdFx0QGNhbm5vbi5zZXRTb3VuZHMgWyBcclxuXHRcdFx0eyBuYW1lIDogXCJmaXJlXCIsIHNvdW5kIDogQHJlc291cmNlcy5nZXRTb3VuZCBTT1VORFMucHJvamVjdGlsZSB9XHJcblx0XHRcdHsgbmFtZSA6IFwiZGVhdGhcIiwgc291bmQgOiBAcmVzb3VyY2VzLmdldFNvdW5kIFNPVU5EUy5jYW5ub25EZWF0aCB9XHJcblx0XHRdXHJcblxyXG5cdHN0YXJ0R2FtZSA6IC0+XHJcblx0XHRAaW52YWRlcnMgPSBbXVxyXG5cdFx0QHByb2plY3RpbGVzID0gW11cclxuXHJcblx0XHRAaW52YWRlKClcclxuXHJcblx0XHRAdml2YUxhUmVzaXN0YW5jZSgpXHJcblxyXG5cdFx0QGZyYW1lID0gMFxyXG5cdFx0QGFuaW1hdGlvbkZyYW1lID0gMFxyXG5cclxuXHRcdGdhbWVTdGVwID0gPT5cclxuXHRcdFx0QHVwZGF0ZSgpXHJcblx0XHRcdEByZW5kZXIoKVxyXG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIGdhbWVTdGVwLCBAY2FudmFzXHRcclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZ2FtZVN0ZXAsIEBjYW52YXNcclxuXHRcclxuXHRwbGF5TXVzaWMgOiAoZnJhbWUpLT5cclxuXHRcdEBtdXNpY0ZyYW1lQ291bnRlciA9IEBtdXNpY0ZyYW1lQ291bnRlciB8fCAwXHJcblx0XHRAbXVzaWNGcmFtZUNvdW50ZXIrK1xyXG5cclxuXHRcdEBtdXNpY0ZyYW1lRGVsYXkgPSBCR1NPVU5EX0ZSQU1FX0RFTEFZIC0gTWF0aC5mbG9vcihmcmFtZS9CR1NPVU5EX1NQRUVEX01VTFRJUExJRVIpXHJcblx0XHRpZiBAbXVzaWNGcmFtZUNvdW50ZXIgPj0gQG11c2ljRnJhbWVEZWxheVxyXG5cdFx0XHRAcmVzb3VyY2VzLmdldFNvdW5kKFNPVU5EUy5iZ1NvdW5kc1tAY3VycmVudFNvdW5kSWRdKS5wbGF5KClcdFxyXG5cdFx0XHRAY3VycmVudFNvdW5kSWQgPSBpZiBAY3VycmVudFNvdW5kSWQgPj0gMyB0aGVuIDAgZWxzZSBAY3VycmVudFNvdW5kSWQgKyAxXHJcblx0XHRcdEBtdXNpY0ZyYW1lQ291bnRlciA9IDBcdFxyXG5cclxuXHRjbGVhckdhbWVGaWVsZCA6IC0+XHJcblx0XHRAY3R4LmNsZWFyUmVjdCAwLCAwLCBDQU5WQVNfV0lEVEgsIENBTlZBU19IRUlHSFRcclxuXHRcdCMgQGN0eC5jbGVhclJlY3QgQGdhbWVGaWVsZC54LCBAZ2FtZUZpZWxkLnksIEBnYW1lRmllbGQud2lkdGgsIEBnYW1lRmllbGQuaGVpZ2h0XHJcblxyXG5cdHVwZGF0ZSA6IC0+XHJcblx0XHQjIFRPRE8gLSBtYWtlIGl0IHByZXR0aWVyXHRcdFxyXG5cclxuXHRcdEBmcmFtZSsrIFxyXG5cdFx0XHJcblx0XHRAcGxheU11c2ljKEBmcmFtZSlcclxuXHJcblx0XHR1bmxlc3MgQGZyYW1lICUgUkVEUkFXX1JBVEUgPT0gMFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBAZ2FtZU92ZXJcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHJcblx0XHRAYW5pbWF0aW9uRnJhbWUrKyBcclxuXHJcblx0XHRmb3IgcHJvamVjdGlsZSBpbiBAcHJvamVjdGlsZXNcclxuXHRcdFx0cHJvamVjdGlsZS51cGRhdGUoKVx0XHRcclxuXHJcblxyXG5cdFx0I1RPRE8gY3JlYXRlIGNsYXNzICdNYXN0ZXJNaW5kJyB0byBoYW5kbGUgaW52YWRlcnMgY3JvdWQgYmVoYXZpb3JcclxuXHRcdCMgVmVyeSB2ZXJ5IGJhZCBjb2RlIGhlcmUuIFZlcnkgYmFkIGNvZGUuXHJcblx0XHQjIGN1cnJlbnRNYXhpbXVtSW52YWRlclJhbmsgPSAwXHJcblx0XHQjIGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0IyBcdGN1cnJlbnRNYXhpbXVtSW52YWRlclJhbmsgPSBNYXRoLm1heCBjdXJyZW50TWF4aW11bUludmFkZXJSYW5rLCBpbnZhZGVyLnJhbmtcclxuXHJcblx0XHQjIGFkdmFuY2VGbGFncyA9IFtdXHJcblx0XHQjIGZvciByYW5rSWQgaW4gQGludmFkZXJSYW5rc1xyXG5cdFx0IyBcdGFkdmFuY2VGbGFnc1tyYW5rSWRdID0gcmFua0lkID4gY3VycmVudE1heGltdW1JbnZhZGVyUmFuayBcclxuXHJcblx0XHQjIGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0IyBcdGFkdmFuY2VGbGFnc1tpbnZhZGVyLnJhbmtdID0gYWR2YW5jZUZsYWdzW2ludmFkZXIucmFua10gb3IgaW52YWRlci5jaGVja0FkdmFuY2UoaW52YWRlci5yYW5rKVx0XHJcblxyXG5cdFx0IyBmb3IgZmxhZzEsaWR4MSBpbiBhZHZhbmNlRmxhZ3Muc2xpY2UoLTEpXHJcblx0XHQjIFx0Y29uc29sZS5sb2cgZmxhZzEsaWR4MVxyXG5cdFx0IyBcdGZvciBmbGFnMiwgaWR4MiBpbiBhZHZhbmNlRmxhZ3NbaWR4MS4uXS5zbGljZSgtMSlcclxuXHRcdCMgXHRcdGFkdmFuY2VGbGFnc1tpZHgxXSA9IGZhbHNlIGlmIGFkdmFuY2VGbGFnc1tpZHgyXSA9PSBmYWxzZVxyXG5cclxuXHRcdGFkdmFuY2VGbGFnID0gZmFsc2VcclxuXHRcdGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0XHRhZHZhbmNlRmxhZyA9IGFkdmFuY2VGbGFnIG9yIGludmFkZXIuY2hlY2tBZHZhbmNlKClcclxuXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0aW52YWRlck1vdmVPdXRjb21lID0gaW52YWRlci51cGRhdGUgQGFuaW1hdGlvbkZyYW1lLCBhZHZhbmNlRmxhZ1xyXG5cdFx0XHRpZiBpbnZhZGVyTW92ZU91dGNvbWUgaW5zdGFuY2VvZiBQcm9qZWN0aWxlXHJcblx0XHRcdFx0QHByb2plY3RpbGVzLnB1c2ggaW52YWRlck1vdmVPdXRjb21lXHJcblxyXG5cdFx0IyBCYWQgY29kZSBlbmRzIGhlcmVcclxuXHJcblx0XHRAY2hlY2tDb2xsaXNpb25zKClcdFxyXG5cclxuXHRcdEBoYW5kbGVLZXlib2FyZEludGVyYWN0aW9uKClcclxuXHJcblx0XHRAY2hlY2tEZXN0cm95ZWRPYmplY3RzKClcclxuXHJcblx0XHRAY2hlY2tHYW1lT3ZlcigpXHJcblxyXG5cdGNoZWNrR2FtZU92ZXIgOiAtPlxyXG5cdFx0dW5sZXNzIEBjYW5ub25cclxuXHRcdFx0QGdhbWVPdmVyID0gdHJ1ZVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0Zm9yIGludmFkZXIgaW4gQGludmFkZXJzXHJcblx0XHRcdGlmIGludmFkZXIueSArIGludmFkZXIuZGlzcGxheUhlaWdodCA+IEBjYW5ub24ueVxyXG5cdFx0XHRcdEBnYW1lT3ZlciA9IHRydWVcclxuXHJcblx0Y2hlY2tDb2xsaXNpb25zIDogLT5cclxuXHRcdGZvciBwcm9qZWN0aWxlIGluIEBwcm9qZWN0aWxlc1xyXG5cdFx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0XHRpZiBjaGVja1Byb2plY3RpbGVDb2xsaXNpb24ocHJvamVjdGlsZSxpbnZhZGVyKVxyXG5cdFx0XHRcdFx0aW52YWRlci5kZXN0cm95KCkgXHJcblx0XHRcdFx0XHRwcm9qZWN0aWxlLmRlc3Ryb3koKVxyXG5cdFx0XHR1bmxlc3MgQGNhbm5vblxyXG5cdFx0XHRcdGNvbnRpbnVlXHRcdFxyXG5cdFx0XHRpZiBjaGVja1Byb2plY3RpbGVDb2xsaXNpb24gcHJvamVjdGlsZSwgQGNhbm5vblxyXG5cdFx0XHRcdHByb2plY3RpbGUuZGVzdHJveSgpXHJcblx0XHRcdFx0QGNhbm5vbi5kZXN0cm95KClcclxuXHJcblx0Y2hlY2tQcm9qZWN0aWxlQ29sbGlzaW9uID0gKHByb2plY3RpbGUsdGFyZ2V0KS0+XHJcblx0XHRjb2xsaXNpb24gPSBjaGVja0NvbGxpc2lvbihwcm9qZWN0aWxlLHRhcmdldClcclxuXHRcdHVubGVzcyBjb2xsaXNpb25cclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0cmV0dXJuIGdldE9iamVjdENsYXNzKHByb2plY3RpbGUub3duZXIpICE9IGdldE9iamVjdENsYXNzKHRhcmdldClcclxuXHJcblx0I0hvcnJpYmxlIFBpZWNlIG9mIGJ1bGxzaGl0IGZvciBJRS4gVGhlIGdhbWUgd2lsbCBOT1Qgc3VwcG9ydCBJRSBpbiBmdXJ0aGVyIHZlcnNpb25zXHJcblx0Z2V0T2JqZWN0Q2xhc3MgPSAob2JqKS0+XHJcbiAgICAgICAgaWYgb2JqIGFuZCBvYmouY29uc3RydWN0b3IgYW5kIG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpXHJcbiAgICAgICAgICAgIGlmIG9iai5jb25zdHJ1Y3Rvci5uYW1lIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzdHIgPSBvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKVxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiBzdHIuY2hhckF0KDApID09ICdbJ1xyXG4gICAgICAgICAgICBcdGFyciA9IHN0ci5tYXRjaCgvXFxbXFx3K1xccyooXFx3KylcXF0vKVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIFx0YXJyID0gc3RyLm1hdGNoKC9mdW5jdGlvblxccyooXFx3KykvKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgYXJyIGFuZCBhcnIubGVuZ3RoID09IDJcclxuICAgICAgICAgICAgICAgcmV0dXJuIGFyclsxXSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgIFx0XHJcbiAgICAgXHRcclxuICAgXHJcblxyXG5cclxuXHQjIFRPRE86IGNyZWF0ZSBjbGFzcyAnQ29sbGlkYWJsZScgdG8gaGFuZGxlIGNvbGxpc2lvbnMgZWFzaWVyXHJcblx0Y2hlY2tDb2xsaXNpb24gPSAoYSxiKS0+XHJcblx0XHRob3Jpem9udGFsQ2hlY2sgPSAoYS54ICsgYS5kaXNwbGF5V2lkdGggPCBiLngpIG9yIChiLnggKyBiLmRpc3BsYXlXaWR0aCA8IGEueClcclxuXHRcdHZlcnRpY2FsQ2hlY2sgPSAoYS55ICsgYS5kaXNwbGF5SGVpZ2h0IDwgYi55KSBvciAoYi55ICsgYi5kaXNwbGF5SGVpZ2h0IDwgYS55KVxyXG5cclxuXHRcdG5vdCAoaG9yaXpvbnRhbENoZWNrIG9yIHZlcnRpY2FsQ2hlY2spXHJcblxyXG5cdGNoZWNrRGVzdHJveWVkT2JqZWN0cyA6IC0+XHJcblx0XHRAcHJvamVjdGlsZXMgPSBfLmZpbHRlciBAcHJvamVjdGlsZXMsKHByb2plY3RpbGUpLT4gbm90IHByb2plY3RpbGUuaXNEZXN0cm95ZWQoKVxyXG5cclxuXHRcdEBpbnZhZGVycyA9IF8uZmlsdGVyIEBpbnZhZGVycywoaW52YWRlciktPiBub3QgaW52YWRlci5pc0Rlc3Ryb3llZCgpXHJcblxyXG5cdFx0dW5sZXNzIEBjYW5ub25cclxuXHRcdFx0cmV0dXJuXHJcblx0XHRpZiBAY2Fubm9uLmlzRGVzdHJveWVkKCkgXHJcblx0XHRcdEBjYW5ub24gPSBudWxsIFxyXG5cdFx0XHRAZ2FtZU92ZXIgPSB0cnVlXHJcblxyXG5cdGhhbmRsZUtleWJvYXJkSW50ZXJhY3Rpb24gOiAtPlxyXG5cdFx0dW5sZXNzIEBjYW5ub25cclxuXHRcdFx0cmV0dXJuXHRcdFxyXG5cdFx0aWYgQGNvbnRyb2xzLmlzRG93bihLZXlib2FyZC5LRVlfQ09ERV9MRUZUKVxyXG5cdFx0XHRAY2Fubm9uLnVwZGF0ZSBAYW5pbWF0aW9uRnJhbWUsIENhbm5vbi5ESVJFQ1RJT05fTEVGVFxyXG5cdFx0ZWxzZSBpZiBAY29udHJvbHMuaXNEb3duKEtleWJvYXJkLktFWV9DT0RFX1JJR0hUKVxyXG5cdFx0XHRAY2Fubm9uLnVwZGF0ZSBAYW5pbWF0aW9uRnJhbWUsIENhbm5vbi5ESVJFQ1RJT05fUklHSFRcclxuXHRcdGVsc2UgXHJcblx0XHRcdEBjYW5ub24udXBkYXRlIEBhbmltYXRpb25GcmFtZVxyXG5cdFx0aWYgQGNvbnRyb2xzLmlzRG93bihLZXlib2FyZC5LRVlfQ09ERV9TUEFDRSlcdFx0XHRcclxuXHRcdFx0QHByb2plY3RpbGVzLnB1c2ggQGNhbm5vbi5maXJlIEBhbmltYXRpb25GcmFtZSBpZiBAY2Fubm9uLmlzUmVsb2FkZWQoKVxyXG5cdFxyXG5cdHJlbmRlciA6IC0+XHJcblx0XHRAY2xlYXJHYW1lRmllbGQoKVx0XHJcblxyXG5cdFx0QGludGVyZmFjZS5yZW5kZXIgQGN0eFxyXG5cclxuXHRcdGlmIEBnYW1lT3ZlclxyXG5cdFx0XHRAY3R4LmZpbGxTdHlsZSA9IEdBTUVfT1ZFUl9DT0xPUlxyXG5cdFx0XHRAY3R4LmZpbGxSZWN0IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpDQU5WQVNfV0lEVEgpLFxyXG5cdFx0XHRcdE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpDQU5WQVNfSEVJR0hUKSw1LDVcclxuXHJcblx0XHRmb3IgcHJvamVjdGlsZSBpbiBAcHJvamVjdGlsZXNcdFx0XHRcclxuXHRcdFx0cHJvamVjdGlsZS5yZW5kZXIgQGN0eCBcclxuXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0aW52YWRlci5yZW5kZXIgQGN0eFxyXG5cclxuXHRcdGlmIEBjYW5ub25cclxuXHRcdFx0QGNhbm5vbi5yZW5kZXIgQGN0eCwgQGFuaW1hdGlvbkZyYW1lXHJcblxyXG5cdGdldEpzRmlsZURpciA9IChmaWxlbmFtZSktPlxyXG5cdFx0cmVnID0gXCIuKiN7ZmlsZW5hbWV9LipcIlxyXG5cdFx0JChcInNjcmlwdFtzcmNdXCIpLmZpbHRlcigtPnRoaXMuc3JjLm1hdGNoIG5ldyBSZWdFeHAocmVnKSkubGFzdCgpLmF0dHIoXCJzcmNcIikuc3BsaXQoJz8nKVswXS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJykrJy8nXHJcblx0XHRcclxud2luZG93LlNwYWNlSW52YWRlcnNHYW1lID0gU3BhY2VJbnZhZGVyc0dhbWVcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==