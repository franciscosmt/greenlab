document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contatoForm');
  const resposta = document.getElementById('resposta');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
      nome: form.nome.value,
      genero: form.genero.value,
      endereco: form.endereco.value,
      telefone: form.telefone.value,
      email: form.email.value,
      mensagem: form.mensagem.value
    };

    try {
      // Exemplo: enviar via fetch para um backend que você deve implementar
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (res.ok) {
        resposta.textContent = 'Mensagem enviada com sucesso!';
        resposta.style.color = 'green';
        form.reset();
      } else {
        throw new Error('Erro ao enviar a mensagem.');
      }
    } catch (error) {
      resposta.textContent = error.message;
      resposta.style.color = 'red';
    }
  });
});
