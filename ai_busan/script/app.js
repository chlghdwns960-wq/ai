const CONFIG = {
  // 공공데이터포털에서 받은 일반 인증키 또는 URL 인코딩 키를 넣으면 돼
  SERVICE_KEY:
    "48c8fab9d57c28a39e6ce674320a111b4aa47959be037c73c60251c2846ed4fc",
  // 공식 문서 기준 국문 맛집 조회 주소
  API_BASE_URL: "https://apis.data.go.kr/6260000/FoodService/getFoodKr",
  RESULT_TYPE: "json",
  DEFAULT_PAGE_NO: 1,
  DEFAULT_ROWS: 200,
  DEFAULT_CENTER: { lat: 35.1796, lng: 129.0756 },
  IMAGE_BASE_URL: "https://www.visitbusan.net",
};

const state = {
  restaurants: [],
  filteredRestaurants: [],
  favoritesOnly: false,
  searchKeyword: "",
  selectedRestaurant: null,
  map: null,
  marker: null,
  infoWindow: null,
};

const FAVORITE_STORAGE_KEY = "busan-food-favorites";

const dom = {
  listView: document.getElementById("listView"),
  detailView: document.getElementById("detailView"),
  restaurantList: document.getElementById("restaurantList"),
  statusMessage: document.getElementById("statusMessage"),
  resultCount: document.getElementById("resultCount"),
  searchInput: document.getElementById("searchInput"),
  refreshButton: document.getElementById("refreshButton"),
  favoriteHeaderButton: document.getElementById("favoriteHeaderButton"),
  tabAll: document.getElementById("tabAll"),
  tabFavorites: document.getElementById("tabFavorites"),
  backButton: document.getElementById("backButton"),
  detailFavoriteButton: document.getElementById("detailFavoriteButton"),
  detailImage: document.getElementById("detailImage"),
  detailName: document.getElementById("detailName"),
  detailAddress: document.getElementById("detailAddress"),
  detailDescription: document.getElementById("detailDescription"),
  detailMenu: document.getElementById("detailMenu"),
  detailPhone: document.getElementById("detailPhone"),
  detailHours: document.getElementById("detailHours"),
  detailHomepageWrap: document.getElementById("detailHomepageWrap"),
  detailHomepage: document.getElementById("detailHomepage"),
  map: document.getElementById("map"),
};

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  loadRestaurants();
});

function bindEvents() {
  dom.searchInput.addEventListener("input", handleSearchInput);
  dom.refreshButton.addEventListener("click", loadRestaurants);
  dom.favoriteHeaderButton.addEventListener("click", () =>
    setFavoritesMode(true),
  );
  dom.tabAll.addEventListener("click", () => setFavoritesMode(false));
  dom.tabFavorites.addEventListener("click", () => setFavoritesMode(true));
  dom.backButton.addEventListener("click", showListView);
  dom.detailFavoriteButton.addEventListener("click", toggleSelectedFavorite);
}

async function loadRestaurants() {
  setStatus("로딩 중", true);

  try {
    const url = buildApiUrl();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const items = extractItems(data);

    if (!Array.isArray(items)) {
      throw new Error("API 응답 구조를 해석하지 못했어.");
    }

    state.restaurants = items
      .map(normalizeRestaurant)
      .filter((item) => item.id);
    applyFilters();

    if (state.restaurants.length === 0) {
      setStatus("불러온 데이터가 없어. API 키와 호출 결과를 확인해줘.");
    } else {
      setStatus("");
    }
  } catch (error) {
    console.error(error);
    state.restaurants = [];
    state.filteredRestaurants = [];
    renderList();
    setStatus(
      "데이터를 불러오지 못했어. API 키, 활용신청 상태, 브라우저 CORS 환경을 확인해줘.",
    );
  }
}

function buildApiUrl() {
  const params = new URLSearchParams({
    serviceKey: CONFIG.SERVICE_KEY,
    pageNo: String(CONFIG.DEFAULT_PAGE_NO),
    numOfRows: String(CONFIG.DEFAULT_ROWS),
    resultType: CONFIG.RESULT_TYPE,
  });

  return `${CONFIG.API_BASE_URL}?${params.toString()}`;
}

function extractItems(data) {
  const body =
    data?.getFoodKr?.item ??
    data?.response?.body?.items?.item ??
    data?.response?.body?.items;

  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.item)) return body.item;
  if (body && typeof body === "object") return [body];
  return [];
}

function normalizeRestaurant(item) {
  return {
    id: String(item.UC_SEQ ?? item.uc_seq ?? ""),
    name:
      safeText(item.MAIN_TITLE) ||
      safeText(item.PLACE) ||
      safeText(item.TITLE) ||
      "상호명 없음",
    title: safeText(item.TITLE),
    district: safeText(item.GUGUN_NM),
    address: joinText([item.ADDR1, item.ADDR2]),
    phone: safeText(item.CNTCT_TEL),
    hours: safeText(item.USAGE_DAY_WEEK_AND_TIME),
    menu: safeText(item.RPRSNTV_MENU),
    description: safeText(item.ITEMCNTNTS),
    homepage: safeText(item.HOMEPAGE_URL),
    image: resolveImageUrl(item.MAIN_IMG_NORMAL || item.MAIN_IMG_THUMB),
    thumbnail: resolveImageUrl(item.MAIN_IMG_THUMB || item.MAIN_IMG_NORMAL),
    lat: Number(item.LAT),
    lng: Number(item.LNG),
  };
}

function safeText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function joinText(values) {
  return values.map(safeText).filter(Boolean).join(" ");
}

function resolveImageUrl(url) {
  const text = safeText(url);
  if (!text)
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
  if (/^https?:\/\//i.test(text)) return text;
  if (text.startsWith("/")) return `${CONFIG.IMAGE_BASE_URL}${text}`;
  return `${CONFIG.IMAGE_BASE_URL}/${text}`;
}

function handleSearchInput(event) {
  state.searchKeyword = event.target.value.trim().toLowerCase();
  applyFilters();
}

function setFavoritesMode(isFavoritesOnly) {
  state.favoritesOnly = isFavoritesOnly;
  dom.tabAll.classList.toggle("nav-btn--active", !isFavoritesOnly);
  dom.tabFavorites.classList.toggle("nav-btn--active", isFavoritesOnly);
  applyFilters();
}

function applyFilters() {
  const favorites = getFavoriteIds();
  const keyword = state.searchKeyword;

  state.filteredRestaurants = state.restaurants.filter((restaurant) => {
    const matchesFavorite = state.favoritesOnly
      ? favorites.includes(restaurant.id)
      : true;
    const haystack = [
      restaurant.name,
      restaurant.address,
      restaurant.menu,
      restaurant.description,
      restaurant.district,
    ]
      .join(" ")
      .toLowerCase();
    const matchesKeyword = keyword ? haystack.includes(keyword) : true;
    return matchesFavorite && matchesKeyword;
  });

  renderList();
}

function renderList() {
  dom.resultCount.textContent = `전체 ${state.filteredRestaurants.length}건`;
  dom.restaurantList.innerHTML = "";

  if (state.filteredRestaurants.length === 0) {
    dom.restaurantList.innerHTML = `
      <div class="empty-box">
        ${state.favoritesOnly ? "즐겨찾기한 맛집이 아직 없어." : "검색 결과가 없어."}
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  state.filteredRestaurants.forEach((restaurant) => {
    const card = document.createElement("article");
    card.className = "restaurant-card";
    card.innerHTML = `
      <div class="restaurant-card__top">
        <div>
          <h3 class="restaurant-card__name">${escapeHtml(restaurant.name)}</h3>
          <p class="restaurant-card__meta"><strong>주소 :</strong> ${escapeHtml(restaurant.address || "정보 없음")}</p>
          <p class="restaurant-card__meta"><strong>메뉴 :</strong> ${escapeHtml(restaurant.menu || "정보 없음")}</p>
        </div>
        <div class="restaurant-card__actions">
          <button class="small-icon-btn js-open-detail" type="button" aria-label="상세 보기" data-id="${restaurant.id}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 21.5 21.5 20l-6-6ZM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
          </button>
          <button class="small-icon-btn js-toggle-favorite ${isFavorite(restaurant.id) ? "favorite-active" : ""}" type="button" aria-label="즐겨찾기 토글" data-id="${restaurant.id}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/></svg>
          </button>
        </div>
      </div>
    `;

    card
      .querySelector(".js-open-detail")
      .addEventListener("click", () => openDetail(restaurant.id));
    card.querySelector(".js-toggle-favorite").addEventListener("click", () => {
      toggleFavorite(restaurant.id);
      renderList();
    });

    fragment.appendChild(card);
  });

  dom.restaurantList.appendChild(fragment);
}

function openDetail(id) {
  const restaurant = state.restaurants.find((item) => item.id === id);
  if (!restaurant) return;

  state.selectedRestaurant = restaurant;
  dom.detailImage.src = restaurant.image;
  dom.detailImage.alt = `${restaurant.name} 대표 이미지`;
  dom.detailName.textContent = restaurant.name;
  dom.detailAddress.textContent = restaurant.address || "주소 정보 없음";
  dom.detailDescription.textContent =
    restaurant.description || "소개 정보 없음";
  dom.detailMenu.textContent = restaurant.menu || "대표 메뉴 정보 없음";
  dom.detailPhone.textContent = restaurant.phone || "연락처 정보 없음";
  dom.detailHours.textContent = restaurant.hours || "운영 시간 정보 없음";

  if (restaurant.homepage) {
    dom.detailHomepageWrap.classList.remove("info-block--hidden");
    dom.detailHomepage.href = restaurant.homepage;
    dom.detailHomepage.textContent = restaurant.homepage;
  } else {
    dom.detailHomepageWrap.classList.add("info-block--hidden");
    dom.detailHomepage.removeAttribute("href");
  }

  syncDetailFavoriteButton();
  showDetailView();
  renderMap(restaurant);
}

function showListView() {
  dom.listView.classList.add("view--active");
  dom.detailView.classList.remove("view--active");
}

function showDetailView() {
  dom.listView.classList.remove("view--active");
  dom.detailView.classList.add("view--active");
  window.scrollTo({ top: 0, behavior: "auto" });
}

function renderMap(restaurant) {
  const lat = Number.isFinite(restaurant.lat)
    ? restaurant.lat
    : CONFIG.DEFAULT_CENTER.lat;
  const lng = Number.isFinite(restaurant.lng)
    ? restaurant.lng
    : CONFIG.DEFAULT_CENTER.lng;

  if (!window.kakao || !window.kakao.maps) {
    dom.map.innerHTML =
      '<div class="empty-box">카카오맵 스크립트 키를 넣으면 지도가 보여.</div>';
    return;
  }

  window.kakao.maps.load(() => {
    dom.map.innerHTML = "";

    const position = new kakao.maps.LatLng(lat, lng);
    const options = { center: position, level: 3 };

    state.map = new kakao.maps.Map(dom.map, options);
    state.marker = new kakao.maps.Marker({ position, clickable: true });
    state.marker.setMap(state.map);

    state.infoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:8px 10px;font-size:13px;line-height:1.4;max-width:180px;word-break:keep-all;">${escapeHtml(restaurant.name)}</div>`,
    });
    state.infoWindow.open(state.map, state.marker);
  });
}

function toggleSelectedFavorite() {
  if (!state.selectedRestaurant) return;
  toggleFavorite(state.selectedRestaurant.id);
  syncDetailFavoriteButton();
  renderList();
}

function syncDetailFavoriteButton() {
  if (!state.selectedRestaurant) return;
  dom.detailFavoriteButton.classList.toggle(
    "favorite-active",
    isFavorite(state.selectedRestaurant.id),
  );
}

function getFavoriteIds() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function saveFavoriteIds(ids) {
  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(ids));
}

function isFavorite(id) {
  return getFavoriteIds().includes(id);
}

function toggleFavorite(id) {
  const favorites = getFavoriteIds();
  const nextFavorites = favorites.includes(id)
    ? favorites.filter((item) => item !== id)
    : [...favorites, id];
  saveFavoriteIds(nextFavorites);
}

function setStatus(message, isLoading = false) {
  if (!message) {
    dom.statusMessage.innerHTML = "";
    return;
  }

  dom.statusMessage.innerHTML = isLoading
    ? `<span class="loading-spinner"></span>${escapeHtml(message)}`
    : escapeHtml(message);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
