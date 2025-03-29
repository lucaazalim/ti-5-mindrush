import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/presentation/main_screen.dart';

class PinScreen extends StatefulWidget {
  const PinScreen({super.key});

  @override
  State<PinScreen> createState() => _PinScreenState();
}

class _PinScreenState extends State<PinScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _pinController = TextEditingController();
  String? _pinError; // Variável para armazenar a mensagem de erro

  // Mock de PINs válidos (substitua com a validação real)
  final List<String> validPins = ['1234', '5678', 'abcd'];

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

      // Simular um atraso para o loading (substitua por sua lógica real)
      await Future.delayed(const Duration(seconds: 2));

      // Valida se o PIN está na lista de válidos
      if (validPins.contains(_pinController.text)) {
        // Navegar para a tela de apelido (MainScreen)
        Navigator.pop(context); // Remover o loading
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MainScreen()),
        );
      } else {
        Navigator.pop(context); // Remover o loading
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('PIN inválido. Tente novamente!'),
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