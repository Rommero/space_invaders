(function() {
  $(document).ready(function() {
    var lastNames, names, tpl;
    $("body").on("mouseenter", ".tv-interaction-btn-default", function() {
      $(this).toggleClass("tv-interaction-btn-default");
      return $(this).toggleClass("tv-interaction-btn-follow");
    });
    $("body").on("mouseleave", ".tv-interaction-btn-follow", function() {
      $(this).toggleClass("tv-interaction-btn-default");
      return $(this).toggleClass("tv-interaction-btn-follow");
    });
    $("body").on("click", ".tv-interaction-btn-follow", function() {
      $(this).toggleClass("tv-interaction-btn-follow");
      return $(this).toggleClass("tv-interaction-btn-unfollow");
    });
    $("body").on("click", ".tv-interaction-btn-unfollow", function() {
      $(this).toggleClass("tv-interaction-btn-follow");
      return $(this).toggleClass("tv-interaction-btn-unfollow");
    });
    $("body").on("mouseenter", ".tv-interaction-btn-following", function() {
      $(this).toggleClass("tv-interaction-btn-following");
      return $(this).toggleClass("tv-interaction-btn-unfollow");
    });
    $("body").on("mouseleave", ".tv-interaction-btn-unfollow", function() {
      $(this).toggleClass("tv-interaction-btn-following");
      return $(this).toggleClass("tv-interaction-btn-unfollow");
    });
    tpl = $("#tv-usercard-template").html();
    names = ["John", "Kevin", "James", "Andrew"];
    lastNames = ["Adams", "Malcolm", "Madison", "Jackson"];
    return console.log(tpl);
  });

}).call(this);
