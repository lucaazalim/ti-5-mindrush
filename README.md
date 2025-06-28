# MindRush

![Alt text](/docs/assets/header.png)

MindRush is a gamification-based learning platform that aims to facilitate and streamline the teaching-learning process through interactive quizzes. The solution allows educators to create and apply personalized quizzes in real-time, while students participate synchronously and receive immediate feedback on their performance. Inspired by the Kahoot! platform, the tool seeks to enhance the learning experience by offering features such as dynamic rankings, quiz generation through generative AI, and an interactive environment that increases student engagement.

## Team Members

- Arthur Ferreira Costa
- Fernando Antônio Ferreira Ibrahim
- Jhonata Silveira Dias
- Luca Ferrari Azalim
- Pedro Henrique Braga de Castro
- Wanessa Dias Costa

## Advisors

- Cleiton Silva Tavares
- Cristiano de Macêdo Neto
- Hugo Bastos de Paula

---

## Usage Instructions

### Web Project (Next.js) — `/code/web`

#### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/)

#### Steps to run the project locally

1. **Access the web project folder**

```bash
cd code/web
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file based on the example file:

```bash
cp .env.example .env
```

Edit the `.env` file with the appropriate values for your local environment.

4. **Run the development server**

```bash
npm run dev
```

5. **Access the application**

Open [http://localhost:3000](http://localhost:3000) in your browser to view the running application.

---

### Mobile Application (Flutter) — `/code/app`

#### Prerequisites

- [Flutter SDK](https://flutter.dev/docs/get-started/install)
- An Android/iOS emulator or configured physical device

#### Steps to run the application locally

1. **Access the Flutter application folder**

```bash
cd code/app
```

2. **Install dependencies**

```bash
flutter pub get
```

3. **Run the application**

With a connected device/emulator:

```bash
flutter run
```
