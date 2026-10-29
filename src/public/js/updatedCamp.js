const formEditarCampeonato = document.querySelector("#form-editar-campeonato");

formEditarCampeonato?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = formEditarCampeonato.querySelector('button[type="submit"]');
  if (button) button.disabled = true;

  try {
    const response = await fetch(formEditarCampeonato.dataset.apiUrl, {
      method: formEditarCampeonato.dataset.apiMethod || "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(Object.fromEntries(new FormData(formEditarCampeonato)))
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Não foi possível atualizar o campeonato.");
    }

    window.location.assign(window.location.pathname.replace(/\/editar\/?$/, ""));
  } catch (error) {
    window.alert(error.message || "Erro ao atualizar o campeonato.");
    if (button) button.disabled = false;
  }
});
