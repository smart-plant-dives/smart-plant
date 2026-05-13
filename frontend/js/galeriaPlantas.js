const select = document.getElementById("opcoes");
const cards = document.querySelectorAll(".plant-card");
const mensagem = document.getElementById("mensagemVazia");

select.addEventListener("change", () => {

    const valor = select.value;
    let visiveis = 0;

    cards.forEach(card => {

        const categoria = card.querySelector("[data-categoria]")?.dataset.categoria;

        if (valor === "todas") {
            card.style.display = "block";
            visiveis++;
        } 
        else if (categoria === valor) {
            card.style.display = "block";
            visiveis++;
        } 
        else {
            card.style.display = "none";
        }

    });

    // MOSTRAR OU ESCONDER MENSAGEM
    if (visiveis === 0) {
        mensagem.style.display = "block";
    } else {
        mensagem.style.display = "none";
    }

});