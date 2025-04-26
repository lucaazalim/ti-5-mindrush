import '../../../utils/dio_config.dart';
import 'package:dio/dio.dart';
import '../../data/question.dart';
import '../../data/alternative.dart';
import '../../../lobby/data/participant.dart';

class MatchService {

  static final Dio _dio = DioClient().dio; // Usa a instância configurada

  static Future<Question> fetchCurrentQuestion(Participant participant) async {
    try {

      String token = participant.token;

      final response = await _dio.get('/matches/current-question',
        options: Options(
          headers: {
            "Authorization": "Bearer $token",
          },
        )
      );
      return Question.fromJson(response.data);

    } catch (e, stackTrace) {

      print('Erro ao encntrar a questão PIN: $e');
      print('StackTrace: $stackTrace');
      throw Exception('Failed to fetch match: $e');

    }

  }

  static Future answerQuestion(Participant participant, String alternativeId) async {

    try{

      String token = participant.token;

      final response = await _dio.post('/matches/answers',
          options: Options(
            headers: {
              "Authorization": "Bearer $token",
            },
          ),
          data: {
            "matchId": participant.matchId,
            "participantId": participant.id,
            "alternativeId": alternativeId
          }
      );

      return;

    }catch (e, stackTrace){

      print('Erro ao enviar resposta: $e');
      print('StackTrace: $stackTrace');
      throw Exception('Failed to send answer: $e');

    }

  }

}