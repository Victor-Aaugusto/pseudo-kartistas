const formEditarCorrida = document.querySelector("#form-editar-corrida");

formEditarCorrida?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = formEditarCorrida.querySelector('button[type="submit"]');
  if (button) button.disabled = true;

  try {
    const formData = new FormData(formEditarCorrida);
    const body = {
      name: formData.get("name"),
      campeonatoId: Number(formData.get("campeonatoId"))
    };

    const response = await fetch(formEditarCorrida.dataset.apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Não foi possível atualizar a corrida.");
    }

    window.location.assign(formEditarCorrida.dataset.successUrl);
  } catch (error) {
    window.alert(error.message || "Erro ao atualizar a corrida.");
    if (button) button.disabled = false;
  }
});
