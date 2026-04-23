// 준비작업
$(function () {
  // list box 숨김
  $("footer .ineer .family .list").hide();
  //   button Click list box Toggle 주기
  $("button").click(function () {
    $(".list").slideToggle();
  });
});
