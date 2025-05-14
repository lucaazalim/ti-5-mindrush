import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/data/participant.dart';
import 'package:mindrush/modules/lobby/presentation/lobby_page.dart';
import '../data/match.dart';
import '../data/dto/register-participant.dart';
import '../logic/api/lobby_service.dart';

class NameScreen extends StatefulWidget {
  final Match match;
  const NameScreen({super.key, required this.match});

  @override
  State<NameScreen> createState() => _NameScreenState();
}

class _NameScreenState extends State<NameScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  String? _nameError;
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;
  final RegExp nameRegex = RegExp(r'^[\p{L}\p{N} ]+$', unicode: true);

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
  }

  @override
  void dispose() {
    _nameController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _submitForm() async {
    String name = _nameController.text.trim();

    String? errorMessage;
    if (name.isEmpty) {
      errorMessage = 'O nome deve ser digitado';
    } else if (name.length < 3) {
      errorMessage = 'Mínimo de 3 caracteres';
    } else if (name.length > 20) {
      errorMessage = 'Máximo de 20 caracteres';
    } else if (!nameRegex.hasMatch(name)) {
      errorMessage = 'Somente letras, números e espaços são permitidos';
    }

    if (errorMessage != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMessage!),
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
      final Participant participant =
      await LobbyService.registerParticipant(widget.match.pin, dto);

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
        const SnackBar(
          content: Text('Erro ao registrar participante. Tente novamente!'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: SlideTransition( // Widget para a animação de slide
        position: _slideAnimation,
        child: Padding(
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
                      width: 160,
                    ),
                    const SizedBox(height: 40),
                    Container(
                      width: 200,
                      height: 40,
                      margin: const EdgeInsets.symmetric(vertical: 10),
                      child: TextFormField(
                        controller: _nameController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'O nome deve ser digitado';
                          }
                          if (value.length < 3) {
                            return 'Minimo de 3 characteres';
                          }
                          if (value.length > 20) {
                            return 'Maximo de 20 characteres';
                          }
                          if (!nameRegex.hasMatch(value)) {
                            return 'Somente letras, números e espaços são permitidos';
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
                          labelText: "Insira o seu apelido",
                          labelStyle: const TextStyle(
                            color: Colors.black87,
                            fontSize: 18,
                          ),
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding:
                          const EdgeInsets.symmetric(vertical: 0, horizontal: 10),
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
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        child: const Text(
                          'Avançar',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(top: 10.0),
                      child: Text(
                        "Por segurança, não insira seu nome real!",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}