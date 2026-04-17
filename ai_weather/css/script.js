/* =========================
   OpenWeather 설정
========================= */
const API_KEY = "08b7f44f0fb5d621b9725681d2900167";
// ↑ 여기에 네 API Key를 직접 넣으면 돼

const weatherTemp = document.getElementById("weatherTemp");
const weatherStatus = document.getElementById("weatherStatus");
const weatherLocation = document.getElementById("weatherLocation");
const weatherIcon = document.getElementById("weatherIcon");

/* =========================
   날씨 아이콘 매핑
========================= */
function getWeatherIcon(main) {
  const weather = main.toLowerCase();

  if (weather.includes("clear")) return "☀️";
  if (weather.includes("cloud")) return "☁️";
  if (
    weather.includes("rain") ||
    weather.includes("drizzle") ||
    weather.includes("thunderstorm")
  )
    return "🌧️";
  if (weather.includes("snow")) return "❄️";

  return "⛅";
}

function getWeatherLabel(main, description) {
  const weather = main.toLowerCase();

  if (weather.includes("clear")) return "맑음";
  if (weather.includes("cloud")) return "흐림";
  if (
    weather.includes("rain") ||
    weather.includes("drizzle") ||
    weather.includes("thunderstorm")
  )
    return "비";
  if (weather.includes("snow")) return "눈";

  return description || main;
}

/* =========================
   위치 기반 날씨 가져오기
========================= */
function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("날씨 데이터를 불러오지 못했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      const temp = Math.round(data.main.temp);
      const city = data.name || "현재 위치";
      const main = data.weather[0].main;
      const description = data.weather[0].description;

      weatherTemp.textContent = `${temp}°`;
      weatherStatus.textContent = getWeatherLabel(main, description);
      weatherLocation.textContent = city;
      weatherIcon.textContent = getWeatherIcon(main);
    })
    .catch((error) => {
      console.error(error);
      weatherTemp.textContent = "--°";
      weatherStatus.textContent = "날씨 정보 오류";
      weatherLocation.textContent = "API KEY 또는 네트워크 확인";
      weatherIcon.textContent = "⚠️";
    });
}

function initWeather() {
  if (!navigator.geolocation) {
    weatherStatus.textContent = "위치 지원 안 됨";
    weatherLocation.textContent = "브라우저에서 위치 정보를 지원하지 않음";
    weatherIcon.textContent = "⚠️";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    (error) => {
      console.error(error);
      weatherStatus.textContent = "위치 권한 필요";
      weatherLocation.textContent = "현재 위치 허용 후 새로고침";
      weatherIcon.textContent = "📍";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
}

/* =========================
   자동 슬라이드
   - 버튼 없음
   - 2초마다 이동
   - 무한 반복
========================= */
const sliderTrack = document.getElementById("sliderTrack");
const originalSlideCount = 5;
let currentIndex = 0;

function moveSlide() {
  const slide = sliderTrack.querySelector(".slide-item");
  if (!slide) return;

  const slideWidth = slide.offsetWidth + 10; // gap 포함
  currentIndex++;

  sliderTrack.style.transition = "transform 0.6s ease";
  sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  if (currentIndex === originalSlideCount) {
    setTimeout(() => {
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = "translateX(0)";
      currentIndex = 0;
    }, 650);
  }
}

function initSlider() {
  setInterval(moveSlide, 2000);
}

/* =========================
   실행
========================= */
window.addEventListener("load", () => {
  initWeather();
  initSlider();
});
