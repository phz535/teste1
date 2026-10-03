# Nexa Bot

Bot oficial da Nexa Store.

## Requisitos

- Node.js 20+
- Aplicação/bot criado no Discord Developer Portal
- Servidor Discord onde o bot será instalado

## Instalação local

```bash
npm install
```

Crie um arquivo `.env` baseado em `.env.example`.

Depois registre os comandos:

```bash
npm run deploy
```

E inicie:

```bash
npm start
```

## Railway

No Railway, configure as mesmas variáveis do `.env` em **Variables**.

O comando de inicialização é:

```bash
npm start
```

## Comandos

- `/ping` — testa o bot
- `/setup` — envia o painel de tickets

## Permissões necessárias

O bot precisa conseguir:

- Ver canais
- Enviar mensagens
- Gerenciar canais
- Gerenciar mensagens
- Ver histórico de mensagens
- Usar comandos de aplicação

Nunca coloque o token do bot no GitHub.
