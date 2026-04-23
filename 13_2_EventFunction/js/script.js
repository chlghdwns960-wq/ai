// 제이쿼리 사용 전 준비사항
$(function () {
  // 버튼 손모양으로표시
  $("button").css({ cursor: "pointer" });
  //   btn1 클릭 하면 .box1 첫번째 박스 부드럽게 사라지기
  $("#btn1").click(function () {
    $(".box1 div:first-child").fadeOut(1000);
  });

  // btn2 클릭 하면 .box1 첫번째 박스 부드럽게 나타나기
  $("#btn2").click(function () {
    $(".box1 div:first-child").fadeIn(1000);
  });

  // btn3 클릭 하면 .box1 두번째 박스 부드럽게 나오고/숨기기
  $("#btn3").click(function () {
    $(".box1 div:last-child").fadeToggle();
  });

  // btn4 클릭 하면 .box2 첫번째 박스 요소의 높이를 0
  $("#btn4").click(function () {
    $(".box2 div:first-child").slideUp();
  });

  // btn5 클릭 하면 .box2 첫번째 박스 요소의 높이를 200
  $("#btn5").click(function () {
    $(".box2 div:first-child").slideDown();
  });

  // btn6 클릭 하면 .box2 두번째 박스 토글
  $("#btn6").click(function () {
    $(".box2 div:nth-child(2)").slideToggle();
  });

  // btn7 클릭 하면 .box2 세번째 애니메이션. 단 포지션이 적용되어있여야함
  $("#btn7").click(function () {
    $(".box2 .ani").animate({ left: "840px" });
  });

  // btn8 클릭 하면 .box2 세번째 애니메이션. 복구
  $("#btn8").click(function () {
    $(".box2 .ani").animate({ left: "440px" });
  });

  // btn9 클릭 하면 box3 첫번째 class bg 추가
  $("#btn9").click(function () {
    $(".box3 div:first-child").addClass("bg");
  });

  // btn10 클릭 하면 box3 첫번째 class bg 삭제
  $("#btn10").click(function () {
    $(".box3 div:first-child").removeClass("bg");
  });
});
