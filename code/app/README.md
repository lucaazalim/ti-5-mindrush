# MindRush - Flutter Application

**MindRush** is a mobile application developed in Flutter that offers an interactive experience of educational games and quizzes for students.

## 📱 Features

- Interactive interface for games and quizzes
- Integrated QR Code scanner
- Audio playback for feedback
- Pusher integration for real-time communication
- Multi-platform support (iOS, Android, Web, Desktop)

## 🛠️ Technologies Used

- **Flutter**: Multi-platform development framework
- **Dart**: Programming language
- **Riverpod**: State management
- **Dio**: HTTP client for API requests
- **Pusher Channels**: Real-time communication
- **Mobile Scanner**: QR Code functionality
- **AudioPlayers**: Audio playback

## 📋 Prerequisites

Before running the application, make sure you have installed:

- [Flutter SDK](https://flutter.dev/docs/get-started/install) (version 3.7.2 or higher)
- [Dart SDK](https://dart.dev/get-dart) (included with Flutter)
- Code editor (recommended: [VS Code](https://code.visualstudio.com/) or [Android Studio](https://developer.android.com/studio))

### For Android development

- [Android Studio](https://developer.android.com/studio)
- Android SDK
- Android emulator or physical device

### For iOS development (macOS only)

- [Xcode](https://developer.apple.com/xcode/)
- iOS Simulator or physical device

## 🚀 How to Run the Application

### 1. Clone the repository and navigate to the app directory

```bash
cd code/app
```

### 2. Install dependencies

```bash
flutter pub get
```

### 3. Configure environment variables

The application uses an `.env` file located in `assets/.env`. The environment variables are already configured:

- `API_KEY`: Pusher API key
- `CLUSTER`: Pusher cluster (sa1)
- `API_URL`: Backend API URL (<http://localhost:3000/api>)

⚠️ **Important**: Make sure the backend is running at the specified URL before running the application.

### 4. Check if everything is set up correctly

```bash
flutter doctor
```

This command will check if all dependencies are installed correctly.

### 5. Run the application

#### To run in development mode

```bash
flutter run
```

#### To run on a specific platform

```bash
# Android
flutter run -d android

# iOS (macOS only)
flutter run -d ios

# Web
flutter run -d web-server --web-port 8080

# Windows (Windows only)
flutter run -d windows

# macOS (macOS only)
flutter run -d macos

# Linux (Linux only)
flutter run -d linux
```

### 6. To run in release mode

```bash
flutter run --release
```

## 🔧 Useful Commands

### List available devices

```bash
flutter devices
```

### Clear cache and dependencies

```bash
flutter clean
flutter pub get
```

### Run tests

```bash
flutter test
```

### Analyze code

```bash
flutter analyze
```

### Format code

```bash
dart format .
```

## 🎯 Project Structure

```text
lib/
├── main.dart           # Entry point of the application
└── modules/           # Modules organized by functionality

assets/
├── .env              # Environment variables
├── images/           # Application images
│   ├── logo.png
│   ├── circulo.png
│   ├── losango.png
│   ├── quadrado.png
│   ├── triangulo.png
│   └── default.jpg
└── sounds/           # Audio files
    ├── click.mp3
    └── answered.mp3
```

## 📚 Additional Resources

- [Official Flutter Documentation](https://flutter.dev/docs)
- [Flutter Cookbook](https://flutter.dev/docs/cookbook)
- [Riverpod Documentation](https://riverpod.dev/)
- [Dio Documentation](https://pub.dev/packages/dio)
