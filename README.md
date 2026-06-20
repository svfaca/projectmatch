# ProjectMatch

Projeto de matchmaking para colaboradores de projetos — gerencia e conecta criadores e builders.

## Visão geral

Web e mobile (Expo/React Native) app para criar, buscar e casar projetos com construtores interessados.

## Pré-requisitos

- Node.js (>=16)
- npm ou Yarn
- Expo CLI (opcional)

## Instalação

1.  Instale dependências:

```bash
npm install
# ou
# yarn
```

2.  Instale dependências nativas do Expo (se necessário):

```bash
npx expo install
```

## Executando

- Iniciar o servidor de desenvolvimento:

```bash
npm start
# ou
# expo start
```

- Abrir no emulador/dispositivo móvel via Expo Go ou no navegador (web).

## Variáveis de ambiente

Coloque chaves/segredos sensíveis em um arquivo `.env` (não comitado). Exemplos:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
```

Use o arquivo `.env.example` como base e crie seu `.env` local.

## Segurança

Regras obrigatórias para este projeto:

- Nunca confiar no frontend para autorização. Toda permissão deve ser validada no Firestore Rules e/ou backend.
- Nunca armazenar segredos no app (Client Secret OAuth, Admin SDK, Service Account JSON, JWT private key, chaves de Stripe/OpenAI/Resend/Mercado Pago).
- Separar papéis e permissões (builder, creator/recruiter, admin) no backend.
- Restringir cada usuário ao próprio documento quando aplicável.

Arquivo de regras:

- `firestore.rules` com regras de acesso por papel e ownership para `users`, `projects` e `matches`.

## Estrutura

Principais pastas:

- `src/` — código-fonte da aplicação
- `assets/` — imagens e ícones

## Contribuição

Abra PRs contra a branch `main`. Siga padrões já existentes no código.

## Licença

Veja o arquivo `LICENSE`.
