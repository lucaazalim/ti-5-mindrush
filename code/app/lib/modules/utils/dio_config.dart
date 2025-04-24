import 'package:dio/dio.dart';

class DioClient {

  final Dio _dio = Dio(

    BaseOptions(
      baseUrl: "http://localhost:3000/api",
      connectTimeout: Duration(seconds: 15),
      receiveTimeout: Duration(seconds: 15),
      headers: {
        "Content-Type": "application/json",
      },
    ),

  );

  Dio get dio => _dio;

}