import 'package:mindrush/modules/match/data/alternative.dart';

class Question {
  final String id;
  final String quizId;
  final String type;
  final String? image;
  final String question;
  final int timeLimit;
  final List<Alternative> alternatives;

  Question({
    required this.id,
    required this.type,
    required this.question,
    required this.timeLimit,
    required this.quizId,
    required this.image,
    List<Alternative>? alternatives,
  }) : alternatives = alternatives ?? [];

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'],
      type: json['type'],
      question: json['question'],
      timeLimit: json['timeLimit'],
      quizId: json['quizId'],
      image: json['image'],
      alternatives: (json['alternatives'] as List<dynamic>?)
          ?.map((alternative) => Alternative.fromJson(
          Map<String, dynamic>.from(alternative as Map)))
          .toList() ??
          [],
    );
  }

  void addAlternative(Alternative alternative) {
    alternatives.add(alternative);
  }

}
