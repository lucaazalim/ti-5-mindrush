import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/lobby/presentation/lobby_page.dart';
import 'package:mindrush/modules/match/data/alternative.dart';
import 'package:mindrush/modules/match/data/question.dart';
import 'package:mindrush/modules/match/presentation/match_question.dart';

import '../data/match.dart';
import '../data/dto/register-participant.dart';
import '../logic/api/lobby_service.dart';

class NameScreen extends StatefulWidget {

  final Match match;
  const NameScreen({super.key, required this.match});

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
    }

    try {
      final dto = RegisterParticipant(nickname: name);
      final Participant participant = await MatchService.registerParticipant(widget.match.pin, dto);

      Navigator.pop(context);
      // Fecha o loading

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => LobbyPage(participant: participant),
        ),
      );


    } catch (e) {
      Navigator.pop(context); // Garante que o loading seja fechado em caso de erro
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao registrar participante: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  // 🔻 ESTE build ESTAVA FORA DA CLASSE, AGORA ESTÁ CORRETAMENTE DENTRO
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
                    child: TextFormField(
                      controller: _nameController,
                      validator: (value) {
                        if (value == null || value.trim().length < 2) {
                          return 'O nome deve ter pelo menos 2 caracteres.';
                        }
                        return null;
                      },
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                      ),
                      textAlignVertical: TextAlignVertical.center,
                      decoration: InputDecoration(
                        floatingLabelAlignment: FloatingLabelAlignment.start,
                        floatingLabelBehavior: FloatingLabelBehavior.never,
                        labelText: "Apelido",
                        labelStyle: const TextStyle(
                          color: Colors.black87,
                          fontSize: 18,
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 10),
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