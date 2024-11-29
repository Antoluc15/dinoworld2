document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://dinoworld2-production.up.railway.app/api.php"; // URL completa del API
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
        fetch(`${[_{{{CITATION{{{_1{](https://github.com/la9una/web/tree/ba1073ae044ebb7b538a3b13f0f9598f7c410bb6/docs%2Fbootstrap%2Falignci.md)
