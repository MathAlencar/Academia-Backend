# Frontend - Fluxo e rotas de pagamento

Este documento explica como o frontend deve usar as rotas de pagamento, onde cada rota entra no fluxo e quais telas são necessárias.

## Visão geral do fluxo

1. O personal precisa ter uma subconta/carteira Asaas configurada.
2. O personal cadastra seus planos.
3. O aluno escolhe um plano.
4. O frontend cria um checkout para esse plano.
5. O aluno paga no checkout hospedado pelo Asaas.
6. O Asaas chama o webhook do backend.
7. O backend atualiza a cobrança e cria uma notificação para o personal quando o pagamento for aprovado.
8. O personal visualiza a notificação no app.

Importante: hoje o sistema ainda não possui saque pelo app. O dinheiro recebido pelo personal fica na conta/carteira Asaas vinculada a ele. O saque precisa ser feito pelo painel/app do Asaas até existir uma rota própria de saque no backend.

## Telas necessárias no frontend

### 1. Tela de planos do personal

Mostra os planos disponíveis de um personal para o aluno escolher.

Uso esperado:

- listar planos do personal;
- mostrar tipo do plano e valor;
- permitir selecionar um plano;
- chamar a criação de checkout.

### 2. Tela/botão de contratar plano

Depois que o aluno escolhe um plano, o frontend chama a rota de checkout.

Ao receber a resposta, o frontend deve redirecionar o aluno para `checkout_url`.

### 3. Telas de retorno do checkout

O Asaas pode redirecionar o aluno para URLs de callback após sucesso, cancelamento ou expiração.

Telas sugeridas:

- pagamento aprovado ou em processamento;
- checkout cancelado;
- checkout expirado;
- erro/falha ao iniciar pagamento.

Essas telas são de experiência do usuário. A confirmação real do pagamento deve vir pelo webhook, não apenas pelo redirecionamento.

### 4. Tela de notificações do personal

Mostra as notificações criadas pelo backend, incluindo pagamento aprovado.

Uso esperado:

- listar notificações;
- filtrar lidas e não lidas;
- marcar notificação como lida;
- exibir dados como aluno, plano, valor e data.

### 5. Tela de saque/recebimentos

Pode existir no frontend, mas deve deixar claro que o saque ainda não é feito pelo sistema.

Estado atual recomendado:

- mostrar aviso: "O saque deve ser realizado diretamente no Asaas.";
- opcionalmente mostrar instruções ou link para o painel do Asaas;
- não prometer saque interno enquanto não houver rota no backend.

## Rotas de checkout

Base no backend:

```txt
/checkout/
```

### Criar checkout

```http
POST /checkout/
Authorization: Bearer <token_do_aluno>
Content-Type: application/json
```

Cria um checkout Asaas para o aluno logado contratar um plano.

Exemplo simples:

```json
{
  "planoId": 12
}
```

Exemplo com dados do aluno:

```json
{
  "planoId": 12,
  "usarDadosAluno": true
}
```

Exemplo com callbacks customizados:

```json
{
  "planoId": 12,
  "usarDadosAluno": true,
  "callback": {
    "successUrl": "https://app.exemplo.com/pagamento/sucesso",
    "cancelUrl": "https://app.exemplo.com/pagamento/cancelado",
    "expiredUrl": "https://app.exemplo.com/pagamento/expirado"
  }
}
```

Exemplo com tipos de pagamento:

```json
{
  "planoId": 12,
  "billingTypes": ["PIX", "CREDIT_CARD"],
  "chargeTypes": ["DETACHED"]
}
```

Resposta esperada:

```json
{
  "cobranca_id": 34,
  "checkout_id": "chk_123456789",
  "checkout_url": "https://sandbox.asaas.com/checkoutSession/show?id=chk_123456789",
  "payment_link_id": "chk_123456789",
  "status": "ACTIVE"
}
```

O frontend deve redirecionar o aluno para `checkout_url`.

### Consultar checkout

```http
GET /checkout/:id
Authorization: Bearer <token_do_aluno>
```

Consulta um checkout no Asaas pelo ID.

Exemplo:

```http
GET /checkout/chk_123456789
Authorization: Bearer <token_do_aluno>
```

Resposta esperada:

```json
{
  "id": "chk_123456789",
  "status": "ACTIVE",
  "checkoutUrl": "https://sandbox.asaas.com/checkoutSession/show?id=chk_123456789"
}
```

Use essa rota para telas de detalhe ou diagnóstico. Para confirmação real de pagamento, confie no webhook processado pelo backend.

## Rotas de notificações do personal

Base no backend:

```txt
/personal/notificacoes/
```

Todas exigem token do personal.

### Listar notificações

```http
GET /personal/notificacoes/
Authorization: Bearer <token_do_personal>
```

Resposta esperada:

```json
{
  "notificacoes": [
    {
      "id": 1,
      "destinatario_id": 7,
      "tipo_destinatario": "personal",
      "tipo": "PAGAMENTO_APROVADO",
      "titulo": "Pagamento aprovado",
      "mensagem": "O aluno Maria Silva teve o pagamento aprovado para o plano Mensal.",
      "entidade_tipo": "checkout",
      "entidade_id": 34,
      "dados": {
        "aluno_id": 10,
        "aluno_nome": "Maria Silva",
        "plano_id": 12,
        "plano_tipo": "Mensal",
        "cobranca_id": 34,
        "checkout_id": "chk_123456789",
        "valor": 120
      },
      "lida_em": null,
      "created_at": "2026-05-20T10:30:00.000Z",
      "updated_at": "2026-05-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Listar apenas não lidas

```http
GET /personal/notificacoes/?lida=false
Authorization: Bearer <token_do_personal>
```

### Listar apenas lidas

```http
GET /personal/notificacoes/?lida=true
Authorization: Bearer <token_do_personal>
```

### Paginação

```http
GET /personal/notificacoes/?page=1&limit=20
Authorization: Bearer <token_do_personal>
```

### Marcar como lida

```http
PATCH /personal/notificacoes/:id/lida
Authorization: Bearer <token_do_personal>
```

Exemplo:

```http
PATCH /personal/notificacoes/1/lida
Authorization: Bearer <token_do_personal>
```

Resposta esperada:

```json
{
  "id": 1,
  "destinatario_id": 7,
  "tipo_destinatario": "personal",
  "tipo": "PAGAMENTO_APROVADO",
  "titulo": "Pagamento aprovado",
  "mensagem": "O aluno Maria Silva teve o pagamento aprovado para o plano Mensal.",
  "lida_em": "2026-05-20T11:00:00.000Z"
}
```

## Rotas de webhook

Base no backend:

```txt
/webhook/
```

Essas rotas são para o Asaas chamar. O frontend não deve chamar essas rotas diretamente.

### Webhook de checkout

```http
POST /webhook/asaas/checkouts
asaas-access-token: <token_configurado_no_backend>
Content-Type: application/json
```

Exemplo de payload esperado:

```json
{
  "event": "CHECKOUT_PAID",
  "checkout": {
    "id": "chk_123456789"
  }
}
```

Quando o evento for `CHECKOUT_PAID`, o backend:

- busca a cobrança pelo `checkout.id`;
- atualiza o status da cobrança para `PAID`;
- cria uma notificação `PAGAMENTO_APROVADO` para o personal.

Eventos tratados:

```json
{
  "CHECKOUT_CREATED": "PENDING",
  "CHECKOUT_CANCELED": "CANCELED",
  "CHECKOUT_EXPIRED": "EXPIRED",
  "CHECKOUT_PAID": "PAID"
}
```

### Webhook de status da conta

```http
POST /webhook/asaas/account-status
asaas-access-token: <token_configurado_no_backend>
Content-Type: application/json
```

Usado para atualizar o status da subconta do personal.

Exemplo:

```json
{
  "event": "ACCOUNT_STATUS_GENERAL_APPROVAL_APPROVED",
  "account": {
    "id": "acc_123456789"
  },
  "accountStatus": {
    "general": "APPROVED"
  }
}
```

### Webhook de transferências

```http
POST /webhook/asaas/transfers
asaas-access-token: <token_configurado_no_backend>
Content-Type: application/json
```

Hoje essa rota existe, mas ainda não implementa uma regra de saque ou histórico de transferências para o frontend.

## Como o personal recebe o dinheiro

No checkout, o backend cria o pagamento com `splits`. Isso direciona uma porcentagem do valor para a carteira Asaas do personal.

Exemplo conceitual:

```json
{
  "items": [
    {
      "name": "Mensal - Plano #12",
      "quantity": 1,
      "value": 120
    }
  ],
  "splits": [
    {
      "walletId": "wallet_do_personal",
      "percentageValue": 90
    }
  ]
}
```

Nesse exemplo, 90% do pagamento vai para a carteira do personal no Asaas.

## Saque pelo personal

Estado atual: o sistema ainda não possui rota de saque.

Isso significa que:

- o personal recebe o valor na conta/carteira Asaas vinculada;
- o saque deve ser feito diretamente pelo Asaas;
- o frontend não deve exibir um botão funcional de "Sacar" integrado ao backend;
- se existir uma tela de recebimentos, ela deve deixar claro que o saque ocorre fora do app.

Para saque dentro do sistema, ainda seria necessário implementar no backend:

- consulta de saldo disponível da conta/carteira Asaas;
- cadastro ou seleção de destino de saque;
- criação de transferência/saque via API do Asaas;
- histórico de saques;
- tratamento do webhook de transferências;
- estados de erro, pendente, concluído e cancelado.

## Sugestão de comportamento no frontend

### Aluno contratando plano

1. Aluno toca em "Contratar".
2. Frontend chama `POST /checkout/`.
3. Backend retorna `checkout_url`.
4. Frontend redireciona para `checkout_url`.
5. Aluno conclui pagamento no Asaas.
6. Frontend mostra tela de retorno.
7. Status real é confirmado depois pelo webhook.

### Personal acompanhando pagamentos

1. Personal abre tela de notificações.
2. Frontend chama `GET /personal/notificacoes/?lida=false`.
3. Mostra notificações de pagamento aprovado.
4. Ao abrir uma notificação, frontend chama `PATCH /personal/notificacoes/:id/lida`.
5. Se houver tela de recebimentos, informar que o saque é feito no Asaas.

## Cuidados importantes

- Não confirmar pagamento apenas pela tela de sucesso do checkout.
- Não chamar webhooks pelo frontend.
- Não mostrar saque interno como disponível enquanto não houver rota própria.
- Sempre usar token do aluno nas rotas de checkout.
- Sempre usar token do personal nas rotas de notificações.