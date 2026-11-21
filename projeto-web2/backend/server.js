const express = require('express');
const path = require('path');

const app = express();
const PORTA = 3000;

// Permite ler o corpo das requisições em JSON
app.use(express.json());

// 1. Middleware global que registra horário, método e endereço no terminal
app.use((req, res, next) => {
  const horario = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${horario}] ${req.method} ${req.url}`);
  next();
});

// 2. Serve os arquivos da pasta frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 3. Dados iniciais em memória (pelo menos 5 itens)
let proximoId = 6;
let veiculos = [
  { id: 1, placa: 'ABC1D23', modelo: 'Fiat Uno', ano: 2015, km: 85000, cor: 'Prata', revisaoEmDia: true, nomeCliente: 'Carlos Silva' },
  { id: 2, placa: 'XYZ9K88', modelo: 'Honda Civic', ano: 2020, km: 42000, cor: 'Preto', revisaoEmDia: true, nomeCliente: 'Mariana Souza' },
  { id: 3, placa: 'QWE4R56', modelo: 'Volkswagen Gol', ano: 2012, km: 130000, cor: 'Branco', revisaoEmDia: false, nomeCliente: 'João Pereira' },
  { id: 4, placa: 'JKL7M89', modelo: 'Chevrolet Onix', ano: 2022, km: 19500, cor: 'Vermelho', revisaoEmDia: true, nomeCliente: 'Ana Costa' },
  { id: 5, placa: 'POI2U34', modelo: 'Toyota Corolla', ano: 2018, km: 67000, cor: 'Prata', revisaoEmDia: false, nomeCliente: 'Pedro Alves' }
];

// Lista de valores permitidos para o campo restrito (cor)
const CORES_PERMITIDAS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul'];

// 4. Função própria de validação
function validarVeiculo(dados, parcial = false) {
  const anoAtual = new Date().getFullYear();

  // Regra 1: Campos obrigatórios (quando não for PATCH)
  if (!parcial) {
    if (!dados.placa || !dados.modelo || dados.ano === undefined || dados.km === undefined || !dados.cor || dados.revisaoEmDia === undefined || !dados.nomeCliente) {
      return 'Todos os campos (placa, modelo, ano, km, cor, revisaoEmDia, nomeCliente) são obrigatórios.';
    }
  }

  // Regra 2: Tipos corretos
  if (dados.placa !== undefined && typeof dados.placa !== 'string') {
    return 'O campo placa deve ser um texto.';
  }
  if (dados.modelo !== undefined && typeof dados.modelo !== 'string') {
    return 'O campo modelo deve ser um texto.';
  }
  if (dados.nomeCliente !== undefined && typeof dados.nomeCliente !== 'string') {
    return 'O campo nomeCliente deve ser um texto.';
  }
  if (dados.ano !== undefined && (typeof dados.ano !== 'number' || Number.isNaN(dados.ano))) {
    return 'O campo ano deve ser um número válido.';
  }
  if (dados.km !== undefined && (typeof dados.km !== 'number' || Number.isNaN(dados.km))) {
    return 'O campo km deve ser um número válido.';
  }
  if (dados.revisaoEmDia !== undefined && typeof dados.revisaoEmDia !== 'boolean') {
    return 'O campo revisaoEmDia deve ser verdadeiro ou falso (booleano).';
  }

  // Regra 3 (específica do tema): Intervalo de números (ano e quilometragem)
  if (dados.ano !== undefined && (dados.ano < 1900 || dados.ano > anoAtual + 1)) {
    return `O ano do veículo deve estar entre 1900 e ${anoAtual + 1}.`;
  }
  if (dados.km !== undefined && dados.km < 0) {
    return 'A quilometragem (km) não pode ser negativa.';
  }

  // Regra 4 (específica do tema): Formato da placa e valor permitido da lista de cores
  if (dados.placa !== undefined && dados.placa.trim().length !== 7) {
    return 'A placa deve conter exatamente 7 caracteres (ex: ABC1D23).';
  }
  if (dados.cor !== undefined && !CORES_PERMITIDAS.includes(dados.cor)) {
    return `Cor inválida. Escolha uma das opções: ${CORES_PERMITIDAS.join(', ')}.`;
  }

  return null; // Nenhum erro encontrado
}

// Função auxiliar para checar se a placa já existe (ignora maiúsculas/minúsculas e espaços)
function placaJaExiste(placa, idIgnorado = null) {
  const placaLimpa = placa.trim().toLowerCase();
  return veiculos.some((v) => v.placa.trim().toLowerCase() === placaLimpa && v.id !== idIgnorado);
}

// ==================== ROTAS DO CRUD ====================

// GET /veiculos - Lista todos ou aplica filtros (?cor=...&anoMin=...)
app.get('/veiculos', (req, res) => {
  const { cor, anoMin } = req.query;
  let resultado = [...veiculos];

  // Validação do filtro numérico (anoMin)
  if (anoMin !== undefined) {
    const anoNumero = Number(anoMin);
    if (Number.isNaN(anoNumero)) {
      return res.status(400).json({ erro: 'O parâmetro anoMin deve ser um número válido.' });
    }
    resultado = resultado.filter((v) => v.ano >= anoNumero);
  }

  // Filtro de texto combinável (cor)
  if (cor !== undefined && cor.trim() !== '') {
    const corBusca = cor.trim().toLowerCase();
    resultado = resultado.filter((v) => v.cor.toLowerCase() === corBusca);
  }

  return res.status(200).json(resultado);
});

// GET /veiculos/:id - Busca um veículo pelo ID
app.get('/veiculos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O ID informado na URL é inválido.' });
  }

  const veiculo = veiculos.find((v) => v.id === id);
  if (!veiculo) {
    return res.status(404).json({ erro: 'Veículo não encontrado.' });
  }

  return res.status(200).json(veiculo);
});

// POST /veiculos - Cadastra um novo veículo
app.post('/veiculos', (req, res) => {
  const erroValidacao = validarVeiculo(req.body, false);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  if (placaJaExiste(req.body.placa)) {
    return res.status(409).json({ erro: 'Já existe um veículo cadastrado com esta placa.' });
  }

  const novoVeiculo = {
    id: proximoId++,
    placa: req.body.placa.trim().toUpperCase(),
    modelo: req.body.modelo.trim(),
    ano: req.body.ano,
    km: req.body.km,
    cor: req.body.cor,
    revisaoEmDia: req.body.revisaoEmDia,
    nomeCliente: req.body.nomeCliente.trim()
  };

  veiculos.push(novoVeiculo);

  return res
    .status(201)
    .location(`/veiculos/${novoVeiculo.id}`)
    .json(novoVeiculo);
});

// PUT /veiculos/:id - Substitui o veículo inteiro
app.put('/veiculos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O ID informado na URL é inválido.' });
  }

  const indice = veiculos.findIndex((v) => v.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: 'Veículo não encontrado.' });
  }

  const erroValidacao = validarVeiculo(req.body, false);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  if (placaJaExiste(req.body.placa, id)) {
    return res.status(409).json({ erro: 'Já existe outro veículo cadastrado com esta placa.' });
  }

  const veiculoAtualizado = {
    id: id,
    placa: req.body.placa.trim().toUpperCase(),
    modelo: req.body.modelo.trim(),
    ano: req.body.ano,
    km: req.body.km,
    cor: req.body.cor,
    revisaoEmDia: req.body.revisaoEmDia,
    nomeCliente: req.body.nomeCliente.trim()
  };

  veiculos[indice] = veiculoAtualizado;
  return res.status(200).json(veiculoAtualizado);
});

// PATCH /veiculos/:id - Atualiza apenas os campos enviados
app.patch('/veiculos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O ID informado na URL é inválido.' });
  }

  const veiculo = veiculos.find((v) => v.id === id);
  if (!veiculo) {
    return res.status(404).json({ erro: 'Veículo não encontrado.' });
  }

  const erroValidacao = validarVeiculo(req.body, true);
  if (erroValidacao) {
    return res.status(400).json({ erro: erroValidacao });
  }

  if (req.body.placa !== undefined && placaJaExiste(req.body.placa, id)) {
    return res.status(409).json({ erro: 'Já existe outro veículo cadastrado com esta placa.' });
  }

  // Atualiza somente o que foi enviado
  if (req.body.placa !== undefined) veiculo.placa = req.body.placa.trim().toUpperCase();
  if (req.body.modelo !== undefined) veiculo.modelo = req.body.modelo.trim();
  if (req.body.ano !== undefined) veiculo.ano = req.body.ano;
  if (req.body.km !== undefined) veiculo.km = req.body.km;
  if (req.body.cor !== undefined) veiculo.cor = req.body.cor;
  if (req.body.revisaoEmDia !== undefined) veiculo.revisaoEmDia = req.body.revisaoEmDia;
  if (req.body.nomeCliente !== undefined) veiculo.nomeCliente = req.body.nomeCliente.trim();

  return res.status(200).json(veiculo);
});

// DELETE /veiculos/:id - Remove um veículo
app.delete('/veiculos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erro: 'O ID informado na URL é inválido.' });
  }

  const indice = veiculos.findIndex((v) => v.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: 'Veículo não encontrado.' });
  }

  veiculos.splice(indice, 1);
  return res.status(204).send();
});

// Inicia o servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});