let btn1 = document.getElementById("btn1");
console.log(btn1);
let fadebox = document.getElementById("fadebox");
let fadetogglebox = document.getElementById("fadetogglebox");
console.log(fadetogglebox);
console.log(fadebox);
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");
let btn5 = document.getElementById("btn5");
let btn6 = document.getElementById("btn6");
let btn7 = document.getElementById("btn7");
let btn8 = document.getElementById("btn8");
let btn9 = document.getElementById("btn9");
let btn10 = document.getElementById("btn10");

// btn1 클릭 box1 첫번째 박스 부드럽게 사라지기
btn1.addEventListener("click", function () {
  fadebox.style.transition = "all 1s";
  fadebox.style.opacity = 0;
  //   사라지면서 공간을 차지않게 해주기
  fadebox.style.visibility = "visible";
});

// btn2 클릭 box1 첫번째 박스 부드럽게 나타내기
btn2.addEventListener("click", function () {
  fadebox.style.transition = "all 1s";
  fadebox.style.opacity = 1;
});

// btn3 클릭 box1 두번째 박스 토글
btn3.addEventListener("click", function () {
  fadetogglebox.classList.toggle("fade-hidden");
});

// btn4 클릭 box2 첫번째 박스 높이 0
let upbox = document.getElementById("up");
btn4.addEventListener("click", function () {
  upbox.classList.add("slide-hidden");
});

// btn5 클릭 box2 첫번째 박스 높이 200
btn5.addEventListener("click", function () {
  upbox.classList.remove("slide-hidden");
});

// btn6 클릭 box2 두번째 박스 토글
let slidetogglebox = document.getElementById("slidetogglebox");
btn6.addEventListener("click", function () {
  slidetogglebox.classList.toggle("slide-hidden");
});

// btn7 클릭 box2 세번째 애니메이션
let anibox = document.getElementById("anim");
btn7.addEventListener("click", function () {
  anibox.classList.add("ani-move");
});

// btn8 클릭 box2 세번째 애니메이션
btn8.addEventListener("click", function () {
  anibox.classList.remove("ani-move");
});
