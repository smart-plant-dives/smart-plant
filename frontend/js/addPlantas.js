// Simulação de clique no botão de adicionar planta
document.querySelector(".add").addEventListener("click", () => {
    alert("Adicionar nova planta!");
});

const container = document.getElementById("cards");

plantas.forEach(planta => {
    container.innerHTML += `
        <div class="card">
            <img src="${planta.imagem}">
            <h3>${planta.nome}</h3>
            <p class="info">
                Espécie: ${planta.especie}<br>
                Categoria: ${planta.categoria}
            </p>
        </div>
    `;
});

fetch("http://localhost:3000/plantas")
    .then(res => res.json())
    .then(data => {
        data.forEach(planta => {
            container.innerHTML += `
                <div class="card">
                    <img src="${planta.imagem}">
                    <h3>${planta.nome}</h3>
                    <p>${planta.especie}</p>
                </div>
            `;
        });
    });


const filtro = document.getElementById("filtro");
const cards = document.querySelectorAll(".card");

filtro.addEventListener("change", () => {
    const valor = filtro.value;

    cards.forEach(card => {
        const categoria = card.getAttribute("data-categoria");

        if (valor === "todas" || valor === categoria) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});