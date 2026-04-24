// 메뉴버튼 클릭 시 모바일 메뉴가 오른쪽에서 왼쪽으로 오는 애니메이션 효과

let btn = document.getElementById("btn");
let mobil = document.getElementById("mobil");
let cover = document.getElementById("cover");
let closebtn = document.getElementById("close-btn");
console.log(mobil, cover);
btn.addEventListener("click", function () {
  mobil.classList.add("on");
  cover.classList.add("on");
});

// X버튼 클릭 시 모바일 메뉴가 오른쪽 밖으로 내보내기
closebtn.addEventListener("click", function () {
  mobil.classList.remove("on");
  cover.classList.remove("on");
});
