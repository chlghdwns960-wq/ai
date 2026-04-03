const scriptUrl =
  "https://script.google.com/macros/s/AKfycbyJslRG1ED9zLCPiI1bm_SQWLJHwGrF92SkGLsTLuQQ1eQlqcJa-umzGSQk5yPt7ip5/exec";

const nav = document.getElementById("nav");
const modal = document.getElementById("ctaModal");
const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");
const hiddenFormFrame = document.getElementById("hiddenFormFrame");
const submitButton = document.querySelector(".form-submit");
const modalCloseTargets = document.querySelectorAll("[data-close-modal]");

let lastTrigger = null;
let pendingSubmit = false;
let submitFallbackTimer = null;

function openModal(trigger = null) {
  lastTrigger = trigger;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) closeButton.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastTrigger) lastTrigger.focus();
}

function handleCTA(event) {
  openModal(event?.currentTarget || null);
}

function setFormStatus(message, type = "") {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = "form-status";

  if (type) {
    formStatus.classList.add(`is-${type}`);
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

function finishSubmitMessage() {
  if (!pendingSubmit) return;

  pendingSubmit = false;
  if (submitButton) submitButton.disabled = false;
  if (leadForm) leadForm.reset();

  setFormStatus(
    "제출 요청을 보냈어. Apps Script 설정이 정상이라면 구글시트에 저장돼.",
    "success",
  );
}

modalCloseTargets.forEach((button) => {
  button.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  },
  { passive: true },
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

if (leadForm) {
  leadForm.setAttribute("action", scriptUrl);

  leadForm.addEventListener("submit", (event) => {
    const name = leadForm.querySelector('[name="Name"]').value.trim();
    const phone = leadForm.querySelector('[name="Pone"]').value.trim();
    const email = leadForm.querySelector('[name="Email"]').value.trim();
    const consent = document.getElementById("privacyConsent")?.checked;

    if (!name) {
      event.preventDefault();
      setFormStatus("이름을 입력해줘.", "error");
      return;
    }

    if (!phone) {
      event.preventDefault();
      setFormStatus("전화번호를 입력해줘.", "error");
      return;
    }

    if (!isValidPhone(phone)) {
      event.preventDefault();
      setFormStatus("전화번호 형식을 다시 확인해줘.", "error");
      return;
    }

    if (!email) {
      event.preventDefault();
      setFormStatus("이메일주소를 입력해줘.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      event.preventDefault();
      setFormStatus("이메일주소 형식을 다시 확인해줘.", "error");
      return;
    }

    if (!consent) {
      event.preventDefault();
      setFormStatus("개인정보 수집 동의를 체크해줘.", "error");
      return;
    }

    pendingSubmit = true;
    if (submitButton) submitButton.disabled = true;
    setFormStatus("제출 중이야...", "loading");

    clearTimeout(submitFallbackTimer);
    submitFallbackTimer = window.setTimeout(() => {
      finishSubmitMessage();
    }, 1800);
  });
}

if (hiddenFormFrame) {
  hiddenFormFrame.addEventListener("load", () => {
    if (!pendingSubmit) return;
    clearTimeout(submitFallbackTimer);
    finishSubmitMessage();
  });
}
