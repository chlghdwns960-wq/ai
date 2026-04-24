$(function () {
  // tab 메뉴 클릭 시 해당 번째에 on클래스 추가
  $(".tab li").click(function () {
    let num = $(this).index();
    console.log(num);
    // 기존 on class 삭제
    $(".tab li").removeClass("on");
    $(this).addClass("on");
    // 기존
    $(".list_wrap").hide();
    $(".list_wrap").eq(num).show();
  });
});
