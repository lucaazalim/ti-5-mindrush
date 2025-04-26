import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

final apiUrl = dotenv.env['API_URL'];


class DioClient {

  final Dio _dio = Dio(

    BaseOptions(
      baseUrl: apiUrl ?? 'http://localhost:3002/api',
      connectTimeout: Duration(seconds: 15),
      receiveTimeout: Duration(seconds: 15),
      headers: {
        "Content-Type": "application/json",
      },
    ),
  );

  Dio get dio => _dio;

}