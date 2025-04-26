import 'package:flutter_riverpod/flutter_riverpod.dart';

import './pusher-service-params.dart';
import './pusher_service.dart';

final pusherServiceProvider = Provider.family<PusherService, PusherServiceParams>((ref, params) {
  final service = PusherService(
    apiKey: params.apiKey,
    cluster: params.cluster,
    channelName: params.channelName,
    authEndpoint: params.authEndpoint,
    userToken: params.userToken,
  );

  service.connect();

  return service;
});