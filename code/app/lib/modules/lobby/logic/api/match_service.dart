import '../../../utils/dio_config.dart';
import 'package:dio/dio.dart';
import '../../data/participant.dart';
import '../../data/match.dart';

class MatchService {
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

}