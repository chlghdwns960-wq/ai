const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const idInput = document.getElementById('userId');
const passwordInput = document.getElementById('userPassword');

loginButton.addEventListener('click', (event) => {
  const idValue = idInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  if (!idValue || !passwordValue) {
    event.preventDefault();
    alert('아이디와 비밀번호를 입력해줘.');
    if (!idValue) {
      idInput.focus();
      return;
    }
    passwordInput.focus();
  }
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
});
