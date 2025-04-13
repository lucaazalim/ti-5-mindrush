class RegisterParticipant {
  final String nickname;

  RegisterParticipant({required this.nickname});

  factory RegisterParticipant.fromJson(Map<String, dynamic> json) {
    return RegisterParticipant(
      nickname: json['nickname'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nickname': nickname,
    };
  }
}