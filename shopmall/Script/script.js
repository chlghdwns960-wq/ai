// 상품 데이터
const productsData = {
  recommended: [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1761574028262-6d834741bfd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBmYX시오ufGVufDF8fHx8MTc3NDgxNzI0OHww&ixlib=rb-4.1.0&q=80&w=1080",
      name: "실크 플리츠 롱 드레스",
      price: 89000,
      originalPrice: 125000,
      discount: 29,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1590588460172-2e7f65714644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxvdXNlJTIwd2hpdGV8ZW58MXx8fHwxNzc0OTI0MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "퓨어 코튼 셔츠 블라우스",
      price: 52000,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1773747310659-9b331019c5c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0JTIwc3dlYXRlciUyMGJlaWdlfGVufDF8fHx8MTc3NDgzMDk0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      name: "소프트 캐시미어 니트",
      price: 78000,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1577909687863-91bb3ec12db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY29hdCUyMGZhc2hpb258ZW58MXx8fHwxNzc0OTI0MTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "오버핏 울 코트",
      price: 165000,
      originalPrice: 198000,
      discount: 17,
    },
  ],
  new: [
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1602564642846-f4201ff0cae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2tpcnQlMjBmYX시오ufGVufDF8fHx8MTc3NDkyNDE2MXww&ixlib=rb-4.1.0&q=80&w=1080",
      name: "플로우 미디 스커트",
      price: 65000,
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1766818437680-8d2fd91aa51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwcGFudHMlMjBiZWlnZXxlbnwxfHx8fDE3NzQ5MjQxNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "하이웨이스트 와이드 팬츠",
      price: 69000,
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1642761441531-73cc1d187f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaWdhbiUyMHNvZnQlMjBwYXN0ZWx8ZW58MXx8fHwxNzc0OTI0MTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "소프트 알파카 가디건",
      price: 95000,
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1774141818089-d211d5bd01f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwaGFuZGJhZyUyMGxlYXRoZXJ8ZW58MXx8fHwxNzc0OTI0MTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "미니멀 레더 토트백",
      price: 118000,
      originalPrice: 148000,
      discount: 20,
    },
  ],
  best: [
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1590588460172-2e7f65714644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmxvdXNlJTIwd2hpdGV8ZW58MXx8fHwxNzc0OTI0MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "프리미엄 리넨 셔츠",
      price: 58000,
    },
    {
      id: 10,
      image:
        "https://images.unsplash.com/photo-1623279743107-152e86999257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwamV3ZWxyeSUyMGdvbGR8ZW58MXx8fHwxNzc0ODY2ODU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "골드 레이어드 목걸이",
      price: 45000,
    },
    {
      id: 11,
      image:
        "https://images.unsplash.com/photo-1761574028262-6d834741bfd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBmYX시오ufGVufDF8fHx8MTc3NDgxNzI0OHww&ixlib=rb-4.1.0&q=80&w=1080",
      name: "텍스처드 니트 원피스",
      price: 82000,
      originalPrice: 115000,
      discount: 29,
    },
    {
      id: 12,
      image:
        "https://images.unsplash.com/photo-1577909687863-91bb3ec12db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY29hdCUyMGZhc2hpb258ZW58MXx8fHwxNzc0OTI0MTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      name: "더블 버튼 블레이저",
      price: 138000,
    },
  ],
};

// 상품 카드 생성 함수
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const discountBadge = product.discount
    ? `<div class="discount-badge">${product.discount}%</div>`
    : "";

  const originalPrice = product.originalPrice
    ? `<span class="original-price">${product.originalPrice.toLocaleString()}원</span>`
    : "";

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
      <button class="like-btn" data-product-id="${product.id}">
        <i data-lucide="heart"></i>
      </button>
      ${discountBadge}
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">
        ${originalPrice}
        <span class="current-price">${product.price.toLocaleString()}원</span>
      </div>
    </div>
  `;

  return card;
}

// 상품 렌더링 함수
function renderProducts(containerId, products) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  products.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });

  // Lucide 아이콘 다시 초기화
  lucide.createIcons();
}

// 찜하기 버튼 이벤트
document.addEventListener("click", (e) => {
  if (e.target.closest(".like-btn")) {
    const btn = e.target.closest(".like-btn");
    btn.classList.toggle("liked");
  }
});

// 카테고리 탭 이벤트
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// 하단 탭바 이벤트
document.querySelectorAll(".bottom-tabbar .tab-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".bottom-tabbar .tab-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// 페이지 로드 시 상품 렌더링
document.addEventListener("DOMContentLoaded", () => {
  renderProducts("recommended-products", productsData.recommended);
  renderProducts("new-products", productsData.new);
  renderProducts("best-products", productsData.best);

  // Lucide 아이콘 초기화
  lucide.createIcons();

  // 장바구니 페이지 기능
  initCartPage();
});

// 장바구니 페이지 기능 초기화
function initCartPage() {
  // 전체선택 체크박스
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", (e) => {
      const itemCheckboxes = document.querySelectorAll(".item-checkbox");
      itemCheckboxes.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });
    });
  }

  // 개별 체크박스
  const itemCheckboxes = document.querySelectorAll(".item-checkbox");
  itemCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(itemCheckboxes).every((cb) => cb.checked);
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
      }
    });
  });

  // 수량 조절
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const quantityControl = e.target.closest(".quantity-control");
      const quantitySpan = quantityControl.querySelector(".quantity");
      let quantity = parseInt(quantitySpan.textContent);

      if (btn.classList.contains("plus")) {
        quantity++;
      } else if (btn.classList.contains("minus") && quantity > 1) {
        quantity--;
      }

      quantitySpan.textContent = quantity;
    });
  });

  // 아이템 삭제
  document.querySelectorAll(".cart-item-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      cartItem.style.transition = "opacity 0.3s";
      cartItem.style.opacity = "0";
      setTimeout(() => {
        cartItem.remove();
      }, 300);
    });
  });
}
