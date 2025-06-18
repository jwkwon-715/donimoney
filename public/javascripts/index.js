$(document).ready(function() {

  $(".play-guide-btn").click(function(e) {
    e.preventDefault();
    const target = $(this).attr("href");
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 800);
  });
  
  $(document).on('click', '.scroll-down a', function(e) {
    e.preventDefault();
    console.log("Arrow clicked!");
    const target = $(this).attr("href") || "#stats-section";
    console.log("Target:", target);
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 800);
  });
  

  $(".menu-buttons > div").click(function() {
    $(".menu-buttons > div").removeClass("active");
    $(this).addClass("active");
    $(".tab-content").hide();
    const tabId = $(this).data("tab") + "-tab";
    $("#" + tabId).show();
  });
  
  $(".location-btn").click(function() {
    $(".location-btn").removeClass("active");
    $(this).addClass("active");
    $(".location-content").hide();
    const location = $(this).data("location");
    $("#" + location + "-content").fadeIn(300);
  });
});
