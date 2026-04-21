const state = {
  currentView: "search",
  recentKeywords: [],
  favoriteIds: [],
  favoriteItems: [],
  popularKeywords: ["경기도", "캠핑장", "공원", "차박", "카라반", "글램핑"],
  searchKeyword: "",
  searchResults: [],
  currentCamp: null,
  detailMap: null,
  detailMarker: null,
  pendingQuickMap: false,
  resultMode: "all",
  currentPage: 1,
  pageSize: 10,
};

const STORAGE_KEYS = {
  RECENT: "camping-search-recent-keywords",
  FAVORITE_IDS: "camping-search-favorite-ids",
  FAVORITE_ITEMS: "camping-search-favorite-items",
};

const els = {};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1200&q=80";

const BOOKMARK_ICON = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v13.4l-7-3.9-7 3.9V6a1.5 1.5 0 0 1 1.5-1.5Z"/>
    <path d="M6.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v13.4l-7-3.9-7 3.9V6a1.5 1.5 0 0 1 1.5-1.5Z"/>
  </svg>
`;

const init = () => {
  cacheElements();
  loadStorage();
  bindEvents();
  renderRecentKeywords();
  renderPopularKeywords();
  updateFilterButtons();
  showView("search");
  syncSearchInputs("");
  loadKakaoMapScript();
};

const cacheElements = () => {
  const ids = [
    "searchView",
    "resultView",
    "detailView",
    "searchInput",
    "openSearchResultBtn",
    "quickMapBtn",
    "clearRecentBtn",
    "recentKeywordList",
    "popularKeywordList",
    "backToSearchBtn",
    "toggleResultMapBtn",
    "resultSearchInput",
    "resultSearchBtn",
    "resultSummary",
    "resultState",
    "resultList",
    "resultPagination",
    "showAllBtn",
    "showFavoritesBtn",
    "tabSearchBtn",
    "backToResultBtn",
    "openMapExternalBtn",
    "detailTopTitle",
    "detailHeroImage",
    "detailTitle",
    "detailAddress",
    "detailBookmarkBtn",
    "copyAddressBtn",
    "homepageLink",
    "reservationLink",
    "detailFacilityChips",
    "detailKeywordChips",
    "detailInfoGrid",
    "detailDescription",
    "detailMap",
    "recenterMapBtn",
    "showNearbyBtn",
    "nearbyList",
  ];

  ids.forEach((id) => {
    els[id] = document.getElementById(id);
  });
};

const loadStorage = () => {
  state.recentKeywords = readJSON(STORAGE_KEYS.RECENT, ["경기도", "글램핑"]);
  state.favoriteIds = readJSON(STORAGE_KEYS.FAVORITE_IDS, []);
  state.favoriteItems = readJSON(STORAGE_KEYS.FAVORITE_ITEMS, []);
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const saveFavoritesToStorage = () => {
  writeJSON(STORAGE_KEYS.FAVORITE_IDS, state.favoriteIds);
  writeJSON(STORAGE_KEYS.FAVORITE_ITEMS, state.favoriteItems);
};

const bindEvents = () => {
  els.openSearchResultBtn?.addEventListener("click", () =>
    performSearch(els.searchInput.value.trim()),
  );
  els.resultSearchBtn?.addEventListener("click", () =>
    performSearch(els.resultSearchInput.value.trim()),
  );

  els.searchInput?.addEventListener("keydown", onSearchKeydown);
  els.resultSearchInput?.addEventListener("keydown", onSearchKeydown);

  els.tabSearchBtn?.addEventListener("click", moveToSearchView);
  els.searchInput?.addEventListener("focus", clearSearchInput);
  els.resultSearchInput?.addEventListener("focus", clearSearchInput);

  els.clearRecentBtn?.addEventListener("click", onClearRecentClick);
  els.quickMapBtn?.addEventListener("click", onQuickMapClick);
  els.backToSearchBtn?.addEventListener("click", () => showView("search"));
  els.backToResultBtn?.addEventListener("click", () => showView("result"));
  els.toggleResultMapBtn?.addEventListener("click", toggleResultMapPanel);

  els.showAllBtn?.addEventListener("click", () => switchResultMode("all"));
  els.showFavoritesBtn?.addEventListener("click", () =>
    switchResultMode("favorites"),
  );

  els.detailBookmarkBtn?.addEventListener("click", toggleCurrentFavorite);
  els.copyAddressBtn?.addEventListener("click", copyCurrentAddress);
  els.openMapExternalBtn?.addEventListener("click", openCurrentKakaoMap);
  els.recenterMapBtn?.addEventListener("click", centerDetailMap);
  els.showNearbyBtn?.addEventListener("click", renderNearbyList);
};

const moveToSearchView = () => {
  showView("search");
  syncSearchInputs("");
  els.searchInput?.focus();
};

const clearSearchInput = (event) => {
  event.target.value = "";
};

const onSearchKeydown = (event) => {
  if (event.key === "Enter") {
    performSearch(event.target.value.trim());
  }
};

const onClearRecentClick = () => {
  if (!state.recentKeywords.length) return;
  if (!confirm("최근 검색어를 모두 삭제할까?")) return;

  state.recentKeywords = [];
  writeJSON(STORAGE_KEYS.RECENT, state.recentKeywords);
  renderRecentKeywords();
};

const onQuickMapClick = async () => {
  if (!state.searchResults.length) {
    const keyword = els.searchInput.value.trim() || "경기도";
    state.pendingQuickMap = true;
    await performSearch(keyword);
    return;
  }

  showView("result");
  openResultMap();
};

const syncSearchInputs = (keyword) => {
  if (els.searchInput) els.searchInput.value = keyword;
  if (els.resultSearchInput) els.resultSearchInput.value = keyword;
};

const addRecentKeyword = (keyword) => {
  if (!keyword) return;

  state.recentKeywords = [
    keyword,
    ...state.recentKeywords.filter((item) => item !== keyword),
  ].slice(0, 8);

  writeJSON(STORAGE_KEYS.RECENT, state.recentKeywords);
  renderRecentKeywords();
};

const renderRecentKeywords = () => {
  if (!els.recentKeywordList) return;

  if (!state.recentKeywords.length) {
    els.recentKeywordList.innerHTML =
      '<p class="empty-text">최근 검색어가 아직 없어.</p>';
    return;
  }

  els.recentKeywordList.innerHTML = state.recentKeywords
    .map(
      (keyword) => `
      <button class="chip is-removable" type="button" data-recent-keyword="${escapeHtml(keyword)}">
        <span>${escapeHtml(keyword)}</span>
      </button>
    `,
    )
    .join("");

  els.recentKeywordList
    .querySelectorAll("[data-recent-keyword]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        performSearch(button.dataset.recentKeyword),
      );
    });
};

const renderPopularKeywords = () => {
  if (!els.popularKeywordList) return;

  els.popularKeywordList.innerHTML = state.popularKeywords
    .map(
      (keyword) => `
      <button class="chip chip--blue" type="button" data-popular-keyword="${escapeHtml(keyword)}">
        ${escapeHtml(keyword)}
      </button>
    `,
    )
    .join("");

  els.popularKeywordList
    .querySelectorAll("[data-popular-keyword]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        performSearch(button.dataset.popularKeyword),
      );
    });
};

const switchResultMode = (mode) => {
  state.resultMode = mode;
  state.currentPage = 1;
  updateFilterButtons();
  renderResultList();
};

const updateFilterButtons = () => {
  els.showAllBtn?.classList.toggle("is-active", state.resultMode === "all");
  els.showFavoritesBtn?.classList.toggle(
    "is-active",
    state.resultMode === "favorites",
  );
};

const performSearch = async (keyword) => {
  if (!keyword) {
    alert("검색어를 입력해줘.");
    return;
  }

  state.searchKeyword = keyword;
  state.resultMode = "all";
  state.currentPage = 1;
  updateFilterButtons();
  syncSearchInputs(keyword);
  addRecentKeyword(keyword);
  showView("result");
  setResultState("loading", `"${escapeHtml(keyword)}" 검색 중...`);

  try {
    const results = await fetchCampingData(keyword);
    state.searchResults = enrichResults(results);
    renderResultList();

    if (state.pendingQuickMap) {
      state.pendingQuickMap = false;
      openResultMap();
    }
  } catch (error) {
    console.error(error);
    state.searchResults = [];
    setResultState(
      "error",
      "검색 중 오류가 발생했어. API 키와 서비스 상태를 확인해줘.",
    );
    if (els.resultList) els.resultList.innerHTML = "";
    if (els.resultPagination) els.resultPagination.innerHTML = "";
  }
};

const fetchCampingData = async (keyword) => {
  const serviceKey = window.APP_CONFIG?.GOCAMPING_SERVICE_KEY;
  if (!serviceKey || serviceKey.includes("YOUR_GOCAMPING_SERVICE_KEY_HERE")) {
    throw new Error("GoCamping service key is missing.");
  }

  const params = new URLSearchParams({
    serviceKey,
    pageNo: "1",
    numOfRows: "50",
    MobileOS: window.APP_CONFIG?.MOBILE_OS || "ETC",
    MobileApp: window.APP_CONFIG?.MOBILE_APP || "CampingSearchApp",
    _type: "json",
    keyword,
  });

  const url = `https://apis.data.go.kr/B551011/GoCamping/searchList?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const items = data?.response?.body?.items?.item;

  if (!items) return [];
  return Array.isArray(items) ? items : [items];
};

const enrichResults = (items) => {
  return items
    .map((item) => {
      const normalized = normalizeCampItem(item);
      return {
        ...normalized,
        isFavorite: state.favoriteIds.includes(String(normalized.contentId)),
      };
    })
    .sort(
      (a, b) =>
        parseDistanceNumber(a.distanceText) -
        parseDistanceNumber(b.distanceText),
    );
};

const normalizeCampItem = (item) => ({
  ...item,
  contentId: String(item.contentId),
  title: item.facltNm || item.title || "이름 없음",
  address: item.address || [item.addr1, item.addr2].filter(Boolean).join(" "),
  image: item.image || item.firstImageUrl || FALLBACK_IMAGE,
  keywords: Array.isArray(item.keywords)
    ? item.keywords
    : normalizeKeywords(item.keyword),
  facilities: Array.isArray(item.facilities)
    ? item.facilities
    : buildFacilityChips(item),
  distanceText: item.distanceText || computeDistanceText(item),
  homepage: item.homepage || "",
  resveUrl: item.resveUrl || "",
});

const normalizeKeywords = (value) => {
  if (!value) return [];
  return String(value)
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);
};

const buildFacilityChips = (item) => {
  const chips = [];
  if (item.induty) chips.push(item.induty);
  if (item.lctCl) chips.push(item.lctCl);
  if (item.facltDivNm) chips.push(item.facltDivNm);

  if (item.sbrsCl) {
    item.sbrsCl
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 3)
      .forEach((v) => chips.push(v));
  }

  return [...new Set(chips)].slice(0, 4);
};

const computeDistanceText = (item) => {
  const seoulLat = 37.5665;
  const seoulLng = 126.978;
  const lat = Number(item.mapY);
  const lng = Number(item.mapX);

  if (!lat || !lng) return "-";
  return `${getDistanceInKm(seoulLat, seoulLng, lat, lng).toFixed(1)}km`;
};

const parseDistanceNumber = (text) => {
  const value = Number(String(text).replace("km", ""));
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
};

const getVisibleResults = () => {
  if (state.resultMode === "favorites") {
    return state.favoriteItems.map((item) => ({
      ...item,
      isFavorite: true,
    }));
  }
  return state.searchResults;
};

const renderResultList = () => {
  if (!els.resultSummary || !els.resultList || !els.resultPagination) return;

  const visibleResults = getVisibleResults();
  const count = visibleResults.length;
  const totalPages = Math.max(1, Math.ceil(count / state.pageSize));
  state.currentPage = Math.min(state.currentPage, totalPages);

  const startIndex = (state.currentPage - 1) * state.pageSize;
  const pagedResults = visibleResults.slice(
    startIndex,
    startIndex + state.pageSize,
  );

  els.resultSummary.textContent = count
    ? state.resultMode === "favorites"
      ? `즐겨찾기 ${count}곳 · ${state.currentPage}/${totalPages} 페이지`
      : `총 ${count}개의 캠핑장 · ${state.currentPage}/${totalPages} 페이지`
    : "";

  if (!count) {
    setResultState(
      "empty",
      state.resultMode === "favorites"
        ? "아직 저장한 캠핑장이 없어."
        : "검색 결과가 없어. 다른 지역명이나 키워드로 다시 검색해줘.",
    );
    els.resultList.innerHTML = "";
    els.resultPagination.innerHTML = "";
    return;
  }

  setResultState("none");

  els.resultList.innerHTML = pagedResults
    .map(
      (item) => `
      <article class="result-item" data-content-id="${escapeHtml(String(item.contentId))}">
        <img
          class="result-thumb"
          src="${escapeAttribute(item.image)}"
          alt="${escapeAttribute(item.title)}"
          loading="lazy"
          onerror="this.src='${FALLBACK_IMAGE}'"
        />
        <div class="result-content">
          <div class="result-title-row">
            <div>
              <h3 class="result-title">${escapeHtml(item.title)}</h3>
              <p class="result-address">${escapeHtml(item.address || "주소 정보 없음")}</p>
            </div>
            <button
              class="bookmark-button ${item.isFavorite ? "is-active" : ""}"
              type="button"
              data-bookmark-id="${escapeHtml(String(item.contentId))}"
              aria-label="저장"
            >
              ${BOOKMARK_ICON}
            </button>
          </div>
          <div class="result-meta-row">
            <div class="meta-chip-group">
              ${item.facilities
                .slice(0, 2)
                .map(
                  (chip) =>
                    `<span class="chip chip--blue">${escapeHtml(chip)}</span>`,
                )
                .join("")}
            </div>
            <span class="distance-text">${escapeHtml(item.distanceText)}</span>
          </div>
        </div>
      </article>
    `,
    )
    .join("");

  els.resultList.querySelectorAll(".result-item").forEach((itemEl) => {
    itemEl.addEventListener("click", (event) => {
      const bookmarkButton = event.target.closest("[data-bookmark-id]");
      if (bookmarkButton) {
        event.stopPropagation();
        toggleFavorite(bookmarkButton.dataset.bookmarkId);
        return;
      }
      openDetail(itemEl.dataset.contentId);
    });
  });

  renderPagination(totalPages);
};

const renderPagination = (totalPages) => {
  if (!els.resultPagination) return;

  if (totalPages <= 1) {
    els.resultPagination.innerHTML = "";
    return;
  }

  const buttons = [];

  if (state.currentPage > 1) {
    buttons.push(
      `<button class="pagination-button" type="button" data-page="${state.currentPage - 1}">이전</button>`,
    );
  }

  for (let page = 1; page <= totalPages; page += 1) {
    buttons.push(`
      <button class="pagination-button ${page === state.currentPage ? "is-active" : ""}" type="button" data-page="${page}">
        ${page}
      </button>
    `);
  }

  if (state.currentPage < totalPages) {
    buttons.push(
      `<button class="pagination-button" type="button" data-page="${state.currentPage + 1}">다음</button>`,
    );
  }

  els.resultPagination.innerHTML = buttons.join("");

  els.resultPagination.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentPage = Number(button.dataset.page);
      renderResultList();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
};

const setResultState = (type, message = "") => {
  if (!els.resultState) return;
  els.resultState.innerHTML =
    type === "none" ? "" : `<div class="state-box">${message}</div>`;
};

const syncFavoriteFlags = () => {
  state.searchResults = state.searchResults.map((item) => ({
    ...item,
    isFavorite: state.favoriteIds.includes(String(item.contentId)),
  }));

  state.favoriteItems = state.favoriteItems.map((item) => ({
    ...item,
    isFavorite: true,
  }));
};

const addFavoriteItem = (camp) => {
  const normalized = normalizeCampItem(camp);
  const id = String(normalized.contentId);

  if (!state.favoriteIds.includes(id)) {
    state.favoriteIds = [id, ...state.favoriteIds];
  }

  state.favoriteItems = [
    normalized,
    ...state.favoriteItems.filter((item) => String(item.contentId) !== id),
  ];
};

const removeFavoriteItem = (contentId) => {
  const id = String(contentId);
  state.favoriteIds = state.favoriteIds.filter((item) => item !== id);
  state.favoriteItems = state.favoriteItems.filter(
    (item) => String(item.contentId) !== id,
  );
};

const findCampById = (contentId) => {
  const id = String(contentId);
  return (
    state.searchResults.find((item) => String(item.contentId) === id) ||
    state.favoriteItems.find((item) => String(item.contentId) === id) ||
    null
  );
};

const toggleFavorite = (contentId) => {
  const id = String(contentId);
  const targetCamp = findCampById(id);

  if (state.favoriteIds.includes(id)) {
    removeFavoriteItem(id);
  } else if (targetCamp) {
    addFavoriteItem(targetCamp);
  }

  saveFavoritesToStorage();
  syncFavoriteFlags();

  if (state.currentCamp && String(state.currentCamp.contentId) === id) {
    const updated = findCampById(id);
    state.currentCamp = updated || state.currentCamp;
    state.currentCamp.isFavorite = state.favoriteIds.includes(id);
    updateDetailFavoriteButton();
  }

  renderResultList();
};

const openDetail = (contentId) => {
  const target = findCampById(contentId);
  if (!target) return;

  state.currentCamp = {
    ...target,
    isFavorite: state.favoriteIds.includes(String(target.contentId)),
  };

  showView("detail");
  renderDetail(state.currentCamp);
};

const renderDetail = (camp) => {
  if (!camp) return;

  els.detailTopTitle.textContent = camp.title;
  els.detailHeroImage.src = camp.image;
  els.detailHeroImage.alt = `${camp.title} 대표 이미지`;
  els.detailTitle.textContent = camp.title;
  els.detailAddress.textContent = camp.address || "주소 정보 없음";
  els.detailDescription.textContent =
    [camp.lineIntro, camp.intro].filter(Boolean).join("\n\n") ||
    "상세 소개 정보가 아직 없어.";

  renderFacilityChips(camp);
  renderKeywordText(camp);
  renderInfoGrid(camp);
  configureActionLinks(camp);
  updateDetailFavoriteButton();
  renderDetailMap(camp);
  renderNearbyList();
};

const renderFacilityChips = (camp) => {
  const items = camp.facilities.length
    ? camp.facilities
    : ["편의시설 정보 없음"];
  els.detailFacilityChips.innerHTML = items
    .map(
      (chip) => `<span class="chip chip--outline">${escapeHtml(chip)}</span>`,
    )
    .join("");
};

const renderKeywordText = (camp) => {
  els.detailKeywordChips.textContent = camp.keywords.length
    ? camp.keywords.map((word) => `#${word}`).join(" ")
    : "#캠핑 #야영장";
};

const renderInfoGrid = (camp) => {
  const cards = [
    ["캠핑장 유형", camp.induty || "-"],
    ["운영 기간", camp.operPdCl || "-"],
    ["운영 요일", camp.operDeCl || "-"],
    ["입지 유형", camp.lctCl || "-"],
    ["예약 방식", camp.resveCl || "-"],
    ["반려동물", camp.animalCmgCl || "-"],
    ["전화번호", camp.tel || "-"],
    ["지역", [camp.doNm, camp.sigunguNm].filter(Boolean).join(" ") || "-"],
  ];

  els.detailInfoGrid.innerHTML = cards
    .map(
      ([label, value]) => `
      <article class="info-card">
        <span class="info-card__label">${escapeHtml(label)}</span>
        <p class="info-card__value">${escapeHtml(value)}</p>
      </article>
    `,
    )
    .join("");
};

const configureActionLinks = (camp) => {
  toggleLink(els.homepageLink, camp.homepage);
  toggleLink(els.reservationLink, camp.resveUrl || camp.homepage);
};

const toggleLink = (element, href) => {
  if (!element) return;
  const enabled = Boolean(href && href !== "");
  element.href = enabled ? href : "#";
  element.style.opacity = enabled ? "1" : ".38";
  element.style.pointerEvents = enabled ? "auto" : "none";
};

const updateDetailFavoriteButton = () => {
  if (!els.detailBookmarkBtn || !state.currentCamp) return;

  const isFavorite = state.favoriteIds.includes(
    String(state.currentCamp.contentId),
  );
  els.detailBookmarkBtn.classList.toggle("is-active", Boolean(isFavorite));
  els.detailBookmarkBtn.innerHTML = BOOKMARK_ICON;
  els.detailBookmarkBtn.setAttribute(
    "aria-label",
    isFavorite ? "저장됨" : "저장",
  );
};

const toggleCurrentFavorite = () => {
  if (!state.currentCamp) return;
  toggleFavorite(state.currentCamp.contentId);
};

const copyCurrentAddress = async () => {
  if (!state.currentCamp?.address) return;

  try {
    await navigator.clipboard.writeText(state.currentCamp.address);
    alert("주소를 복사했어.");
  } catch (error) {
    console.error(error);
    alert("주소 복사에 실패했어.");
  }
};

const openCurrentKakaoMap = () => {
  if (!state.currentCamp) return;

  const lat = Number(state.currentCamp.mapY);
  const lng = Number(state.currentCamp.mapX);

  if (!lat || !lng) {
    alert("지도 좌표 정보가 없어.");
    return;
  }

  const url = `https://map.kakao.com/link/map/${encodeURIComponent(state.currentCamp.title)},${lat},${lng}`;
  window.open(url, "_blank", "noopener");
};

const renderNearbyList = () => {
  if (!state.currentCamp || !els.nearbyList) return;

  const currentId = String(state.currentCamp.contentId);
  const lat = Number(state.currentCamp.mapY);
  const lng = Number(state.currentCamp.mapX);

  const baseList = [
    ...state.searchResults,
    ...state.favoriteItems.filter(
      (fav) =>
        !state.searchResults.some(
          (item) => String(item.contentId) === String(fav.contentId),
        ),
    ),
  ];

  const nearby = baseList
    .filter((item) => String(item.contentId) !== currentId)
    .map((item) => ({
      ...item,
      nearbyDistance:
        lat && lng && item.mapY && item.mapX
          ? getDistanceInKm(lat, lng, Number(item.mapY), Number(item.mapX))
          : Number.MAX_SAFE_INTEGER,
    }))
    .sort((a, b) => a.nearbyDistance - b.nearbyDistance)
    .slice(0, 3);

  if (!nearby.length) {
    els.nearbyList.innerHTML =
      '<div class="state-box">주변 추천 캠핑장이 없어.</div>';
    return;
  }

  els.nearbyList.innerHTML = nearby
    .map(
      (item) => `
      <button class="nearby-item" type="button" data-nearby-id="${escapeHtml(String(item.contentId))}">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.address || "주소 정보 없음")}</p>
        </div>
        <span class="distance-text">
          ${Number.isFinite(item.nearbyDistance) ? `${item.nearbyDistance.toFixed(1)}km` : "-"}
        </span>
      </button>
    `,
    )
    .join("");

  els.nearbyList.querySelectorAll("[data-nearby-id]").forEach((button) => {
    button.addEventListener("click", () => openDetail(button.dataset.nearbyId));
  });
};

const showView = (viewName) => {
  state.currentView = viewName;
  els.searchView?.classList.toggle("is-active", viewName === "search");
  els.resultView?.classList.toggle("is-active", viewName === "result");
  els.detailView?.classList.toggle("is-active", viewName === "detail");
};

const toggleResultMapPanel = () => openResultMap();

const openResultMap = () => {
  const visibleResults = getVisibleResults();
  if (!visibleResults.length) {
    alert("먼저 검색 결과를 불러와야 해.");
    return;
  }

  const labels = visibleResults
    .slice(0, 6)
    .map((item, index) => `${index + 1}. ${item.title}`)
    .join("\n");

  alert(`카카오맵은 상세 화면에서 바로 표시돼.\n\n현재 목록 상위:\n${labels}`);
};

const loadKakaoMapScript = () => {
  const kakaoKey = window.APP_CONFIG?.KAKAO_MAP_APP_KEY;
  if (!kakaoKey || kakaoKey.includes("YOUR_KAKAO_MAP_APP_KEY_HERE")) {
    console.warn("Kakao Map app key is missing.");
    return;
  }

  if (window.kakao?.maps) return;

  const script = document.createElement("script");
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
  script.async = true;
  script.onload = () =>
    window.kakao.maps.load(() => {
      if (state.currentCamp) renderDetailMap(state.currentCamp);
    });

  document.head.appendChild(script);
};

const renderDetailMap = (camp) => {
  const kakao = window.kakao;
  const lat = Number(camp.mapY);
  const lng = Number(camp.mapX);

  if (!kakao?.maps || !lat || !lng) {
    els.detailMap.innerHTML =
      '<div class="state-box" style="height:100%;display:flex;align-items:center;justify-content:center;">카카오맵 키를 넣으면 지도가 표시돼.</div>';
    return;
  }

  const position = new kakao.maps.LatLng(lat, lng);

  if (!state.detailMap) {
    state.detailMap = new kakao.maps.Map(els.detailMap, {
      center: position,
      level: 4,
    });
  } else {
    state.detailMap.setCenter(position);
  }

  if (state.detailMarker) {
    state.detailMarker.setMap(null);
  }

  state.detailMarker = new kakao.maps.Marker({
    position,
    clickable: true,
    title: camp.title,
  });

  state.detailMarker.setMap(state.detailMap);

  const overlayContent = `<div style="padding:8px 10px;font-size:12px;font-weight:700;border-radius:10px;background:#fff;border:1px solid #d9dce4;box-shadow:0 8px 20px rgba(0,0,0,.08);">${escapeHtml(camp.title)}</div>`;
  const infowindow = new kakao.maps.InfoWindow({ content: overlayContent });

  infowindow.open(state.detailMap, state.detailMarker);

  kakao.maps.event.addListener(state.detailMarker, "click", function () {
    infowindow.open(state.detailMap, state.detailMarker);
  });

  setTimeout(() => {
    state.detailMap.relayout();
    state.detailMap.setCenter(position);
  }, 80);
};

const centerDetailMap = () => {
  if (state.currentCamp) renderDetailMap(state.currentCamp);
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttribute = (value) => escapeHtml(value);

const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

document.addEventListener("DOMContentLoaded", init);
