import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/lobby/logic/api/lobby_service.dart';
import 'package:mindrush/modules/lobby/presentation/lobby_page.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/logic/api/match_service.dart';
import 'package:mindrush/modules/match/presentation/question_timer.dart';


import 'package:mindrush/modules/utils/pusher/pusher-service-params.dart';
import 'package:mindrush/modules/utils/pusher/pusher-provider.dart';
import 'package:mindrush/modules/utils/pusher/pusher_service.dart';

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

  void answerQuestion(String selectedAnswerId) {

    setState(() {
      answered = true;
      selectedAnswer = selectedAnswerId;
    });

    MatchService.answerQuestion(widget.participant, selectedAnswerId);

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
  void initState() {
    super.initState();


    final pusherParams = PusherServiceParams(
      apiKey: '9341498703db8ab930c9',
      cluster: 'sa1',
      channelName: 'presence-match-${widget.participant.matchId}',
      authEndpoint: '$envApiUrl/pusher/auth/participant',
      userToken: widget.participant.token,
    );

    _pusherService = ref.read(pusherServiceProvider(pusherParams));

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Fundo branco
      body: SafeArea(
        child: Column(
          children: [

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24),
              child: Text(
                widget.question.question,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.black, // Texto preto
                ),
                textAlign: TextAlign.center,
              ),
            ),

            Padding(
              padding: const EdgeInsets.only(top: 20),
              child: QuestionTimer(
                initialTime: widget.question.timeLimit, // Tempo inicial em segundos
                onTimeExpired: () {

                  if (!answered) {
                    setState(() => answered = true);
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => LobbyPage(
                          participant: widget.participant,
                        ),
                      ),
                    );
                  }

                },
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(

                  children: List.generate(widget.question.alternatives.length, (index) {
                    final alternative = widget.question.alternatives[index];
                    final cor = _corPorIndice(index);

                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: cor,
                              foregroundColor: Colors.white,
                              textStyle: const TextStyle(fontSize: 20),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            onPressed: answered ? null : (){

                              answerQuestion(alternative.id);

                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => LobbyPage(
                                    participant: widget.participant,
                                  ),
                                ),
                              );

                            },
                            child: Text(alternative.answer, textAlign: TextAlign.center),
                          ),
                        ),
                      ),
                    );


                  }),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}