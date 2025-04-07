import './dio_config.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


String? apiUrl = dotenv.env['API_URL'];

class ApiService{

  final Dio _dio = DioClient().dio;

  Future<Match> enterRoom(pin) async {

    try{

      Response response = await _dio.get("/matches/$pin");
      return response.data;

    }catch(e){

      throw Exception("Failed to fetch matches");

    }

  }

}