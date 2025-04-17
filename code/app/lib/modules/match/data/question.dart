import 'package:mindrush/modules/match/data/alternative.dart';

class Question {
  final int id;
  final String type;
  final String question;
  final int timeLimit;
  final int quizId;
  final List<Alternative> alternatives;

  Question({
    required this.id,
    required this.type,
    required this.question,
    required this.timeLimit,
    required this.quizId,
    List<Alternative>? alternatives,
  }) : alternatives = alternatives ?? [];

  void addAlternative(Alternative alternative) {
    alternatives.add(alternative);
  }

}
