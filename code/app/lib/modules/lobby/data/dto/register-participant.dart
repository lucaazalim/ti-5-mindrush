class RegisterParticipant {
  final String nickname;

  RegisterParticipant({required this.nickname});

  Map<String, dynamic> toJson() {
    return {
      'nickname': nickname,
    };
  }
}