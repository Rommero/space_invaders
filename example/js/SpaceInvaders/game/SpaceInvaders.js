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
      if (this._isDestroyed) {
        return false;
      }
      if (this._isDying) {
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

    Sprite.prototype.render = function(ctx) {
      return ctx.drawImage(this.img, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.displayWidth, this.displayHeight);
    };

    return Sprite;

  })(Destroyable);

  window.Sprite = Sprite;

}).call(this);

(function() {
  var Cannon, Projectile,
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
      Projectile.__super__.update.call(this);
      if (this.isDestroyed()) {
        return;
      }
      this.y += this.velocity.y;
      if (this.y < this.bounds.y.min) {
        return this.destroy();
      }
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

  Cannon = (function(_super) {
    var CANNON_CHARGE_STRENGTH, CANNON_DEPLOYMENT_DELAY, CANNON_RECHARGE_TIME, SPEED_MULTIPLIER;

    __extends(Cannon, _super);

    Cannon.SPRITE_WIDTH = 49;

    Cannon.SPRITE_HEIGHT = 30;

    Cannon.DIRECTION_LEFT = 1;

    Cannon.DIRECTION_RIGHT = 0;

    CANNON_DEPLOYMENT_DELAY = 60;

    SPEED_MULTIPLIER = 4;

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
    }

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
      if (!this.init) {
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
      return Cannon.__super__.render.call(this, ctx);
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
    var ANIMATION_STEP_DURATION, DEFAULT_ANIMATION_STEP, DEFAULT_H_VELOCITY, DEFAULT_INVADER_REST_TIME, DEFAULT_W_VELOCITY, INVADER_DELAY_MAGIC, INVADER_DELAY_MULTIPLIER, VELOCITY_INERTIA_MULTIPLIER, W_VELOCITY_MULTIPLIER, sign;

    __extends(Invader, _super);

    Invader.SPRITE_WIDTH = 50;

    Invader.SPRITE_HEIGHT = 35;

    Invader.INVADER_TYPE_LARGE = 2;

    Invader.INVADER_TYPE_MEDIUM = 1;

    Invader.INVADER_TYPE_SMALL = 0;

    DEFAULT_ANIMATION_STEP = 0;

    ANIMATION_STEP_DURATION = 1;

    DEFAULT_INVADER_REST_TIME = 60 / 3;

    DEFAULT_H_VELOCITY = Invader.SPRITE_WIDTH / 7;

    DEFAULT_W_VELOCITY = 0;

    W_VELOCITY_MULTIPLIER = .7;

    VELOCITY_INERTIA_MULTIPLIER = .5;

    INVADER_DELAY_MULTIPLIER = 10;

    INVADER_DELAY_MAGIC = 5;

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
    }

    Invader.prototype.update = function(animationFrame, advanceFlags) {
      var invaderRankDelay;
      Invader.__super__.update.call(this);
      if (this.isDestroyed()) {
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
      this.updateVelocity(advanceFlags);
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      if (animationFrame % ANIMATION_STEP_DURATION !== 0) {
        return;
      }
      this.animationStep = 1 - this.animationStep;
      return this.spriteX = this.animationStep * Invader.SPRITE_WIDTH;
    };

    Invader.prototype.checkAdvance = function(rank) {
      if (rank !== this.rank) {
        return false;
      }
      return (this.x + this.displayWidth * sign(this.velocity.x) + this.velocity.x >= this.bounds.x.max) || (this.x + this.displayWidth * sign(this.velocity.x) + this.velocity.x <= this.bounds.x.min);
    };

    Invader.prototype.updateVelocity = function(advanceFlags) {
      this.velocity.y = 0;
      if (advanceFlags[this.rank]) {
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
      console.log(this.keysDown);
      return _.has(this.keysDown, keyCode);
    };

    Keyboard.prototype.isPressed = function(keyCode) {
      console.log(this.keysDown, this.keysPressed);
      if (this.isDown(keyCode)) {
        this.keysPressed[keyCode] = true;
        return true;
      }
      if (_.has(this.keysPressed, keyCode)) {
        return false;
      }
      return false;
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

    function ResourceLoader(imageList, callback) {
      var check, imageData, _i, _len;
      if (_.isString(imageList)) {
        imageList = [
          {
            url: imageList,
            id: imageList
          }
        ];
      }
      if (_.isArray(imageList)) {
        check = true;
        for (_i = 0, _len = imageList.length; _i < _len; _i++) {
          imageData = imageList[_i];
          check *= _.isObject(imageData) && _.has(imageData, 'url');
        }
        if (!check) {
          throw "ResourceLoader :: ResourceLoader accepts only String or String[]";
        }
      }
      this.images = {};
      this.loadImages(imageList, callback);
    }

    ResourceLoader.prototype.loadImages = function(imageList, callback) {
      if (callback == null) {
        callback = function() {};
      }
      return async.each(imageList, (function(_this) {
        return function(imageData, eCallback) {
          var img;
          img = new Image();
          img.onload = function() {
            _this.images[imageData.id || imageData.url] = img;
            return eCallback(null);
          };
          return img.src = imageData.url;
        };
      })(this), (function(_this) {
        return function(err) {
          callback();
          return _this.emit("ready");
        };
      })(this));
    };

    ResourceLoader.prototype.get = function(imageId) {
      if (!_.has(this.images, imageId)) {
        throw "ResourceLoader :: Image not loaded";
      }
      return this.images[imageId];
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
    var BG_COLOR, CANNON_SPRITE, CANVAS_HEIGHT, CANVAS_WIDTH, CLEAR_SCALE, FOOTER_HEIGHT, FREE_H_SPACE, HEADER_HEIGHT, H_SPACE_PER_INVADER_MULTIPLIER, INVADERS_PER_RANK, INVADER_SPRITE, REDRAW_RATE, SIDE_OFFSET, W_SPACE_PER_INVADER_MULTIPLIER, getJsFileDir;

    __extends(SpaceInvadersGame, _super);

    CANVAS_HEIGHT = 640;

    CANVAS_WIDTH = 640;

    INVADER_SPRITE = "sprites/invaders.png";

    CANNON_SPRITE = "sprites/cannon.png";

    BG_COLOR = "#000";

    REDRAW_RATE = 1;

    HEADER_HEIGHT = 100;

    FOOTER_HEIGHT = 75;

    SIDE_OFFSET = 25;

    INVADERS_PER_RANK = 11;

    FREE_H_SPACE = 4;

    H_SPACE_PER_INVADER_MULTIPLIER = 1.4;

    W_SPACE_PER_INVADER_MULTIPLIER = 1.8;

    CLEAR_SCALE = .3;

    function SpaceInvadersGame(_at_dest) {
      var currentDir;
      this.dest = _at_dest;
      currentDir = getJsFileDir("SpaceInvaders.js");
      this.resources = new ResourceLoader([
        {
          url: currentDir + INVADER_SPRITE,
          id: INVADER_SPRITE
        }, {
          url: currentDir + CANNON_SPRITE,
          id: CANNON_SPRITE
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
      var i, rank, type, _i, _len, _ref, _results;
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
            _results1.push(this.invaders.push(new Invader(this.resources.get(INVADER_SPRITE), type, rank, this.gameField.x + i * this.hSpacePerInvader, this.gameField.y + rank * this.wSpacePerInvader, this.gameFieldBounds, this.invaderScale)));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    SpaceInvadersGame.prototype.vivaLaResistance = function() {
      return this.cannon = new Cannon(this.resources.get(CANNON_SPRITE), this.gameField.x, this.gameField.y + this.gameField.height - Cannon.SPRITE_HEIGHT * this.invaderScale, this.gameFieldBounds, this.invaderScale);
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

    SpaceInvadersGame.prototype.clearGameField = function() {
      return this.ctx.clearRect(this.gameField.x, this.gameField.y, this.gameField.width, this.gameField.height);
    };

    SpaceInvadersGame.prototype.update = function() {
      var advanceFlags, invader, projectile, rankId, rankType, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      this.frame++;
      if (this.frame % REDRAW_RATE !== 0) {
        return;
      }
      this.clearGameField();
      this.animationFrame++;
      _ref = this.projectiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        projectile = _ref[_i];
        projectile.update();
      }
      advanceFlags = [];
      _ref1 = this.invaderRanks;
      for (rankId = _j = 0, _len1 = _ref1.length; _j < _len1; rankId = ++_j) {
        rankType = _ref1[rankId];
        advanceFlags[rankId] = false;
      }
      _ref2 = this.invaders;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        invader = _ref2[_k];
        advanceFlags[invader.rank] = advanceFlags[invader.rank] || invader.checkAdvance(invader.rank);
      }
      _ref3 = this.invaders;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        invader = _ref3[_l];
        invader.update(this.animationFrame, advanceFlags);
      }
      return this.handleKeyboardInteraction();
    };

    SpaceInvadersGame.prototype.checkDestroyedObjects = function() {
      this.projectiles = _.filter(this.projectiles, function(projectile) {
        return !projectile.isDestroyed();
      });
      return this.invaders = _.filter(this.invaders, function(invader) {
        return !invader.isDestroyed();
      });
    };

    SpaceInvadersGame.prototype.handleKeyboardInteraction = function() {
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
      return this.cannon.render(this.ctx, this.animationFrame);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRlc3Ryb3lhYmxlLmNvZmZlZSIsIlNwcml0ZS5jb2ZmZWUiLCJDYW5ub24uY29mZmVlIiwiSW52YWRlci5jb2ZmZWUiLCJLZXlib2FyZC5jb2ZmZWUiLCJSZXNvdXJjZUxvYWRlci5jb2ZmZWUiLCJTcGFjZUludmFkZXJzR2FtZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBTTtBQUNTLElBQUEscUJBQUMsU0FBRCxHQUFBOztRQUFDLFlBQVk7T0FDMUI7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsU0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixLQURoQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBRlosQ0FEYTtJQUFBLENBQWQ7O0FBQUEsMEJBS0EsYUFBQSxHQUFnQixTQUFDLFNBQUQsR0FBQTthQUNmLElBQUMsQ0FBQSxVQUFELEdBQWMsVUFEQztJQUFBLENBTGhCLENBQUE7O0FBQUEsMEJBUUEsVUFBQSxHQUFhLFNBQUEsR0FBQTtBQUNaLE1BQUEsSUFBRyxJQUFDLENBQUEsWUFBSjtBQUNDLGVBQU8sS0FBUCxDQUREO09BQUE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLFFBQUo7QUFDQyxRQUFBLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxLQUFQLENBRkQ7T0FIQTtBQU9BLGFBQU8sSUFBUCxDQVJZO0lBQUEsQ0FSYixDQUFBOztBQUFBLDBCQWtCQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsVUFBRCxFQUFBLENBQUE7QUFFQSxNQUFBLElBQUcsSUFBQyxDQUFBLFVBQUQsSUFBZSxDQUFsQjtlQUNDLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBRGpCO09BSFc7SUFBQSxDQWxCWixDQUFBOztBQUFBLDBCQXdCQSxPQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELENBQUEsRUFGUztJQUFBLENBeEJWLENBQUE7O0FBQUEsMEJBNEJBLE1BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsVUFBRCxDQUFBLEVBRFE7SUFBQSxDQTVCVCxDQUFBOztBQUFBLDBCQStCQSxXQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ2IsSUFBQyxDQUFBLGFBRFk7SUFBQSxDQS9CZCxDQUFBOztBQUFBLDBCQWtDQSxPQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLFNBRFE7SUFBQSxDQWxDVixDQUFBOzt1QkFBQTs7TUFERCxDQUFBOztBQUFBLEVBc0NBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFdBdENyQixDQUFBO0FBQUE7OztBQ0FBO0FBQUEsTUFBQSxNQUFBO0lBQUE7aUNBQUE7O0FBQUEsRUFBTTtBQUNMLDZCQUFBLENBQUE7O0FBQWMsSUFBQSxnQkFBQyxPQUFELEVBQU8sV0FBUCxFQUFxQixXQUFyQixFQUFtQyxLQUFuQyxFQUEyQyxLQUEzQyxFQUFtRCxLQUFuRCxFQUEyRCxLQUEzRCxFQUFtRSxnQkFBbkUsRUFBa0YsaUJBQWxGLEdBQUE7QUFDYixNQURjLElBQUMsQ0FBQSxNQUFELE9BQ2QsQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxnQ0FBRCxjQUFXLENBQy9CLENBQUE7QUFBQSxNQURrQyxJQUFDLENBQUEsZ0NBQUQsY0FBVyxDQUM3QyxDQUFBO0FBQUEsTUFEZ0QsSUFBQyxDQUFBLG9CQUFELFFBQUssQ0FDckQsQ0FBQTtBQUFBLE1BRHdELElBQUMsQ0FBQSxvQkFBRCxRQUFLLENBQzdELENBQUE7QUFBQSxNQURnRSxJQUFDLENBQUEsb0JBQUQsUUFBSyxDQUNyRSxDQUFBO0FBQUEsTUFEd0UsSUFBQyxDQUFBLG9CQUFELFFBQUssQ0FDN0UsQ0FBQTtBQUFBLE1BRGdGLElBQUMsQ0FBQSxlQUFELGdCQUNoRixDQUFBO0FBQUEsTUFEK0YsSUFBQyxDQUFBLGdCQUFELGlCQUMvRixDQUFBO0FBQUEsTUFBQSxzQ0FBQSxDQUFBLENBRGE7SUFBQSxDQUFkOztBQUFBLHFCQUdBLE1BQUEsR0FBUyxTQUFDLEdBQUQsR0FBQTthQUNSLEdBQUcsQ0FBQyxTQUFKLENBQWMsSUFBQyxDQUFBLEdBQWYsRUFBb0IsSUFBQyxDQUFBLE9BQXJCLEVBQThCLElBQUMsQ0FBQSxPQUEvQixFQUF3QyxJQUFDLENBQUEsQ0FBekMsRUFBNEMsSUFBQyxDQUFBLENBQTdDLEVBQWdELElBQUMsQ0FBQSxDQUFqRCxFQUFvRCxJQUFDLENBQUEsQ0FBckQsRUFBd0QsSUFBQyxDQUFBLFlBQXpELEVBQXVFLElBQUMsQ0FBQSxhQUF4RSxFQURRO0lBQUEsQ0FIVCxDQUFBOztrQkFBQTs7S0FEb0IsWUFBckIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE1BUGhCLENBQUE7QUFBQTs7O0FDQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7aUNBQUE7O0FBQUEsRUFBTTtBQUVMLGlDQUFBLENBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsS0FBRCxHQUFTLENBQVQsQ0FBQTs7QUFBQSxJQUNBLFVBQUMsQ0FBQSxNQUFELEdBQVUsRUFEVixDQUFBOztBQUFBLElBR0EsVUFBQyxDQUFBLEtBQUQsR0FBVSxTQUhWLENBQUE7O0FBS2MsSUFBQSxvQkFBQyxLQUFELEVBQUssS0FBTCxFQUFTLFNBQVQsRUFBaUIsWUFBakIsRUFBNEIsVUFBNUIsRUFBcUMsU0FBckMsR0FBQTtBQUNiLE1BRGMsSUFBQyxDQUFBLElBQUQsS0FDZCxDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLElBQUQsS0FDbEIsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxRQUFELFNBQ3RCLENBQUE7QUFBQSxNQUQ4QixJQUFDLENBQUEsV0FBRCxZQUM5QixDQUFBO0FBQUEsTUFEeUMsSUFBQyxDQUFBLFNBQUQsVUFDekMsQ0FBQTtBQUFBLE1BRGtELElBQUMsQ0FBQSxRQUFELFNBQ2xELENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLFVBQVUsQ0FBQyxLQUFYLEdBQW1CLElBQUMsQ0FBQSxLQUFwQyxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixVQUFVLENBQUMsTUFBWCxHQUFvQixJQUFDLENBQUEsS0FEdEMsQ0FBQTtBQUFBLE1BR0EsMENBQUEsQ0FIQSxDQURhO0lBQUEsQ0FMZDs7QUFBQSx5QkFXQSxNQUFBLEdBQVMsU0FBQyxjQUFELEdBQUE7QUFDUixNQUFBLHFDQUFBLENBQUEsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUg7QUFDQyxjQUFBLENBREQ7T0FGQTtBQUFBLE1BS0EsSUFBQyxDQUFBLENBQUQsSUFBTSxJQUFDLENBQUEsUUFBUSxDQUFDLENBTGhCLENBQUE7QUFPQSxNQUFBLElBQUcsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFsQjtlQUNDLElBQUMsQ0FBQSxPQUFELENBQUEsRUFERDtPQVJRO0lBQUEsQ0FYVCxDQUFBOztBQUFBLHlCQXNCQSxNQUFBLEdBQVMsU0FBQyxHQUFELEdBQUE7QUFDUixNQUFBLElBQUcsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFIO0FBQ0MsY0FBQSxDQUREO09BQUE7QUFBQSxNQUdBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLFVBQVUsQ0FBQyxLQUgzQixDQUFBO2FBSUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxZQUFELEdBQWMsQ0FBaEMsRUFBbUMsSUFBQyxDQUFBLENBQXBDLEVBQXVDLElBQUMsQ0FBQSxZQUF4QyxFQUFzRCxJQUFDLENBQUEsYUFBdkQsRUFMUTtJQUFBLENBdEJULENBQUE7O3NCQUFBOztLQUZ3QixZQUF6QixDQUFBOztBQUFBLEVBZ0NNO0FBQ0wsUUFBQSx1RkFBQTs7QUFBQSw2QkFBQSxDQUFBOztBQUFBLElBQUEsTUFBQyxDQUFBLFlBQUQsR0FBZ0IsRUFBaEIsQ0FBQTs7QUFBQSxJQUNBLE1BQUMsQ0FBQSxhQUFELEdBQWlCLEVBRGpCLENBQUE7O0FBQUEsSUFHQSxNQUFDLENBQUEsY0FBRCxHQUFrQixDQUhsQixDQUFBOztBQUFBLElBSUEsTUFBQyxDQUFBLGVBQUQsR0FBbUIsQ0FKbkIsQ0FBQTs7QUFBQSxJQU1BLHVCQUFBLEdBQTBCLEVBTjFCLENBQUE7O0FBQUEsSUFPQSxnQkFBQSxHQUFtQixDQVBuQixDQUFBOztBQUFBLElBU0Esc0JBQUEsR0FBeUIsRUFUekIsQ0FBQTs7QUFBQSxJQVdBLG9CQUFBLEdBQXVCLEVBWHZCLENBQUE7O0FBYWMsSUFBQSxnQkFBQyxPQUFELEVBQU8sS0FBUCxFQUFXLEtBQVgsRUFBZSxVQUFmLEVBQXdCLFNBQXhCLEdBQUE7QUFDYixNQURjLElBQUMsQ0FBQSxNQUFELE9BQ2QsQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxJQUFELEtBQ3BCLENBQUE7QUFBQSxNQUR3QixJQUFDLENBQUEsSUFBRCxLQUN4QixDQUFBO0FBQUEsTUFENEIsSUFBQyxDQUFBLFNBQUQsVUFDNUIsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSxRQUFELFNBQ3JDLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLElBQUMsQ0FBQSxLQUF2QyxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixNQUFNLENBQUMsYUFBUCxHQUF1QixJQUFDLENBQUEsS0FEekMsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUhSLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixDQUx0QixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBUEEsQ0FBQTtBQUFBLE1BU0Esd0NBQU0sSUFBQyxDQUFBLEdBQVAsRUFDQyxDQURELEVBRUMsQ0FGRCxFQUdDLE1BQU0sQ0FBQyxZQUhSLEVBSUMsTUFBTSxDQUFDLGFBSlIsRUFLQyxJQUFDLENBQUEsQ0FMRixFQU1DLElBQUMsQ0FBQSxDQU5GLEVBT0MsSUFBQyxDQUFBLFlBUEYsRUFRQyxJQUFDLENBQUEsYUFSRixDQVRBLENBRGE7SUFBQSxDQWJkOztBQUFBLHFCQWtDQSxJQUFBLEdBQU8sU0FBQyxjQUFELEdBQUE7QUFDTixVQUFBLHdCQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLFVBQUQsQ0FBQSxDQUFQO0FBQ0MsY0FBQSxDQUREO09BQUE7QUFBQSxNQUVBLFlBQUEsR0FBZSxJQUFDLENBQUEscUJBQUQsQ0FBQSxDQUZmLENBQUE7QUFBQSxNQUdBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQ2hCLFlBQVksQ0FBQyxDQURHLEVBRWhCLFlBQVksQ0FBQyxDQUZHLEVBR2hCLElBSGdCLEVBSWhCO0FBQUEsUUFBRSxDQUFBLEVBQUksQ0FBTjtBQUFBLFFBQVMsQ0FBQSxFQUFJLENBQUEsc0JBQWI7T0FKZ0IsRUFLaEIsSUFBQyxDQUFBLE1BTGUsRUFNaEIsSUFBQyxDQUFBLEtBTmUsQ0FIakIsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQVhBLENBQUE7QUFZQSxhQUFPLFVBQVAsQ0FiTTtJQUFBLENBbENQLENBQUE7O0FBQUEscUJBaURBLHFCQUFBLEdBQXdCLFNBQUEsR0FBQTtBQUN2QixVQUFBLE1BQUE7YUFBQSxNQUFBLEdBQ0M7QUFBQSxRQUFBLENBQUEsRUFBSSxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxZQUFELEdBQWUsQ0FBeEI7QUFBQSxRQUNBLENBQUEsRUFBSSxJQUFDLENBQUEsQ0FETDtRQUZzQjtJQUFBLENBakR4QixDQUFBOztBQUFBLHFCQXNEQSxVQUFBLEdBQWEsU0FBQSxHQUFBO2FBQ1osSUFBQyxDQUFBLFlBRFc7SUFBQSxDQXREYixDQUFBOztBQUFBLHFCQXlEQSxVQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUFDLENBQUEsa0JBQUQsR0FBc0Isb0JBQXRCLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLE1BRkg7SUFBQSxDQXpEYixDQUFBOztBQUFBLHFCQTZEQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBSDtBQUNDLGNBQUEsQ0FERDtPQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsa0JBQUQsRUFIQSxDQUFBO0FBSUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxrQkFBRCxJQUF1QixDQUExQjtlQUNDLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FEaEI7T0FMYTtJQUFBLENBN0RkLENBQUE7O0FBQUEscUJBc0VBLE1BQUEsR0FBUyxTQUFDLGNBQUQsRUFBaUIsU0FBakIsR0FBQTtBQUNSLE1BQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFSO0FBQ0MsY0FBQSxDQUREO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FIQSxDQUFBO0FBTUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxXQUFGLENBQWMsU0FBZCxDQUFIO0FBQ0MsY0FBQSxDQUREO09BTkE7QUFBQSxNQVNBLElBQUMsQ0FBQSxDQUFELElBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLENBQVQsRUFBYSxTQUFiLENBQUEsR0FBMEIsZ0JBVGhDLENBQUE7QUFXQSxNQUFBLElBQXNCLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBckM7QUFBQSxRQUFBLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBZixDQUFBO09BWEE7QUFZQSxNQUFBLElBQXNDLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBQyxDQUFBLFlBQU4sR0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBckU7ZUFBQSxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQVYsR0FBZ0IsSUFBQyxDQUFBLGFBQXRCO09BYlE7SUFBQSxDQXRFVCxDQUFBOztBQUFBLHFCQXFGQSxNQUFBLEdBQVMsU0FBQyxHQUFELEVBQUssY0FBTCxHQUFBO0FBQ1IsTUFBQSxJQUFBLENBQUEsQ0FBTyxjQUFBLEdBQWlCLHVCQUF4QixDQUFBO0FBQ0MsY0FBQSxDQUREO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFGUixDQUFBO2FBR0EsbUNBQU0sR0FBTixFQUpRO0lBQUEsQ0FyRlQsQ0FBQTs7a0JBQUE7O0tBRG9CLE9BaENyQixDQUFBOztBQUFBLEVBNkhBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE1BN0hoQixDQUFBO0FBQUE7OztBQ0FBO0FBQUEsTUFBQSxPQUFBO0lBQUE7aUNBQUE7O0FBQUEsRUFBTTtBQUNMLFFBQUEsMk5BQUE7O0FBQUEsOEJBQUEsQ0FBQTs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxZQUFELEdBQWdCLEVBQWhCLENBQUE7O0FBQUEsSUFDQSxPQUFDLENBQUEsYUFBRCxHQUFpQixFQURqQixDQUFBOztBQUFBLElBR0EsT0FBQyxDQUFBLGtCQUFELEdBQXNCLENBSHRCLENBQUE7O0FBQUEsSUFJQSxPQUFDLENBQUEsbUJBQUQsR0FBdUIsQ0FKdkIsQ0FBQTs7QUFBQSxJQUtBLE9BQUMsQ0FBQSxrQkFBRCxHQUFzQixDQUx0QixDQUFBOztBQUFBLElBT0Esc0JBQUEsR0FBeUIsQ0FQekIsQ0FBQTs7QUFBQSxJQVFBLHVCQUFBLEdBQTBCLENBUjFCLENBQUE7O0FBQUEsSUFjQSx5QkFBQSxHQUE0QixFQUFBLEdBQUcsQ0FkL0IsQ0FBQTs7QUFBQSxJQWdCQSxrQkFBQSxHQUFxQixPQUFPLENBQUMsWUFBUixHQUF1QixDQWhCNUMsQ0FBQTs7QUFBQSxJQWlCQSxrQkFBQSxHQUFxQixDQWpCckIsQ0FBQTs7QUFBQSxJQWtCQSxxQkFBQSxHQUF3QixFQWxCeEIsQ0FBQTs7QUFBQSxJQW1CQSwyQkFBQSxHQUE4QixFQW5COUIsQ0FBQTs7QUFBQSxJQXNCQSx3QkFBQSxHQUE0QixFQXRCNUIsQ0FBQTs7QUFBQSxJQXVCQSxtQkFBQSxHQUFzQixDQXZCdEIsQ0FBQTs7QUF5QmMsSUFBQSxpQkFBQyxPQUFELEVBQU8sUUFBUCxFQUFjLFFBQWQsRUFBcUIsS0FBckIsRUFBeUIsS0FBekIsRUFBNkIsVUFBN0IsRUFBc0MsU0FBdEMsR0FBQTtBQUNiLFVBQUEsS0FBQTtBQUFBLE1BRGMsSUFBQyxDQUFBLE1BQUQsT0FDZCxDQUFBO0FBQUEsTUFEb0IsSUFBQyxDQUFBLE9BQUQsUUFDcEIsQ0FBQTtBQUFBLE1BRDJCLElBQUMsQ0FBQSxPQUFELFFBQzNCLENBQUE7QUFBQSxNQURrQyxJQUFDLENBQUEsSUFBRCxLQUNsQyxDQUFBO0FBQUEsTUFEc0MsSUFBQyxDQUFBLElBQUQsS0FDdEMsQ0FBQTtBQUFBLE1BRDBDLElBQUMsQ0FBQSxTQUFELFVBQzFDLENBQUE7QUFBQSxNQURtRCxJQUFDLENBQUEsUUFBRCxTQUNuRCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUFqQixDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsa0JBQVQsRUFBNEIsT0FBTyxDQUFDLG1CQUFwQyxFQUF3RCxPQUFPLENBQUMsa0JBQWhFLENBRlIsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLENBQU8sS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFDLENBQUEsSUFBZixDQUFBLElBQXdCLENBQS9CLENBQUE7QUFFQyxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBTyxDQUFDLGtCQUFoQixDQUZEO09BSkE7QUFBQSxNQVFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLHlCQVJoQixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsUUFBRCxHQUFZLHlCQVRaLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxRQUFELEdBQVk7QUFBQSxRQUFFLENBQUEsRUFBSSxrQkFBTjtBQUFBLFFBQTBCLENBQUEsRUFBSSxDQUE5QjtPQVhaLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLElBQUMsQ0FBQSxLQWJ4QyxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsYUFBRCxHQUFpQixPQUFPLENBQUMsYUFBUixHQUF3QixJQUFDLENBQUEsS0FkMUMsQ0FBQTtBQUFBLE1BZ0JBLHlDQUNDLElBQUMsQ0FBQSxHQURGLEVBRUMsSUFBQyxDQUFBLGFBQUQsR0FBaUIsT0FBTyxDQUFDLFlBRjFCLEVBR0MsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUMsYUFIakIsRUFJQyxPQUFPLENBQUMsWUFKVCxFQUtDLE9BQU8sQ0FBQyxhQUxULEVBTUMsSUFBQyxDQUFBLENBTkYsRUFPQyxJQUFDLENBQUEsQ0FQRixFQVFDLElBQUMsQ0FBQSxZQVJGLEVBU0MsSUFBQyxDQUFBLGFBVEYsQ0FoQkEsQ0FEYTtJQUFBLENBekJkOztBQUFBLHNCQXNEQSxNQUFBLEdBQVMsU0FBQyxjQUFELEVBQWdCLFlBQWhCLEdBQUE7QUFDUixVQUFBLGdCQUFBO0FBQUEsTUFBQSxrQ0FBQSxDQUFBLENBQUE7QUFFQSxNQUFBLElBQUcsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFIO0FBQ0MsY0FBQSxDQUREO09BRkE7QUFBQSxNQUtBLGdCQUFBLEdBQW1CLENBQUMsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLElBQXhCLENBQUEsR0FBZ0Msd0JBTG5ELENBQUE7QUFNQSxNQUFBLElBQUcsY0FBQSxJQUFrQixnQkFBckI7QUFDQyxjQUFBLENBREQ7T0FOQTtBQVFBLE1BQUEsSUFBTyxJQUFDLENBQUEsWUFBRCxFQUFBLEtBQW1CLENBQTFCO0FBQ0MsUUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsQ0FBQTtBQUNBLGNBQUEsQ0FGRDtPQVJBO0FBQUEsTUFXQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBWFIsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLFFBWmpCLENBQUE7QUFBQSxNQWNBLElBQUMsQ0FBQSxjQUFELENBQWdCLFlBQWhCLENBZEEsQ0FBQTtBQUFBLE1BZUEsSUFBQyxDQUFBLENBQUQsSUFBTSxJQUFDLENBQUEsUUFBUSxDQUFDLENBZmhCLENBQUE7QUFBQSxNQWdCQSxJQUFDLENBQUEsQ0FBRCxJQUFNLElBQUMsQ0FBQSxRQUFRLENBQUMsQ0FoQmhCLENBQUE7QUFpQkEsTUFBQSxJQUFPLGNBQUEsR0FBaUIsdUJBQWpCLEtBQTRDLENBQW5EO0FBQ0MsY0FBQSxDQUREO09BakJBO0FBQUEsTUFtQkEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBQSxHQUFJLElBQUMsQ0FBQSxhQW5CdEIsQ0FBQTthQW9CQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxhQUFELEdBQWlCLE9BQU8sQ0FBQyxhQXJCNUI7SUFBQSxDQXREVCxDQUFBOztBQUFBLHNCQStFQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDZCxNQUFBLElBQU8sSUFBQSxLQUFRLElBQUMsQ0FBQSxJQUFoQjtBQUNDLGVBQU8sS0FBUCxDQUREO09BQUE7QUFFQSxhQUFPLENBQUMsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFDLENBQUEsWUFBRCxHQUFjLElBQUEsQ0FBSyxJQUFDLENBQUEsUUFBUSxDQUFDLENBQWYsQ0FBbkIsR0FBdUMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxDQUFqRCxJQUFzRCxJQUFDLENBQUEsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFqRSxDQUFBLElBQ04sQ0FBQyxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxZQUFELEdBQWMsSUFBQSxDQUFLLElBQUMsQ0FBQSxRQUFRLENBQUMsQ0FBZixDQUFuQixHQUF1QyxJQUFDLENBQUEsUUFBUSxDQUFDLENBQWpELElBQXNELElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQWpFLENBREQsQ0FIYztJQUFBLENBL0VmLENBQUE7O0FBQUEsc0JBcUZBLGNBQUEsR0FBaUIsU0FBQyxZQUFELEdBQUE7QUFFaEIsTUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLENBQVYsR0FBYyxDQUFkLENBQUE7QUFDQSxNQUFBLElBQUcsWUFBYSxDQUFBLElBQUMsQ0FBQSxJQUFELENBQWhCO0FBQ0MsUUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLENBQVYsR0FBYyxDQUFBLElBQUcsQ0FBQSxRQUFRLENBQUMsQ0FBMUIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsQ0FBVixHQUFjLHFCQUFBLEdBQXdCLElBQUMsQ0FBQSxjQUZ4QztPQUhnQjtJQUFBLENBckZqQixDQUFBOztBQUFBLElBNEZBLElBQUEsR0FBTyxTQUFDLEdBQUQsR0FBQTtBQUNOLE1BQUEsSUFBRyxHQUFBLElBQU8sQ0FBVjtBQUNDLGVBQU8sQ0FBUCxDQUREO09BQUE7QUFFQSxhQUFPLENBQUEsQ0FBUCxDQUhNO0lBQUEsQ0E1RlAsQ0FBQTs7bUJBQUE7O0tBRHFCLE9BQXRCLENBQUE7O0FBQUEsRUFpR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FqR2pCLENBQUE7QUFBQTs7O0FDQ0E7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBTTtBQUNMLElBQUEsUUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFBakIsQ0FBQTs7QUFBQSxJQUNBLFFBQUMsQ0FBQSxjQUFELEdBQWtCLEVBRGxCLENBQUE7O0FBQUEsSUFFQSxRQUFDLENBQUEsY0FBRCxHQUFrQixFQUZsQixDQUFBOztBQUljLElBQUEsa0JBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFEZixDQUFBO0FBQUEsTUFHQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMkIsU0FBM0IsRUFBcUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUNwQyxLQUFDLENBQUEsUUFBUyxDQUFBLEtBQUssQ0FBQyxPQUFOLENBQVYsR0FBMkIsS0FEUztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLENBSEEsQ0FBQTtBQUFBLE1BS0EsUUFBUSxDQUFDLGdCQUFULENBQTJCLE9BQTNCLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDbEMsTUFBQSxDQUFBLEtBQVEsQ0FBQSxRQUFTLENBQUEsS0FBSyxDQUFDLE9BQU4sRUFEaUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxDQUxBLENBRGE7SUFBQSxDQUpkOztBQUFBLHVCQWNBLE1BQUEsR0FBUyxTQUFDLE9BQUQsR0FBQTtBQUNSLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFDLENBQUEsUUFBYixDQUFBLENBQUE7QUFDQSxhQUFPLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBQyxDQUFBLFFBQVAsRUFBZ0IsT0FBaEIsQ0FBUCxDQUZRO0lBQUEsQ0FkVCxDQUFBOztBQUFBLHVCQWtCQSxTQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDWCxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBQyxDQUFBLFFBQWIsRUFBdUIsSUFBQyxDQUFBLFdBQXhCLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsQ0FBSDtBQUNDLFFBQUEsSUFBQyxDQUFBLFdBQVksQ0FBQSxPQUFBLENBQWIsR0FBd0IsSUFBeEIsQ0FBQTtBQUNBLGVBQU8sSUFBUCxDQUZEO09BREE7QUFLQSxNQUFBLElBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsV0FBUCxFQUFvQixPQUFwQixDQUFIO0FBQ0MsZUFBTyxLQUFQLENBREQ7T0FMQTtBQU9BLGFBQU8sS0FBUCxDQVJXO0lBQUEsQ0FsQlosQ0FBQTs7b0JBQUE7O01BREQsQ0FBQTs7QUFBQSxFQTZCQSxNQUFNLENBQUMsUUFBUCxHQUFrQixRQTdCbEIsQ0FBQTtBQUFBOzs7QUNEQTtBQUFBLE1BQUEsY0FBQTtJQUFBO2lDQUFBOztBQUFBLEVBQU07QUFDTCxxQ0FBQSxDQUFBOztBQUFjLElBQUEsd0JBQUMsU0FBRCxFQUFXLFFBQVgsR0FBQTtBQUNiLFVBQUEsMEJBQUE7QUFBQSxNQUFBLElBQUcsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxTQUFYLENBQUg7QUFDQyxRQUFBLFNBQUEsR0FBWTtVQUFDO0FBQUEsWUFBQyxHQUFBLEVBQU0sU0FBUDtBQUFBLFlBQWtCLEVBQUEsRUFBSyxTQUF2QjtXQUFEO1NBQVosQ0FERDtPQUFBO0FBRUEsTUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsU0FBVixDQUFIO0FBQ0MsUUFBQSxLQUFBLEdBQVEsSUFBUixDQUFBO0FBQ0EsYUFBQSxnREFBQTtvQ0FBQTtBQUFBLFVBQUEsS0FBQSxJQUFVLENBQUMsQ0FBQyxRQUFGLENBQVcsU0FBWCxDQUFBLElBQTBCLENBQUMsQ0FBQyxHQUFGLENBQU0sU0FBTixFQUFpQixLQUFqQixDQUFwQyxDQUFBO0FBQUEsU0FEQTtBQUVBLFFBQUEsSUFBQSxDQUFBLEtBQUE7QUFDQyxnQkFBTyxrRUFBUCxDQUREO1NBSEQ7T0FGQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxFQVJWLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxVQUFELENBQVksU0FBWixFQUF1QixRQUF2QixDQVZBLENBRGE7SUFBQSxDQUFkOztBQUFBLDZCQWFBLFVBQUEsR0FBYSxTQUFDLFNBQUQsRUFBVyxRQUFYLEdBQUE7O1FBQVcsV0FBUyxTQUFBLEdBQUE7T0FDaEM7YUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFNBQVgsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsU0FBRCxFQUFXLFNBQVgsR0FBQTtBQUNyQixjQUFBLEdBQUE7QUFBQSxVQUFBLEdBQUEsR0FBVSxJQUFBLEtBQUEsQ0FBQSxDQUFWLENBQUE7QUFBQSxVQUVBLEdBQUcsQ0FBQyxNQUFKLEdBQWEsU0FBQSxHQUFBO0FBQ1osWUFBQSxLQUFDLENBQUEsTUFBTyxDQUFBLFNBQVMsQ0FBQyxFQUFWLElBQWdCLFNBQVMsQ0FBQyxHQUExQixDQUFSLEdBQXlDLEdBQXpDLENBQUE7bUJBRUEsU0FBQSxDQUFVLElBQVYsRUFIWTtVQUFBLENBRmIsQ0FBQTtpQkFNQSxHQUFHLENBQUMsR0FBSixHQUFVLFNBQVMsQ0FBQyxJQVBDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsRUFRRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7QUFDRCxVQUFBLFFBQUEsQ0FBQSxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTyxPQUFQLEVBRkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJGLEVBRFk7SUFBQSxDQWJiLENBQUE7O0FBQUEsNkJBMEJBLEdBQUEsR0FBTSxTQUFDLE9BQUQsR0FBQTtBQUNMLE1BQUEsSUFBQSxDQUFBLENBQVEsQ0FBQyxHQUFGLENBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxPQUFmLENBQVA7QUFDQyxjQUFPLG9DQUFQLENBREQ7T0FBQTthQUVBLElBQUMsQ0FBQSxNQUFPLENBQUEsT0FBQSxFQUhIO0lBQUEsQ0ExQk4sQ0FBQTs7MEJBQUE7O0tBRDRCLGNBQTdCLENBQUE7O0FBQUEsRUFnQ0EsTUFBTSxDQUFDLGNBQVAsR0FBd0IsY0FoQ3hCLENBQUE7QUFBQTs7O0FDRUE7QUFBQSxNQUFBLGlCQUFBO0lBQUE7aUNBQUE7O0FBQUEsRUFBTTtBQUNMLFFBQUEsd1BBQUE7O0FBQUEsd0NBQUEsQ0FBQTs7QUFBQSxJQUFBLGFBQUEsR0FBZ0IsR0FBaEIsQ0FBQTs7QUFBQSxJQUNBLFlBQUEsR0FBZSxHQURmLENBQUE7O0FBQUEsSUFFQSxjQUFBLEdBQWtCLHNCQUZsQixDQUFBOztBQUFBLElBR0EsYUFBQSxHQUFpQixvQkFIakIsQ0FBQTs7QUFBQSxJQUlBLFFBQUEsR0FBWSxNQUpaLENBQUE7O0FBQUEsSUFLQSxXQUFBLEdBQWMsQ0FMZCxDQUFBOztBQUFBLElBT0EsYUFBQSxHQUFnQixHQVBoQixDQUFBOztBQUFBLElBUUEsYUFBQSxHQUFnQixFQVJoQixDQUFBOztBQUFBLElBU0EsV0FBQSxHQUFjLEVBVGQsQ0FBQTs7QUFBQSxJQVdBLGlCQUFBLEdBQW9CLEVBWHBCLENBQUE7O0FBQUEsSUFhQSxZQUFBLEdBQWUsQ0FiZixDQUFBOztBQUFBLElBZUEsOEJBQUEsR0FBaUMsR0FmakMsQ0FBQTs7QUFBQSxJQWdCQSw4QkFBQSxHQUFpQyxHQWhCakMsQ0FBQTs7QUFBQSxJQWtCQSxXQUFBLEdBQWMsRUFsQmQsQ0FBQTs7QUFvQmMsSUFBQSwyQkFBQyxRQUFELEdBQUE7QUFDYixVQUFBLFVBQUE7QUFBQSxNQURjLElBQUMsQ0FBQSxPQUFELFFBQ2QsQ0FBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLFlBQUEsQ0FBYyxrQkFBZCxDQUFiLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsY0FBQSxDQUFlO1FBQy9CO0FBQUEsVUFBQyxHQUFBLEVBQU0sVUFBQSxHQUFhLGNBQXBCO0FBQUEsVUFBb0MsRUFBQSxFQUFLLGNBQXpDO1NBRCtCLEVBRS9CO0FBQUEsVUFBQyxHQUFBLEVBQU0sVUFBQSxHQUFhLGFBQXBCO0FBQUEsVUFBbUMsRUFBQSxFQUFLLGFBQXhDO1NBRitCO09BQWYsRUFHZCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNGLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFERTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSGMsQ0FGakIsQ0FEYTtJQUFBLENBcEJkOztBQUFBLGdDQTZCQSxJQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ04sTUFBQSxDQUFBLENBQUUsSUFBQyxDQUFBLElBQUgsQ0FBUSxDQUFDLE1BQVQsQ0FBaUIsMENBQWpCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGNBQVQsQ0FBeUIsbUJBQXpCLENBRlYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBb0IsSUFBcEIsQ0FIUCxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLFFBQUEsQ0FBQSxDQUxoQixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUIsQ0FQbkIsQ0FBQTthQVNBLElBQUMsQ0FBQSxTQUFELENBQUEsRUFWTTtJQUFBLENBN0JQLENBQUE7O0FBQUEsZ0NBeUNBLGFBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2YsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FDQztBQUFBLFFBQUEsQ0FBQSxFQUFJLFdBQUo7QUFBQSxRQUNBLENBQUEsRUFBSSxhQURKO0FBQUEsUUFFQSxLQUFBLEVBQVEsWUFBQSxHQUFlLFdBQUEsR0FBYyxDQUZyQztBQUFBLFFBR0EsTUFBQSxFQUFTLGFBQUEsR0FBZ0IsYUFBaEIsR0FBZ0MsYUFIekM7T0FERCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsZUFBRCxHQUNDO0FBQUEsUUFBQSxDQUFBLEVBQ0M7QUFBQSxVQUFBLEdBQUEsRUFBTSxJQUFDLENBQUEsU0FBUyxDQUFDLENBQWpCO0FBQUEsVUFDQSxHQUFBLEVBQU0sSUFBQyxDQUFBLFNBQVMsQ0FBQyxDQUFYLEdBQWUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQURoQztTQUREO0FBQUEsUUFHQSxDQUFBLEVBQ0M7QUFBQSxVQUFBLEdBQUEsRUFBTSxJQUFDLENBQUEsU0FBUyxDQUFDLENBQWpCO0FBQUEsVUFDQSxHQUFBLEVBQU0sSUFBQyxDQUFBLFNBQVMsQ0FBQyxDQUFYLEdBQWUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQURoQztTQUpEO09BUEQsQ0FBQTtBQUFBLE1BY0EsQ0FBQSxDQUFHLG9CQUFILENBQXVCLENBQUMsSUFBeEIsQ0FBOEIsUUFBOUIsRUFBc0MsYUFBdEMsQ0FkQSxDQUFBO0FBQUEsTUFlQSxDQUFBLENBQUcsb0JBQUgsQ0FBdUIsQ0FBQyxJQUF4QixDQUE4QixPQUE5QixFQUFxQyxZQUFyQyxDQWZBLENBQUE7QUFBQSxNQWdCQSxDQUFBLENBQUcsb0JBQUgsQ0FBdUIsQ0FBQyxHQUF4QixDQUE2QixrQkFBN0IsRUFBaUQsUUFBakQsQ0FoQkEsQ0FBQTtBQUFBLE1BaUJBLENBQUEsQ0FBRyxvQkFBSCxDQUF1QixDQUFDLEdBQXhCLENBQTZCLHVCQUE3QixFQUF1RCxNQUF2RCxDQWpCQSxDQUFBO0FBQUEsTUFrQkEsUUFBQSxHQUFXLENBQUUsVUFBRixFQUFhLFNBQWIsRUFBdUIsT0FBdkIsRUFBK0IsTUFBL0IsRUFBc0MsRUFBdEMsQ0FsQlgsQ0FBQTtBQW1CQTtXQUFBLCtDQUFBOzhCQUFBO0FBQUEsc0JBQUEsQ0FBQSxDQUFHLG9CQUFILENBQXVCLENBQUMsR0FBeEIsQ0FBK0IsTUFBRCxHQUFRLGFBQXRDLEVBQXFELE1BQXJELEVBQUEsQ0FBQTtBQUFBO3NCQXBCZTtJQUFBLENBekNoQixDQUFBOztBQUFBLGdDQWdFQSxNQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1IsVUFBQSx1Q0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FDZixPQUFPLENBQUMsa0JBRE8sRUFFZixPQUFPLENBQUMsbUJBRk8sRUFHZixPQUFPLENBQUMsbUJBSE8sRUFJZixPQUFPLENBQUMsa0JBSk8sRUFLZixPQUFPLENBQUMsa0JBTE8sQ0FBaEIsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFlBQUQsR0FDQyxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsR0FBbUIsQ0FBQyxpQkFBQSxHQUFvQixZQUFyQixDQUFuQixHQUNBLENBQUMsT0FBTyxDQUFDLFlBQVIsR0FBdUIsOEJBQXhCLENBVkQsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLDhCQUF2QixHQUF3RCxJQUFDLENBQUEsWUFaN0UsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLDhCQUF4QixHQUF5RCxJQUFDLENBQUEsWUFiOUUsQ0FBQTtBQWVBO0FBQUE7V0FBQSx5REFBQTswQkFBQTtBQUNDOztBQUFBO2VBQVMsK0dBQVQsR0FBQTtBQUVDLDJCQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFtQixJQUFBLE9BQUEsQ0FDbEIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsY0FBZixDQURrQixFQUVsQixJQUZrQixFQUdsQixJQUhrQixFQUlsQixJQUFDLENBQUEsU0FBUyxDQUFDLENBQVgsR0FBZSxDQUFBLEdBQUksSUFBQyxDQUFBLGdCQUpGLEVBS2xCLElBQUMsQ0FBQSxTQUFTLENBQUMsQ0FBWCxHQUFlLElBQUEsR0FBTyxJQUFDLENBQUEsZ0JBTEwsRUFNbEIsSUFBQyxDQUFBLGVBTmlCLEVBT2xCLElBQUMsQ0FBQSxZQVBpQixDQUFuQixFQUFBLENBRkQ7QUFBQTs7c0JBQUEsQ0FERDtBQUFBO3NCQWhCUTtJQUFBLENBaEVULENBQUE7O0FBQUEsZ0NBNkZBLGdCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUNsQixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsTUFBQSxDQUNiLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLGFBQWYsQ0FEYSxFQUViLElBQUMsQ0FBQSxTQUFTLENBQUMsQ0FGRSxFQUdiLElBQUMsQ0FBQSxTQUFTLENBQUMsQ0FBWCxHQUFlLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBMUIsR0FBbUMsTUFBTSxDQUFDLGFBQVAsR0FBdUIsSUFBQyxDQUFBLFlBSDlDLEVBSWIsSUFBQyxDQUFBLGVBSlksRUFLYixJQUFDLENBQUEsWUFMWSxFQURJO0lBQUEsQ0E3Rm5CLENBQUE7O0FBQUEsZ0NBc0dBLFNBQUEsR0FBWSxTQUFBLEdBQUE7QUFDWCxVQUFBLFFBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBWixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRGYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQVBULENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLENBUmxCLENBQUE7QUFBQSxNQVVBLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1YsVUFBQSxLQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxDQURBLENBQUE7aUJBRUEsTUFBTSxDQUFDLHFCQUFQLENBQTZCLFFBQTdCLEVBQXVDLEtBQUMsQ0FBQSxNQUF4QyxFQUhVO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FWWCxDQUFBO2FBY0EsTUFBTSxDQUFDLHFCQUFQLENBQTZCLFFBQTdCLEVBQXVDLElBQUMsQ0FBQSxNQUF4QyxFQWZXO0lBQUEsQ0F0R1osQ0FBQTs7QUFBQSxnQ0F1SEEsY0FBQSxHQUFpQixTQUFBLEdBQUE7YUFDaEIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsSUFBQyxDQUFBLFNBQVMsQ0FBQyxDQUExQixFQUE2QixJQUFDLENBQUEsU0FBUyxDQUFDLENBQXhDLEVBQTJDLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBdEQsRUFBNkQsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUF4RSxFQURnQjtJQUFBLENBdkhqQixDQUFBOztBQUFBLGdDQTBIQSxNQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1IsVUFBQSx5SEFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsRUFBQSxDQUFBO0FBRUEsTUFBQSxJQUFPLElBQUMsQ0FBQSxLQUFELEdBQVMsV0FBVCxLQUF3QixDQUEvQjtBQUNDLGNBQUEsQ0FERDtPQUZBO0FBQUEsTUFLQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGNBQUQsRUFOQSxDQUFBO0FBUUE7QUFBQSxXQUFBLDJDQUFBOzhCQUFBO0FBQ0MsUUFBQSxVQUFVLENBQUMsTUFBWCxDQUFBLENBQUEsQ0FERDtBQUFBLE9BUkE7QUFBQSxNQVdBLFlBQUEsR0FBZSxFQVhmLENBQUE7QUFZQTtBQUFBLFdBQUEsZ0VBQUE7aUNBQUE7QUFBQSxRQUFBLFlBQWEsQ0FBQSxNQUFBLENBQWIsR0FBdUIsS0FBdkIsQ0FBQTtBQUFBLE9BWkE7QUFjQTtBQUFBLFdBQUEsOENBQUE7NEJBQUE7QUFDQyxRQUFBLFlBQWEsQ0FBQSxPQUFPLENBQUMsSUFBUixDQUFiLEdBQTZCLFlBQWEsQ0FBQSxPQUFPLENBQUMsSUFBUixDQUFiLElBQThCLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE9BQU8sQ0FBQyxJQUE3QixDQUEzRCxDQUREO0FBQUEsT0FkQTtBQWlCQTtBQUFBLFdBQUEsOENBQUE7NEJBQUE7QUFDQyxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBQyxDQUFBLGNBQWhCLEVBQWdDLFlBQWhDLENBQUEsQ0FERDtBQUFBLE9BakJBO2FBcUJBLElBQUMsQ0FBQSx5QkFBRCxDQUFBLEVBdEJRO0lBQUEsQ0ExSFQsQ0FBQTs7QUFBQSxnQ0FrSkEscUJBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxXQUFWLEVBQXNCLFNBQUMsVUFBRCxHQUFBO2VBQWUsQ0FBQSxVQUFjLENBQUMsV0FBWCxDQUFBLEVBQW5CO01BQUEsQ0FBdEIsQ0FBZixDQUFBO2FBRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxRQUFWLEVBQW1CLFNBQUMsT0FBRCxHQUFBO2VBQVksQ0FBQSxPQUFXLENBQUMsV0FBUixDQUFBLEVBQWhCO01BQUEsQ0FBbkIsRUFIVztJQUFBLENBbEp4QixDQUFBOztBQUFBLGdDQXVKQSx5QkFBQSxHQUE0QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixRQUFRLENBQUMsYUFBMUIsQ0FBSDtBQUNDLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsSUFBQyxDQUFBLGNBQWhCLEVBQWdDLE1BQU0sQ0FBQyxjQUF2QyxDQUFBLENBREQ7T0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLFFBQVEsQ0FBQyxjQUExQixDQUFIO0FBQ0osUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxJQUFDLENBQUEsY0FBaEIsRUFBZ0MsTUFBTSxDQUFDLGVBQXZDLENBQUEsQ0FESTtPQUFBLE1BQUE7QUFHSixRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLElBQUMsQ0FBQSxjQUFoQixDQUFBLENBSEk7T0FGTDtBQU1BLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBaUIsUUFBUSxDQUFDLGNBQTFCLENBQUg7QUFDQyxRQUFBLElBQWtELElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBLENBQWxEO2lCQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsY0FBZCxDQUFsQixFQUFBO1NBREQ7T0FQMkI7SUFBQSxDQXZKNUIsQ0FBQTs7QUFBQSxnQ0FpS0EsTUFBQSxHQUFTLFNBQUEsR0FBQTtBQUNSLFVBQUEscURBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7OEJBQUE7QUFDQyxRQUFBLFVBQVUsQ0FBQyxNQUFYLENBQWtCLElBQUMsQ0FBQSxHQUFuQixDQUFBLENBREQ7QUFBQSxPQUFBO0FBR0E7QUFBQSxXQUFBLDhDQUFBOzRCQUFBO0FBQ0MsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLElBQUMsQ0FBQSxHQUFoQixDQUFBLENBREQ7QUFBQSxPQUhBO2FBTUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsSUFBQyxDQUFBLEdBQWhCLEVBQXFCLElBQUMsQ0FBQSxjQUF0QixFQVBRO0lBQUEsQ0FqS1QsQ0FBQTs7QUFBQSxJQTBLQSxZQUFBLEdBQWUsU0FBQyxRQUFELEdBQUE7QUFDZCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTyxJQUFBLEdBQUksUUFBSixHQUFhLElBQXBCLENBQUE7YUFDQSxDQUFBLENBQUcsYUFBSCxDQUFnQixDQUFDLE1BQWpCLENBQXdCLFNBQUEsR0FBQTtlQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBVCxDQUFtQixJQUFBLE1BQUEsQ0FBTyxHQUFQLENBQW5CLEVBQUY7TUFBQSxDQUF4QixDQUF5RCxDQUFDLElBQTFELENBQUEsQ0FBZ0UsQ0FBQyxJQUFqRSxDQUF1RSxLQUF2RSxDQUE0RSxDQUFDLEtBQTdFLENBQW9GLEdBQXBGLENBQXdGLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBM0YsQ0FBa0csR0FBbEcsQ0FBcUcsQ0FBQyxLQUF0RyxDQUE0RyxDQUE1RyxFQUErRyxDQUFBLENBQS9HLENBQWtILENBQUMsSUFBbkgsQ0FBeUgsR0FBekgsQ0FBQSxHQUE4SCxJQUZoSDtJQUFBLENBMUtmLENBQUE7OzZCQUFBOztLQUQrQixjQUFoQyxDQUFBOztBQUFBLEVBK0tBLE1BQU0sQ0FBQyxpQkFBUCxHQUEyQixpQkEvSzNCLENBQUE7QUFBQSIsImZpbGUiOiJTcGFjZUludmFkZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRGVzdHJveWFibGVcclxuXHRjb25zdHJ1Y3RvciA6IChkZWF0aFRpbWUgPSAwKS0+XHJcblx0XHRAZGVhdGhUaW1lciA9IGRlYXRoVGltZVxyXG5cdFx0QF9pc0Rlc3Ryb3llZCA9IGZhbHNlXHJcblx0XHRAX2lzRHlpbmcgPSBmYWxzZVxyXG5cclxuXHRzZXREZWF0aFRpbWVyIDogKGRlYXRoVGltZSktPlxyXG5cdFx0QGRlYXRoVGltZXIgPSBkZWF0aFRpbWVcclxuXHJcblx0Y2hlY2tQdWxzZSA6IC0+ICMgVHJ1ZSB3aGVuIGFsaXZlIGFuZCBub3QgZHlpbmcgKHBhaW5mdWxseSlcclxuXHRcdGlmIEBfaXNEZXN0cm95ZWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0aWYgQF9pc0R5aW5nXHRcclxuXHRcdFx0QGRpZVNsb3dseSgpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdHJldHVybiB0cnVlXHRcclxuXHJcblx0ZGllU2xvd2x5IDogLT4gICMgQW5kIHBhaW5mdWxseVxyXG5cdFx0QGRlYXRoVGltZXItLVxyXG5cclxuXHRcdGlmIEBkZWF0aFRpbWVyIDw9IDBcclxuXHRcdFx0QF9pc0Rlc3Ryb3llZCA9IHRydWVcclxuXHJcblx0ZGVzdHJveSA6IC0+XHJcblx0XHRAX2lzRHlpbmcgPSB0cnVlXHJcblx0XHRAZGllU2xvd2x5KClcclxuXHJcblx0dXBkYXRlIDogLT5cclxuXHRcdEBjaGVja1B1bHNlKClcclxuXHJcblx0aXNEZXN0cm95ZWQgOiAtPlxyXG5cdFx0QF9pc0Rlc3Ryb3llZFx0XHJcblxyXG5cdGlzRHlpbmcgOiAtPiAjIE9uY2UgYWdhaW4sIHNsb3dseSBhbmQgcGFpbmZ1bGx5XHJcblx0XHRAX2lzRHlpbmdcclxuXHJcbndpbmRvdy5EZXN0cm95YWJsZSA9IERlc3Ryb3lhYmxlIiwiY2xhc3MgU3ByaXRlIGV4dGVuZHMgRGVzdHJveWFibGVcclxuXHRjb25zdHJ1Y3RvciA6IChAaW1nLCBAc3ByaXRlWCA9IDAsIEBzcHJpdGVZID0gMCwgQHcgPSAwLCBAaCA9IDAsIEB4ID0gMCwgQHkgPSAwLCBAZGlzcGxheVdpZHRoLCBAZGlzcGxheUhlaWdodCktPlxyXG5cdFx0c3VwZXIoKVxyXG5cclxuXHRyZW5kZXIgOiAoY3R4KS0+XHRcclxuXHRcdGN0eC5kcmF3SW1hZ2UgQGltZywgQHNwcml0ZVgsIEBzcHJpdGVZLCBAdywgQGgsIEB4LCBAeSwgQGRpc3BsYXlXaWR0aCwgQGRpc3BsYXlIZWlnaHRcclxuXHRcdFxyXG53aW5kb3cuU3ByaXRlID0gU3ByaXRlIiwiY2xhc3MgUHJvamVjdGlsZSBleHRlbmRzIERlc3Ryb3lhYmxlXHJcblxyXG5cdEBXSURUSCA9IDNcclxuXHRASEVJR0hUID0gMTVcclxuXHJcblx0QENPTE9SID0gXCIjZmZmZmZmXCJcclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQHgsIEB5LCBAb3duZXIsIEB2ZWxvY2l0eSwgQGJvdW5kcywgQHNjYWxlKS0+XHJcblx0XHRAZGlzcGxheVdpZHRoID0gUHJvamVjdGlsZS5XSURUSCAqIEBzY2FsZVxyXG5cdFx0QGRpc3BsYXlIZWlnaHQgPSBQcm9qZWN0aWxlLkhFSUdIVCAqIEBzY2FsZVxyXG5cclxuXHRcdHN1cGVyKClcclxuXHJcblx0dXBkYXRlIDogKGFuaW1hdGlvbkZyYW1lKS0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdEB5ICs9IEB2ZWxvY2l0eS55XHJcblxyXG5cdFx0aWYgQHkgPCBAYm91bmRzLnkubWluXHJcblx0XHRcdEBkZXN0cm95KClcclxuXHJcblx0cmVuZGVyIDogKGN0eCktPlxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0IyBiY2t1cEZpbGxTdHlsZSA9IGN0eC5maWxsU3R5bGVcclxuXHRcdGN0eC5maWxsU3R5bGUgPSBQcm9qZWN0aWxlLkNPTE9SXHJcblx0XHRjdHguZmlsbFJlY3QgQHggLSBAZGlzcGxheVdpZHRoLzIsIEB5LCBAZGlzcGxheVdpZHRoLCBAZGlzcGxheUhlaWdodFx0XHJcblx0XHQjIGN0eC5maWxsU3R5bGUgPSBiY2t1cEZpbGxTdHlsZVxyXG5cclxuY2xhc3MgQ2Fubm9uIGV4dGVuZHMgU3ByaXRlXHJcblx0QFNQUklURV9XSURUSCA9IDQ5XHJcblx0QFNQUklURV9IRUlHSFQgPSAzMFxyXG5cclxuXHRARElSRUNUSU9OX0xFRlQgPSAxXHJcblx0QERJUkVDVElPTl9SSUdIVCA9IDBcclxuXHJcblx0Q0FOTk9OX0RFUExPWU1FTlRfREVMQVkgPSA2MCAjIEFuaW1hdGlvbiBmcmFtZXMgYmVmb3JlIHRoZSBjYW5ub24gYXBwZWFyc1xyXG5cdFNQRUVEX01VTFRJUExJRVIgPSA0XHJcblxyXG5cdENBTk5PTl9DSEFSR0VfU1RSRU5HVEggPSAxMFxyXG5cclxuXHRDQU5OT05fUkVDSEFSR0VfVElNRSA9IDM1ICMgRnJhbWVzIHRvIHJlY2hhcmdlIGNhbm5vbi4gT25lIGNhbm5vdCBzaW1wbHkgcGV3LXBldyBsaWtlIGEgbWFjaGluZSBndW5cclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQGltZywgQHgsIEB5LCBAYm91bmRzLCBAc2NhbGUpLT5cclxuXHRcdEBkaXNwbGF5V2lkdGggPSBDYW5ub24uU1BSSVRFX1dJRFRIICogQHNjYWxlXHJcblx0XHRAZGlzcGxheUhlaWdodCA9IENhbm5vbi5TUFJJVEVfSEVJR0hUICogQHNjYWxlXHJcblxyXG5cdFx0QGluaXQgPSBmYWxzZVxyXG5cclxuXHRcdEBjYW5ub25SZWNoYXJnZVN0ZXAgPSAwXHJcblxyXG5cdFx0QGxvYWRDYW5ub24oKVxyXG5cclxuXHRcdHN1cGVyKEBpbWcsIFxyXG5cdFx0XHQwLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHRDYW5ub24uU1BSSVRFX1dJRFRILCBcclxuXHRcdFx0Q2Fubm9uLlNQUklURV9IRUlHSFQsXHJcblx0XHRcdEB4LFxyXG5cdFx0XHRAeSxcclxuXHRcdFx0QGRpc3BsYXlXaWR0aCxcclxuXHRcdFx0QGRpc3BsYXlIZWlnaHRcclxuXHRcdClcdFx0XHJcblxyXG5cdGZpcmUgOiAoYW5pbWF0aW9uRnJhbWUpLT5cclxuXHRcdHVubGVzcyBAaXNSZWxvYWRlZCgpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0YmFycmVsQ29vcmRzID0gQGdldENhbm5vbkJhcnJlbENvb3JkcygpXHRcclxuXHRcdHByb2plY3RpbGUgPSBuZXcgUHJvamVjdGlsZShcclxuXHRcdFx0YmFycmVsQ29vcmRzLngsIFxyXG5cdFx0XHRiYXJyZWxDb29yZHMueSwgXHJcblx0XHRcdEAsXHJcblx0XHRcdHsgeCA6IDAsIHkgOiAtQ0FOTk9OX0NIQVJHRV9TVFJFTkdUSH0sIFxyXG5cdFx0XHRAYm91bmRzLFxyXG5cdFx0XHRAc2NhbGVcclxuXHRcdClcclxuXHRcdEBsb2FkQ2Fubm9uKClcdFx0XHRcdFxyXG5cdFx0cmV0dXJuIHByb2plY3RpbGVcclxuXHJcblx0Z2V0Q2Fubm9uQmFycmVsQ29vcmRzIDogLT5cclxuXHRcdGNvb3JkcyA9IFx0XHJcblx0XHRcdHggOiBAeCArIEBkaXNwbGF5V2lkdGgvIDJcclxuXHRcdFx0eSA6IEB5XHRcdFxyXG5cclxuXHRpc1JlbG9hZGVkIDogLT5cclxuXHRcdEBfaXNSZWxvYWRlZFx0XHRcclxuXHJcblx0bG9hZENhbm5vbiA6IC0+XHJcblx0XHRAY2Fubm9uUmVjaGFyZ2VTdGVwID0gQ0FOTk9OX1JFQ0hBUkdFX1RJTUVcclxuXHRcdEBfaXNSZWxvYWRlZCA9IGZhbHNlXHJcblxyXG5cdGNoZWNrUmVsb2FkIDogLT5cclxuXHRcdGlmIEBpc1JlbG9hZGVkKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0QGNhbm5vblJlY2hhcmdlU3RlcC0tXHJcblx0XHRpZiBAY2Fubm9uUmVjaGFyZ2VTdGVwIDw9IDAgXHJcblx0XHRcdEBfaXNSZWxvYWRlZCA9IHRydWVcclxuXHJcblxyXG5cdHVwZGF0ZSA6IChhbmltYXRpb25GcmFtZSwgZGlyZWN0aW9uKS0+XHJcblx0XHR1bmxlc3MgQGluaXRcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0QGNoZWNrUmVsb2FkKClcclxuXHJcblxyXG5cdFx0aWYgXy5pc1VuZGVmaW5lZChkaXJlY3Rpb24pXHJcblx0XHRcdHJldHVybiBcclxuXHJcblx0XHRAeCArPSBNYXRoLnBvdygtMSwgZGlyZWN0aW9uKSAqIFNQRUVEX01VTFRJUExJRVJcclxuXHJcblx0XHRAeCA9IEBib3VuZHMueC5taW4gaWYgQHggPCBAYm91bmRzLngubWluXHJcblx0XHRAeCA9IEBib3VuZHMueC5tYXggLSBAZGlzcGxheVdpZHRoIGlmIEB4ICsgQGRpc3BsYXlXaWR0aCA+IEBib3VuZHMueC5tYXhcclxuXHJcblx0cmVuZGVyIDogKGN0eCxhbmltYXRpb25GcmFtZSktPlxyXG5cdFx0dW5sZXNzIGFuaW1hdGlvbkZyYW1lID4gQ0FOTk9OX0RFUExPWU1FTlRfREVMQVlcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0QGluaXQgPSB0cnVlXHJcblx0XHRzdXBlciBjdHhcclxuXHJcblxyXG53aW5kb3cuQ2Fubm9uID0gQ2Fubm9uXHQiLCJjbGFzcyBJbnZhZGVyIGV4dGVuZHMgU3ByaXRlXHJcblx0QFNQUklURV9XSURUSCA9IDUwXHJcblx0QFNQUklURV9IRUlHSFQgPSAzNVx0XHJcblxyXG5cdEBJTlZBREVSX1RZUEVfTEFSR0UgPSAyXHJcblx0QElOVkFERVJfVFlQRV9NRURJVU0gPSAxXHJcblx0QElOVkFERVJfVFlQRV9TTUFMTCA9IDBcclxuXHJcblx0REVGQVVMVF9BTklNQVRJT05fU1RFUCA9IDBcclxuXHRBTklNQVRJT05fU1RFUF9EVVJBVElPTiA9IDEgIyBVcGRhdGVzIGV2ZXJ5IEFOSU1BVElPTl9TVEVQX0RVUkFUSU9OJ3RoIGZyYW1lXHJcblxyXG5cdFxyXG5cclxuXHQjIEluIGZyYW1lcy4gTGVzc2VyIHRoZSB0aW1lLCBmYXN0ZXIgdGhlIEludmFkZXIsIHRoZXJlZm9yZSBoYXJkZXIgdGhlIGdhbWVcclxuXHQjIFdoZW4gc2V0IHRvIDEgaW52YWRlcnMgZ28gWm9pZGJlcmctc3R5bGUgKFxcLykoOywuOykoXFwvKSAtICh8KSg7LC47KSh8KSAtIChcXC8pKDssLjspKFxcLylcclxuXHRERUZBVUxUX0lOVkFERVJfUkVTVF9USU1FID0gNjAvM1xyXG5cclxuXHRERUZBVUxUX0hfVkVMT0NJVFkgPSBJbnZhZGVyLlNQUklURV9XSURUSCAvIDdcclxuXHRERUZBVUxUX1dfVkVMT0NJVFkgPSAwXHJcblx0V19WRUxPQ0lUWV9NVUxUSVBMSUVSID0gLjdcclxuXHRWRUxPQ0lUWV9JTkVSVElBX01VTFRJUExJRVIgPSAuNVxyXG5cdCMgVmVsb2NpdHkge3ggOiBmbG9hdCx5IDogZmxvYXR9LCBwaXhlbHMgcGVyIGFuaW1hdGlvbiBmcmFtZSBcclxuXHJcblx0SU5WQURFUl9ERUxBWV9NVUxUSVBMSUVSICA9IDEwXHJcblx0SU5WQURFUl9ERUxBWV9NQUdJQyA9IDVcclxuXHJcblx0Y29uc3RydWN0b3IgOiAoQGltZywgQHR5cGUsIEByYW5rLCBAeCwgQHksIEBib3VuZHMsIEBzY2FsZSktPlx0XHRcclxuXHRcdEBhbmltYXRpb25TdGVwID0gMCAjIDIgQW5pbWF0aW9uIFN0ZXBzXHJcblxyXG5cdFx0dHlwZXMgPSBbSW52YWRlci5JTlZBREVSX1RZUEVfU01BTEwsSW52YWRlci5JTlZBREVSX1RZUEVfTUVESVVNLEludmFkZXIuSU5WQURFUl9UWVBFX0xBUkdFXVxyXG5cclxuXHRcdHVubGVzcyB0eXBlcy5pbmRleE9mKEB0eXBlKSA+PSAwXHJcblx0XHRcdCMgY29uc29sZS5sb2cgdHlwZXNcclxuXHRcdFx0QHR5cGUgPSBJbnZhZGVyLklOVkFERVJfVFlQRV9TTUFMTFx0XHJcblxyXG5cdFx0QHJlc3RUaW1lTGVmdCA9IERFRkFVTFRfSU5WQURFUl9SRVNUX1RJTUVcclxuXHRcdEByZXN0VGltZSA9IERFRkFVTFRfSU5WQURFUl9SRVNUX1RJTUVcclxuXHJcblx0XHRAdmVsb2NpdHkgPSB7IHggOiBERUZBVUxUX0hfVkVMT0NJVFksIHkgOiAwIH0gXHJcblxyXG5cdFx0QGRpc3BsYXlXaWR0aCA9IEludmFkZXIuU1BSSVRFX1dJRFRIICogQHNjYWxlXHJcblx0XHRAZGlzcGxheUhlaWdodCA9IEludmFkZXIuU1BSSVRFX0hFSUdIVCAqIEBzY2FsZVxyXG5cclxuXHRcdHN1cGVyKCBcclxuXHRcdFx0QGltZywgXHJcblx0XHRcdEBhbmltYXRpb25TdGVwICogSW52YWRlci5TUFJJVEVfV0lEVEgsXHJcblx0XHRcdEB0eXBlICogSW52YWRlci5TUFJJVEVfSEVJR0hULFxyXG5cdFx0XHRJbnZhZGVyLlNQUklURV9XSURUSCwgXHJcblx0XHRcdEludmFkZXIuU1BSSVRFX0hFSUdIVCxcclxuXHRcdFx0QHgsXHJcblx0XHRcdEB5LFxyXG5cdFx0XHRAZGlzcGxheVdpZHRoLFxyXG5cdFx0XHRAZGlzcGxheUhlaWdodFxyXG5cdFx0KVxyXG5cclxuXHR1cGRhdGUgOiAoYW5pbWF0aW9uRnJhbWUsYWR2YW5jZUZsYWdzKS0+XHJcblx0XHRzdXBlcigpXHJcblxyXG5cdFx0aWYgQGlzRGVzdHJveWVkKClcclxuXHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdGludmFkZXJSYW5rRGVsYXkgPSAoSU5WQURFUl9ERUxBWV9NQUdJQyAtIEByYW5rKSAqIElOVkFERVJfREVMQVlfTVVMVElQTElFUlx0XHRcdFxyXG5cdFx0aWYgYW5pbWF0aW9uRnJhbWUgPD0gaW52YWRlclJhbmtEZWxheVxyXG5cdFx0XHRyZXR1cm4gXHRcclxuXHRcdHVubGVzcyBAcmVzdFRpbWVMZWZ0LS0gaXMgMFxyXG5cdFx0XHRAaWRsZSA9IHRydWVcclxuXHRcdFx0cmV0dXJuIFxyXG5cdFx0QGlkbGUgPSBmYWxzZVxyXG5cdFx0QHJlc3RUaW1lTGVmdCA9IEByZXN0VGltZVx0XHJcblxyXG5cdFx0QHVwZGF0ZVZlbG9jaXR5IGFkdmFuY2VGbGFnc1xyXG5cdFx0QHggKz0gQHZlbG9jaXR5LnhcclxuXHRcdEB5ICs9IEB2ZWxvY2l0eS55XHJcblx0XHR1bmxlc3MgYW5pbWF0aW9uRnJhbWUgJSBBTklNQVRJT05fU1RFUF9EVVJBVElPTiA9PSAwXHJcblx0XHRcdHJldHVyblxyXG5cdFx0QGFuaW1hdGlvblN0ZXAgPSAxIC0gQGFuaW1hdGlvblN0ZXBcclxuXHRcdEBzcHJpdGVYID0gQGFuaW1hdGlvblN0ZXAgKiBJbnZhZGVyLlNQUklURV9XSURUSFxyXG5cclxuXHQjIEludmFkZXJzIGFyZSBxaXV0ZSBmZWFyZnVsIGNyZWF0dXJlcy4gXHJcblx0IyBUaGV5IGFkdmFuY2Ugb25seSBpZiBvbmUgb2YgdGhlbSBkZWNpZGVzIHRvIGFuZCB3YWl0IGZvciB0aGUgbGFzdCBvbmUgaW4gcmFuayB0byBtYWtlIHN1Y2ggYSBkZWNpc2lvblxyXG5cdGNoZWNrQWR2YW5jZSA6IChyYW5rKS0+XHJcblx0XHR1bmxlc3MgcmFuayA9PSBAcmFua1xyXG5cdFx0XHRyZXR1cm4gZmFsc2VcdFx0XHRcdFxyXG5cdFx0cmV0dXJuIChAeCArIEBkaXNwbGF5V2lkdGgqc2lnbihAdmVsb2NpdHkueCkgKyBAdmVsb2NpdHkueCA+PSBAYm91bmRzLngubWF4KSBvciBcclxuXHRcdFx0KEB4ICsgQGRpc3BsYXlXaWR0aCpzaWduKEB2ZWxvY2l0eS54KSArIEB2ZWxvY2l0eS54IDw9IEBib3VuZHMueC5taW4pXHJcblxyXG5cdHVwZGF0ZVZlbG9jaXR5IDogKGFkdmFuY2VGbGFncyktPlxyXG5cdFx0IyBjb25zb2xlLmxvZyBhZHZhbmNlRmxhZ1xyXG5cdFx0QHZlbG9jaXR5LnkgPSAwXHJcblx0XHRpZiBhZHZhbmNlRmxhZ3NbQHJhbmtdXHJcblx0XHRcdEB2ZWxvY2l0eS54ID0gLSBAdmVsb2NpdHkueFxyXG5cdFx0XHRAdmVsb2NpdHkueSA9IFdfVkVMT0NJVFlfTVVMVElQTElFUiAqIEBkaXNwbGF5SGVpZ2h0XHRcdFxyXG5cclxuXHRzaWduID0gKG51bSktPlxyXG5cdFx0aWYgbnVtID49IDBcclxuXHRcdFx0cmV0dXJuIDFcclxuXHRcdHJldHVybiAtMVxyXG53aW5kb3cuSW52YWRlciA9IEludmFkZXIiLCJcclxuY2xhc3MgS2V5Ym9hcmRcclxuXHRAS0VZX0NPREVfTEVGVCA9IDM3XHJcblx0QEtFWV9DT0RFX1JJR0hUID0gMzlcclxuXHRAS0VZX0NPREVfU1BBQ0UgPSAzMlxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IC0+XHJcblx0XHRAa2V5c0Rvd24gPSB7fVxyXG5cdFx0QGtleXNQcmVzc2VkID0ge31cclxuXHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwia2V5ZG93blwiLCAoZXZlbnQpPT5cdFx0XHJcblx0XHRcdEBrZXlzRG93bltldmVudC5rZXlDb2RlXSA9IHRydWUgXHRcdFx0XHJcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyIFwia2V5dXBcIiwgKGV2ZW50KT0+XHRcdFx0XHRcdFx0XHJcblx0XHRcdGRlbGV0ZSBAa2V5c0Rvd25bZXZlbnQua2V5Q29kZV1cclxuXHRcdFx0IyBkZWxldGUgQGtleXNQcmVzc2VkW2V2ZW50LmtleUNvZGVdXHJcblxyXG5cdGlzRG93biA6IChrZXlDb2RlKS0+XHJcblx0XHRjb25zb2xlLmxvZyBAa2V5c0Rvd25cclxuXHRcdHJldHVybiBfLmhhcyhAa2V5c0Rvd24sa2V5Q29kZSlcclxuXHJcblx0aXNQcmVzc2VkIDogKGtleUNvZGUpLT5cclxuXHRcdGNvbnNvbGUubG9nIEBrZXlzRG93biwgQGtleXNQcmVzc2VkXHJcblx0XHRpZiBAaXNEb3duIGtleUNvZGVcclxuXHRcdFx0QGtleXNQcmVzc2VkW2tleUNvZGVdID0gdHJ1ZVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdGlmIF8uaGFzIEBrZXlzUHJlc3NlZCwga2V5Q29kZVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxud2luZG93LktleWJvYXJkID0gS2V5Ym9hcmQiLCJjbGFzcyBSZXNvdXJjZUxvYWRlciBleHRlbmRzIEV2ZW50RW1pdHRlcjJcclxuXHRjb25zdHJ1Y3RvciA6IChpbWFnZUxpc3QsY2FsbGJhY2spLT5cclxuXHRcdGlmIF8uaXNTdHJpbmcgaW1hZ2VMaXN0XHJcblx0XHRcdGltYWdlTGlzdCA9IFt7dXJsIDogaW1hZ2VMaXN0LCBpZCA6IGltYWdlTGlzdH1dXHJcblx0XHRpZiBfLmlzQXJyYXkoaW1hZ2VMaXN0KVxyXG5cdFx0XHRjaGVjayA9IHRydWUgXHJcblx0XHRcdGNoZWNrICo9IChfLmlzT2JqZWN0KGltYWdlRGF0YSkgYW5kIF8uaGFzKGltYWdlRGF0YSwndXJsJykpIGZvciBpbWFnZURhdGEgaW4gaW1hZ2VMaXN0XHJcblx0XHRcdHVubGVzcyBjaGVja1xyXG5cdFx0XHRcdHRocm93IFwiUmVzb3VyY2VMb2FkZXIgOjogUmVzb3VyY2VMb2FkZXIgYWNjZXB0cyBvbmx5IFN0cmluZyBvciBTdHJpbmdbXVwiXHJcblxyXG5cdFx0QGltYWdlcyA9IHt9XHJcblxyXG5cdFx0QGxvYWRJbWFnZXMgaW1hZ2VMaXN0LCBjYWxsYmFja1xyXG5cdFx0XHJcblx0bG9hZEltYWdlcyA6IChpbWFnZUxpc3QsY2FsbGJhY2s9LT4pLT5cclxuXHRcdGFzeW5jLmVhY2ggaW1hZ2VMaXN0LCAoaW1hZ2VEYXRhLGVDYWxsYmFjayk9PlxyXG5cdFx0XHRpbWcgPSBuZXcgSW1hZ2UoKVxyXG5cclxuXHRcdFx0aW1nLm9ubG9hZCA9ID0+XHJcblx0XHRcdFx0QGltYWdlc1tpbWFnZURhdGEuaWQgfHwgaW1hZ2VEYXRhLnVybF0gPSBpbWdcclxuXHJcblx0XHRcdFx0ZUNhbGxiYWNrIG51bGxcclxuXHRcdFx0aW1nLnNyYyA9IGltYWdlRGF0YS51cmxcclxuXHRcdCwgKGVycik9PlxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblx0XHRcdEBlbWl0IFwicmVhZHlcIlxyXG5cclxuXHRnZXQgOiAoaW1hZ2VJZCktPlxyXG5cdFx0dW5sZXNzIF8uaGFzIEBpbWFnZXMsIGltYWdlSWRcclxuXHRcdFx0dGhyb3cgXCJSZXNvdXJjZUxvYWRlciA6OiBJbWFnZSBub3QgbG9hZGVkXCJcclxuXHRcdEBpbWFnZXNbaW1hZ2VJZF1cclxuXHJcbndpbmRvdy5SZXNvdXJjZUxvYWRlciA9IFJlc291cmNlTG9hZGVyXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHJcblx0XHRcclxuXHJcbiIsIlxyXG5cclxuY2xhc3MgU3BhY2VJbnZhZGVyc0dhbWUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIyXHJcblx0Q0FOVkFTX0hFSUdIVCA9IDY0MFxyXG5cdENBTlZBU19XSURUSCA9IDY0MFxyXG5cdElOVkFERVJfU1BSSVRFID0gXCJzcHJpdGVzL2ludmFkZXJzLnBuZ1wiXHJcblx0Q0FOTk9OX1NQUklURSA9IFwic3ByaXRlcy9jYW5ub24ucG5nXCJcclxuXHRCR19DT0xPUiA9IFwiIzAwMFwiXHJcblx0UkVEUkFXX1JBVEUgPSAxXHJcblxyXG5cdEhFQURFUl9IRUlHSFQgPSAxMDBcclxuXHRGT09URVJfSEVJR0hUID0gNzVcclxuXHRTSURFX09GRlNFVCA9IDI1XHJcblxyXG5cdElOVkFERVJTX1BFUl9SQU5LID0gMTEgIyBZZWFoLCByYW5rcy4gTGlrZSBpbiByZWFsIGFybXlcclxuXHJcblx0RlJFRV9IX1NQQUNFID0gNCAjIEZyZWUgc3BhY2UgKDEgdW5pdCA9IDEgSW52YWRlciBkaXNwbGF5IHdpZHRoKSBmb3IgSW52YWRlcnMgdG8gbW92ZS4gXHJcblxyXG5cdEhfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUiA9IDEuNFxyXG5cdFdfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUiA9IDEuOFxyXG5cclxuXHRDTEVBUl9TQ0FMRSA9IC4zIFxyXG5cclxuXHRjb25zdHJ1Y3RvciA6IChAZGVzdCktPlxyXG5cdFx0Y3VycmVudERpciA9IGdldEpzRmlsZURpciBcIlNwYWNlSW52YWRlcnMuanNcIlxyXG5cclxuXHRcdEByZXNvdXJjZXMgPSBuZXcgUmVzb3VyY2VMb2FkZXIgW1xyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIElOVkFERVJfU1BSSVRFLCBpZCA6IElOVkFERVJfU1BSSVRFfVxyXG5cdFx0XHR7dXJsIDogY3VycmVudERpciArIENBTk5PTl9TUFJJVEUsIGlkIDogQ0FOTk9OX1NQUklURX1cclxuXHRcdF0sID0+XHJcblx0XHRcdEBpbml0KClcclxuXHJcblx0aW5pdCA6IC0+XHRcdFxyXG5cdFx0JChAZGVzdCkuYXBwZW5kIFwiPGNhbnZhcyBpZD0nU3BhY2VJbnZhZGVyc0dhbWUnPjwvY2FudmFzPlwiXHJcblx0XHRAaW5pdEdhbWVGaWVsZCgpXHJcblx0XHRAY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJTcGFjZUludmFkZXJzR2FtZVwiKVxyXG5cdFx0QGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcblxyXG5cdFx0QGNvbnRyb2xzID0gbmV3IEtleWJvYXJkKClcclxuXHJcblx0XHRAY3R4Lmdsb2JhbEFscGhhID0gMSBcclxuXHJcblx0XHRAc3RhcnRHYW1lKClcclxuXHJcblx0aW5pdEdhbWVGaWVsZCA6IC0+XHJcblx0XHRAZ2FtZUZpZWxkID0gXHJcblx0XHRcdHggOiBTSURFX09GRlNFVFxyXG5cdFx0XHR5IDogSEVBREVSX0hFSUdIVFxyXG5cdFx0XHR3aWR0aCA6IENBTlZBU19XSURUSCAtIFNJREVfT0ZGU0VUICogMlxyXG5cdFx0XHRoZWlnaHQgOiBDQU5WQVNfSEVJR0hUIC0gSEVBREVSX0hFSUdIVCAtIEZPT1RFUl9IRUlHSFRcclxuXHJcblx0XHRAZ2FtZUZpZWxkQm91bmRzID1cclxuXHRcdFx0eCA6IFxyXG5cdFx0XHRcdG1pbiA6IEBnYW1lRmllbGQueFxyXG5cdFx0XHRcdG1heCA6IEBnYW1lRmllbGQueCArIEBnYW1lRmllbGQud2lkdGhcclxuXHRcdFx0eSA6IFxyXG5cdFx0XHRcdG1pbiA6IEBnYW1lRmllbGQueVxyXG5cdFx0XHRcdG1heCA6IEBnYW1lRmllbGQueSArIEBnYW1lRmllbGQuaGVpZ2h0XHRcclxuXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmF0dHIgXCJoZWlnaHRcIixDQU5WQVNfSEVJR0hUXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmF0dHIgXCJ3aWR0aFwiLENBTlZBU19XSURUSFxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MgXCJiYWNrZ3JvdW5kLWNvbG9yXCIgLCBCR19DT0xPUlxyXG5cdFx0JChcIiNTcGFjZUludmFkZXJzR2FtZVwiKS5jc3MgXCItd2Via2l0LXRvdWNoLWNhbGxvdXRcIiAsIFwibm9uZVwiXHJcblx0XHRwcmVmaXhlcyA9IFtcIi13ZWJraXQtXCIsXCIta2h0bWwtXCIsXCItbW96LVwiLFwiLW1zLVwiLFwiXCJdXHJcblx0XHQkKFwiI1NwYWNlSW52YWRlcnNHYW1lXCIpLmNzcyhcIiN7cHJlZml4fXVzZXItc2VsZWN0XCIsIFwibm9uZVwiKSBmb3IgcHJlZml4IGluIHByZWZpeGVzXHJcblxyXG5cclxuXHRpbnZhZGUgOiAtPlxyXG5cdFx0QGludmFkZXJSYW5rcyA9IFtcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfU01BTEwsXHJcblx0XHRcdEludmFkZXIuSU5WQURFUl9UWVBFX01FRElVTSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTUVESVVNLFxyXG5cdFx0XHRJbnZhZGVyLklOVkFERVJfVFlQRV9MQVJHRSxcclxuXHRcdFx0SW52YWRlci5JTlZBREVSX1RZUEVfTEFSR0VcclxuXHRcdF1cdFx0XHRcclxuXHJcblx0XHRAaW52YWRlclNjYWxlID0gXHJcblx0XHRcdEBnYW1lRmllbGQud2lkdGggLyAoSU5WQURFUlNfUEVSX1JBTksgKyBGUkVFX0hfU1BBQ0UpIC8gXHJcblx0XHRcdChJbnZhZGVyLlNQUklURV9XSURUSCAqIEhfU1BBQ0VfUEVSX0lOVkFERVJfTVVMVElQTElFUilcclxuXHJcblx0XHRAaFNwYWNlUGVySW52YWRlciA9IEludmFkZXIuU1BSSVRFX1dJRFRIICogSF9TUEFDRV9QRVJfSU5WQURFUl9NVUxUSVBMSUVSICogQGludmFkZXJTY2FsZVxyXG5cdFx0QHdTcGFjZVBlckludmFkZXIgPSBJbnZhZGVyLlNQUklURV9IRUlHSFQgKiBXX1NQQUNFX1BFUl9JTlZBREVSX01VTFRJUExJRVIgKiBAaW52YWRlclNjYWxlXHJcblxyXG5cdFx0Zm9yIHR5cGUscmFuayBpbiBAaW52YWRlclJhbmtzXHJcblx0XHRcdGZvciBpIGluIFswLi5JTlZBREVSU19QRVJfUkFOSy0xXVxyXG5cclxuXHRcdFx0XHRAaW52YWRlcnMucHVzaCBuZXcgSW52YWRlcihcclxuXHRcdFx0XHRcdEByZXNvdXJjZXMuZ2V0KElOVkFERVJfU1BSSVRFKSxcclxuXHRcdFx0XHRcdHR5cGUsIFxyXG5cdFx0XHRcdFx0cmFuayxcdFx0XHRcdFxyXG5cdFx0XHRcdFx0QGdhbWVGaWVsZC54ICsgaSAqIEBoU3BhY2VQZXJJbnZhZGVyLCBcclxuXHRcdFx0XHRcdEBnYW1lRmllbGQueSArIHJhbmsgKiBAd1NwYWNlUGVySW52YWRlcixcclxuXHRcdFx0XHRcdEBnYW1lRmllbGRCb3VuZHMsXHJcblx0XHRcdFx0XHRAaW52YWRlclNjYWxlXHJcblx0XHRcdFx0KSBcclxuXHJcblx0dml2YUxhUmVzaXN0YW5jZSA6IC0+XHJcblx0XHRAY2Fubm9uID0gbmV3IENhbm5vbihcclxuXHRcdFx0QHJlc291cmNlcy5nZXQoQ0FOTk9OX1NQUklURSksXHJcblx0XHRcdEBnYW1lRmllbGQueCxcclxuXHRcdFx0QGdhbWVGaWVsZC55ICsgQGdhbWVGaWVsZC5oZWlnaHQgLSBDYW5ub24uU1BSSVRFX0hFSUdIVCAqIEBpbnZhZGVyU2NhbGUsXHJcblx0XHRcdEBnYW1lRmllbGRCb3VuZHMsXHJcblx0XHRcdEBpbnZhZGVyU2NhbGVcclxuXHRcdClcclxuXHJcblx0c3RhcnRHYW1lIDogLT5cclxuXHRcdEBpbnZhZGVycyA9IFtdXHJcblx0XHRAcHJvamVjdGlsZXMgPSBbXVxyXG5cclxuXHRcdEBpbnZhZGUoKVxyXG5cclxuXHRcdEB2aXZhTGFSZXNpc3RhbmNlKClcclxuXHJcblx0XHRAZnJhbWUgPSAwXHJcblx0XHRAYW5pbWF0aW9uRnJhbWUgPSAwXHJcblx0XHJcblx0XHRnYW1lU3RlcCA9ID0+XHJcblx0XHRcdEB1cGRhdGUoKVxyXG5cdFx0XHRAcmVuZGVyKClcclxuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBnYW1lU3RlcCwgQGNhbnZhc1x0XHJcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIGdhbWVTdGVwLCBAY2FudmFzXHJcblx0XHRcdFxyXG5cdGNsZWFyR2FtZUZpZWxkIDogLT5cclxuXHRcdEBjdHguY2xlYXJSZWN0IEBnYW1lRmllbGQueCwgQGdhbWVGaWVsZC55LCBAZ2FtZUZpZWxkLndpZHRoLCBAZ2FtZUZpZWxkLmhlaWdodFxyXG5cclxuXHR1cGRhdGUgOiAtPlxyXG5cdFx0QGZyYW1lKysgXHJcblx0XHRcclxuXHRcdHVubGVzcyBAZnJhbWUgJSBSRURSQVdfUkFURSA9PSAwXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdEBjbGVhckdhbWVGaWVsZCgpXHRcclxuXHRcdEBhbmltYXRpb25GcmFtZSsrIFxyXG5cclxuXHRcdGZvciBwcm9qZWN0aWxlIGluIEBwcm9qZWN0aWxlc1xyXG5cdFx0XHRwcm9qZWN0aWxlLnVwZGF0ZSgpXHRcclxuXHJcblx0XHRhZHZhbmNlRmxhZ3MgPSBbXVxyXG5cdFx0YWR2YW5jZUZsYWdzW3JhbmtJZF0gPSBmYWxzZSBmb3IgcmFua1R5cGUscmFua0lkIGluIEBpbnZhZGVyUmFua3NcclxuXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0YWR2YW5jZUZsYWdzW2ludmFkZXIucmFua10gPSBhZHZhbmNlRmxhZ3NbaW52YWRlci5yYW5rXSBvciBpbnZhZGVyLmNoZWNrQWR2YW5jZShpbnZhZGVyLnJhbmspXHRcclxuXHJcblx0XHRmb3IgaW52YWRlciBpbiBAaW52YWRlcnNcclxuXHRcdFx0aW52YWRlci51cGRhdGUgQGFuaW1hdGlvbkZyYW1lLCBhZHZhbmNlRmxhZ3NcclxuXHJcblxyXG5cdFx0QGhhbmRsZUtleWJvYXJkSW50ZXJhY3Rpb24oKVxyXG5cclxuXHRjaGVja0Rlc3Ryb3llZE9iamVjdHMgOiAtPlxyXG5cdFx0QHByb2plY3RpbGVzID0gXy5maWx0ZXIgQHByb2plY3RpbGVzLChwcm9qZWN0aWxlKS0+IG5vdCBwcm9qZWN0aWxlLmlzRGVzdHJveWVkKClcclxuXHJcblx0XHRAaW52YWRlcnMgPSBfLmZpbHRlciBAaW52YWRlcnMsKGludmFkZXIpLT4gbm90IGludmFkZXIuaXNEZXN0cm95ZWQoKVxyXG5cclxuXHRoYW5kbGVLZXlib2FyZEludGVyYWN0aW9uIDogLT5cdFx0XHJcblx0XHRpZiBAY29udHJvbHMuaXNEb3duKEtleWJvYXJkLktFWV9DT0RFX0xFRlQpXHJcblx0XHRcdEBjYW5ub24udXBkYXRlIEBhbmltYXRpb25GcmFtZSwgQ2Fubm9uLkRJUkVDVElPTl9MRUZUXHJcblx0XHRlbHNlIGlmIEBjb250cm9scy5pc0Rvd24oS2V5Ym9hcmQuS0VZX0NPREVfUklHSFQpXHJcblx0XHRcdEBjYW5ub24udXBkYXRlIEBhbmltYXRpb25GcmFtZSwgQ2Fubm9uLkRJUkVDVElPTl9SSUdIVFxyXG5cdFx0ZWxzZSBcclxuXHRcdFx0QGNhbm5vbi51cGRhdGUgQGFuaW1hdGlvbkZyYW1lXHJcblx0XHRpZiBAY29udHJvbHMuaXNEb3duKEtleWJvYXJkLktFWV9DT0RFX1NQQUNFKVx0XHRcdFxyXG5cdFx0XHRAcHJvamVjdGlsZXMucHVzaCBAY2Fubm9uLmZpcmUgQGFuaW1hdGlvbkZyYW1lIGlmIEBjYW5ub24uaXNSZWxvYWRlZCgpXHJcblx0XHJcblx0cmVuZGVyIDogLT5cclxuXHRcdGZvciBwcm9qZWN0aWxlIGluIEBwcm9qZWN0aWxlc1x0XHRcdFxyXG5cdFx0XHRwcm9qZWN0aWxlLnJlbmRlciBAY3R4IFxyXG5cclxuXHRcdGZvciBpbnZhZGVyIGluIEBpbnZhZGVyc1xyXG5cdFx0XHRpbnZhZGVyLnJlbmRlciBAY3R4XHJcblxyXG5cdFx0QGNhbm5vbi5yZW5kZXIgQGN0eCwgQGFuaW1hdGlvbkZyYW1lXHJcblxyXG5cdGdldEpzRmlsZURpciA9IChmaWxlbmFtZSktPlxyXG5cdFx0cmVnID0gXCIuKiN7ZmlsZW5hbWV9LipcIlxyXG5cdFx0JChcInNjcmlwdFtzcmNdXCIpLmZpbHRlcigtPnRoaXMuc3JjLm1hdGNoIG5ldyBSZWdFeHAocmVnKSkubGFzdCgpLmF0dHIoXCJzcmNcIikuc3BsaXQoJz8nKVswXS5zcGxpdCgnLycpLnNsaWNlKDAsIC0xKS5qb2luKCcvJykrJy8nXHJcblx0XHRcclxud2luZG93LlNwYWNlSW52YWRlcnNHYW1lID0gU3BhY2VJbnZhZGVyc0dhbWVcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==