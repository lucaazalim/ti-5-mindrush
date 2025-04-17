import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/match/data/alternative.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/presentation/match_question.dart';

class LobbyPage extends StatefulWidget {
  final Participant participant;

  const LobbyPage({super.key, required this.participant});

  @override
  _LobbyPageState createState() => _LobbyPageState();
}

class _LobbyPageState extends State<LobbyPage> {
  @override
  void initState() {
    super.initState();

    // Espera 4 segundos antes de redirecionar
    Future.delayed(const Duration(seconds: 6), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => MatchQuestionScreen(
            // Exemplo de dados, modifique conforme seu caso
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
}