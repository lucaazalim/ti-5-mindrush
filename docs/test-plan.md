# Test Plan - MindRush

## Introdução

Este documento detalha o plano de testes das funcionalidades principais do sistema MindRush. Para cada funcionalidade prioritária, está descrito o comportamento esperado, as verificações a serem realizadas e os critérios de aceite.

## Arquitetura

A arquitetura do sistema MindRush está descrita no [documento principal da documentação](README.md#4-modelagem-e-projeto-arquitetural).

## Casos de Teste

### 1. Educador autentica-se

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

### 4. Educador exclui quiz

#### 4.1 Comportamento Esperado

1. O educador acessa a página `/dashboard/quizzes`, onde são listados seus quizzes.
2. Ao localizar o quiz desejado, o educador clica no ícone de **configurações** correspondente.
3. No menu que se abre, o educador clica em **"Excluir"**.
4. Um modal ou diálogo de confirmação é exibido, solicitando que o educador confirme a exclusão.
5. Ao clicar em **"Confirmar"**, o quiz é excluído permanentemente do sistema.
6. O quiz removido deixa de aparecer na lista da página `/dashboard/quizzes`.
7. Uma **mensagem de sucesso** (ex: “Quiz excluído com sucesso!”) é exibida ao usuário.

#### 4.2 Verificações

1. A página `/dashboard/quizzes` exibe corretamente todos os quizzes do educador.
2. O ícone de configurações está visível e funcional para cada quiz listado.
3. O botão **"Excluir"** está presente e funcional no menu de configurações.
4. Ao clicar em "Excluir", é exibido um modal ou diálogo solicitando confirmação.
5. O botão de **confirmação** está visível e funcional no modal.
6. Após a confirmação, o quiz é removido da lista exibida na interface.
7. A mensagem **"Quiz excluído com sucesso!"** é exibida após a exclusão.

#### 4.3 Critérios de Aceite

1. O educador consegue iniciar o processo de exclusão a partir do menu de configurações do quiz.
2. A exclusão só ocorre após uma confirmação explícita por parte do usuário.
3. O quiz não aparece mais na interface após a exclusão.
4. Uma mensagem de sucesso é exibida para confirmar a operação.
5. A interface permanece estável e sem erros após a exclusão do quiz.

---

### 5. Educador cria partida

#### 5.1 Comportamento Esperado

1. O educador acessa a página `/dashboard/quizzes`, onde são listados seus quizzes.
2. Em um dos quizzes listados, o educador clica no botão ou opção **"Criar partida"**.
3. O sistema deve criar uma nova instância de partida associada ao quiz selecionado.
4. O educador deve ser redirecionado automaticamente para a página da nova partida, por exemplo: `/dashboard/games/[ID da partida]`.
5. A nova partida deve estar em estado inicial (ainda não iniciada), pronta para ser configurada ou iniciada.
6. Uma **mensagem de sucesso** (ex: “Partida criada com sucesso!”) pode ser exibida ao educador.

#### 5.2 Verificações

1. A página `/dashboard/quizzes` exibe corretamente a lista de quizzes.
2. A opção **"Criar partida"** está visível e funcional para cada quiz.
3. Ao clicar em "Criar partida", o redirecionamento para a página da nova partida ocorre sem erros.
4. A nova partida está vinculada corretamente ao quiz selecionado.
5. A interface da página da partida reflete o estado inicial esperado.
6. Uma mensagem de sucesso é exibida após a criação.

#### 5.3 Critérios de Aceite

1. A opção de criar uma nova partida está acessível a partir da lista de quizzes.
2. A criação da partida ocorre de forma fluida e sem erros.
3. O educador é redirecionado corretamente para a interface da nova partida.
4. A nova partida está associada ao quiz correto e pronta para ser iniciada.
5. O sistema exibe uma mensagem clara de confirmação da criação da partida.

---

### 6. Participante acessa partida

#### 6.1 Comportamento Esperado

1. O participante abre o aplicativo mobile do MindRush.
2. Na tela inicial, o participante informa o **PIN da partida** fornecido pelo educador.
3. O sistema verifica a validade do PIN e, se for válido, redireciona o participante para a próxima tela.
4. O participante informa um **nickname** que será usado durante a partida.
5. Após confirmar, o participante entra na sala de espera e aguarda o início da partida.
6. O nickname informado deve aparecer na interface web do educador, indicando que o participante está conectado.
7. O participante deve visualizar uma tela de "Aguardando o início da partida".

#### 6.2 Verificações

1. O aplicativo mobile está funcional e acessível ao participante.
2. O campo para inserir o PIN está visível na tela inicial do app.
3. O sistema valida corretamente o PIN e impede o acesso se ele for inválido.
4. O campo de nickname é exibido somente após o PIN válido.
5. É possível inserir e confirmar o nickname.
6. O nickname do participante aparece na tela web do educador (por exemplo, na interface da partida em `/dashboard/games/[ID]`).
7. A interface do participante exibe o estado de "Aguardando início".

#### 6.3 Critérios de Aceite

1. O participante consegue acessar o app, informar o PIN e escolher um nickname.
2. O sistema valida o PIN corretamente e direciona o participante para a tela adequada.
3. O nickname do participante é exibido na interface do educador.
4. O participante visualiza claramente que está aguardando o início da partida.
5. O fluxo não apresenta erros de interface ou falhas de comunicação entre cliente e servidor.

---

### 7. Educador inicia partida

#### 7.1 Comportamento Esperado

1. Após criar uma partida, o educador é redirecionado para a página da partida em `/dashboard/games/[ID da partida]`.
2. Na interface da partida, o educador visualiza os participantes conectados e a opção **"Iniciar partida"**.
3. Ao clicar no botão **"Iniciar partida"**, o sistema deve:
   - Mudar o estado da partida para "em andamento"
   - Exibir a **primeira pergunta** do quiz na tela do educador e dos participantes
   - Impedir novos participantes de ingressarem na partida
4. A tela do educador passa a exibir as alternativas e o tempo restante.

#### 7.2 Verificações

1. A página da partida é carregada corretamente após a criação da partida.
2. O botão **"Iniciar partida"** está visível e funcional na interface do educador.
3. O clique no botão dispara a transição do estado da partida de "aguardando" para "em andamento".
4. A primeira questão do quiz é exibida corretamente tanto para o educador quanto para os participantes.
5. Participantes que tentam acessar a partida após seu início são impedidos de entrar (mensagem de erro).
6. O educador visualiza o andamento da questão, com opções e tempo visíveis.

#### 7.3 Critérios de Aceite

1. O educador consegue iniciar a partida.
2. A primeira questão do quiz é exibida imediatamente após o início.
3. O sistema bloqueia o acesso de novos participantes após o início da partida.
4. A experiência visual tanto para o educador quanto para os participantes é clara e responsiva.

---

### 8. Educador encerra partida

#### 8.1 Comportamento Esperado

1. O educador acessa a página da partida em `/dashboard/games/[ID da partida]`, onde pode visualizar o estado atual da partida (aguardando ou em andamento).
2. A opção **"Encerrar partida"** está visível na interface do educador.
3. Se a partida **não estiver na última questão**, ao clicar em **"Encerrar partida"**, o sistema exibe um **modal de confirmação** informando que a partida será finalizada antecipadamente.
4. Caso o educador confirme, o sistema encerra a partida imediatamente.
5. Se a partida **estiver na última questão**, o encerramento pode ocorrer diretamente sem exibição do modal.
6. Após o encerramento:
   - A tela do educador é atualizada com os resultados finais da partida.
   - A interface dos participantes exibe que a partida foi encerrada.
7. A partida é marcada como **encerrada** no banco de dados e torna-se acessível apenas para visualização posterior.

#### 8.2 Verificações

1. O botão **"Encerrar partida"** está visível na interface da partida.
2. Ao clicar no botão, o comportamento varia de acordo com o progresso da partida:
   - Modal de confirmação é exibido se a partida não estiver na última questão.
   - Encerramento direto ocorre se estiver na última questão.
3. O modal de confirmação exibe uma mensagem clara e o botão de confirmação funciona corretamente.
4. Após a confirmação, a interface do educador exibe os resultados.
5. A interface dos participantes exibe uma tela informando que a partida foi encerrada.

#### 8.3 Critérios de Aceite

1. O educador consegue encerrar uma partida manualmente em qualquer momento.
2. O sistema exibe um modal de confirmação quando a partida não estiver na última questão.
3. A ação de encerramento é processada corretamente e de forma estável.
4. As interfaces do educador e dos participantes refletem o término da partida.
5. A experiência é clara, previsível e livre de erros visuais ou funcionais.

---

### 9. Educador visualiza histórico de partidas

#### 9.1 Comportamento Esperado

1. O educador acessa a página `/dashboard/quizzes`, onde estão listados seus quizzes.
2. Para cada quiz listado, há a opção **"Histórico de Partidas"** disponível.
3. Ao clicar em **"Histórico de Partidas"**, o educador é redirecionado para uma página (ou modal) que exibe uma **tabela** contendo as partidas já realizadas com aquele quiz.
4. Cada linha da tabela corresponde a uma partida finalizada.
5. Em cada linha da tabela, há um **ícone de olho** que permite visualizar o resultado da respectiva partida.
6. Ao clicar no ícone, o educador é redirecionado para a página de relatório final da partida selecionada.

#### 9.2 Verificações

1. A opção **"Histórico de Partidas"** está visível e funcional na página `/dashboard/quizzes` para quizzes com partidas realizadas.
2. A tabela de histórico é exibida corretamente ao clicar na opção.
3. Apenas partidas finalizadas são exibidas na tabela.
4. O ícone de olho está presente e funcional em cada linha da tabela.
5. O clique no ícone redireciona corretamente para a página de resultados da partida.
6. Os dados exibidos na página de resultado são consistentes com a execução da partida.

#### 9.3 Critérios de Aceite

1. O educador consegue visualizar o histórico de partidas associadas a um quiz.
2. A navegação entre a lista de quizzes, o histórico e o resultado da partida funciona sem erros.
3. O ícone de olho permite acessar corretamente os relatórios de partidas finalizadas.
4. A funcionalidade apresenta uma experiência clara e livre de inconsistências.

---

## Estratégia de Teste

Para cada funcionalidade, serão escolhidas uma ou mais estratégias de teste das listadas abaixo.

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
