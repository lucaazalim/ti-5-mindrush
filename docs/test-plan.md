# Test Plan - MindRush

## Introdução

Este documento detalha o plano de testes das funcionalidades principais do sistema MindRush. Para cada funcionalidade prioritária, está descrito o comportamento esperado, as verificações a serem realizadas e os critérios de aceite.

## Arquitetura

A arquitetura do sistema MindRush está descrita no [documento principal da documentação](README.md#4-modelagem-e-projeto-arquitetural).

## Functionalidades

### Autenticação

#### Estratégia

Manual

#### Comportamento Esperado

- Ao clicar no botão **Acessar** na página inicial (`/`), o usuário deve ser redirecionado para a página de autorização de login do Google.
- Após a autorização bem-sucedida, o usuário deve ser redirecionado automaticamente para **/dashboard/quizzes**, já autenticado no MindRush.

#### Verificações

1. O botão **Acessar** está visível na página inicial.
2. Ao clicar, a janela do Google OAuth é aberta.
3. Após o login/consentimento no Google, o usuário é autenticado.
4. O sistema redireciona automaticamente para **/dashboard/quizzes**.
5. Em caso de erro ou negação no Google, o sistema exibe uma mensagem apropriada.

#### Critérios de Aceite

- ✅ O botão **Acessar** aparece corretamente na página inicial.
- ✅ O redirecionamento para o Google ocorre sem erros.
- ✅ O usuário é autenticado corretamente após o consentimento.
- ✅ O usuário é redirecionado automaticamente para **/dashboard/quizzes**.
- ✅ Erros no processo (ex.: negação de permissão) são tratados com mensagens claras ao usuário.

---

### Criação de Quiz

#### Estratégia

Ponta-a-ponta

#### Comportamento Esperado

- O educador pode criar um novo quiz fornecendo as informações necessárias, como título, descrição e perguntas.
- O sistema valida os dados fornecidos e retorna um erro caso algum campo obrigatório esteja ausente ou inválido.
- Após a criação bem-sucedida, o quiz é salvo no banco de dados e está disponível para uso.

#### Verificações

1. O educador preenche todos os campos obrigatórios e o quiz é criado com sucesso.
2. O sistema retorna um erro ao tentar criar um quiz com campos obrigatórios ausentes.
3. O sistema retorna um erro ao tentar criar um quiz com dados inválidos (ex.: título com menos de 3 caracteres).
4. O quiz criado aparece na lista de quizzes disponíveis para o educador.

#### Critérios de Aceite

- ✅ O sistema valida corretamente os dados fornecidos.
- ✅ O quiz é salvo no banco de dados após a criação bem-sucedida.
- ✅ O quiz aparece na lista de quizzes disponíveis para o educador.

---

## Estratégia de Teste

Serão utilizadas três estratégias de de testes, dependendo da funcionalidade.

| Tipo de Teste | Descrição                                                                                                               | Ferramenta       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Unitário      | Testa pequenas partes isoladas do código (ex.: funções ou métodos) para garantir que funcionem corretamente.            | Jest             |
| Ponta-a-ponta | Verifica o fluxo completo do sistema, simulando o comportamento real do usuário e a integração entre os componentes.    | Playwright       |
| Manual        | Teste realizado por uma pessoa, explorando o sistema manualmente para identificar problemas ou validar funcionalidades. | Postman / Manual |

## Ambiente e Ferramentas

Os testes serão realizados em ambiente de produção, com o auxílio das ferramentas descritas abaixo.

| Ferramenta | Descrição                                                                       |
| ---------- | ------------------------------------------------------------------------------- |
| Jest       | Framework de testes JavaScript focado em testes unitários e de integração.      |
| Playwright | Ferramenta para testes end-to-end que simula interações reais em navegadores.   |
| Postman    | Plataforma para testar APIs, permitindo enviar requisições e validar respostas. |

## Classificação de Bugs

Os bugs encontrados devem ser classificados com uma das severidades descritas abaixo.

| Severidade | Descrição                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Bloqueante | Impede completamente o uso do sistema ou de uma funcionalidade principal; não há solução alternativa viável.         |
| Grave      | Impacta severamente uma funcionalidade importante, mas há alguma solução alternativa temporária disponível.          |
| Moderada   | Afeta parcialmente uma funcionalidade ou gera erros em cenários específicos, sem comprometer o uso geral do sistema. |
| Pequena    | Problema de baixo impacto, como erros visuais, textos, ou pequenas inconsistências que não afetam o funcionamento.   |

## Definição de Pronto

Serão consideradas prontas as funcionalidades que passarem pelas verificações e testes descritas neste documento e não apresentarem bugs com severidade acima de "Pequena".
