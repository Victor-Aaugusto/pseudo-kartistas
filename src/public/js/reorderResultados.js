document.querySelectorAll(".js-sortable-results").forEach((lista) => {
  let linhaArrastada = null;

  function sincronizarPosicoes() {
    lista.querySelectorAll(".js-result-edit-row").forEach((linha, indice) => {
      const posicao = indice + 1;
      const seletor = linha.querySelector(".js-result-position");
      const pontos = linha.querySelector(".points-hint");

      if (seletor && Array.from(seletor.options).some((opcao) => Number(opcao.value) === posicao)) {
        seletor.value = String(posicao);
      }

      if (pontos) {
        const pontuacaoPorPosicao = [10, 8, 5, 3, 1];
        pontos.textContent = `${pontuacaoPorPosicao[indice] || 0} pts`;
      }
    });
  }

  lista.querySelectorAll(".js-result-edit-row[draggable='true']").forEach((linha) => {
    linha.addEventListener("dragstart", (event) => {
      linhaArrastada = linha;
      linha.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", linha.dataset.userId || "piloto");
    });

    linha.addEventListener("dragend", () => {
      linha.classList.remove("is-dragging");
      lista.querySelectorAll(".is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
      linhaArrastada = null;
    });

    linha.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!linhaArrastada || linhaArrastada === linha) return;

      const depois = event.clientY > linha.getBoundingClientRect().top + linha.offsetHeight / 2;
      lista.insertBefore(linhaArrastada, depois ? linha.nextSibling : linha);
      lista.querySelectorAll(".is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
      linha.classList.add("is-drop-target");
    });

    linha.addEventListener("drop", (event) => {
      event.preventDefault();
      sincronizarPosicoes();
    });
  });
});

const formEditarPosicoes = document.querySelector("#form-editar-posicoes-corrida");

formEditarPosicoes?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = formEditarPosicoes.querySelector('button[type="submit"]');
  if (button) button.disabled = true;

  try {
    const resultados = Array.from(
      formEditarPosicoes.querySelectorAll(".js-result-edit-row")
    ).map((linha) => ({
      corridaId: Number(linha.dataset.corridaId),
      userId: Number(linha.dataset.userId),
      posicao: Number(linha.querySelector(".js-result-position").value)
    }));

    const response = await fetch(formEditarPosicoes.dataset.apiUrl, {
      method: formEditarPosicoes.dataset.apiMethod || "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(resultados)
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Não foi possível salvar as posições.");
    }

    window.location.assign(formEditarPosicoes.dataset.successUrl);
  } catch (error) {
    window.alert(error.message || "Erro ao salvar as posições.");
    if (button) button.disabled = false;
  }
});
