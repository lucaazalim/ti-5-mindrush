# Test Plan - MindRush

## Introduction

This document details the test plan for the main functionalities of the MindRush system. For each priority functionality, the expected behavior, verifications to be performed and acceptance criteria are described. The MindRush system architecture is described in the [architecture document](/docs/architecture.md).

## Test Strategy

For each functionality, one or more test strategies from the list below will be chosen.

| Test Type  | Description                                                                                                 | Tool             |
| ---------- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| Unit       | Tests small isolated parts of code (e.g.: functions or methods) to ensure they work correctly.              | Jest             |
| End-to-end | Verifies the complete system flow, simulating real user behavior and integration between components.        | Playwright       |
| Manual     | Test performed by a person, manually exploring the system to identify problems or validate functionalities. | Postman / Manual |

## Environment and Tools

Tests will be performed in production environment, with the help of tools described below.

| Tool       | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| Jest       | JavaScript testing framework focused on unit and integration tests.            |
| Playwright | Tool for end-to-end testing that simulates real interactions in browsers.      |
| Postman    | Platform for testing APIs, allowing sending requests and validating responses. |

## Bug Classification

Found bugs must be classified with one of the severities described below.

| Severity | Description                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| Blocking | Completely prevents system or main functionality usage; there is no viable alternative solution.                        |
| Severe   | Severely impacts an important functionality, but there is some temporary alternative solution available.                |
| Moderate | Partially affects a functionality or generates errors in specific scenarios, without compromising general system usage. |
| Minor    | Low impact problem, such as visual errors, texts, or small inconsistencies that do not affect functionality.            |

## Definition of Done

Functionalities will be considered done when they pass the verifications and tests described in this document and do not present bugs with severity above "Minor".

## Coverage

- **Unit tests:** at least 90% of code contained in the `/code/web/src/lib` directory root must be covered by unit tests. Other project code files will have their behavior validated through end-to-end tests.
- **End-to-end tests:** at least 80% of main functionalities must be tested with end-to-end tests.

---

## Test Cases

### 1. Educator autentica-se

#### 1.1 Comportamento Esperado

1. Ao clicar no botão **Acessar** na página inicial (`/`), o usuário deve ser redirecionado para a página de autorização de login do Google.
2. Após a autorização bem-sucedida, o usuário deve ser redirecionado automaticamente para `/dashboard/quizzes`, já autenticado no MindRush.

#### 1.2 Verificações

1. O botão **Acessar** está visível na página inicial.
2. Ao clicar, a janela do Google OAuth é aberta.
3. Após o login/consentimento no Google, o usuário é autenticado.
4. O sistema redireciona automaticamente para `/dashboard/quizzes`.
5. Em caso de erro ou negação no Google, o sistema exibe uma mensagem apropriada.

#### 1.3 Critérios de Aceite

1. O botão **Acessar** aparece corretamente na página inicial.
2. O redirecionamento para o Google ocorre sem erros.
3. O usuário é autenticado corretamente após o consentimento.
4. O usuário é redirecionado automaticamente para `/dashboard/quizzes`.
5. Erros no processo (ex.: negação de permissão) são tratados com mensagens claras ao usuário.

---

### 2. Educador cria quiz com questões e alternativas

#### 2.1 Comportamento Esperado

1. Ao clicar no botão **"Criar quiz"** na página `/dashboard/quizzes`, deve ser exibido um formulário solicitando:
   - Título do quiz (campo obrigatório)
   - Descrição do quiz (campo opcional)
   - Método de criação (ex: manual, por importação, etc.)
2. Após preencher os dados obrigatórios e confirmar a criação, o sistema deve:
   - Criar o novo quiz no banco de dados
   - Redirecionar automaticamente para a página `/dashboard/quizzes/[ID do quiz]`
3. Nessa nova página, o educador poderá:
   - Adicionar uma ou mais **questões**
   - Para cada questão, adicionar **duas ou mais alternativas**
   - Marcar ao menos uma alternativa como correta
4. Ao clicar no botão **"Salvar alterações"**, as questões e alternativas devem ser salvas e uma **mensagem de sucesso** deve ser exibida ao usuário (ex: "Quiz salvo com sucesso!").

#### 2.2 Verificações

1. O botão **"Criar quiz"** está visível e funcional na página `/dashboard/quizzes`.
2. O formulário de criação do quiz é exibido corretamente ao clicar no botão.
3. É possível preencher e submeter o formulário com dados válidos.
4. Após a criação, o redirecionamento para `/dashboard/quizzes/[ID]` ocorre corretamente.
5. Na nova página, é possível adicionar uma nova questão ao quiz.
6. Para cada questão, é possível adicionar múltiplas alternativas.
7. O sistema impede o salvamento se:
   - Não houver pelo menos uma alternativa marcada como correta.
   - Existirem campos obrigatórios em branco.
8. Ao clicar em **"Salvar alterações"**, uma **mensagem de sucesso** é exibida ao usuário (ex: "Quiz salvo com sucesso!").

#### 2.3 Critérios de Aceite

1. O educador consegue criar um quiz preenchendo apenas os campos obrigatórios.
2. O redirecionamento para a página de edição de quiz funciona sem erros.
3. O educador consegue adicionar questões e alternativas de forma intuitiva.
4. É possível salvar o quiz somente quando todas as regras de validação são respeitadas.
5. A confirmação visual do salvamento (mensagem de sucesso) é exibida corretamente.

---

### 3. Educador renomeia quiz

#### 3.1 Comportamento Esperado

1. O educador acessa a página `/dashboard/quizzes`, onde são listados seus quizzes.
2. Ao localizar o quiz desejado, o educador clica no ícone de **configurações** correspondente.
3. No menu que se abre, o educador clica em **"Renomear"**.
4. Um modal ou formulário é exibido com os campos preenchidos com o **título atual** e a **descrição atual** do quiz.
5. O educador altera o título e/ou a descrição do quiz.
6. Ao clicar no botão **"Salvar"**, as alterações devem ser salvas e refletidas imediatamente na interface.
7. Uma **mensagem de sucesso** (ex: “Quiz atualizado com sucesso!”) deve ser exibida ao usuário.

#### 3.2 Verificações

1. A página `/dashboard/quizzes` lista corretamente os quizzes criados pelo educador.
2. O ícone de configurações está visível e funcional para cada quiz listado.
3. O botão **"Renomear"** está presente no menu de configurações.
4. O modal ou formulário com os dados atuais do quiz é exibido corretamente.
5. É possível editar o título e a descrição.
6. O botão **"Salvar"** está habilitado apenas se houver alterações válidas.
7. Após salvar, as alterações são refletidas na lista de quizzes.
8. A mensagem **"Quiz atualizado com sucesso!"** é exibida após o salvamento.

#### 3.3 Critérios de Aceite

1. O educador consegue abrir o formulário de edição do quiz sem erros.
2. É possível alterar o título e/ou descrição do quiz de forma intuitiva.
3. As alterações são refletidas imediatamente na interface do usuário.
4. A confirmação visual de sucesso é exibida ao usuário.
5. Validações impedem envios incorretos ou inválidos.

---

### 4. Educador cria partida

#### 4.1 Comportamento Esperado

1. O educador acessa a página `/dashboard/quizzes`, onde são listados seus quizzes.
2. Em um dos quizzes listados, o educador clica no botão ou opção **"Criar partida"**.
3. O sistema deve criar uma nova instância de partida associada ao quiz selecionado.
4. O educador deve ser redirecionado automaticamente para a página da nova partida, por exemplo: `/dashboard/games/[ID da partida]`.
5. A nova partida deve estar em estado inicial (ainda não iniciada), pronta para ser configurada ou iniciada.
6. Uma **mensagem de sucesso** (ex: “Partida criada com sucesso!”) pode ser exibida ao educador.
7. Ao tentar criar uma nova partida para o mesmo quiz novamente, o botão "Criar partida" não deve estar mais disponível para este quiz, e deve ser exibido o botão "Acompanhar partida" em seu lugar, indicando que já existe uma partida ativa.

#### 4.2 Verificações

1. A página `/dashboard/quizzes` exibe corretamente a lista de quizzes.
2. A opção **"Criar partida"** está visível e funcional para cada quiz.
3. Ao clicar em "Criar partida", o redirecionamento para a página da nova partida ocorre sem erros.
4. A nova partida está vinculada corretamente ao quiz selecionado.
5. A interface da página da partida reflete o estado inicial esperado.
6. Uma mensagem de sucesso é exibida após a criação.
7. Após a criação da partida, na listagem do quiz, o botão "Criar partida" deve desaparecer para aquele quiz específico e ser substituído pelo botão "Acompanhar partida".
8. O botão "Acompanhar partida" deve estar visível e funcional para o quiz que já possui partida.

#### 4.3 Critérios de Aceite

1. A opção de criar uma nova partida está acessível a partir da lista de quizzes.
2. A criação da partida ocorre de forma fluida e sem erros.
3. O educador é redirecionado corretamente para a interface da nova partida.
4. A nova partida está associada ao quiz correto e pronta para ser iniciada.
5. O sistema exibe uma mensagem clara de confirmação da criação da partida.
6. A tentativa de criar nova partida para quiz com partida ativa não é possível via interface — o botão "Criar partida" desaparece para aquele quiz, e o botão "Acompanhar partida" aparece no seu lugar.

---

### 5. Participante acessa partida

#### 5.1 Comportamento Esperado

1. O educador acessa o painel de quizzes e inicia o acompanhamento de uma partida existente.
2. O sistema redireciona o educador para a tela da partida, onde é exibido um PIN exclusivo.
3. Um participante se conecta à partida através de uma requisição POST para a rota `/matches/{pin}/participants`, informando o nickname no corpo da requisição.
4. O nickname informado deve aparecer na interface web do educador, indicando que o participante está conectado.
5. O participante deve visualizar uma tela de "Aguardando o início da partida".

#### 5.2 Verificações

1. O painel de quizzes está acessível ao educador autenticado.
2. O botão “Acompanhar partida” está visível e funcional.
3. O sistema redireciona corretamente para a URL da partida (/dashboard/matches/[id]).
4. O campo de nickname é exibido somente após o PIN válido.
5. O PIN da partida é exibido na interface com exatamente 6 dígitos.
6. A API de criação de participante aceita um nickname e responde com sucesso.
7. O nickname informado aparece na interface web da partida para o educador.

#### 5.3 Critérios de Aceite

1. O educador consegue acessar o dashboard e acompanhar uma partida.
2. O sistema exibe corretamente o PIN da partida.
3. Um participante pode se registrar usando o PIN e um nickname válido.
4. O nickname do participante é exibido na interface da partida para o educador.
5. O participante permanece aguardando o início da partida.
6. Não ocorrem falhas de comunicação ou erros de interface durante o processo.

---

### 6. Educador inicia partida

#### 6.1 Comportamento Esperado

1. Após criar uma partida, o educador é redirecionado para a página da partida em `/dashboard/games/[ID da partida]`.
2. Na interface da partida, o educador visualiza os participantes conectados e a opção **"Iniciar partida"**.
3. Ao clicar no botão **"Iniciar partida"**, o sistema deve:
   - Mudar o estado da partida para "em andamento"
   - Exibir a **primeira pergunta** do quiz na tela do educador e dos participantes
   - Impedir novos participantes de ingressarem na partida
4. A tela do educador passa a exibir as alternativas e o tempo restante.

#### 6.2 Verificações

1. A página da partida é carregada corretamente após a criação da partida.
2. O botão **"Iniciar partida"** está visível e funcional na interface do educador.
3. O clique no botão dispara a transição do estado da partida de "aguardando" para "em andamento".
4. A primeira questão do quiz é exibida corretamente tanto para o educador quanto para os participantes.
5. Participantes que tentam acessar a partida após seu início são impedidos de entrar (mensagem de erro).
6. O educador visualiza o andamento da questão, com opções e tempo visíveis.

#### 6.3 Critérios de Aceite

1. O educador consegue iniciar a partida.
2. A primeira questão do quiz é exibida imediatamente após o início.
3. O sistema bloqueia o acesso de novos participantes após o início da partida.
4. A experiência visual tanto para o educador quanto para os participantes é clara e responsiva.

---

### 7. Educador encerra partida

#### 7.1 Comportamento Esperado

1. O educador acessa a página da partida em `/dashboard/games/[ID da partida]`, onde pode visualizar o estado atual da partida (aguardando ou em andamento).
2. A opção **"Encerrar partida"** está visível na interface do educador.
3. Se a partida **não estiver na última questão**, ao clicar em **"Encerrar partida"**, o sistema exibe um **modal de confirmação** informando que a partida será finalizada antecipadamente.
4. Caso o educador confirme, o sistema encerra a partida imediatamente.
5. Se a partida **estiver na última questão**, o encerramento pode ocorrer diretamente sem exibição do modal.
6. Após o encerramento:
   - A tela do educador é atualizada com os resultados finais da partida.
   - A interface dos participantes exibe que a partida foi encerrada.
7. A partida é marcada como **encerrada** no banco de dados e torna-se acessível apenas para visualização posterior.

#### 7.2 Verificações

1. O botão **"Encerrar partida"** está visível na interface da partida.
2. Ao clicar no botão, o comportamento varia de acordo com o progresso da partida:
   - Modal de confirmação é exibido se a partida não estiver na última questão.
   - Encerramento direto ocorre se estiver na última questão.
3. O modal de confirmação exibe uma mensagem clara e o botão de confirmação funciona corretamente.
4. Após a confirmação, a interface do educador exibe os resultados.
5. A interface dos participantes exibe uma tela informando que a partida foi encerrada.

#### 7.3 Critérios de Aceite

1. O educador consegue encerrar uma partida manualmente em qualquer momento.
2. O sistema exibe um modal de confirmação quando a partida não estiver na última questão.
3. A ação de encerramento é processada corretamente e de forma estável.
4. As interfaces do educador e dos participantes refletem o término da partida.
5. A experiência é clara, previsível e livre de erros visuais ou funcionais.

---

### 8. Educador visualiza histórico de partidas

#### 8.1 Comportamento Esperado

1. A opção **"Histórico de Partidas"** está visível e funcional na página `/dashboard/quizzes` para quizzes com partidas realizadas.
2. A tabela de histórico é exibida corretamente ao clicar na opção.
3. O ícone de olho está presente e funcional em cada linha da tabela.
4. O clique no ícone redireciona corretamente para a página de resultados da partida.

### 8.2 Verificações

1. A opção "Histórico de Partidas" está visível na página `/dashboard/quizzes`.

2. Ao clicar na opção, o educador é redirecionado corretamente para a página `/dashboard/matches`.

3. A tabela de partidas é exibida corretamente, com colunas como título do quiz, status e data de finalização.

4. O ícone de olho (visualizar resultado) está presente em cada linha da tabela.

5. O botão de voltar está presente e funcional na página de histórico.

6. O clique no ícone de olho redireciona corretamente para a página de relatório da respectiva partida.

#### 8.3 Critérios de Aceite

1. O educador consegue visualizar o histórico de todas as partidas finalizadas
2. A navegação entre a lista de quizzes, o histórico e o resultado da partida funciona sem erros.
3. O ícone de olho permite acessar corretamente os relatórios de partidas finalizadas.
4. A funcionalidade apresenta uma experiência clara e livre de inconsistências.

---

### 9. Educador exclui quiz

#### 9.1 Comportamento Esperado

1. O educador acessa a página `/dashboard/quizzes`, onde são listados seus quizzes.
2. Ao localizar o quiz desejado, o educador clica no ícone de **configurações** correspondente.
3. No menu que se abre, o educador clica em **"Excluir"**.
4. Um modal ou diálogo de confirmação é exibido, solicitando que o educador confirme a exclusão.
5. Ao clicar em **"Confirmar"**, o quiz é excluído permanentemente do sistema.
6. O quiz removido deixa de aparecer na lista da página `/dashboard/quizzes`.
7. Uma **mensagem de sucesso** (ex: “Quiz excluído com sucesso!”) é exibida ao usuário.

#### 9.2 Verificações

1. A página `/dashboard/quizzes` exibe corretamente todos os quizzes do educador.
2. O ícone de configurações está visível e funcional para cada quiz listado.
3. O botão **"Excluir"** está presente e funcional no menu de configurações.
4. Ao clicar em "Excluir", é exibido um modal ou diálogo solicitando confirmação.
5. O botão de **confirmação** está visível e funcional no modal.
6. Após a confirmação, o quiz é removido da lista exibida na interface.
7. A mensagem **"Quiz excluído com sucesso!"** é exibida após a exclusão.

#### 9.3 Critérios de Aceite

1. O educador consegue iniciar o processo de exclusão a partir do menu de configurações do quiz.
2. A exclusão só ocorre após uma confirmação explícita por parte do usuário.
3. O quiz não aparece mais na interface após a exclusão.
4. Uma mensagem de sucesso é exibida para confirmar a operação.
5. A interface permanece estável e sem erros após a exclusão do quiz.
