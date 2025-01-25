document.getElementById("btnCrear").addEventListener("click", function () {
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("desc").value.trim();
  const imagen = document.getElementById("imgT").files[0]; // Imagen opcional
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const bloque = document.getElementById("bloque").value;

  if (!titulo || !descripcion || !fechaInicio || !fechaFin || !bloque) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const tarea = {
    titulo,
    descripcion,
    imagen: imagen ? imagen.name : null,
    fechaInicio,
    fechaFin,
    bloque,
  };

  const tareaItem = document.createElement("li");
  tareaItem.classList.add("bg-white", "p-4", "rounded-lg", "shadow", "mb-4");
  tareaItem.setAttribute("draggable", "true"); // Permitir que la tarea sea arrastrada
  tareaItem.dataset.bloque = bloque || "Pendientes"; // Valor predeterminado si no está definido
  const tareaId = Date.now(); // Usamos la hora actual para generar un ID único
  tareaItem.dataset.id = tareaId; // Asignar el ID al dataset de la tarea
  tareaItem.id = `tarea-${tareaId}`; // Asignar el ID de la tarea en el HTML
  tareaItem.innerHTML = `
    <h3 class="font-semibold">${tarea.titulo}</h3>
    <p>${tarea.descripcion}</p>
    <p class="text-gray-500">Inicio: ${new Date(
      tarea.fechaInicio
    ).toLocaleString()}</p>
    <p class="text-gray-500">Fin: ${new Date(
      tarea.fechaFin
    ).toLocaleString()}</p>
   
    <button class="ml-2 mt-2 bg-red-500 text-white py-1 px-3 rounded" onclick="eliminarTarea(this)">Eliminar</button>
  `;

  // Añadir la tarea a la columna correspondiente
  document
    .getElementById(bloque.toLowerCase().replace(" ", "-"))
    .appendChild(tareaItem);

  guardarTareaEnLocalStorage(tarea, tareaId);
  guardarTareaEnDB(tarea, tareaId);

  // Limpiar formulario
  document.getElementById("titulo").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("imgT").value = "";
  document.getElementById("fechaInicio").value = "";
  document.getElementById("fechaFin").value = "";
  document.getElementById("bloque").value = "Pendientes";
});

// Guardar tarea en localStorage
function guardarTareaEnLocalStorage(tarea, tareaId) {
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tarea.id = tareaId;
  tareas.push(tarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Guardar tarea en db.json
function guardarTareaEnDB(tarea, tareaId) {
  fetch("http://localhost:3000/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: tareaId,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      imagen: tarea.imagen || "",
      fechaInicio: tarea.fechaInicio,
      fechaFinal: tarea.fechaFin,
      asignacion: tarea.bloque,
    }),
  })
    .then((response) => response.json())
    .catch((error) =>
      console.error("Error guardando tarea en db.json:", error)
    );
}

// Cargar tareas desde db.json y localStorage
window.onload = function () {
  const tareasLocalStorage = JSON.parse(localStorage.getItem("tareas")) || [];
  fetch("http://localhost:3000/tareas")
    .then((response) => response.json())
    .then((tareasDB) => {
      const todasLasTareas = [...tareasLocalStorage, ...tareasDB];
      todasLasTareas.forEach((tarea) => {
        const tareaItem = document.createElement("li");
        tareaItem.classList.add(
          "bg-white",
          "p-4",
          "rounded-lg",
          "shadow",
          "mb-4"
        );
        tareaItem.setAttribute("draggable", "true");

        // Asegurarnos de que 'asignacion' esté definido
        const asignacion = tarea.asignacion || "Pendientes"; // Valor predeterminado si no está definido
        tareaItem.dataset.bloque = asignacion;
        tareaItem.id = `tarea-${tarea.id}`;

        tareaItem.innerHTML = `
          <h3 class="font-semibold">${tarea.titulo}</h3>
          <p>${tarea.descripcion}</p>
          <p class="text-gray-500">Inicio: ${new Date(
            tarea.fechaInicio
          ).toLocaleString()}</p>
          <p class="text-gray-500">Fin: ${new Date(
            tarea.fechaFinal
          ).toLocaleString()}</p>
          <button class="mt-2 bg-green-500 text-white py-1 px-3 rounded" onclick="moverTarea('${asignacion}', this)">Mover</button>
          <button class="ml-2 mt-2 bg-red-500 text-white py-1 px-3 rounded" onclick="eliminarTarea(this)">Eliminar</button>
        `;

        // Añadir la tarea a la columna correspondiente, usando el valor predeterminado para asignacion si es necesario
        document
          .getElementById(asignacion.toLowerCase().replace(" ", "-"))
          .appendChild(tareaItem);
      });
    })
    .catch((error) => {
      console.error("Error cargando tareas desde db.json:", error);
    });
};

// Funciones para manejar el Drag and Drop
function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const tareaItem = document.querySelector(
    `#${event.dataTransfer.getData("text/plain")}`
  );
  const columnaDestino = event.target.closest("[id]");
  if (columnaDestino && tareaItem) {
    columnaDestino.appendChild(tareaItem); // Mover la tarea
    tareaItem.dataset.bloque = columnaDestino.id; // Actualizar la columna de la tarea
  }
}

document.addEventListener("dragstart", function (event) {
  if (event.target.tagName === "LI") {
    event.dataTransfer.setData("text/plain", event.target.id); // Guardar el ID de la tarea arrastrada
  }
});
function eliminarTarea(button) {
  const tareaItem = button.parentElement;
  const tareaId = tareaItem.dataset.id; // Obtener el ID desde el dataset

  // Eliminar la tarea desde el servidor (db.json)
  fetch(`http://localhost:3000/tareas/${tareaId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      // Eliminar la tarea de localStorage
      const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
      const tareaIndex = tareas.findIndex((t) => t.id == tareaId);
      if (tareaIndex !== -1) {
        tareas.splice(tareaIndex, 1);
        localStorage.setItem("tareas", JSON.stringify(tareas));
      }

      // Eliminar la tarea de la vista
      tareaItem.remove();
    })
    .catch((error) => {
      console.error("Error eliminando tarea:", error);
    });
}
