const API_KEY = "08b7f44f0fb5d621b9725681d2900167";

const weatherTemp = document.getElementById("weatherTemp");
const weatherStatus = document.getElementById("weatherStatus");
const weatherLocation = document.getElementById("weatherLocation");
const weatherIcon = document.getElementById("weatherIcon");

/* 날씨 아이콘 */
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

/* 위치 기반 날씨 */
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

/* 상단 히어로 슬라이드 */
const heroSlides = document.querySelectorAll(".hero-slide");
let heroCurrentIndex = 0;

function moveHeroSlide() {
  heroSlides[heroCurrentIndex].classList.remove("active");
  heroCurrentIndex = (heroCurrentIndex + 1) % heroSlides.length;
  heroSlides[heroCurrentIndex].classList.add("active");
}

function initHeroSlider() {
  setInterval(moveHeroSlide, 2000);
}

/* 하단 가이드 슬라이드 */
const sliderTrack = document.getElementById("sliderTrack");
const originalSlideCount = 5;
let currentIndex = 0;

function moveSlide() {
  const slide = sliderTrack.querySelector(".slide-item");
  if (!slide) return;

  const slideWidth = slide.offsetWidth + 12;
  currentIndex++;

  sliderTrack.style.transition = "transform 0.75s ease";
  sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  if (currentIndex === originalSlideCount) {
    setTimeout(() => {
      sliderTrack.style.transition = "none";
      sliderTrack.style.transform = "translateX(0)";
      currentIndex = 0;
    }, 800);
  }
}

function initSlider() {
  setInterval(moveSlide, 2000);
}

window.addEventListener("load", () => {
  initWeather();
  initHeroSlider();
  initSlider();
});
