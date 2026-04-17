const API_KEY = "08b7f44f0fb5d621b9725681d2900167";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityNameEl = document.getElementById("cityName");
const weatherDescEl = document.getElementById("weatherDesc");
const tempEl = document.getElementById("temp");
const windSpeedEl = document.getElementById("windSpeed");
const humidityEl = document.getElementById("humidity");
const feelsLikeEl = document.getElementById("feelsLike");
const ozoneEl = document.getElementById("ozone");
const statusMessageEl = document.getElementById("statusMessage");

function setStatus(message, isError = false) {
  statusMessageEl.textContent = message;
  statusMessageEl.style.color = isError
    ? "rgba(255, 235, 235, 0.98)"
    : "rgba(255, 255, 255, 0.92)";
}

function setLoadingState(isLoading) {
  searchBtn.disabled = isLoading;
  locationBtn.disabled = isLoading;

  if (isLoading) {
    searchBtn.textContent = "검색중";
    locationBtn.textContent = "로딩중";
  } else {
    searchBtn.textContent = "검색";
    locationBtn.textContent = "내 위치";
  }
}

function updateWeatherUI(weatherData, ozoneValue) {
  const city = weatherData.name || "도시명";
  const country = weatherData.sys?.country || "";
  const description = weatherData.weather?.[0]?.description || "날씨 정보 없음";
  const temp = Math.round(weatherData.main?.temp ?? 0);
  const windSpeed = weatherData.wind?.speed ?? 0;
  const humidity = weatherData.main?.humidity ?? 0;
  const feelsLike = Math.round(weatherData.main?.feels_like ?? 0);

  cityNameEl.textContent = country ? `${city}` : city;
  weatherDescEl.textContent = country
    ? `${country} · ${description}`
    : description;
  tempEl.textContent = `${temp}°`;
  windSpeedEl.innerHTML = `${Number(windSpeed).toFixed(2)} <small>m/s</small>`;
  humidityEl.textContent = `${humidity}%`;
  feelsLikeEl.textContent = `${feelsLike}°`;

  if (ozoneValue !== null && ozoneValue !== undefined) {
    ozoneEl.innerHTML = `${Math.round(ozoneValue)} <small>μg/m³</small>`;
  } else {
    ozoneEl.innerHTML = `- <small>μg/m³</small>`;
  }
}

async function getCoordinatesByCity(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city,
  )}&limit=1&appid=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("도시 좌표 조회에 실패했습니다.");
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("입력한 도시를 찾을 수 없습니다.");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
}

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("날씨 정보를 불러오지 못했습니다.");
  }

  return await response.json();
}

async function getAirPollutionByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("대기질 정보를 불러오지 못했습니다.");
  }

  const data = await response.json();
  return data?.list?.[0]?.components?.o3 ?? null;
}

async function searchWeatherByCity() {
  const city = cityInput.value.trim();

  if (!city) {
    setStatus("도시명을 입력해주세요.", true);
    cityInput.focus();
    return;
  }

  if (API_KEY === "YOUR_API_KEY_HERE") {
    setStatus("script.js 파일의 API 키를 먼저 입력해주세요.", true);
    return;
  }

  try {
    setLoadingState(true);
    setStatus("날씨 정보를 불러오는 중입니다...");

    const coords = await getCoordinatesByCity(city);
    const weatherData = await getWeatherByCoords(coords.lat, coords.lon);
    const ozoneValue = await getAirPollutionByCoords(coords.lat, coords.lon);

    updateWeatherUI(weatherData, ozoneValue);
    cityInput.value = "";
    cityInput.focus();
    setStatus(`${coords.name}, ${coords.country} 날씨 정보를 불러왔습니다.`);
  } catch (error) {
    setStatus(error.message || "오류가 발생했습니다.", true);
  } finally {
    setLoadingState(false);
  }
}

async function searchWeatherByLocation(lat, lon) {
  if (API_KEY === "YOUR_API_KEY_HERE") {
    setStatus("script.js 파일의 API 키를 먼저 입력해주세요.", true);
    return;
  }

  try {
    setLoadingState(true);
    setStatus("현재 위치 날씨를 불러오는 중입니다...");

    const weatherData = await getWeatherByCoords(lat, lon);
    const ozoneValue = await getAirPollutionByCoords(lat, lon);

    updateWeatherUI(weatherData, ozoneValue);
    setStatus("현재 위치 날씨 정보를 불러왔습니다.");
  } catch (error) {
    setStatus(
      error.message || "위치 기반 날씨 조회 중 오류가 발생했습니다.",
      true,
    );
  } finally {
    setLoadingState(false);
  }
}

function handleCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus("이 브라우저에서는 위치 정보를 지원하지 않습니다.", true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      searchWeatherByLocation(latitude, longitude);
    },
    () => {
      setStatus(
        "위치 권한이 거부되었거나 현재 위치를 가져올 수 없습니다.",
        true,
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  );
}

searchBtn.addEventListener("click", searchWeatherByCity);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeatherByCity();
  }
});

locationBtn.addEventListener("click", handleCurrentLocation);
