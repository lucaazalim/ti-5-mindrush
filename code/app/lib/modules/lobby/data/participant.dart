class Participant {
  final String id;
  final String nickname;
  final int? totalPoints;
  final int? lastPointIncrement;
  final String matchId;
  final String token;
  final String? avatarUrl;

  Participant({
    required this.id,
    required this.nickname,
    this.totalPoints,
    this.lastPointIncrement,
    required this.matchId,
    required this.token,
    this.avatarUrl
  });

  factory Participant.fromJson(Map<String, dynamic> json) {
    print('JSON recebido no fromJson: $json'); // 👈 Adicione isto

    return Participant(
      id: json['id'],
      nickname: json['nickname'],
      totalPoints: json['totalPoints'],
      lastPointIncrement: json['lastPointIncrement'] != null ? json['lastPointIncrement'] : 0,
      matchId: json['matchId'],
      token: json['token'] ?? '',
      avatarUrl : json['avatarUrl'] ?? ''
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nickname': nickname,
      'totalPoints': totalPoints,
      'lastPointIncrement': lastPointIncrement,
      'matchId': matchId,
      'token': token,
      'avatarUrl': avatarUrl
    };
  }
}