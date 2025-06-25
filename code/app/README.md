# MindRush - Aplicativo Flutter

O **MindRush** é um aplicativo móvel desenvolvido em Flutter que oferece uma experiência interativa de jogos e quizzes educativos para estudantes.

## 📱 Funcionalidades

- Interface interativa para jogos e quizzes
- Scanner QR Code integrado
- Reprodução de áudio para feedback
- Integração com Pusher para comunicação em tempo real
- Suporte a múltiplas plataformas (iOS, Android, Web, Desktop)

## 🛠️ Tecnologias Utilizadas

- **Flutter**: Framework de desenvolvimento multiplataforma
- **Dart**: Linguagem de programação
- **Riverpod**: Gerenciamento de estado
- **Dio**: Cliente HTTP para requisições à API
- **Pusher Channels**: Comunicação em tempo real
- **Mobile Scanner**: Funcionalidade de QR Code
- **AudioPlayers**: Reprodução de áudio

## 📋 Pré-requisitos

Antes de rodar o aplicativo, certifique-se de ter instalado:

- [Flutter SDK](https://flutter.dev/docs/get-started/install) (versão 3.7.2 ou superior)
- [Dart SDK](https://dart.dev/get-dart) (incluído com Flutter)
- Editor de código (recomendado: [VS Code](https://code.visualstudio.com/) ou [Android Studio](https://developer.android.com/studio))

### Para desenvolvimento Android

- [Android Studio](https://developer.android.com/studio)
- Android SDK
- Emulador Android ou dispositivo físico

### Para desenvolvimento iOS (apenas macOS)

- [Xcode](https://developer.apple.com/xcode/)
- Simulador iOS ou dispositivo físico

## 🚀 Como Rodar o Aplicativo

### 1. Clone o repositório e navegue até o diretório do app

```bash
cd code/app
```

### 2. Instale as dependências

```bash
flutter pub get
```

### 3. Configure as variáveis de ambiente

O aplicativo utiliza um arquivo `.env` localizado em `assets/.env`. As variáveis de ambiente já estão configuradas:

- `API_KEY`: Chave da API do Pusher
- `CLUSTER`: Cluster do Pusher (sa1)
- `API_URL`: URL da API backend (<http://localhost:3000/api>)

⚠️ **Importante**: Certifique-se de que o backend esteja rodando na URL especificada antes de executar o aplicativo.

### 4. Verifique se tudo está configurado corretamente

```bash
flutter doctor
```

Este comando verificará se todas as dependências estão instaladas corretamente.

### 5. Execute o aplicativo

#### Para executar em modo de desenvolvimento

```bash
flutter run
```

#### Para executar em uma plataforma específica

```bash
# Android
flutter run -d android

# iOS (apenas macOS)
flutter run -d ios

# Web
flutter run -d web-server --web-port 8080

# Windows (apenas Windows)
flutter run -d windows

# macOS (apenas macOS)
flutter run -d macos

# Linux (apenas Linux)
flutter run -d linux
```

### 6. Para executar em modo release

```bash
flutter run --release
```

## 🔧 Comandos Úteis

### Listar dispositivos disponíveis

```bash
flutter devices
```

### Limpar cache e dependências

```bash
flutter clean
flutter pub get
```

### Executar testes

```bash
flutter test
```

### Analisar código

```bash
flutter analyze
```

### Formatar código

```bash
dart format .
```

## 🎯 Estrutura do Projeto

```text
lib/
├── main.dart           # Ponto de entrada do aplicativo
└── modules/           # Módulos organizados por funcionalidade

assets/
├── .env              # Variáveis de ambiente
├── images/           # Imagens do aplicativo
│   ├── logo.png
│   ├── circulo.png
│   ├── losango.png
│   ├── quadrado.png
│   ├── triangulo.png
│   └── default.jpg
└── sounds/           # Arquivos de áudio
    ├── click.mp3
    └── answered.mp3
```

## 📚 Recursos Adicionais

- [Documentação oficial do Flutter](https://flutter.dev/docs)
- [Cookbook Flutter](https://flutter.dev/docs/cookbook)
- [Documentação do Riverpod](https://riverpod.dev/)
- [Documentação do Dio](https://pub.dev/packages/dio)
