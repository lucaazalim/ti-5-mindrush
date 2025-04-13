class Participant {
  final String id;
  final String nickname;
  final int totalPoints;
  final String matchId;

  Participant({
    required this.id,
    required this.nickname,
    required this.totalPoints,
    required this.matchId,
  });

  factory Participant.fromJson(Map<String, dynamic> json) {
    return Participant(
      id: json['id'],
      nickname: json['nickname'],
      totalPoints: json['total_points'],
      matchId: json['matchId'],
    );
  }

}