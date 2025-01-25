import { localSesioness } from "../sesiones.js";

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  // Verificar las credenciales del usuario
  const exito = localSesioness(usuario, password);

  if (exito) {
    alert("Inicio de sesión exitoso.");
    window.location.href = "../index.html"; // Redirigir al index
  } else {
    alert("Credenciales incorrectas.");
  }
});
