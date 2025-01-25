import { agregarUsuario } from "../sesiones.js";

// Escuchamos el evento de submit del formulario de registro
document
  .getElementById("registroForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    // Guardar el usuario en el localStorage (si es necesario)
    agregarUsuario(usuario, password);

    // Registrar el usuario en el servidor (json-server)
    fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuario,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Usuario registrado correctamente en el servidor.");
        window.location.href = "./login.html"; // Redirigir al login después del registro
      })
      .catch((error) => {
        alert("Error al registrar el usuario en el servidor.", error);
      });
  });
