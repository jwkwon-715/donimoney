$(document).ready(function() {
  // 스크롤 다운 버튼 클릭 시 다음 섹션으로 스크롤
  $(".play-guide-btn").click(function(e) {
    e.preventDefault();
    const target = $(this).attr("href");
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 800);
  });
  
  // 화살표 클릭 이벤트 - 이벤트 위임 방식으로 변경
  $(document).on('click', '.scroll-down a', function(e) {
    e.preventDefault();
    console.log("Arrow clicked!"); // 디버깅 메시지
    const target = $(this).attr("href") || "#stats-section";
    console.log("Target:", target); // 타겟 확인
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 800);
  });
  
  // 탭 버튼 클릭 시 활성화 및 콘텐츠 변경 (세 번째 섹션)
  $(".menu-buttons > div").click(function() {
    // 모든 탭 버튼에서 active 클래스 제거
    $(".menu-buttons > div").removeClass("active");
    
    // 클릭한 탭 버튼에 active 클래스 추가
    $(this).addClass("active");
    
    // 모든 탭 콘텐츠 숨기기
    $(".tab-content").hide();
    
    // 클릭한 탭에 해당하는 콘텐츠 표시
    const tabId = $(this).data("tab") + "-tab";
    $("#" + tabId).show();
  });
  
  // 위치 버튼 클릭 시 내용 전환 (네 번째 섹션)
  $(".location-btn").click(function() {
    // 모든 버튼에서 active 클래스 제거
    $(".location-btn").removeClass("active");
    
    // 클릭한 버튼에 active 클래스 추가
    $(this).addClass("active");
    
    // 모든 콘텐츠 숨기기
    $(".location-content").hide();
    
    // 선택한 위치에 해당하는 콘텐츠 표시
    const location = $(this).data("location");
    $("#" + location + "-content").fadeIn(300);
  });
});
