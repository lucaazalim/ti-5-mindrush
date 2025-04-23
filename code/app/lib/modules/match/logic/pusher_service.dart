import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:pusher_channels_flutter/pusher_channels_flutter.dart';

typedef PusherEventCallback = void Function(String eventName, dynamic data);

class PusherService extends ChangeNotifier {
  final String apiKey;
  final String cluster;
  final String channelName;
  final String authEndpoint;
  final String? userToken; // Pode ser nulo se não estiver autenticado

  PusherChannelsFlutter pusher = PusherChannelsFlutter.getInstance();

  bool _isConnected = false;
  bool get isConnected => _isConnected;

  final Map<String, List<PusherEventCallback>> _eventListeners = {};

  PusherService({
    required this.apiKey,
    required this.cluster,
    required this.channelName,
    required this.authEndpoint,
    this.userToken,
  });

  Future<void> connect() async {
    try {
      await pusher.init(
        apiKey: apiKey,
        cluster: cluster,
        authEndpoint: authEndpoint,
        onConnectionStateChange: (currentState, previousState) {
          debugPrint("📶 Estado: $previousState ➡️ $currentState");
        },
        onError: (message, code, exception) {
          debugPrint("❌ Erro: $message");
        },
        onAuthorizer: (channelName, socketId, options) async {
          final response = await http.post(
            Uri.parse(authEndpoint),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              if (userToken != null) 'Authorization': 'Bearer $userToken',
            },
            body: {
              'socket_id': socketId,
              'channel_name': channelName,
            },
          );

          if (response.statusCode == 200) {
            return response.body;
          } else {
            debugPrint("❗ Erro ao autenticar: ${response.body}");
            throw Exception("Autenticação Pusher falhou");
          }
        },
      );

      await pusher.connect();
      _isConnected = true;
      notifyListeners();

      await pusher.subscribe(
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
      debugPrint("❗ Falha ao conectar com autenticação: $e");
    }
  }

  void addEventListener(String eventName, PusherEventCallback callback) {
    if (_eventListeners[eventName] == null) {
      _eventListeners[eventName] = [];
    }
    _eventListeners[eventName]!.add(callback);
  }

  void removeEventListener(String eventName, PusherEventCallback callback) {
    _eventListeners[eventName]?.remove(callback);
  }

  Future<void> disconnect() async {
    await pusher.unsubscribe(channelName: channelName);
    await pusher.disconnect();
    _isConnected = false;
    notifyListeners();
    _eventListeners.clear();
  }
}