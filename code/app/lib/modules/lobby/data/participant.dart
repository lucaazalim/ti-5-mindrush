class Participant {
  final String id;
  final String nickname;
  final int totalPoints;
  final String matchId;
  final String token;

  Participant({
    required this.id,
    required this.nickname,
    required this.totalPoints,
    required this.matchId,
    required this.token
  });

  factory Participant.fromJson(Map<String, dynamic> json) {
    return Participant(
      id: json['id'],
      nickname: json['nickname'],
      totalPoints: json['total_points'],
      matchId: json['matchId'],
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nickname': nickname,
      'total_points': totalPoints,
      'matchId': matchId,
      'token': token
    };
  }
}