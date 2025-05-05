import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/presentation/match_question.dart';
import 'package:mindrush/modules/match/logic/api/match_service.dart';

import 'package:mindrush/modules/utils/pusher/pusher_service.dart'; // PusherService
import 'package:mindrush/modules/utils/pusher/pusher-service-params.dart'; // PusherServiceParams
import 'package:mindrush/modules/utils/pusher/pusher-provider.dart'; // PusherService Provider
import 'package:mindrush/modules/utils/pusher/event-handler.dart'; // Event Handler

final envApiUrl = dotenv.env['API_URL'];
final envApiKey = dotenv.env['API_KEY'] ?? "";
final envCluster = dotenv.env['CLUSTER'] ?? "";

class MatchPointsScreen extends ConsumerStatefulWidget {

  final Participant participant;

  const MatchPointsScreen({super.key, required this.participant});

  @override
  _MatchPointsScreenState createState() => _MatchPointsScreenState();
}

class _MatchPointsScreenState extends ConsumerState<MatchPointsScreen> {

  late PusherService _pusherService;
  int totalPoints = 0;
  int lastQuestionPoints = 0;

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
        // Fetch the next question
        final openQuestion = await MatchService.fetchCurrentQuestion(widget.participant);

        // Navigate to the match question screen
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

    // Fetch the participant's current score
    _fetchParticipantScore();

    // Connect to Pusher
    _pusherService.connect();
  }

  Future<void> _fetchParticipantScore() async {
    try {
      // A função para obter a pontuação do participante (ajustar conforme o seu API)
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
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [

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
                    widget.participant.avatarUrl!,
                    width: 80,
                    height: 80,
                    fit: BoxFit.scaleDown,
                    placeholderBuilder: (context) => CircularProgressIndicator(),
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
              const SizedBox(height: 40),
              // Pontuação total
              Text(
                'Pontuação Total: $totalPoints',
                style: const TextStyle(
                  fontSize: 20,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              // Pontuação da última pergunta
              Text(
                'Pontuação da Última Pergunta: $lastQuestionPoints',
                style: const TextStyle(
                  fontSize: 18,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                'Aguardando próxima questão...',
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
    );
  }

  @override
  void dispose() {
    _pusherService.disconnect();
    super.dispose();
  }
}
