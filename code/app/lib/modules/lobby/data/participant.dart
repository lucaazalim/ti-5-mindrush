class Participant {
  final String id;
  final String nickname;
  final int totalPoints;
  final String matchId;
  final String token;
  final String avatarUrl;

  Participant({
    required this.id,
    required this.nickname,
    required this.totalPoints,
    required this.matchId,
    required this.token,
    required this.avatarUrl
  });

  factory Participant.fromJson(Map<String, dynamic> json) {
    return Participant(
      id: json['id'],
      nickname: json['nickname'],
      totalPoints: json['totalPoints'],
      matchId: json['matchId'],
      token: json['token'],
      avatarUrl : json['avatarUrl']
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nickname': nickname,
      'totalPoints': totalPoints,
      'matchId': matchId,
      'token': token,
      'avatarUrl': avatarUrl
    };
  }
}