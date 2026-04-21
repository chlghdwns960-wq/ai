const loaderBar = document.getElementById("loaderBar");
const loaderText = document.getElementById("loaderText");

const duration = 3000;
const startTime = performance.now();
const targetUrl = "./index2.html";

function animateLoader(currentTime) {
  const elapsed = currentTime - startTime;
  const progress = Math.min((elapsed / duration) * 100, 100);

  loaderBar.style.width = `${progress}%`;
  loaderText.textContent = `${Math.round(progress)}%`;

  if (progress < 100) {
    requestAnimationFrame(animateLoader);
  } else {
    window.location.href = targetUrl;
  }
}

requestAnimationFrame(animateLoader);
