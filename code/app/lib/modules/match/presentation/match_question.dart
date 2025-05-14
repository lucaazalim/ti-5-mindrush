import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/logic/api/match_service.dart';
import 'package:mindrush/modules/match/presentation/question_timer.dart';

import 'package:mindrush/modules/utils/pusher/pusher-service-params.dart';
import 'package:mindrush/modules/utils/pusher/pusher-provider.dart';
import 'package:mindrush/modules/utils/pusher/pusher_service.dart';

import 'match_points.dart';

final envApiUrl = dotenv.env['API_URL'];

class MatchQuestionScreen extends ConsumerStatefulWidget {
  final Question question;
  final Participant participant;

  const MatchQuestionScreen({
    super.key,
    required this.question,
    required this.participant,
  });

  @override
  ConsumerState<MatchQuestionScreen> createState() => _MatchQuestionScreenState();
}

class _MatchQuestionScreenState extends ConsumerState<MatchQuestionScreen> {
  late PusherService _pusherService;
  bool answered = false;
  String? selectedAnswer;
  DateTime? _startTime; // Para registrar o tempo de início da questão

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now(); // Registra o tempo quando a tela é carregada

    final pusherParams = PusherServiceParams(
      apiKey: '181d4fce834f3a2416da',
      cluster: 'us2',
      channelName: 'presence-match-${widget.participant.matchId}',
      authEndpoint: '$envApiUrl/pusher/auth/participant',
      userToken: widget.participant.token,
    );

    _pusherService = ref.read(pusherServiceProvider(pusherParams));
  }

  void answerQuestion(String selectedAnswerId) {
    if (!answered) {
      setState(() {
        answered = true;
        selectedAnswer = selectedAnswerId;
      });
      MatchService.answerQuestion(widget.participant, selectedAnswerId);

      // Calcula o tempo de resposta
      final responseTime = DateTime.now().difference(_startTime!).inSeconds;
      final remainingTime = widget.question.timeLimit - responseTime;

      // Navega para a MatchPointsScreen com o tempo restante
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => MatchPointsScreen(
            participant: widget.participant,
            remainingTime: remainingTime > 0 ? remainingTime : 0, // Garante que não seja negativo
          ),
        ),
      );
    }
  }

  String _iconePorIndice(int index) {
    switch (index) {
      case 0:
        return 'assets/images/triangulo.png';
      case 1:
        return 'assets/images/losango.png';
      case 2:
        return 'assets/images/circulo.png';
      case 3:
      default:
        return 'assets/images/quadrado.png';
    }
  }

  Color _corPorIndice(int index) {
    const coresFixas = [
      Colors.red,
      Colors.blue,
      Colors.orange,
      Colors.green,
    ];
    return coresFixas[index % coresFixas.length];
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final imageHeight = screenHeight * 0.3; // Define a altura máxima da imagem como 30% da tela

    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: SafeArea(
        child: Column(
          children: [
            if (widget.question.image != null)
              Padding(
                padding: const EdgeInsets.all(16),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: SizedBox( // Envolve o Image.network com um SizedBox
                    height: imageHeight,
                    width: double.infinity,
                    child: Image.network(
                      widget.question.image!,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30),
                  ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      widget.question.question,
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    Expanded(
                      child: ListView.builder(
                        itemCount: widget.question.alternatives.length,
                        itemBuilder: (context, index) {
                          final alternative = widget.question.alternatives[index];
                          final cor = _corPorIndice(index);
                          final imagePath = _iconePorIndice(index);

                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16.0),
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: cor,
                                foregroundColor: Colors.white,
                                textStyle: const TextStyle(fontSize: 20),
                                minimumSize: const Size.fromHeight(70),
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                              ),
                              onPressed: answered
                                  ? null
                                  : () {
                                answerQuestion(alternative.id);
                              },
                              child: Row(
                                children: [
                                  Image.asset(
                                    imagePath,
                                    height: 40,
                                    width: 40,
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Text(
                                      alternative.answer,
                                      textAlign: TextAlign.left,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 16),
                    QuestionTimer(
                      initialTime: widget.question.timeLimit,
                      onTimeExpired: () {
                        if (!answered) {
                          setState(() => answered = true);
                          // Navega para a MatchPointsScreen com tempo restante 0
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => MatchPointsScreen(
                                participant: widget.participant,
                                remainingTime: 0,
                              ),
                            ),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}