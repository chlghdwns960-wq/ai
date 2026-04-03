const scriptURL =
  "https://https://script.google.com/macros/s/AKfycbyJslRG1ED9zLCPiI1bm_SQWLJHwGrF92SkGLsTLuQQ1eQlqcJa-umzGSQk5yPt7ip5/exec.google.com/macros/s/AKfycbyJslRG1ED9zLCPiI1bm_SQWLJHwGrF92SkGLsTLuQQ1eQlqcJa-umzGSQk5yPt7ip5/execadd you own link here"; // add your own app script link here
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      msg.innerHTML = "Message sent successfully";
      setTimeout(function () {
        msg.innerHTML = "";
      }, 5000);
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});
