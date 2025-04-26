import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/presentation/match_question.dart';
import 'package:mindrush/modules/match/logic/api/match_service.dart';

import 'package:mindrush/modules/utils/pusher/pusher_service.dart'; // Importe o seu PusherService
import 'package:mindrush/modules/utils/pusher/pusher-service-params.dart'; // Importe o seu PusherService
import 'package:mindrush/modules/utils/pusher/pusher-provider.dart'; // Importe o seu PusherService
import 'package:mindrush/modules/utils/pusher/event-handler.dart';

final envApiUrl = dotenv.env['API_URL'];
final envApiKey = dotenv.env['API_KEY'] ?? "";
final envCluster = dotenv.env['CLUSTER'] ?? "";

class LobbyPage extends ConsumerStatefulWidget {

  final Participant participant;

  const LobbyPage({super.key, required this.participant});

  @override
  _LobbyPageState createState() => _LobbyPageState();
}

class _LobbyPageState extends ConsumerState<LobbyPage> {

  late PusherService _pusherService;
  Question? question;

  @override
  void initState() {

    super.initState();

    final pusherParams = PusherServiceParams(
      apiKey: envApiKey,
      cluster: envCluster,
      channelName: 'presence-match-${widget.participant.matchId}',
      authEndpoint: '$envApiUrl/pusher/auth/participant',
      userToken: widget.participant.token,
    );

    _pusherService = ref.read(pusherServiceProvider(pusherParams));

    final handler = GlobalEventHandler();

    handler.on('next-match-question-event', (data) async {
      try {
        final openQuestion = await MatchService.fetchCurrentQuestion(widget.participant);

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => MatchQuestionScreen(
              participant: widget.participant,
              question: openQuestion,
            ),
          ),
        );
      } catch (e) {

        print('Erro ao buscar a questão atual: $e');

      }
    });

    _pusherService.connect();

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