import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/presentation/name_screen.dart';
import '../logic/api/lobby_service.dart';
import '../data/sound_utils.dart';

class PinScreen extends StatefulWidget {
  const PinScreen({super.key});

  @override
  State<PinScreen> createState() => _PinScreenState();
}

class _PinScreenState extends State<PinScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _pinController = TextEditingController();
  String? _pinError; // Variável para armazenar a mensagem de erro
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
  }

  @override
  void dispose() {
    _pinController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _validatePin() async {
    SoundUtils.playSound('sounds/click.mp3');
    setState(() {
      _pinError = null; // Limpa o erro anterior
    });

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

      try {
        // Tenta validar o PIN através da API
        final match = await LobbyService.validateMatch(_pinController.text);

        // Se chegou aqui, o match foi encontrado com sucesso
        Navigator.pop(context); // Remove o loading

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => NameScreen(match: match),
          ),
        );
      } catch (e) {
        // Erro ao buscar o match
        Navigator.pop(context); // Remove o loading
        print('Erro ao validar PIN: $e');

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('PIN inválido ou erro na conexão. Tente novamente!'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } else {
      setState(() {
        _pinError = 'Por favor insira o PIN'; // Define a mensagem de erro
      });
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
                        controller: _pinController,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 18,
                        ),
                        decoration: InputDecoration(
                          hintText: "PIN da partida",
                          labelStyle: const TextStyle(
                            color: Colors.black87,
                            fontSize: 15,
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
                            borderSide: const BorderSide(color: Colors.white),
                          ),
                          errorText: _pinError, // Exibe a mensagem de erro
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return null; // Retorna null para usar errorText
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(height: 5),
                    SizedBox(
                      width: 200,
                      height: 40,
                      child: ElevatedButton(
                        onPressed: _validatePin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2C2C2C),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        child: const Text(
                          'Acessar partida',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 10.0),
                      child: const Text(
                        "Prepare-se para aprender e se divertir!",
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