# Front: Fluxos de Personal e Subconta

## Objetivo

Validar o cadastro/login do personal e a ativacao de recebimentos via subconta Asaas.

## Pre-requisitos de tela

O front precisa ter, no minimo:

- Tela de cadastro de personal.
- Tela de login de personal.
- Tela/etapa de cadastro de endereco do personal.
- Area logada do personal guardando `token` e `id`.
- Botao `Ativar recebimentos`.
- Formulario de ativacao de recebimentos.
- Opcional: botao/tela `Atualizar dados de recebimento`. - INDISPONÍVEL

Sem endereco cadastrado, o backend bloqueia a ativacao da subconta.

## Fluxo 1: Cadastro de personal

`POST /personal/`

Body minimo recomendado:

```json
{
  "nome": "Personal Teste",
  "email": "personal@test.com",
  "password": "123456",
  "descricao": "Personal de teste",
  "formacao": "Educacao Fisica",
  "experiencia": "5 anos",
  "cidade": "Sao Paulo",
  "profissao": "Personal trainer",
  "areaAtuacao": "Musculacao",
  "modeloAtendimento": "presencial"
}
```

Resposta esperada:

```json
{
  "id": 1,
  "nome": "Personal Teste",
  "email": "personal@test.com"
}
```

## Fluxo 2: Login de personal

`POST /personal/token/`

Body:

```json
{
  "email": "personal@test.com",
  "password": "123456"
}
```

Resposta esperada:

```json
{
  "token": "jwt",
  "id": 1
}
```

O front deve salvar o `token` e enviar nas rotas protegidas:

```http
Authorization: Bearer jwt
```

## Fluxo 3: Cadastro de endereco do personal

`POST /enderecos/`

Body:

```json
{
  "personal_id": 1,
  "rua": "Rua Teste",
  "numero": 123,
  "complemento": "Sala 1",
  "bairro": "Centro",
  "cidade": "Sao Paulo",
  "estado": "Sao Paulo",
  "cep": "01000-000"
}
```

Resposta esperada: objeto do endereco criado.

Observacao: hoje essa rota recebe `personal_id` no body e nao exige token.

## Fluxo 4: Ativar recebimentos

Botao sugerido: `Ativar recebimentos`.

Ao clicar, abrir formulario com:

- CPF/CNPJ
- Data de nascimento
- Telefone
- Renda mensal
- Tipo de empresa

`POST /subconta/ativar-recebimentos`

Headers:

```http
Authorization: Bearer jwt
Content-Type: application/json
```

Body:

```json
{
  "cpfCnpj": "12345678909",
  "dataNascimento": "1990-01-01",
  "telefone": "11999999999",
  "rendaMensal": 5000,
  "companyType": "MEI"
}
```

`companyType` aceitos:

- `MEI`
- `LIMITED`
- `INDIVIDUAL`
- `ASSOCIATION`

Resposta esperada:

```json
{
  "message": "Subconta criada com sucesso.",
  "data": {
    "personal_id": 1,
    "asaas_account_id": "...",
    "wallet_id": "...",
    "onboarding_url": "...",
    "company_type": "MEI",
    "status_cadastro": "CONCLUIDO",
    "status_aprovacao": "PENDENTE",
    "status_recebimento": "PENDENTE"
  }
}
```

Se vier `onboarding_url`, o front deve exibir um botao para abrir o link de onboarding do Asaas.

## Fluxo 5: Consultar status da subconta

Usar ao entrar na area logada do personal ou na tela de recebimentos.

`GET /subconta/me`

Headers:

```http
Authorization: Bearer jwt
```

Resposta quando existe subconta:

```json
{
  "message": "Subconta encontrada.",
  "data": {
    "id": 1,
    "personal_id": 1,
    "asaas_account_id": "...",
    "wallet_id": "...",
    "onboarding_url": "...",
    "company_type": "MEI",
    "status_cadastro": "CONCLUIDO",
    "status_aprovacao": "PENDENTE",
    "status_recebimento": "PENDENTE",
    "created_at": "2026-05-11T00:00:00.000Z",
    "updated_at": "2026-05-11T00:00:00.000Z"
  }
}
```

Resposta quando ainda nao existe subconta:

```json
{
  "message": "Personal ainda não possui subconta.",
  "data": null
}
```

Uso no front:

- `data: null`: mostrar botao `Ativar recebimentos`.
- `status_cadastro: PENDENTE`: mostrar carregando/pendente.
- `status_cadastro: ERRO`: permitir tentar ativar novamente.
- `status_cadastro: CONCLUIDO`: mostrar status da conta.
- `onboarding_url`: mostrar botao para abrir onboarding do Asaas.

## Fluxo 6: Atualizar dados de recebimento - INDISPONÍVEL

Botao sugerido: `Atualizar dados de recebimento`.

`PUT /subconta/`

Headers:

```http
Authorization: Bearer jwt
Content-Type: application/json
```

Body igual ao fluxo de ativacao:

```json
{
  "cpfCnpj": "12345678909",
  "dataNascimento": "1990-01-01",
  "telefone": "11999999999",
  "rendaMensal": 6000,
  "companyType": "MEI"
}
```

Resposta esperada:

```json
{
  "message": "Subconta atualizada com sucesso.",
  "data": {
    "personal_id": 1,
    "company_type": "MEI"
  }
}
```

## Estados que o front deve tratar

- Sem token: redirecionar para login.
- Sem endereco: mostrar chamada para cadastrar endereco antes de ativar recebimentos.
- Campos obrigatorios ausentes: destacar campos do formulario de ativacao.
- Subconta ja concluida: bloquear nova ativacao e oferecer atualizacao, se fizer sentido.
- Erro Asaas/backend: mostrar `errors[0]`.
