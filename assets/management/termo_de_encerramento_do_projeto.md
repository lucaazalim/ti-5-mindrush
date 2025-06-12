# Termo de Encerramento do Projeto: MindRush

**Data:** 11 de junho de 2025

**Componentes da Equipe:**

- Arthur Ferreira Costa
- Fernando Antônio Ferreira Ibrahim
- Jhonata Silveira Dias
- Luca Ferrari Azalim
- Pedro Henrique Braga de Castro
- Wanessa Dias Costa

**Orientadores:**

- Cleiton Silva Tavares
- Cristiano de Macêdo Neto
- Hugo Bastos de Paula

---

## Objetivo do projeto

Desenvolver uma plataforma digital que permita a educadores a criação e aplicação em tempo real de quizzes personalizados.

## Resumo do projeto

O MindRush é uma plataforma de quizzes gamificados desenvolvida para transformar o processo de ensino-aprendizagem, proporcionando uma experiência interativa e engajadora para educadores e estudantes. A solução foi inspirada em plataformas como Kahoot!, mas com funcionalidades aprimoradas e foco na experiência brasileira.

O projeto foi desenvolvido seguindo uma arquitetura moderna de software, com uma aplicação web construída em Next.js/React para educadores e um aplicativo móvel em Flutter para estudantes. A plataforma permite que educadores criem quizzes personalizados manualmente ou através de inteligência artificial generativa, gerenciem partidas em tempo real, e acompanhem o progresso dos estudantes através de rankings dinâmicos e feedback instantâneo.

A comunicação em tempo real é garantida através do Pusher, permitindo interações síncronas entre educadores e estudantes durante as partidas. O sistema de pontuação gamificado incentiva a participação ativa dos estudantes, promovendo um ambiente de aprendizado colaborativo e competitivo.

## Artefatos entregues

### 1. Aplicação Web (Plataforma do Educador)

- Interface responsiva desenvolvida em Next.js/React com TypeScript
- Sistema de autenticação integrado com Google OAuth
- Dashboard para gerenciamento completo de quizzes (criação, edição, exclusão)
- Funcionalidade de geração automática de quizzes via IA generativa (OpenAI)
- Interface de controle de partidas em tempo real
- Sistema de visualização de rankings e resultados
- Histórico de partidas realizadas

### 2. Aplicativo Móvel (Plataforma do Estudante)

- Aplicativo híbrido desenvolvido em Flutter para iOS e Android
- Interface otimizada para resposta rápida a questionários
- Sistema de entrada via PIN ou QR Code
- Visualização de rankings em tempo real
- Feedback instantâneo sobre desempenho

### 3. Infraestrutura e Backend

- API RESTful robusta com Next.js Server Actions
- Banco de dados PostgreSQL com esquemas otimizados
- Sistema de mensageria em tempo real via Pusher
- ORM Drizzle para gerenciamento de dados
- Sistema de autenticação e autorização seguro

### 4. Arquitetura e Documentação

- Documento de arquitetura completo seguindo padrões de mercado
- Plano de testes abrangente com casos de uso detalhados
- Documentação técnica de APIs e componentes
- Guias de instalação e configuração
- Wireframes e especificações de design

### 5. Testes e Qualidade

- Suíte de testes unitários com Jest
- Testes de integração end-to-end com Playwright
- Testes de performance e carga (simulação de 60 usuários simultâneos)
- Validação de requisitos funcionais e não-funcionais

### 6. Artefatos Gerenciais

- Termo de Abertura de Projeto
- Declaração de Escopo do Projeto
- EAP
- Registro das Partes Interessadas
- Atas de Reunião

## Conclusões

O projeto MindRush foi concluído com sucesso, atendendo plenamente aos objetivos estabelecidos no início do desenvolvimento. A plataforma desenvolvida oferece uma solução completa e inovadora para a gamificação do processo de ensino-aprendizagem, permitindo que educadores criem experiências interativas e engajadoras para seus estudantes.

### Resultados Obtidos

- **Objetivo principal alcançado:** A plataforma digital foi desenvolvida com sucesso, permitindo criação e aplicação de quizzes em tempo real
- **Plataforma web funcional:** Interface completa para educadores com todas as funcionalidades planejadas implementadas
- **Aplicativo móvel operacional:** Aplicação móvel responsiva para estudantes com experiência otimizada
- **Integração bem-sucedida:** Comunicação eficiente entre as plataformas através de APIs e mensageria em tempo real
- **Performance validada:** Sistema testado com carga de 60 usuários simultâneos mantendo tempos de resposta abaixo de 500ms

### Principais Contribuições

1. **Inovação educacional:** Desenvolvimento de uma alternativa nacional ao Kahoot! adaptada ao contexto brasileiro
2. **Tecnologia moderna:** Aplicação de tecnologias atuais como Next.js, Flutter, e IA generativa em contexto educacional
3. **Experiência de usuário:** Criação de interfaces intuitivas que facilitam a adoção por educadores e estudantes
4. **Escalabilidade:** Arquitetura preparada para crescimento e expansão futura

### Lições Aprendidas

1. **Importância da comunicação eficaz:** A comunicação clara e constante entre os membros da equipe foi fundamental para o sucesso do projeto. Reuniões regulares e uso de ferramentas colaborativas evitaram conflitos de desenvolvimento e garantiram alinhamento dos objetivos.

2. **Planejamento de arquitetura desde o início:** Investir tempo no design da arquitetura no início do projeto economizou significativamente tempo de desenvolvimento posterior. A definição clara da estrutura de dados e APIs facilitou o desenvolvimento paralelo das diferentes plataformas.

3. **Testes automatizados como garantia de qualidade:** A implementação de testes unitários, de integração e performance desde o início do desenvolvimento mostrou-se essencial para manter a confiabilidade do sistema e facilitar refatorações futuras.

4. **Gestão de dependências e integrações externas:** Trabalhar com serviços externos (Pusher, OpenAI, Google OAuth) requer planejamento cuidadoso para lidar com limitações de API, custos e possíveis indisponibilidades. Ter planos de contingência é crucial.

5. **Desenvolvimento mobile vs web:** As diferenças entre desenvolvimento web e mobile exigem abordagens distintas para UX/UI. O Flutter mostrou-se eficiente para desenvolvimento híbrido, mas requer atenção especial para performance em dispositivos com recursos limitados.

6. **Importância dos testes de performance:** Os testes de carga revelaram gargalos que não eram aparentes durante o desenvolvimento, demonstrando a importância de validar performance com cargas realistas desde o início do projeto.

7. **Versionamento e documentação contínua:** Manter documentação atualizada e versionamento adequado facilitou significativamente a manutenção do código e a integração de novos membros ao projeto.

8. **Flexibilidade no escopo:** Algumas funcionalidades tiveram que ser adaptadas durante o desenvolvimento devido a limitações técnicas ou mudanças de requisitos. Manter flexibilidade sem comprometer os objetivos principais foi um aprendizado valioso.
