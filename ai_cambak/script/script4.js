const heroSwiper = new Swiper(".heroSwiper", {
  loop: true,
  speed: 500,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".hero-pagination",
    clickable: true,
  },
});

document.querySelectorAll(".theme-bookmark").forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("is-active");
    button.setAttribute("aria-pressed", String(isActive));
  });
});
