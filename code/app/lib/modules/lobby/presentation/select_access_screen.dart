import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:mindrush/modules/lobby/presentation/pin_screen.dart';
import 'package:mindrush/modules/lobby/presentation/qr_code_screen.dart';

class SelectAccessScreen extends StatelessWidget {
  const SelectAccessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(
                'assets/images/logo.png',
                width: 212,
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: 212,
                height: 40,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PinScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  child: const Text(
                    "Entrar com PIN",
                    style: TextStyle(color: Color(0xFF2C2C2C), fontSize: 18),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: 212,
                height: 40,
                child: ElevatedButton(
                  onPressed: () {
                  if (kIsWeb) {
                  ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                  content: Text('Leitura de QR Code não é suportada no navegador!'),
                  backgroundColor: Colors.redAccent,
                  ),
                  );
                  } else {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const QrCodeScreen()),
                    );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2C2C2C),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  child: const Text(
                    "Ler QR Code",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
