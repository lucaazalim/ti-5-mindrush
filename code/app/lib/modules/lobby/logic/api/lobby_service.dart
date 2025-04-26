import '../../../utils/dio_config.dart';
import 'package:dio/dio.dart';
import '../../data/participant.dart';
import '../../data/match.dart';
import '../../data/dto/register-participant.dart';

class LobbyService {
  static final Dio _dio = DioClient().dio; // Usa a instância configurada

  static Future<Match> validateMatch(String pin) async {
    try {

      final response = await _dio.get('/matches/$pin');
      return Match.fromJson(response.data);

    } catch (e, stackTrace) {

      print('Erro ao validar PIN: $e');
      print('StackTrace: $stackTrace');
      throw Exception('Failed to fetch match: $e');

    }
  }

  static Future<Participant> registerParticipant(String pin, RegisterParticipant dto) async {

    try{
      final response = await _dio.post('/matches/$pin/participants', data: dto.toJson());
      return Participant.fromJson(response.data);

    }catch (e, stackTrace) {

      print('Erro ao cirar o usuário: $e');
      print('StackTrace: $stackTrace');
      throw Exception('Failed to register user: $e');

    }

  }

}