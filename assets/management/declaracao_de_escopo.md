# Declaração de Escopo

| **Campo**                        | **Detalhes**                                                                                                                                     |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| **Projeto**                       | Mind*Rush*                                                                                                                                      |
| **Gerente do Projeto**            | Luca Ferrari Azalim                                                                                                                            |
| **Objetivo do Projeto**           | Desenvolver uma plataforma digital que permita aos educadores a criação e aplicação em tempo real de quizzes personalizados.                    |

## Escopo do Projeto/Produto

### Etapas do Ciclo de Vida e Objetivos

1. **Planejamento**  
   - Definição dos requisitos funcionais e não funcionais.
   - Estruturação da equipe e distribuição das tarefas.

2. **Design e Prototipagem**  
   - Criação de wireframes e protótipos da interface da plataforma.
   - Validação das propostas junto aos stakeholders.

3. **Desenvolvimento**  
   - Integração com banco de dados e servidores de autenticação.
   - Implementação das funcionalidades essenciais tanto na web quanto no mobile: criação de quizzes, participação em quizzes síncronos, feedback instantâneo e painel de gerenciamento de quizzes.
   - Criação de WebSockets, RabbitMQ e serviços de mensageria.

4. **Testes e Validação**  
   - Implementação de testes unitários.
   - Ajustes com base no resultado.

5. **Implantação e Monitoramento**  
   - Publicação da plataforma para uso.
   - Monitoramento de desempenho e correção de eventuais falhas.

6. **Encerramento e Documentação**  
   - Elaboração da documentação final do produto.

### Limites do Projeto (O que Não Será Feito)

- O projeto não incluirá funcionalidades para provas formais ou questionários de múltipla escolha, como os oferecidos por ferramentas como o Google Forms.

### Restrições (O que Restringe/Condiciona o Projeto)

- **Capacidade da Plataforma**: A plataforma deve suportar até 60 alunos simultaneamente sem latência significativa.
- **Escopo Definido**: O projeto não incluirá funcionalidades para provas formais ou questionários convencionais como os do Google Forms.
- **Restrições Arquiteturais**:  
   - O sistema deve adotar um modelo baseado em web service.
   - Suporte a serviços tanto no ambiente web quanto no móvel.
   - As versões web e móvel devem ser desenvolvidas utilizando tecnologias distintas.
   - Inclusão de mecanismo de comunicação em tempo real (mensageria).
   - Utilização de serviços de computação em nuvem.
   - Hospedagem em uma plataforma de nuvem gratuita.
   - Estratégias de testes para garantir a qualidade do sistema.
   - Suporte a múltiplos clientes conectados simultaneamente a um único servidor, possibilitando operações concorrentes.

### Premissas (Condições para Iniciar o Projeto)

- Os stakeholders devem aceitar e assinar a proposta do projeto.
- Os alunos envolvidos no projeto precisam estar devidamente matriculados na disciplina de “Trabalho Interdisciplinar: Aplicações Distribuídas”.

## Marcos Agendados e Entregas

| **Id. do Marco** | **Entregáveis Previstos**                                                                                                                                              |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Sprint 01**    | Apresentação inicial do projeto, Artefato Lean Inception, Estruturação inicial do GitHub Project e distribuição de tarefas.                                              |
| **Sprint 02**    | Protótipo de interface da versão web, Protótipo de interface do aplicativo móvel, Ata de reunião de kickoff, Documento de Arquitetura de Software, Definição de mecanismos arquiteturais, Requisitos funcionais e não funcionais, Restrições arquiteturais, Sessões 1 a 4 do Documento de Arquitetura de Software, Termo de Abertura do Projeto (TAP). |
| **Sprint 03**    | Declaração de Escopo do Projeto, Estrutura Analítica do Projeto (EAP), Implementação de funcionalidades essenciais: O educador se cadastra no sistema, O educador gerencia os quizzes, O educador gerencia as questões dos quizzes, O educador gera uma partida a partir de um quiz, O estudante informa um código para acessar uma partida, O estudante informa um apelido que o identificará na partida. |
| **Sprint 04**    | Implementação de funcionalidades essenciais restantes: O estudante responde às questões da partida em tempo real, O estudante visualiza o ranque de pontuação da partida ao fim de cada questão, O estudante visualiza o ranque de pontuação final ao fim da partida, O educador inicia, pausa e encerra uma partida. |
| **Sprint 05**    | Plano de testes das funcionalidades prioritárias, Implementação de funcionalidades opcionais: O educador gera um quiz a partir de um tema qualquer usando IA generativa, O educador gera um quiz a partir de um documento PDF usando IA generativa, O estudante escaneia um código QR para acessar uma partida. |
| **Sprint 06**    | Apresentação final do projeto, Avaliação da arquitetura (*método ATAM*), Plano de testes das funcionalidades desejáveis, Relatório de encerramento do projeto, Vídeo de apresentação do projeto (*pitch*). |
