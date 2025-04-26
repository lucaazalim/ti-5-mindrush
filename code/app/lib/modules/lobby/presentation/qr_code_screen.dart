import 'package:flutter/material.dart';
import 'package:mindrush/modules/lobby/logic/api/lobby_service.dart';
import 'package:mindrush/modules/lobby/presentation/name_screen.dart';
import 'package:mobile_scanner/mobile_scanner.dart'; 

class QrCodeScreen extends StatefulWidget {
  const QrCodeScreen({super.key});

  @override
  State<QrCodeScreen> createState() => _QrCodeScreenState();
}

class _QrCodeScreenState extends State<QrCodeScreen> {
  bool _isProcessing = false;

  // Função para lidar com o escaneamento do QR Code
  void _onQRScan(BarcodeCapture barcodeCapture) async {
    if (!_isProcessing) {
      setState(() {
        _isProcessing = true;
      });

      final code = barcodeCapture.barcodes.first.rawValue;

      if (code != null) {
        // Mostra loading
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (_) => const Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ),
        );

        try {
          final match = await MatchService.validateMatch(code);
          Navigator.pop(context); // Fecha o loading
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => NameScreen(match: match)),
          );
        } catch (e) {
          Navigator.pop(context); // Fecha o loading
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('QR Code inválido ou erro na conexão. Tente novamente!'),
              backgroundColor: Colors.redAccent,
            ),
          );
          setState(() {
            _isProcessing = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 4,
            child: MobileScanner(
              onDetect: (barcodeCapture) {
                _onQRScan(barcodeCapture); // Chama a função para tratar o scan
              },
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: _isProcessing
                  ? const CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              )
                  : const Text(
                'Escaneie o QR Code da partida',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
