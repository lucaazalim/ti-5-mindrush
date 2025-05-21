import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:mindrush/modules/lobby/presentation/pin_screen.dart';
import 'package:mindrush/modules/lobby/presentation/qr_code_screen.dart';
import '../data/sound_utils.dart';

class SelectAccessScreen extends StatefulWidget {
  const SelectAccessScreen({super.key});

  @override
  State<SelectAccessScreen> createState() => _SelectAccessScreenState();
}

class _SelectAccessScreenState extends State<SelectAccessScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500), // Duração da animação
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward(); // Inicia a animação
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: Center(
        child: FadeTransition( // Widget para a animação de fade
          opacity: _fadeAnimation,
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Image.asset(
                  'assets/images/logo.png',
                  width: 160,
                ),
                const SizedBox(height: 40),
                SizedBox(
                  width: 200,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {
                      SoundUtils.playSound('sounds/click.mp3');
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PinScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: const Text(
                      "Entrar com PIN",
                      style: TextStyle(color: Color(0xFF2C2C2C), fontSize: 16),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: 200,
                  height: 40,
                  child: ElevatedButton(
                    onPressed: () {
                      if (kIsWeb) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                                'Leitura de QR Code não é suportada no navegador!'),
                            backgroundColor: Colors.redAccent,
                          ),
                        );
                      } else {
                        SoundUtils.playSound('sounds/click.mp3');
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const QrCodeScreen()),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2C2C2C),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: const Text(
                      "Ler QR Code",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}