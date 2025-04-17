import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mindrush/modules/match/logic/pusher_service.dart';

final pusherServiceProvider = ChangeNotifierProvider<PusherService>((ref) {
  return PusherService(
    apiKey: 'SUA_API_KEY',
    cluster: 'SUA_CLUSTER',
    channelName: 'SEU_CANAL',
  );
});