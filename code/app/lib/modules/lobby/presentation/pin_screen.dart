import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/presentation/name_screen.dart';
import '../logic/api/match_service.dart';
class PinScreen extends StatefulWidget {
  const PinScreen({super.key});

  @override
  State<PinScreen> createState() => _PinScreenState();
}

class _PinScreenState extends State<PinScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _pinController = TextEditingController();
  String? _pinError; // Variável para armazenar a mensagem de erro


  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  void _validatePin() async {
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
        final match = await MatchService.validateMatch(_pinController.text);

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
                      controller: _pinController,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                      ),
                      decoration: InputDecoration(
                        hintText: "PIN da Partida",
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
                    width: 212,
                    height: 40,
                    child: ElevatedButton(
                      onPressed: _validatePin,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2C2C2C),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      child: const Text(
                        'Validar PIN',
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
    );
  }
}