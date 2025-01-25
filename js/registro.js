
btnRegistrar.addEventListener("click", () => {
  const userName = document.querySelector(".usuario").value;
  userNameText.textContent = userName;
  localStorage.setItem("usuario", userName);
});

 export function displayUserName() {
  const nameFromLocalStorage = localStorage.getItem("usuario");

  if (nameFromLocalStorage) {
    userNameText.textContent = nameFromLocalStorage;
  } else {
    userNameText.textContent = "Usuario no se encuentra en localstorage";
  }
}

displayUserName();