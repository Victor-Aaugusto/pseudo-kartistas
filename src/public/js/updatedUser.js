const formUserUpdate = document.querySelector("#form-atualizar-perfil")

formUserUpdate.addEventListener('submit', async(e) => {
    e.preventDefault()

    const button = formUserUpdate.querySelector('button[type="submit"]')

    try{
        const formData = new FormData(formUserUpdate)

        const senha = String(formData.get("senha") || "")
        const confirmarSenha = String(formData.get("confirmarSenha") || "")

        if((senha || confirmarSenha) && senha !== confirmarSenha) throw Error('Senhas inválidas')

        const body = {
            email: formData.get("email"),
            phone: formData.get("phone")
        }

        if(senha) body.senha = senha

        button.disabled = true

        const response = await fetch(formUserUpdate.dataset.apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        })

        if(!response.ok) throw new Error('Erro no envio dos dados')

        window.location.assign(formUserUpdate.dataset.successUrl)
    } catch(error){
            window.alert(error.message || "Erro ao atualizar a corrida.");
            if (button) button.disabled = false;
    }
})