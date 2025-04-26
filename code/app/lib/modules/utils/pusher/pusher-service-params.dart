import 'package:equatable/equatable.dart';

class PusherServiceParams extends Equatable {
  final String apiKey;
  final String cluster;
  final String channelName;
  final String authEndpoint;
  final String? userToken;

  const PusherServiceParams({
    required this.apiKey,
    required this.cluster,
    required this.channelName,
    required this.authEndpoint,
    this.userToken,
  });

  @override
  List<Object?> get props => [apiKey, cluster, channelName, authEndpoint, userToken];
}