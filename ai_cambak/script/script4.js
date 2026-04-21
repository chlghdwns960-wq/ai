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
