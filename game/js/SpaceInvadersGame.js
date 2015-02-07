(function() {
  var SpaceInvadersGame,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __hasProp = {}.hasOwnProperty;

  SpaceInvadersGame = (function(_super) {
    __extends(SpaceInvadersGame, _super);

    function SpaceInvadersGame(dest) {
      $(dest).append("canvas");
    }

    return SpaceInvadersGame;

  })(EventEmitter2);

}).call(this);
