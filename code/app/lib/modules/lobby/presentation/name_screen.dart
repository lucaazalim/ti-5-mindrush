import 'package:flutter/material.dart';
import 'package:mindrush/modules/match/logic/alternative.dart';
import 'package:mindrush/modules/match/logic/question.dart';

import 'package:mindrush/modules/match/presentation/match_question.dart';

class NameScreen extends StatefulWidget {
  const NameScreen({super.key});

  @override
  State<NameScreen> createState() => _NameScreenState();
}

class _NameScreenState extends State<NameScreen> {

  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  String? _nameError;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _submitForm() async {

    String name = _nameController.text.trim();
    if (name.isEmpty || name.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('O nome deve ter pelo menos 2 caracteres.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_formKey.currentState!.validate()) {
      // Exibir o loading
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return const Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          );
        },
      );

      // Simular um atraso para o loading (substitua por sua lógica real)

      await Future.delayed(const Duration(seconds: 2));

      Navigator.pop(context); // Remove o loading
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
                Alternative(id:1, answer: 'Rio de Janeiro', correct: false),
                Alternative(id:2, answer: 'São Paulo', correct: false),
                Alternative(id:3, answer: 'Brasília', correct: true),
                Alternative(id:4, answer: 'Salvador', correct: false),
              ],
            ),
            onResponder: (resposta) {
              print('Resposta selecionada: $resposta');
            },
          ),
        ),
      );


    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Center(
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    'assets/images/logo.png',
                    width: 212,
                  ),
                  const SizedBox(height: 40),
                  Container(
                      width: 212,
                      height: 40,
                      margin: const EdgeInsets.symmetric(vertical: 10),
                      child:

                        TextFormField(
                          controller: _nameController,
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 18, // Ajusta o tamanho do texto
                          ),
                          textAlignVertical: TextAlignVertical.center,// Centraliza o texto digitado
                          decoration: InputDecoration(
                            floatingLabelAlignment: FloatingLabelAlignment.start,
                            floatingLabelBehavior: FloatingLabelBehavior.never,
                            labelText: "Apelido", // Define o label diretamente
                            labelStyle: const TextStyle(
                              color: Colors.black87,
                              fontSize: 18,
                            ),
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 10), // Ajuste do padding interno
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(6),
                              borderSide: const BorderSide(color: Colors.white),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(6),
                              borderSide: const BorderSide(color: Colors.blue),
                            ),
                          ),

                        ),

                  ),

                  const SizedBox(height: 5),

                  SizedBox(
                    width: 212,
                    height: 40,
                    child: ElevatedButton(
                      onPressed: _submitForm,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2C2C2C),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      child: const Text(
                        'Prosseguir',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ),
                  ),

                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}