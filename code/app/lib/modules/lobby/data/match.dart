class Match {
  final String id;
  final String quizId;
  final String pin;
  final String state;
  final DateTime createdAt;

  Match({
    required this.id,
    required this.quizId,
    required this.pin,
    required this.state,
    required this.createdAt,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      id: json['id'],
      quizId: json['quizId'],
      pin: json['pin'],
      state: json['state'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'quizId': quizId,
      'pin': pin,
      'state': state,
      'createdAt': createdAt.toIso8601String(),
    };
  }

}