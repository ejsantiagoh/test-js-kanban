const btnCrear = document.querySelector(".btnCrear");

document.getElementById("crear").addEventListener("click", function(){
    const contenedor = document.querySelectorAll("container2");
    
});

const crear = () => {
    const inputTarea = document.querySelector("#nombreTarea");
        const tareaTexto = inputTarea.value.trim();

        // Verificar si la tarea no está vacía
        if (tareaTexto === "") {
          alert("Por favor, ingresa una tarea.");
          return;
        }

        // Crear el elemento de la tarea
        const tareaItem = document.createElement("li");
      
        // Crear el texto de la tarea
        const tareaDescripcion = document.createElement("span");
        tareaDescripcion.textContent = tareaTexto;
        tareaItem.appendChild(tareaDescripcion);

        // Crear el botón de completar tarea
        const btnCompletar = document.createElement("button");
        btnCompletar.textContent = "Completada";
        
        btnCompletar.onclick = () =>
          completarTarea(tareaItem, tareaDescripcion);
        tareaItem.appendChild(btnCompletar);

        // Crear el botón de eliminar tarea
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        
        btnEliminar.onclick = () => eliminarTarea(tareaItem);
        tareaItem.appendChild(btnEliminar);

        // Agregar la tarea a la lista
        document.querySelector("#listaTareas").appendChild(tareaItem);

        // Almacenar la tarea en el localStorage
        almacenarTareas();

        // Limpiar el campo de texto después de agregar la tarea
        inputTarea.value = "";
      };
      fetch("http://localhost:3000/post/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));


window.onload = cargarTareas;