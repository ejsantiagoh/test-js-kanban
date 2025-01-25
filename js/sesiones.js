
// let sesiones = window.localStorage.getItem("usuarios");
// console.log(JSON.parse(sesiones));

// Esta función se llama cuando un usuario intenta iniciar sesión
export function agregarUsuario(usuario, password) {
  let sesiones = window.localStorage.getItem("usuarios");

  if (!sesiones) {
    sesiones = []; // Si no hay usuarios almacenados, crear un array vacío
  } else {
    sesiones = JSON.parse(sesiones); // Si ya existen, parsearlos
  }

  // Agregar el nuevo usuario
  sesiones.push({ usuario, password });

  // Guardar el array actualizado en localStorage
  window.localStorage.setItem("usuarios", JSON.stringify(sesiones));
  console.log("Usuario registrado correctamente.");
}

export function localSesioness(usu, password) {
  let sesiones = window.localStorage.getItem("usuarios");

  if (!sesiones) {
    console.log("No hay usuarios almacenados.");
    return false;
  }

  let usuarios = JSON.parse(sesiones);

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.usuario === usu && usuario.password === password
  );

  if (usuarioEncontrado) {
    console.log("Sesión válida.");
    window.localStorage.setItem("usuarioLogueado", usu);
    return true;
  } else {
    console.log("Credenciales incorrectas.");
    return false;
  }
}

export function verificarSesion() {
  const usuarioLogueado = window.localStorage.getItem("usuarioLogueado");

  // Si hay un usuario logueado, podemos quedarnos en la misma página o redirigir al index
  if (usuarioLogueado) {
    console.log("Usuario logueado:", usuarioLogueado);
    // Si está logueado, podemos dejarlo en el index o redirigir a otra página
    window.location.href = "../index.html";  // Redirigir a la página principal o a otra
  } else {
    console.log("No hay usuario logueado.");
    // No hacemos nada, ya que no hay sesión
  }
}

export function cerrarSesion() {
  // Eliminar la sesión del usuario en localStorage
  window.localStorage.removeItem("usuarioLogueado");

  // Redirigir al index
  window.location.href = "./index.html"; // Redirigir a la página principal después de cerrar sesión
}
