# MindRush - Aplicação Web

O **MindRush** é uma aplicação web desenvolvida em Next.js que oferece uma plataforma completa para criação e gerenciamento de quizzes para educadores.

## 🌐 Funcionalidades

- Interface administrativa para criação e gerenciamento de quizzes
- Sistema de autenticação com Google OAuth
- Dashboard para acompanhamento de resultados e estatísticas
- Geração de QR Codes para acesso aos jogos
- Comunicação em tempo real com Pusher
- Sistema de análise de PDFs com IA para geração automática de perguntas
- Interface moderna com Tailwind CSS
- Suporte a temas claro e escuro

## 🛠️ Tecnologias Utilizadas

- **Next.js**: Framework React para desenvolvimento web
- **TypeScript**: Linguagem de programação tipada
- **Tailwind CSS**: Framework de CSS utilitário
- **ShadCN/UI**: Biblioteca de componentes React
- **Drizzle ORM**: ORM TypeScript para PostgreSQL
- **PostgreSQL**: Banco de dados relacional
- **NextAuth.js**: Autenticação para Next.js
- **Pusher**: Comunicação em tempo real
- **React Query**: Gerenciamento de estado e cache
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **Recharts**: Biblioteca de gráficos
- **OpenAI**: Integração com IA para análise de PDFs

## 📋 Pré-requisitos

Antes de rodar a aplicação, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (incluído com Node.js)
- [PostgreSQL](https://www.postgresql.org/) (versão 13 ou superior)
- Editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

## 🚀 Como Rodar a Aplicação

### 1. Clone o repositório e navegue até o diretório web

```bash
cd code/web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Inicie o PostgreSQL usando Docker:

```bash
./start-database.sh
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis necessárias:

```bash
cp .env.example .env
```

Em seguida, edite o arquivo `.env` com suas configurações específicas. Consulte a seção [Configurando autenticação com Google OAuth](#configurando-autenticação-com-google-oauth) para obter as credenciais do Google.

### 5. Execute as migrações do banco de dados

```bash
npm run db:push
```

### 6. Execute a aplicação

#### Para executar em modo de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

#### Para executar em modo de produção

```bash
npm run build
npm run start
```

## 🔧 Comandos Úteis

### Gerenciamento do banco de dados

```bash
# Gerar migrações
npm run db:generate

# Aplicar migrações
npm run db:migrate

# Push schema para o banco
npm run db:push

# Abrir Drizzle Studio
npm run db:studio
```

### Desenvolvimento

```bash
# Verificar tipos TypeScript
npm run typecheck

# Executar linting
npm run lint

# Corrigir problemas de linting
npm run lint:fix

# Formatar código
npm run format:write

# Verificar formatação
npm run format:check
```

### Testes

```bash
# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Teste de performance (carregamento de respostas)
npm run test:load
```

---

## Diretrizes de Desenvolvimento

1. **Evite o uso de `any` no TypeScript**. Caso tenha dúvidas sobre como tipar algo corretamente, peça ajuda antes de
   usar esse tipo genérico.

2. **Não utilize `@ts-ignore` ou `eslint-disable`**. Esses comandos ignoram erros importantes. Se surgir algum alerta do
   ESLint que você não conseguir resolver, solicite suporte ao invés de suprimir o aviso.

3. **Para redirecionamentos, utilize o hook `useRouter()` do Next.js**. Não use `window.location.href`, pois isso não é
   apropriado em aplicações SPA (Single Page Application).

4. **Evite recarregar a página com `window.location.reload()`**. Essa prática quebra a fluidez da SPA e deve ser
   substituída por abordagens reativas e controladas.

5. **Use constantes de rota definidas no arquivo `lib/routes.ts`**. Isso evita o uso de rotas hard-coded, garante
   consistência entre os arquivos e facilita manutenções futuras.

6. **Com React Hook Form, não passe objetos de formulário como props**. Em vez disso, utilize os hooks diretamente
   dentro dos componentes que precisam interagir com o formulário.

7. **Corrija todos os avisos do ESLint**. Leia com atenção cada sublinhado amarelo ou vermelho e entenda o problema
   antes de corrigi-lo. Isso contribui para um código mais limpo e confiável.

8. **Escreva todo o código em inglês**, com exceção dos textos exibidos para os usuários finais (como rótulos, mensagens
   e títulos).

9. **Para exibir mensagens ao usuário, utilize o componente Sonner do ShadCN**. Evite o uso de `alert()`, que não é
   elegante nem padronizado com o restante da interface.

10. **Sempre utilize os componentes da biblioteca ShadCN quando disponíveis**. Evite criar componentes personalizados
    desnecessariamente. Isso garante consistência visual, reduz retrabalho e acelera o desenvolvimento

11. **Todas as entidades do banco de dados possuem tipos inferidos automaticamente**, disponíveis no arquivo
    `lib/types.ts`. Usem esses tipos para evitar a duplicação de tipos e garantir a consistência entre o banco de dados
    e o código.

12. **Evite o uso de `throw`.** O arquivo `/lib/result.ts` fornece uma abstração para lidar com erros de maneira
    funcional. Leia [este artigo](https://www.dennisokeeffe.com/blog/2024-07-14-creating-a-result-type-in-typescript)
    sobre Result Pattern.

---

## Configurando autenticação com Google OAuth

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

## 📚 Recursos Adicionais

- [Documentação oficial do Next.js](https://nextjs.org/docs)
- [Documentação do ShadCN/UI](https://ui.shadcn.com/)
- [Documentação do Drizzle ORM](https://orm.drizzle.team/)
- [Documentação do NextAuth.js](https://next-auth.js.org/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do React Query](https://tanstack.com/query/latest)
