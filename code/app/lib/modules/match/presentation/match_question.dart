import 'package:flutter/material.dart';
import 'package:mindrush/modules/match/data/question.dart';

class MatchQuestionScreen extends StatefulWidget {
  final Question question;
  final void Function(String respostaSelecionada) onResponder;

  const MatchQuestionScreen({
    super.key,
    required this.question,
    required this.onResponder,
  });

  @override
  State<MatchQuestionScreen> createState() => _MatchQuestionScreenState();
}

class _MatchQuestionScreenState extends State<MatchQuestionScreen> {
  bool respondido = false;
  String? respostaSelecionada;

  void responder(String resposta) {
    setState(() {
      respondido = true;
      respostaSelecionada = resposta;
    });

    Future.delayed(const Duration(milliseconds: 500), () {
      widget.onResponder(resposta);
    });
  }

  Color _corPorIndice(int index) {
    const coresFixas = [
      Colors.red,
      Colors.blue,
      Colors.green,
      Colors.orange,
    ];
    return coresFixas[index % coresFixas.length];
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
                            onPressed: respondido ? null : () => responder(alternative.answer),
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