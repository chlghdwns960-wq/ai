let list = document.getElementById("list");
let button = document.getElementById("button");
console.log(list, button);

button.addEventListener("click", function () {
  list.classList.toggle("list-hidden");
});
