const listaVeiculos = document.getElementById('lista-veiculos');
const formVeiculo = document.getElementById('form-veiculo');
const caixaErro = document.getElementById('mensagem-erro');

// Função para evitar injeção de HTML ao usar innerHTML
function escapar(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Busca os veículos na API e desenha na tabela
async function carregarVeiculos() {
  try {
    const resposta = await fetch('/veiculos');
    const dados = await resposta.json();

    listaVeiculos.innerHTML = '';

    dados.forEach((veiculo) => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${escapar(veiculo.id)}</td>
        <td>${escapar(veiculo.placa)}</td>
        <td>${escapar(veiculo.modelo)}</td>
        <td>${escapar(veiculo.ano)}</td>
        <td>${escapar(veiculo.km)} km</td>
        <td>${escapar(veiculo.cor)}</td>
        <td>${veiculo.revisaoEmDia ? 'Em dia' : 'Pendente'}</td>
        <td>${escapar(veiculo.nomeCliente)}</td>
      `;
      listaVeiculos.appendChild(linha);
    });
  } catch (erro) {
    console.error('Erro ao buscar veículos:', erro);
  }
}

// Envia o formulário de cadastro para a API
formVeiculo.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  caixaErro.hidden = true;
  caixaErro.textContent = '';

  const novoVeiculo = {
    placa: document.getElementById('placa').value,
    modelo: document.getElementById('modelo').value,
    ano: Number(document.getElementById('ano').value),
    km: Number(document.getElementById('km').value),
    cor: document.getElementById('cor').value,
    revisaoEmDia: document.getElementById('revisaoEmDia').checked,
    nomeCliente: document.getElementById('nomeCliente').value
  };

  try {
    const resposta = await fetch('/veiculos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoVeiculo)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      // Exibe na tela a mensagem de erro devolvida pelo servidor (400 ou 409)
      caixaErro.textContent = dados.erro || 'Erro ao cadastrar veículo.';
      caixaErro.hidden = false;
      return;
    }

    // Limpa o formulário e atualiza a listagem
    formVeiculo.reset();
    carregarVeiculos();
  } catch (erro) {
    caixaErro.textContent = 'Não foi possível conectar ao servidor.';
    caixaErro.hidden = false;
  }
});

// Carrega a lista assim que a página abre
carregarVeiculos();