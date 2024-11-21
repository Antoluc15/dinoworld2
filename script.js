document.addEventListener("DOMContentLoaded", () => {
    const dinoForm = document.getElementById("dinoForm");
    const dinoList = document.getElementById("dinoList");

    // Función para cargar todos los dinosaurios
    function fetchDinosaurios() {
        fetch("api.php")
            .then(response => response.json())
            .then(data => {
                dinoList.innerHTML = "";
                data.forEach(dino => {
                    addDinoToList(dino);
                });
            })
            .catch(error => console.error("Error al obtener dinosaurios:", error));
    }

    // Función para agregar un dinosaurio a la lista
    function addDinoToList(dino) {
        const li = document.createElement("li");
        li.innerHTML = `${dino.nombre} - ${dino.especie} (${dino.periodo})<br>
                Descripción: ${dino.descripcion}<br>
                <img src="${dino.imagen}" alt="${dino.nombre}" width="100"><br>
                <button onclick="editDino(${dino.id})">Editar</button>
                <button onclick="deleteDino(${dino.id})">Eliminar</button>`;

        dinoList.appendChild(li);
    }

    // Enviar el formulario para agregar o editar un dinosaurio
    dinoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("dinoId").value;
        const method = id ? "PUT" : "POST";
        const url = id ? `api.php?id=${id}` : "api.php";
        
        const dinoData = {
            nombre: document.getElementById("nombre").value,
            especie: document.getElementById("especie").value,
            periodo: document.getElementById("periodo").value,
            descripcion: document.getElementById("descripcion").value,
            imagen: document.getElementById("imagen").value
        };

        console.log("Datos enviados:", dinoData);

        fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dinoData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            dinoForm.reset();
            if (method === "POST") {
                addDinoToList(data);
            } else {
                fetchDinosaurios();
            }
        })
        .catch(error => console.error("Error al guardar el dinosaurio:", error));
    });

    // Función para editar un dinosaurio
    window.editDino = (id) => {
        fetch(`api.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Verifica la respuesta del servidor aquí
                document.getElementById("dinoId").value = data.id;
                document.getElementById("nombre").value = data.nombre;
                document.getElementById("especie").value = data.especie;
                document.getElementById("periodo").value = data.periodo;
                document.getElementById("descripcion").value = data.descripcion;
                document.getElementById("imagen").value = data.imagen;
            })
            .catch(error => console.error("Error al editar dinosaurio:", error));
    };
   

    // Función para eliminar un dinosaurio
    window.deleteDino = (id) => {
        fetch(`api.php?id=${id}`, {method: "DELETE"})
            .then(() => fetchDinosaurios())
            .catch(error => console.error("Error al eliminar dinosaurio:", error));
    };

    // Cargar los dinosaurios al cargar la página
    fetchDinosaurios();
});
