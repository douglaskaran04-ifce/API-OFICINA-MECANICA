# Sistema de Oficina Mecânica

**Disciplina:** Desenvolvimento Web 2, IFCE campus Maranguape
**Tema:** Oficina Mecânica
**Equipe:** Equipe 01

## Integrantes

| Nome | Responsabilidade principal |
|---|---|
| Carlos Jefferson | Rotas e validação da API (`backend/server.js`) |
| Fernando Carvalho | Página (`frontend/index.html`, CSS e `fetch`) |
| Douglas Karan | Documentação (`docs/api.md`, `docs/diagrama.md` e `README.md`) |

## Sobre o sistema

Este sistema ajuda no controle diário de uma oficina mecânica, permitindo cadastrar e consultar os veículos que entram para atendimento. Ele guarda os dados principais do carro, o estado da revisão e o nome do cliente responsável.

## Entidade principal desta parte

**Entidade:** `veiculos`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | número | gerado pelo servidor |
| `placa` | texto | obrigatório, único (409), 7 caracteres |
| `modelo` | texto | obrigatório |
| `ano` | número | obrigatório, entre 1900 e o ano atual + 1 |
| `km` | número | obrigatório, maior ou igual a 0 |
| `cor` | texto | obrigatório, valores permitidos: Branco, Preto, Prata, Cinza, Vermelho, Azul |
| `revisaoEmDia` | booleano | obrigatório (`true` ou `false`) |
| `nomeCliente` | texto | obrigatório |

## Como instalar e rodar

```text
npm install
node backend/server.js
```

Depois, abra `http://localhost:3000` no navegador.

## Documentação

- [Endpoints da API](docs/api.md)
- [Diagrama das entidades](docs/diagrama.md)

## Andamento do projeto

- [x] Parte 1: API CRUD em memória da entidade principal e página simples
- [ ] Parte 2: banco de dados SQLite e demais entidades
- [ ] Parte 3: login e autorização