# Web

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