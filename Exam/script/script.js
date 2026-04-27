// 스플래시 화면에서 온보딩 화면으로 이동하는 함수
function moveToOnboarding() {
  window.location.href = "./index2.html";
}

// 페이지 로드 후 2초 뒤 온보딩 화면으로 자동 이동하는 함수
function startSplashTimer() {
  window.setTimeout(moveToOnboarding, 2000);
}

window.addEventListener("load", startSplashTimer);
