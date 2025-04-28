import 'dart:async';
import 'package:flutter/material.dart';

class QuestionTimer extends StatefulWidget {
  final int initialTime;
  final VoidCallback onTimeExpired;

  const QuestionTimer({
    super.key,
    required this.initialTime,
    required this.onTimeExpired,
  });

  @override
  State<QuestionTimer> createState() => _QuestionTimerState();
}

class _QuestionTimerState extends State<QuestionTimer> {
  late int _timeLeft;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timeLeft = widget.initialTime;
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timeLeft > 0) {
        setState(() => _timeLeft--);
      } else {
        _timer?.cancel();
        widget.onTimeExpired();
      }
    });
  }

  void stopTimer() {
    _timer?.cancel();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final progressValue = _timeLeft / widget.initialTime;

    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          width: 60,
          height: 60,
          child: CircularProgressIndicator(
            value: progressValue,
            strokeWidth: 4,
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation<Color>(
              _timeLeft > 5 ? Colors.blue : Colors.red,
            ),
          ),
        ),
        Text(
          '$_timeLeft',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: _timeLeft > 5 ? Colors.blue : Colors.red,
          ),
        ),
      ],
    );
  }
}