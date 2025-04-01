# Avaliação dos Riscos de Segurança e Privacidade

**Nome do consultor de segurança da equipe:** Luca Ferrari Azalim

---

**1. Quais partes do projeto requerem modelos de ameaças antes da liberação?**

- **Cadastro e login de educador (RF1, RNF5 e RNF6):** Criação de conta e login por parte do educador usando conta Google.
- **Acesso a partidas (RF9, RF10 e RF11):** Participação anônima de estudantes nos quizzes, informando apenas um apelido.

**Observação:** por orientação dos professores, o login de educador é tratado como requisito não-funcional.

---

**2. Quais partes do projeto requerem revisões do design de segurança antes da liberação?**

---

**3. Quais partes do projeto exigirão um teste de penetração por um grupo externo à equipe?**

- **Back-end (API RESTful e Server Actions):** Testes externos para rotas críticas de autenticação, quizzes e sessões.
- **Interface do Educador (Next.js Web):** Verificar exposição de dados sensíveis, _XSS_ e _CSRF_.
- **Sistema de WebSocket e mensageria:** Validar resistência contra _man-in-the-middle_ e _spoofing_.

---

**4. Existem outros requisitos de teste ou análise considerados necessários pelo consultor de segurança?**

- **Revisão de código com foco em segurança (Secure Code Review)** para backend.
- **Testes automatizados de segurança (ex: OWASP ZAP, Snyk)** na pipeline CI/CD.
- **Validação de permissões** para impedir acesso indevido a dados de educadores.
- **Auditoria de dependências** (Next.js, Flutter, IA, RabbitMQ) para mitigar vulnerabilidades conhecidas.

---

**5. Qual é o escopo específico dos requisitos de teste de fuzzing?**

- **Endpoints de API REST e Server Actions:** Testar a robustez por meio do envio de dados malformados ou inválidos.
- **Inputs Web e Mobile:** Avaliar a resistência da aplicação ao receber entradas inesperadas ou malformadas.

---

**6. Qual é a Classificação de impacto de privacidade?**

**P1 – Risco de privacidade alto**

- A plataforma **armazena dados pessoais** dos educadores (e-mail e ID da conta Google).
- **Sessões persistentes** em banco de dados (RNF5).
- Estudantes utilizam **apelidos anônimos**, mas respostas são armazenadas e associadas a partidas específicas.
- Entrada de dados para IA pode conter informações sensíveis.
