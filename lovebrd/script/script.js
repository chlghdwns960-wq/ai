const startButton = document.getElementById("startButton");
const startToast = document.getElementById("startToast");
const effectLayer = document.querySelector(".effect-layer");
const momentsSection = document.getElementById("moments");

function spawnBurst(targetEl) {
  if (!targetEl || !effectLayer) return;

  const rect = targetEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const confettiColors = ["#f0b7bc", "#f7d9dd", "#e8c7cf", "#f6e4c9"];
  const hearts = ["💖", "💗", "🤍"];

  for (let i = 0; i < 9; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = hearts[i % hearts.length];
    heart.style.setProperty("--x", `${originX}px`);
    heart.style.setProperty("--y", `${originY}px`);
    heart.style.setProperty("--dx", `${(Math.random() - 0.5) * 180}px`);
    heart.style.setProperty("--rotate", `${(Math.random() - 0.5) * 50}deg`);
    heart.style.animationDelay = `${i * 20}ms`;
    effectLayer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  for (let i = 0; i < 18; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti-particle";
    confetti.style.background = confettiColors[i % confettiColors.length];
    confetti.style.setProperty("--x", `${originX}px`);
    confetti.style.setProperty("--y", `${originY}px`);
    confetti.style.setProperty("--dx", `${(Math.random() - 0.5) * 260}px`);
    confetti.style.setProperty("--dy", `${(Math.random() - 0.5) * 180}px`);
    confetti.style.setProperty("--rotate", `${(Math.random() - 0.5) * 220}deg`);
    confetti.style.animationDelay = `${i * 14}ms`;
    effectLayer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 1100);
  }
}

if (startButton && startToast && momentsSection) {
  startButton.addEventListener("click", (event) => {
    event.preventDefault();
    startToast.classList.add("show");

    requestAnimationFrame(() => {
      spawnBurst(startToast);
    });

    setTimeout(() => {
      momentsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 280);

    setTimeout(() => {
      startToast.classList.remove("show");
    }, 1050);
  });
}

const burstEmojis = ["❤", "🧡", "💛", "💚", "💙", "💜", "✨", "🎉", "🐾"];
const personCards = document.querySelectorAll(".person-card");

function burstAroundCard(card) {
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const count = 22;

  for (let i = 0; i < count; i += 1) {
    const emoji = document.createElement("span");
    emoji.className = "burst-emoji";
    emoji.textContent = burstEmojis[i % burstEmojis.length];

    const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.5;
    const distance = 70 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const startX = centerX + (Math.random() - 0.5) * 60;
    const startY = centerY + (Math.random() - 0.5) * 40;

    emoji.style.setProperty("--x", `${startX}px`);
    emoji.style.setProperty("--y", `${startY}px`);
    emoji.style.setProperty("--dx", `${dx}px`);
    emoji.style.setProperty("--dy", `${dy}px`);
    emoji.style.setProperty("--rotate", `${(Math.random() - 0.5) * 80}deg`);

    document.body.appendChild(emoji);

    setTimeout(() => {
      emoji.remove();
    }, 900);
  }
}

personCards.forEach((card) => {
  const toggleCard = () => {
    const isOpen = card.classList.toggle("open");
    card.setAttribute("aria-expanded", String(isOpen));
    burstAroundCard(card);
  };

  card.addEventListener("click", toggleCard);

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard();
    }
  });
});

const giftBox = document.getElementById("giftBox");
const answerModal = document.getElementById("answerModal");
const answerModalClose = document.getElementById("answerModalClose");
const answerCancel = document.getElementById("answerCancel");
const answerSubmit = document.getElementById("answerSubmit");
const answerInput = document.getElementById("answerInput");
const answerError = document.getElementById("answerError");
const secretModal = document.getElementById("secretModal");
const secretModalClose = document.getElementById("secretModalClose");
const SECRET_CODE = "0724";

function spawnModalRain() {
  if (!secretModal) return;

  secretModal
    .querySelectorAll(".modal-rain-particle")
    .forEach((node) => node.remove());
  const symbols = ["💖", "💗", "🎉", "🎊"];

  for (let i = 0; i < 112; i += 1) {
    const particle = document.createElement("span");
    particle.className = "modal-rain-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.setProperty("--left", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${18 + Math.random() * 16}px`);
    particle.style.setProperty(
      "--duration",
      `${2600 + Math.random() * 2200}ms`,
    );
    particle.style.setProperty("--delay", `${Math.random() * 220}ms`);
    particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
    particle.style.setProperty("--rotate", `${(Math.random() - 0.5) * 120}deg`);
    secretModal.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 5600);
  }
}

function openAnswerModal() {
  if (!answerModal || !answerInput || !answerError) return;

  answerModal.classList.add("show");
  answerError.textContent = "";
  answerInput.value = "";

  setTimeout(() => {
    answerInput.focus();
  }, 20);
}

function closeAnswerModal() {
  if (!answerModal || !answerInput || !answerError) return;

  answerModal.classList.remove("show");
  answerError.textContent = "";
  answerInput.value = "";
}

function openSecretModal() {
  if (!secretModal) return;
  secretModal.classList.add("show");
  spawnModalRain();
}

function closeSecretModal() {
  if (!secretModal) return;
  secretModal.classList.remove("show");
}

function checkSecretCode() {
  if (!answerInput || !answerError) return;

  const value = answerInput.value.trim();

  if (value === SECRET_CODE) {
    closeAnswerModal();
    openSecretModal();
  } else {
    answerError.textContent = "틀렸어! 다시 입력해줘 💦";
    answerInput.focus();
    answerInput.select();
  }
}

if (giftBox) {
  giftBox.addEventListener("click", openAnswerModal);
}

if (answerSubmit) {
  answerSubmit.addEventListener("click", checkSecretCode);
}

if (answerInput) {
  answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkSecretCode();
    }
  });
}

if (answerModalClose) {
  answerModalClose.addEventListener("click", closeAnswerModal);
}

if (answerCancel) {
  answerCancel.addEventListener("click", closeAnswerModal);
}

if (answerModal) {
  answerModal.addEventListener("click", (event) => {
    if (event.target === answerModal) {
      closeAnswerModal();
    }
  });
}

if (secretModalClose) {
  secretModalClose.addEventListener("click", closeSecretModal);
}

if (secretModal) {
  secretModal.addEventListener("click", (event) => {
    if (event.target === secretModal) {
      closeSecretModal();
    }
  });
}

const bgRainLayer = document.getElementById("bgRainLayer");
const flame = document.getElementById("flame");
const blowBtn = document.getElementById("blowBtn");
const blowText = document.getElementById("blowText");

// 경로는 사용자가 말한 box3 1~8 형식으로 반영

const rainImageCount = 14;

const rainImages = Array.from(
  { length: rainImageCount },
  (_, i) => `./images/box3/img${i + 1}.png`,
);

let candleOff = false;
let rainInterval = null;

function spawnBackgroundImageRainBurst() {
  if (!bgRainLayer) return;

  for (let i = 0; i < 16; i += 1) {
    const frame = document.createElement("div");
    frame.className = "bg-rain-image";

    const img = document.createElement("img");
    img.src = rainImages[Math.floor(Math.random() * rainImages.length)];
    img.alt = "rain image";

    frame.appendChild(img);

    frame.style.setProperty("--left", `${Math.random() * 100}%`);
    frame.style.setProperty("--size", `${70 + Math.random() * 46}px`);
    frame.style.setProperty("--duration", `${2600 + Math.random() * 1800}ms`);
    frame.style.setProperty("--delay", `${Math.random() * 180}ms`);
    frame.style.setProperty("--drift", `${(Math.random() - 0.5) * 160}px`);
    frame.style.setProperty("--rotate", `${(Math.random() - 0.5) * 24}deg`);

    bgRainLayer.appendChild(frame);

    setTimeout(() => {
      frame.remove();
    }, 4800);
  }
}

function startBackgroundImageRain() {
  if (rainInterval) return;

  spawnBackgroundImageRainBurst();

  rainInterval = setInterval(() => {
    spawnBackgroundImageRainBurst();
  }, 700);
}

function stopBackgroundImageRain() {
  if (rainInterval) {
    clearInterval(rainInterval);
    rainInterval = null;
  }

  if (bgRainLayer) {
    bgRainLayer.innerHTML = "";
  }
}

if (blowBtn && flame && blowText) {
  blowBtn.addEventListener("click", () => {
    candleOff = !candleOff;
    flame.classList.toggle("off", candleOff);
    blowBtn.textContent = candleOff ? "다시 켜기" : "초 불기";

    if (candleOff) {
      blowText.textContent =
        "소원을 빌었다면, 오늘 하루는 더 오래 예쁘게 남을 거야.";
      startBackgroundImageRain();
    } else {
      blowText.textContent = "버튼을 눌러 작은 마무리 이벤트를 볼 수 있어.";
      stopBackgroundImageRain();
    }
  });
}

const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("musicToggle");
const musicIndicator = document.getElementById("musicIndicator");
let isPlaying = false;

if (musicToggle && bgm && musicIndicator) {
  musicToggle.addEventListener("click", async () => {
    const hasSource = bgm.querySelector("source")?.getAttribute("src");
    if (!hasSource) return;

    try {
      if (!isPlaying) {
        await bgm.play();
        isPlaying = true;
        musicIndicator.textContent = "🎵💖";
      } else {
        bgm.pause();
        isPlaying = false;
        musicIndicator.textContent = "🔇💖";
      }
    } catch (error) {
      console.error(error);
    }
  });
}

// ===== site lock + reveal effect =====
const siteLock = document.getElementById("siteLock");
const siteLockInput = document.getElementById("siteLockInput");
const siteLockSubmit = document.getElementById("siteLockSubmit");
const siteLockError = document.getElementById("siteLockError");
const PAGE_PASSWORD = "0409";

function markRevealTargets() {
  const targets = [
    document.querySelector(".hero-copy"),
    ...document.querySelectorAll(".hero-menu .menu-card"),
    document.querySelector("#moments .section-head"),
    ...document.querySelectorAll("#moments .photo-card"),
  ].filter(Boolean);

  targets.forEach((el, index) => {
    el.classList.add("reveal-target");
    const delayClass = `reveal-delay-${Math.min(index, 5)}`;
    el.classList.add(delayClass);
  });
}

function playRevealSequence() {
  const targets = document.querySelectorAll(".reveal-target");
  targets.forEach((el) => {
    el.classList.remove("reveal-in");
    void el.offsetWidth;
    el.classList.add("reveal-in");
  });
}

function openSiteLock() {
  if (!siteLock || !siteLockInput) return;
  document.body.classList.add("is-locked");
  siteLock.classList.add("show");
  siteLock.setAttribute("aria-hidden", "false");
  setTimeout(() => siteLockInput.focus(), 30);
}

function finalizeUnlock() {
  if (!siteLock) return;
  siteLock.classList.remove("show", "unlocking");
  siteLock.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  playRevealSequence();
}

function unlockSiteWithEffect() {
  if (!siteLock) return;
  siteLock.classList.add("unlocking");
  siteLockError.textContent = "";
  setTimeout(finalizeUnlock, 920);
}

function checkSitePassword() {
  if (!siteLockInput || !siteLockError) return;
  const value = siteLockInput.value.trim();

  if (value === PAGE_PASSWORD) {
    unlockSiteWithEffect();
  } else {
    siteLockError.textContent = "비밀번호가 틀렸어. 다시 입력해줘 💦";
    siteLockInput.focus();
    siteLockInput.select();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  markRevealTargets();
  openSiteLock();
});

if (siteLockSubmit) {
  siteLockSubmit.addEventListener("click", checkSitePassword);
}

if (siteLockInput) {
  siteLockInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkSitePassword();
    }
  });
}
