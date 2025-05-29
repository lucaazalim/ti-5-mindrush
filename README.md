# MindRush

![Alt text](/docs/assets/header.png)

MindRush é uma plataforma de aprendizado baseada em gamificação que visa facilitar e dinamizar o processo de ensino-aprendizagem por meio de quizzes interativos. A solução permite que educadores criem e apliquem quizzes personalizados em tempo real, enquanto os alunos participam de forma síncrona e recebem feedback imediato sobre seu desempenho. Inspirado na plataforma Kahoot!, a ferramenta busca aprimorar a experiência de aprendizado, oferecendo funcionalidades como rankings dinâmicos, geração de quizzes por meio IA generativa e um ambiente interativo que aumenta o engajamento dos estudantes.

## Integrantes

- Arthur Ferreira Costa
- Fernando Antônio Ferreira Ibrahim
- Jhonata Silveira Dias
- Luca Ferrari Azalim
- Pedro Henrique Braga de Castro
- Wanessa Dias Costa

## Orientadores

- Cleiton Silva Tavares
- Cristiano de Macêdo Neto
- Hugo Bastos de Paula

---

## Instruções de utilização

### Projeto Web (Next.js) — `/code/web`

#### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/)

#### Passos para rodar o projeto localmente

1. **Acesse a pasta do projeto web**

```bash
cd code/web
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` baseado no arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com os valores apropriados para o seu ambiente local.

4. **Execute o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar a aplicação em execução.

---

### Aplicativo Mobile (Flutter) — `/code/app`

#### Pré-requisitos

- [Flutter SDK](https://flutter.dev/docs/get-started/install)
- Um emulador Android/iOS ou dispositivo físico configurado

#### Passos para rodar o aplicativo localmente

1. **Acesse a pasta do aplicativo Flutter**

```bash
cd code/app
```

2. **Instale as dependências**

```bash
flutter pub get
```

3. **Execute o aplicativo**

Com um dispositivo/emulador conectado:

```bash
flutter run
```
