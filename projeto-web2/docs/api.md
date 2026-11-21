# Endpoints da API

Os exemplos usam o prefixo `/veiculos`. Todas as respostas de erro têm o formato:

```json
{ "erro": "mensagem clara do que deu errado" }
```

## Endpoints implementados (Parte 1)

| Método | Caminho | O que faz | Corpo esperado | Status possíveis |
|---|---|---|---|---|
| GET | `/veiculos` | Lista os itens (aceita filtros por query string) | nenhum | 200, 400 |
| GET | `/veiculos/:id` | Devolve um item | nenhum | 200, 400, 404 |
| POST | `/veiculos` | Cadastra um item | `placa`, `modelo`, `ano`, `km`, `cor`, `revisaoEmDia`, `nomeCliente` | 201, 400, 409 |
| PUT | `/veiculos/:id` | Substitui o item inteiro | `placa`, `modelo`, `ano`, `km`, `cor`, `revisaoEmDia`, `nomeCliente` | 200, 400, 404, 409 |
| PATCH | `/veiculos/:id` | Altera só os campos enviados | Um ou mais campos do veículo | 200, 400, 404, 409 |
| DELETE | `/veiculos/:id` | Remove o item | nenhum | 204, 400, 404 |

### Filtros de `GET /veiculos`

| Parâmetro | Tipo | Exemplo | O que faz |
|---|---|---|---|
| `cor` | texto | `?cor=Prata` | Filtra os veículos pela cor exata (sem diferenciar maiúsculas e minúsculas) |
| `anoMin` | número | `?anoMin=2018` | Filtra os veículos fabricados a partir do ano informado |

### Exemplo de item

```json
{
  "id": 1,
  "placa": "ABC1D23",
  "modelo": "Fiat Uno",
  "ano": 2015,
  "km": 85000,
  "cor": "Prata",
  "revisaoEmDia": true,
  "nomeCliente": "Carlos Silva"
}
```

## Endpoints planejados (Partes 2 e 3)

| Método | Caminho | O que fará | Parte prevista |
|---|---|---|---|
| GET | `/clientes` | Lista todos os clientes cadastrados | Parte 2 |
| POST | `/clientes` | Cadastra um novo cliente | Parte 2 |
| GET | `/clientes/:id/veiculos` | Lista todos os veículos de um cliente específico | Parte 2 |
| GET | `/ordens-servico` | Lista todas as ordens de serviço da oficina | Parte 2 |
| POST | `/veiculos/:id/ordens-servico` | Abre uma nova ordem de serviço para um veículo | Parte 2 |
| POST | `/login` | Autentica o usuário no sistema | Parte 3 |