import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/match/data/alternative.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/presentation/match_question.dart';

import 'package:mindrush/modules/utils/pusher/pusher_service.dart'; // Importe o seu PusherService
import 'package:mindrush/modules/utils/pusher/pusher-service-params.dart'; // Importe o seu PusherService
import 'package:mindrush/modules/utils/pusher/pusher-provider.dart'; // Importe o seu PusherService
import 'package:mindrush/modules/utils/pusher/event-handler.dart';

class LobbyPage extends ConsumerStatefulWidget {

  final Participant participant;

  const LobbyPage({super.key, required this.participant});

  @override
  _LobbyPageState createState() => _LobbyPageState();
}

class _LobbyPageState extends ConsumerState<LobbyPage> {

  late PusherService _pusherService;


  @override
  void initState() {
    super.initState();

    final pusherParams = PusherServiceParams(
      apiKey: '9341498703db8ab930c9',
      cluster: 'sa1',
      channelName: 'presence-match-${widget.participant.matchId}',
      authEndpoint: 'http://localhost:3000/api/pusher/auth/participant',
      userToken: widget.participant.token,
    );

    _pusherService = ref.read(pusherServiceProvider(pusherParams));


    final handler = GlobalEventHandler();
    handler.on('hi', (data) {
      print("GlobalEventHanddler escutou hi");
    });

    _pusherService.connect();

    // Espera 4 segundos antes de redirecionar
    Future.delayed(const Duration(seconds: 10), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => MatchQuestionScreen(
            question: Question(
              id: 1,
              type: 'match',
              question: 'Qual é a capital do Brasil?',
              timeLimit: 30,
              quizId: 100,
              alternatives: [
                Alternative(id: 1, answer: 'Rio de Janeiro', correct: false),
                Alternative(id: 2, answer: 'São Paulo', correct: false),
                Alternative(id: 3, answer: 'Brasília', correct: true),
                Alternative(id: 4, answer: 'Salvador', correct: false),
              ],
            ),
            onResponder: (resposta) {
              print('Resposta selecionada: $resposta');
            },
          ),
        ),
      );
    });
  }



  @override
  Widget build(BuildContext context) {
    final avatarUrl =
        'https://api.dicebear.com/9.x/adventurer/png?seed=${widget.participant.nickname}';

    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(
                'assets/images/logo.png',
                width: 212,
              ),
              const SizedBox(height: 40),
              // Avatar gerado por nickname
              CircleAvatar(
                radius: 50,
                backgroundColor: Colors.white,
                backgroundImage: NetworkImage(avatarUrl),
              ),
              const SizedBox(height: 20),
              Text(
                widget.participant.nickname,
                style: const TextStyle(
                  fontSize: 24,
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 30),
              const CircularProgressIndicator(
                color: Colors.white,
              ),
              const SizedBox(height: 20),
              const Text(
                'Aguardando o início da partida...',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }

}