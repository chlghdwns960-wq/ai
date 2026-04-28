// Google Apps Script Web App URL은 마지막 단계에서 입력합니다.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUiHaxCyoZfkG0i8npLj7MPF2JUSdbf9DV2NbgWOp5gE0mCdbgusnYcGO86zZ50oxI/exec";

/**
 * 지정한 섹션으로 부드럽게 이동하는 함수입니다.
 */
function scrollToSection(targetSelector) {
  const target = document.querySelector(targetSelector);

  if (!target) return;

  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

  window.scrollTo({
    top: targetTop,
    behavior: "smooth",
  });
}

/**
 * CTA 버튼과 이동 버튼에 스크롤 이벤트를 연결하는 함수입니다.
 */
function initScrollButtons() {
  const scrollButtons = document.querySelectorAll(".js-scroll-target");

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      scrollToSection(target);
    });
  });
}

/**
 * 패키지 선택 버튼 클릭 시 폼의 희망 검진 패키지를 자동 선택하는 함수입니다.
 */
function initPackageSelect() {
  const packageButtons = document.querySelectorAll(".js-select-package");
  const packageSelect = document.getElementById("packageType");

  packageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedPackage = button.dataset.package;

      if (packageSelect) {
        packageSelect.value = selectedPackage;
      }

      scrollToSection("#reservation");
    });
  });
}

/**
 * 연락처 입력값을 숫자와 하이픈 형태로 자동 정리하는 함수입니다.
 */
function formatPhoneNumber(value) {
  const numbers = value.replace(/[^0-9]/g, "");

  if (numbers.length <= 3) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

/**
 * 연락처 입력 필드에 자동 하이픈 기능을 적용하는 함수입니다.
 */
function initPhoneFormat() {
  const phoneInput = document.getElementById("phone");

  if (!phoneInput) return;

  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhoneNumber(phoneInput.value);
  });
}

/**
 * 특정 필드의 에러 메시지를 표시하는 함수입니다.
 */
function setError(fieldName, message) {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);

  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * 모든 폼 에러 메시지를 초기화하는 함수입니다.
 */
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");

  errorMessages.forEach((message) => {
    message.textContent = "";
  });
}

/**
 * 폼 입력값을 검사하고 에러 여부를 반환하는 함수입니다.
 */
function validateForm(formData) {
  let isValid = true;
  const phonePattern = /^010-[0-9]{4}-[0-9]{4}$/;

  clearErrors();

  if (!formData.guardianName.trim()) {
    setError("guardianName", "보호자 이름을 입력해주세요.");
    isValid = false;
  }

  if (!formData.phone.trim()) {
    setError("phone", "연락처를 입력해주세요.");
    isValid = false;
  } else if (!phonePattern.test(formData.phone.trim())) {
    setError("phone", "연락처는 010-0000-0000 형식으로 입력해주세요.");
    isValid = false;
  }

  if (!formData.petName.trim()) {
    setError("petName", "반려동물 이름을 입력해주세요.");
    isValid = false;
  }

  if (!formData.petType) {
    setError("petType", "반려동물 종류를 선택해주세요.");
    isValid = false;
  }

  if (!formData.packageType) {
    setError("packageType", "희망 검진 패키지를 선택해주세요.");
    isValid = false;
  }

  if (!formData.privacyAgree) {
    setError("privacyAgree", "개인정보 수집 및 상담 연락에 동의해주세요.");
    isValid = false;
  }

  return isValid;
}

/**
 * 폼 입력값을 객체 형태로 수집하는 함수입니다.
 */
function getFormData(form) {
  return {
    submittedAt: new Date().toISOString(),
    guardianName: form.guardianName.value,
    phone: form.phone.value,
    petName: form.petName.value,
    petType: form.petType.value,
    petAge: form.petAge.value,
    packageType: form.packageType.value,
    message: form.message.value,
    privacyAgree: form.privacyAgree.checked,
  };
}

/**
 * 구글시트 URL이 없을 때 임시로 localStorage에 데이터를 저장하는 함수입니다.
 */
function saveToLocalStorage(data) {
  const savedData = JSON.parse(localStorage.getItem("petcareReservations") || "[]");
  savedData.push(data);
  localStorage.setItem("petcareReservations", JSON.stringify(savedData));
}

/**
 * 폼 데이터를 구글시트 또는 임시 저장소에 저장하는 함수입니다.
 */
async function submitReservationData(data) {
  if (!GOOGLE_SCRIPT_URL) {
    saveToLocalStorage(data);
    return {
      ok: true,
      mode: "local",
    };
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  return {
    ok: true,
    mode: "google-sheet",
    response,
  };
}


/**
 * 제출 완료 모달을 여는 함수입니다.
 */
function openSubmitModal() {
  const modal = document.getElementById("submitModal");

  if (!modal) return;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

/**
 * 제출 완료 모달을 닫는 함수입니다.
 */
function closeSubmitModal() {
  const modal = document.getElementById("submitModal");

  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

/**
 * 제출 완료 모달 닫기 버튼 이벤트를 연결하는 함수입니다.
 */
function initSubmitModal() {
  const modal = document.getElementById("submitModal");
  const closeButton = document.querySelector(".submit-modal-close");

  if (!modal || !closeButton) return;

  closeButton.addEventListener("click", closeSubmitModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeSubmitModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSubmitModal();
    }
  });
}

/**
 * 폼 제출 이벤트를 처리하는 함수입니다.
 */
function initReservationForm() {
  const form = document.getElementById("reservationForm");
  const result = document.getElementById("formResult");
  const submitButton = form?.querySelector(".submit-btn");

  if (!form || !result || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = getFormData(form);
    const isValid = validateForm(data);

    result.className = "form-result";
    result.textContent = "";

    if (!isValid) {
      result.classList.add("fail");
      result.textContent = "필수 입력 항목을 확인해주세요.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "전송 중...";
    result.classList.add("loading");
    result.textContent = "상담 신청 정보를 전송 중입니다...";

    try {
      const submitResult = await submitReservationData(data);

      result.className = "form-result success";
      result.textContent = submitResult.mode === "google-sheet"
        ? "신청이 완료되었습니다. 확인 후 상담 연락을 드리겠습니다."
        : "임시 저장이 완료되었습니다. 구글시트 URL 연결 전 상태입니다.";

      openSubmitModal();
      form.reset();
    } catch (error) {
      result.className = "form-result fail";
      result.textContent = "전송에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "상담 신청하기";
    }
  });
}

/**
 * 스크롤 진입 시 요소가 부드럽게 나타나는 애니메이션을 적용하는 함수입니다.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}


/**
 * 스크롤 위치에 따라 위로가기 버튼을 표시하고 클릭 시 상단으로 이동하는 함수입니다.
 */
function initScrollTopButton() {
  const scrollTopButton = document.querySelector(".scroll-top-btn");

  if (!scrollTopButton) return;

  function toggleScrollTopButton() {
    if (window.scrollY > 520) {
      scrollTopButton.classList.add("is-visible");
    } else {
      scrollTopButton.classList.remove("is-visible");
    }
  }

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleScrollTopButton);
  toggleScrollTopButton();
}

/**
 * 페이지에 필요한 모든 초기 기능을 실행하는 함수입니다.
 */
function initPage() {
  initScrollButtons();
  initPackageSelect();
  initPhoneFormat();
  initReservationForm();
  initSubmitModal();
  initScrollReveal();
  initScrollTopButton();
}

document.addEventListener("DOMContentLoaded", initPage);
