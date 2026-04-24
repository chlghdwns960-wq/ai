// 제이쿼리 준비작업
// $(document).ready(function(){}) 프로 준비
$(function () {
  // 메뉴버튼 클릭 시 모바일 메뉴가 오른쪽에서 왼쪽으로 오는 애니메이션 효과
  $("button").click(function () {
    $(".cover").fadeIn(300);
    $(".mobile-menu").animate({ right: 0 }, 300);
  });

  // X버튼 클릭 시 모바일 메뉴가 오른쪽 밖으로 내보내기
  $(".close-btn").click(function () {
    $(".mobile-menu").animate({ right: "-100%" });
    $(".cover").fadeOut(300);
  });
});
