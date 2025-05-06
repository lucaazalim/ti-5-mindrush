import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mindrush/modules/lobby/data/participant.dart';


class MatchEndScreen extends StatefulWidget {

  final Participant participant;

  const MatchEndScreen({
    Key? key,
    required this.participant,
  }) : super(key: key);

  @override
  State<MatchEndScreen> createState() => _MatchEndScreenState();
}

class _MatchEndScreenState extends State<MatchEndScreen> {
  @override
  Widget build(BuildContext context) {
    final avatarUrl = widget.participant.avatarUrl;

    return Scaffold(
      backgroundColor: const Color(0xFF0060E1),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(
                'assets/images/logo.png',
                width: 160,
              ),
              const SizedBox(height: 40),
              // Avatar
              Container(
                width: 100,
                height: 100,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                ),
                child: ClipOval(
                  child: avatarUrl != null
                      ? SvgPicture.network(
                    avatarUrl,
                    width: 80,
                    height: 80,
                    fit: BoxFit.scaleDown,
                    placeholderBuilder: (context) =>
                        CircularProgressIndicator(),
                  )
                      : Text(
                    widget.participant.nickname.substring(0, 1),
                    style: TextStyle(
                      fontSize: 40,
                      color: Color(0xFF0060E1),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                widget.participant.nickname,
                style: const TextStyle(
                  fontSize: 24,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 30),
              // Match results card
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 40),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Partida Finalizada!',
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildResultRow('Pontuação:', '${widget.participant.totalPoints}'),
                  ],
                ),
              ),
              const SizedBox(height: 30),
              // Action buttons
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: const Text(
                          'Voltar',
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFF0060E1),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            color: Colors.white,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}