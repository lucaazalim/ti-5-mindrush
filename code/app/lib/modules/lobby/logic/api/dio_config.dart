import 'package:dio/dio.dart';

class DioClient {

  final Dio _dio = Dio(

    BaseOptions(
      baseUrl: "https://exemplo.com",
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
      headers: {
        "Content-Type": "application/json",
      },
    ),

  );

  Dio get dio => _dio;

}