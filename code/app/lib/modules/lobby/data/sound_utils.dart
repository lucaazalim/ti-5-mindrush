import 'package:audioplayers/audioplayers.dart';

class SoundUtils {

  static Future<void> playSound(String soundPath) async {
    final player = AudioPlayer();
    try {
      await player.play(AssetSource(soundPath));
    } catch (e) {
      print('Error playing sound $soundPath: $e');
    } finally {

      player.dispose();
    }
  }
}
