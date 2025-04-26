class Alternative {
  final String id;
  final String answer;
  final String questionId;
  final int order ;

  Alternative({
    required this.id,
    required this.answer,
    required this.order,
    required this.questionId
  });

  factory Alternative.fromJson(Map<String, dynamic> json) {
    return Alternative(
        id: json['id'],
        questionId: json['questionId'],
        answer: json['answer'],
        order: json['order']
    );
  }

}