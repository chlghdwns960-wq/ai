const productsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 18%",
    name: "클래식 벨티드 트렌치 코트",
    price: 169000,
    originalPrice: 209000,
    discount: 19,
    category: "아우터",
    color: "베이지",
    fit: "레귤러 핏",
    material: "코튼 혼방",
    description:
      "간절기에 가장 활용도 높은 트렌치 코트야. 허리 벨트로 실루엣을 잡기 좋고, 출근룩부터 주말 약속룩까지 폭넓게 어울려.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 22%",
    name: "미니멀 더블 블레이저",
    price: 139000,
    category: "아우터",
    color: "차콜",
    fit: "세미 오버핏",
    material: "폴리 레이온 혼방",
    description:
      "깔끔한 실루엣이 강점인 더블 블레이저야. 슬랙스와 매치하면 포멀하게, 데님과 매치하면 세련된 데일리 룩으로 정리돼.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 24%",
    name: "퓨어 코튼 셔츠 블라우스",
    price: 52000,
    category: "상의",
    color: "오프화이트",
    fit: "스탠다드 핏",
    material: "코튼 100%",
    description:
      "단정하게 떨어지는 기본 셔츠 블라우스야. 단독으로 입어도 깔끔하고, 재킷 안 이너로 넣기에도 부담이 없어.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 20%",
    name: "소프트 베이직 니트 탑",
    price: 78000,
    category: "상의",
    color: "머스터드",
    fit: "슬림 핏",
    material: "비스코스 혼방 니트",
    description:
      "몸에 과하게 붙지 않는 베이직 니트 탑이야. 컬러 포인트가 분명해서 심플한 하의와 매치해도 룩이 밋밋하지 않아.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1506629905607-d9b1c1bdbf0c?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 26%",
    name: "하이웨이스트 와이드 슬랙스",
    price: 69000,
    category: "하의",
    color: "라이트 베이지",
    fit: "와이드 핏",
    material: "폴리 스판 혼방",
    description:
      "허리선을 안정적으로 잡아주는 와이드 슬랙스야. 셔츠, 니트, 재킷 어디에 붙여도 정돈된 비율이 나와.",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1506629905607-d9b1c1bdbf0c?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 22%",
    name: "플로우 미디 스커트",
    price: 65000,
    category: "하의",
    color: "아이보리",
    fit: "A라인 핏",
    material: "폴리 혼방",
    description:
      "움직일 때 자연스럽게 퍼지는 미디 스커트야. 너무 꾸민 느낌 없이 여성스러운 무드를 만들기 좋다.",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 20%",
    name: "실크 플레어 롱 원피스",
    price: 89000,
    originalPrice: 125000,
    discount: 29,
    category: "원피스",
    color: "플럼 퍼플",
    fit: "플레어 핏",
    material: "실키 폴리",
    description:
      "한 벌만 입어도 분위기가 살아나는 롱 원피스야. 특별한 약속이나 데이트 룩으로 활용하기 좋고 실루엣이 우아하게 떨어져.",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center 16%",
    name: "슬림 니트 미디 원피스",
    price: 82000,
    originalPrice: 109000,
    discount: 24,
    category: "원피스",
    color: "플로럴 크림",
    fit: "슬림 핏",
    material: "니트 혼방",
    description:
      "몸선을 정리해주는 니트 미디 원피스야. 단독으로도 충분하고, 가벼운 아우터와 함께 입기에도 좋아.",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center center",
    name: "위빙 레더 숄더백",
    price: 118000,
    originalPrice: 148000,
    discount: 20,
    category: "가방",
    color: "브라운",
    fit: "미디엄 사이즈",
    material: "비건 레더",
    description:
      "가볍게 메기 좋은 숄더백이야. 포멀한 룩은 물론 데님 기반 캐주얼 룩에도 자연스럽게 들어간다.",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=80",
    fallbackImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&h=1200&q=80",
    imagePosition: "center center",
    name: "파우더 블루 미니 백",
    price: 96000,
    category: "가방",
    color: "파우더 블루",
    fit: "미니 사이즈",
    material: "소프트 레더",
    description:
      "룩에 산뜻한 포인트를 더해주는 미니 백이야. 봄, 여름 시즌 가벼운 원피스나 셔츠 룩과 특히 잘 맞아.",
  },
];

function getProductById(productId) {
  return productsData.find((product) => product.id === Number(productId));
}

function formatPrice(price) {
  return `${price.toLocaleString()}원`;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.category = product.category;
  card.dataset.productId = product.id;
  card.tabIndex = 0;

  const discountBadge = product.discount
    ? `<div class="discount-badge">${product.discount}%</div>`
    : "";

  const originalPrice = product.originalPrice
    ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>`
    : "";

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" style="object-position: ${product.imagePosition || "center center"};" />
      <button class="like-btn" data-product-id="${product.id}" type="button" aria-label="찜하기">
        <i data-lucide="heart"></i>
      </button>
      ${discountBadge}
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">
        ${originalPrice}
        <span class="current-price">${formatPrice(product.price)}</span>
      </div>
    </div>
  `;

  const image = card.querySelector("img");
  if (image && product.fallbackImage) {
    image.addEventListener("error", () => {
      if (image.src !== product.fallbackImage) {
        image.src = product.fallbackImage;
      }
    }, { once: true });
  }

  return card;
}

function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    container.appendChild(createProductCard(product));
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function getFilteredProducts(category) {
  if (category === "전체") return productsData;
  return productsData.filter((product) => product.category === category);
}

function renderFilteredProducts(category) {
  const title = document.getElementById("filtered-title");
  const emptyMessage = document.getElementById("filtered-empty-message");
  const filteredProducts = getFilteredProducts(category);

  if (!title) return;

  title.textContent = category === "전체" ? "전체 상품" : `${category} 상품`;
  renderProducts("filtered-products", filteredProducts);

  if (emptyMessage) {
    emptyMessage.hidden = filteredProducts.length > 0;
  }
}

function initCategoryTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((button) => button.classList.remove("active"));
      btn.classList.add("active");
      renderFilteredProducts(btn.dataset.category);
    });
  });
}

function initLikeButtons() {
  document.addEventListener("click", (e) => {
    const likeButton = e.target.closest(".like-btn");
    if (!likeButton) return;
    e.stopPropagation();
    likeButton.classList.toggle("liked");
  });
}

function openProductDetail(productId) {
  window.location.href = `product.html?id=${productId}`;
}

function initProductCardNavigation() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn")) return;

    const productCard = e.target.closest(".product-card");
    if (!productCard) return;

    openProductDetail(productCard.dataset.productId);
  });

  document.addEventListener("keydown", (e) => {
    const productCard = e.target.closest(".product-card");
    if (!productCard) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProductDetail(productCard.dataset.productId);
    }
  });
}

function initBottomTabbar() {
  document.querySelectorAll(".bottom-tabbar .tab-item").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".bottom-tabbar .tab-item")
        .forEach((tabItem) => tabItem.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function renderProductDetailPage() {
  const detailPage = document.getElementById("product-detail-page");
  if (!detailPage) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const product = getProductById(productId) || productsData[0];

  const title = document.getElementById("detail-name");
  const image = document.getElementById("detail-image");
  const category = document.getElementById("detail-category");
  const price = document.getElementById("detail-price");
  const originalPrice = document.getElementById("detail-original-price");
  const discount = document.getElementById("detail-discount");
  const description = document.getElementById("detail-description");
  const meta = document.getElementById("detail-meta");

  if (title) title.textContent = product.name;
  if (image) {
    image.src = product.image;
    image.alt = product.name;
    image.style.objectPosition = product.imagePosition || "center center";
    image.onerror = () => {
      if (product.fallbackImage) image.src = product.fallbackImage;
    };
  }
  if (category) category.textContent = product.category;
  if (price) price.textContent = formatPrice(product.price);
  if (description) description.textContent = product.description;

  if (originalPrice) {
    if (product.originalPrice) {
      originalPrice.textContent = formatPrice(product.originalPrice);
      originalPrice.hidden = false;
    } else {
      originalPrice.hidden = true;
    }
  }

  if (discount) {
    if (product.discount) {
      discount.textContent = `${product.discount}% OFF`;
      discount.hidden = false;
    } else {
      discount.hidden = true;
    }
  }

  if (meta) {
    meta.innerHTML = `
      <div class="detail-meta-item"><span>카테고리</span><strong>${product.category}</strong></div>
      <div class="detail-meta-item"><span>컬러</span><strong>${product.color}</strong></div>
      <div class="detail-meta-item"><span>핏</span><strong>${product.fit}</strong></div>
      <div class="detail-meta-item"><span>소재</span><strong>${product.material}</strong></div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilteredProducts("전체");
  renderProductDetailPage();

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  initLikeButtons();
  initCategoryTabs();
  initProductCardNavigation();
  initBottomTabbar();
  initCartPage();
});

function initCartPage() {
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", (e) => {
      const itemCheckboxes = document.querySelectorAll(".item-checkbox");
      itemCheckboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });
    });
  }

  const itemCheckboxes = document.querySelectorAll(".item-checkbox");
  itemCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(itemCheckboxes).every((cb) => cb.checked);
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
      }
    });
  });

  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const quantityControl = e.target.closest(".quantity-control");
      const quantitySpan = quantityControl?.querySelector(".quantity");
      if (!quantitySpan) return;

      let quantity = parseInt(quantitySpan.textContent, 10);

      if (btn.classList.contains("plus")) {
        quantity += 1;
      } else if (btn.classList.contains("minus") && quantity > 1) {
        quantity -= 1;
      }

      quantitySpan.textContent = quantity;
    });
  });

  document.querySelectorAll(".cart-item-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      if (!cartItem) return;
      cartItem.style.transition = "opacity 0.3s";
      cartItem.style.opacity = "0";
      setTimeout(() => {
        cartItem.remove();
      }, 300);
    });
  });
}
