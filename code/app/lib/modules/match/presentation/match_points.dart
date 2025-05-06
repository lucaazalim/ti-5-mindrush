import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'dart:async';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/lobby/presentation/match_end_screen.dart';
import 'package:mindrush/modules/lobby/presentation/pin_screen.dart';
import 'package:mindrush/modules/match/logic/api/match_service.dart';
import 'package:mindrush/modules/match/presentation/match_question.dart';

import 'package:mindrush/modules/utils/pusher/pusher_service.dart';
import 'package:mindrush/modules/utils/pusher/pusher-service-params.dart';
import 'package:mindrush/modules/utils/pusher/pusher-provider.dart';
import 'package:mindrush/modules/utils/pusher/event-handler.dart';

final envApiUrl = dotenv.env['API_URL'];
final envApiKey = dotenv.env['API_KEY'] ?? "";
final envCluster = dotenv.env['CLUSTER'] ?? "";

class MatchPointsScreen extends ConsumerStatefulWidget {
  final Participant participant;
  final int remainingTime; // Recebe o tempo restante

  const MatchPointsScreen({super.key, required this.participant, required this.remainingTime});

  @override
  _MatchPointsScreenState createState() => _MatchPointsScreenState();
}

class _MatchPointsScreenState extends ConsumerState<MatchPointsScreen> {
  late PusherService _pusherService;
  int totalPoints = 0;
  int lastQuestionPoints = 0;
  bool _loadingScore = true;

  @override
  void initState() {
    super.initState();
    _startTimerAndFetchScore(widget.remainingTime); // Usa o remainingTime recebido

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
        print('Erro ao buscar a próxima questão: $e');
      }
    });

    handler.on('match-ended-event', (data) async {
      try {

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => MatchEndScreen(participant:
              Participant(
                  id: widget.participant.id,
                  nickname: widget.participant.nickname,
                  matchId: widget.participant.matchId,
                  token: widget.participant.token,
                  totalPoints: totalPoints,
                  avatarUrl: widget.participant.avatarUrl
              )
            ),
          ),
        );
      } catch (e) {

        print('Erro ao sair da partida e rentornar ao lobby: $e');

      }

    });

    _pusherService.connect();

  }

  Future<void> _startTimerAndFetchScore(int remainingTime) async {
    await Future.delayed(Duration(seconds: remainingTime));
    await _fetchParticipantScore();
    setState(() {
      _loadingScore = false;
    });
  }

  Future<void> _fetchParticipantScore() async {
    try {
      final response = await MatchService.fetchParticipantData(widget.participant);
      setState(() {
        totalPoints = response.totalPoints ?? 0;
        lastQuestionPoints = response.lastPointIncrement ?? 0;
      });
    } catch (e) {
      print('Erro ao obter a pontuação: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),

      body: Center(
        child: _loadingScore
            ? const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(height: 20),
            Text(
              'Aguardando resultados...',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                color: Colors.white,
              ),
            ),
          ],
        )
            : SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),
              Container(
                width: 120,
                height: 120,
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                ),
                child: ClipOval(
                  child: SvgPicture.network(
                    widget.participant.avatarUrl!,
                    width: 100,
                    height: 100,
                    fit: BoxFit.scaleDown,
                    placeholderBuilder: (context) => const CircularProgressIndicator(),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                widget.participant.nickname,
                style: const TextStyle(
                  fontSize: 28,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(width: 8),
                  Text(
                    'Pontuação Total: $totalPoints',
                    style: const TextStyle(
                      fontSize: 24,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                '(${lastQuestionPoints >= 0 ? '+' : ''}$lastQuestionPoints Pontos na Última Rodada)',
                style: TextStyle(
                  fontSize: 18,
                  color: lastQuestionPoints >= 0 ? Colors.lightGreenAccent : Colors.redAccent,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                'Aguardando próxima questão...',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
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
    _pusherService.disconnect();
    super.dispose();
  }
}