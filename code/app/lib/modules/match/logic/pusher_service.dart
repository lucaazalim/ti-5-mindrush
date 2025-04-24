import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:pusher_channels_flutter/pusher_channels_flutter.dart';

typedef PusherEventCallback = void Function(String eventName, dynamic data);

class PusherService extends ChangeNotifier {

  final String apiKey;
  final String cluster;
  final String channelName;
  final String authEndpoint;
  final String? userToken;

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


    pusher = PusherChannelsFlutter.getInstance();

    try {
      await pusher.init(
        apiKey: apiKey,
        cluster: cluster,
        onConnectionStateChange: onConnectionStateChange,
        onError: onError,
        onSubscriptionSucceeded: onSubscriptionSucceeded,
        onEvent: onEvent,
        onSubscriptionError: onSubscriptionError,
        onDecryptionFailure: onDecryptionFailure,
        onMemberAdded: onMemberAdded,
        onAuthorizer: onAuthorizer,
      );


      await pusher.subscribe(channelName: channelName);

      await pusher.connect();


    }catch(e){
      print("error in initialization: $e");
    }

  }

  dynamic onAuthorizer(String channelName, String socketId, dynamic options) async {

    var authUrl = authEndpoint;

    print("🔐 Iniciando autenticação Pusher...");
    print("📡 Enviando para endpoint: $authUrl");
    print("📡 Enviando para endpoint: $userToken");
    print("📨 Dados do body: socket_id=$socketId, channel_name=$channelName");

    final result = await http.post(
      Uri.parse(authUrl),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer $userToken',
      },
      body: 'socket_id=' + socketId + '&channel_name=' + channelName,
    );

    print("✅ Status da resposta: ${result.statusCode}");
    print("📦 Corpo da resposta: ${result.body}");

    var json = jsonDecode(result.body);
    return json;

  }

  void onError(String message, int? code, dynamic e) {
    print("onError: $message code: $code exception: $e");
  }

  void onConnectionStateChange(dynamic currentState, dynamic previousState) {
    print("Connection: $currentState");
  }

  void onMemberRemoved(String channelName, PusherMember member) {
    print("onMemberRemoved: $channelName member: $member");
  }

  void onMemberAdded(String channelName, PusherMember member) {
    print("onMemberAdded: $channelName member: $member");
  }

  void onSubscriptionSucceeded(String channelName, dynamic data) {
    print("onSubscriptionSucceeded: $channelName data: $data");
  }

  void onSubscriptionError(String message, dynamic e) {
    print("onSubscriptionError: $message Exception: $e");
  }

  void onEvent(PusherEvent event) {
    print("📡 Evento recebido:");
    print("📛 Nome do evento: ${event.eventName}");
    print("📝 Dados recebidos: ${event.data}");
  }

  void onDecryptionFailure(String event, String reason) {
    print("onDecryptionFailure: $event reason: $reason");
  }


  Future<void> disconnect() async {
    await pusher.unsubscribe(channelName: channelName);
    await pusher.disconnect();
    _isConnected = false;
    notifyListeners();
    _eventListeners.clear();
  }

}