document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://dinoworld2-production.up.railway.app/api.php";
    const dinoForm = document.getElementById("dinoForm");
    const dinoList = document.getElementById("dinoList");

    function fetchDinosaurios() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                dinoList.innerHTML = "";
                data.forEach(dino => {
                    addDinoToList(dino);
                });
            })
            .catch(error => console.error("Error al obtener dinosaurios:", error));
    }

    function addDinoToList(dino) {
        const li = document.createElement("li");
        li.innerHTML = `${dino.nombre} - ${dino.especie} (${dino.periodo})<br>
                Descripción: ${dino.descripcion}<br>
                <img src="${dino.imagen}" alt="${dino.nombre}" width="100"><br>
                <button onclick="editDino(${dino.id})">Editar</button>
                <button onclick="deleteDino(${dino.id})">Eliminar</button>`;

        dinoList.appendChild(li);
    }

    dinoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("dinoId").value;
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}?id=${id}` : API_URL;
        
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
            fetchDinosaurios(); // Recargar la lista de dinosaurios
        })
        .catch(error => console.error("Error al guardar el dinosaurio:", error));
    });

    window.editDino = (id) => {
        fetch(`${API_URL}?id=${id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("dinoId").value = data.id;
                document.getElementById("nombre").value = data.nombre;
                document.getElementById("especie").value = data.especie;
                document.getElementById("periodo").value = data.periodo;
                document.getElementById("descripcion").value = data.descripcion;
                document.getElementById("imagen").value = data.imagen;
            })
            .catch(error => console.error("Error al editar dinosaurio:", error));
    };

    window.deleteDino = (id) => {
        fetch(`${API_URL}?id=${id}`, {method: "DELETE"})
            .then(() => fetchDinosaurios())
            .catch(error => console.error("Error al eliminar dinosaurio:", error));
    };

    fetchDinosaurios();
});
