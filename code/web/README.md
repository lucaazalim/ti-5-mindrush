## Next.js Authentication com NextAuth e Google OAuth

### Configurar o Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/cloud-resource-manager)
2. Crie um novo projeto
3. Vá para **APIs e Serviços** -> **Tela de Consentimento OAuth**
4. Configure a autenticação OAuth:
   - Insira `http://localhost:3000` na "Página inicial do aplicativo"
   - Em **Acesso a dados**, adicione os três primeiros escopos disponíveis
5. Vá para **Credenciais** e crie um novo **OAuth Client ID**:
   - Selecione "Aplicativo Web"
   - **Origens JavaScript autorizadas**: `http://localhost:3000`
   - **URIs de redirecionamento autorizados**: `http://localhost:3000/api/auth/callback/google`
6. Copie o **Client ID** e o **Client Secret**

### Criar o arquivo `.env`
No diretório raiz do projeto, crie um arquivo `.env` e adicione:
```env
AUTH_GOOGLE_ID=seu-client-id
AUTH_GOOGLE_SECRET=seu-client-secret
AUTH_SECRET=sua-chave-secreta
```

**Dica**: Para gerar uma chave segura para `AUTH_SECRET`, use:
```bash
npx auth secret
```

### Rodar o projeto localmente
```bash
npm run dev
# ou
yarn dev
```
Acesse `http://localhost:3000` no navegador.