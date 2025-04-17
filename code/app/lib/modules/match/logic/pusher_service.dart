import 'package:flutter/foundation.dart';
import 'package:pusher_channels_flutter/pusher_channels_flutter.dart';

typedef PusherEventCallback = void Function(String eventName, dynamic data);

class PusherService extends ChangeNotifier {
  final String apiKey;
  final String cluster;
  final String channelName;

  final PusherChannelsFlutter _pusher = PusherChannelsFlutter.getInstance();

  bool _isConnected = false;
  bool get isConnected => _isConnected;

  final Map<String, List<PusherEventCallback>> _eventListeners = {};

  PusherService({
    required this.apiKey,
    required this.cluster,
    required this.channelName,
  });

  /// Conecta e começa a escutar eventos
  Future<void> connect() async {
    try {
      await _pusher.init(
        apiKey: apiKey,
        cluster: cluster,
        onConnectionStateChange: (currentState, previousState) {
          debugPrint("📶 Estado: $previousState ➡️ $currentState");
        },
        onError: (message, code, exception) {
          debugPrint("❌ Erro: $message");
        },
      );

      await _pusher.connect();
      _isConnected = true;
      notifyListeners(); // 🟢 Notifica a UI

      await _pusher.subscribe(
        channelName: channelName,
        onEvent: (event) {
          if (event != null && event.eventName != null) {
            final name = event.eventName!;
            debugPrint("📩 Evento recebido: $name");

            if (_eventListeners.containsKey(name)) {
              for (var callback in _eventListeners[name]!) {
                callback(name, event.data);
              }
            }
          }
        },
      );
    } catch (e) {
      debugPrint("❗ Falha ao conectar: $e");
    }
  }

  /// Adiciona um callback para um evento específico
  void addEventListener(String eventName, PusherEventCallback callback) {
    if (_eventListeners[eventName] == null) {
      _eventListeners[eventName] = [];
    }
    _eventListeners[eventName]!.add(callback);
  }

  /// Remove um listener específico
  void removeEventListener(String eventName, PusherEventCallback callback) {
    _eventListeners[eventName]?.remove(callback);
  }

  Future<void> disconnect() async {
    await _pusher.unsubscribe(channelName: channelName);
    await _pusher.disconnect();
    _isConnected = false;
    notifyListeners(); // 🔴 Notifica a UI
    _eventListeners.clear();
  }
}