import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/lobby/presentation/match_end_screen.dart';
import 'package:mindrush/modules/lobby/presentation/pin_screen.dart';
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

class _LobbyPageState extends ConsumerState<LobbyPage>
    with SingleTickerProviderStateMixin {
  late PusherService _pusherService;
  Question? question;
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800), // Duração da animação
    );
    _slideAnimation = Tween<Offset>(begin: const Offset(-0.1, 0.0), end: Offset.zero).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutQuad),
    );
    _animationController.forward(); // Inicia a animação

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

    handler.on('match-ended-event', (data) async {
      try {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => MatchEndScreen(participant: widget.participant),
          ),
        );
      } catch (e) {
        print('Erro ao sair da partida e rentornar ao lobby: $e');
      }
    });

    _pusherService.connect();
  }

  @override
  Widget build(BuildContext context) {
    final avatarUrl = widget.participant.avatarUrl;

    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: SlideTransition( // Widget para a animação de slide
        position: _slideAnimation,
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  'assets/images/logo.png',
                  width: 160,
                ),
                const SizedBox(height: 40),
                // Avatar gerado por nickname
                Container(
                  width: 100,
                  height: 100,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                  ),
                  child: ClipOval(
                    child: SvgPicture.network(
                      avatarUrl!,
                      width: 80,
                      height: 80,
                      fit: BoxFit.scaleDown,
                      placeholderBuilder: (context) =>
                      const CircularProgressIndicator(),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  widget.participant.nickname,
                  style: const TextStyle(
                    fontSize: 24,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Aguarde a partida iniciar...',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }
}