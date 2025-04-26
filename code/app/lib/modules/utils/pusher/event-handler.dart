class GlobalEventHandler {
  static final GlobalEventHandler _instance = GlobalEventHandler._internal();

  factory GlobalEventHandler() {
    return _instance;
  }

  GlobalEventHandler._internal();

  final Map<String, Function> _events = {};

  void on(String eventName, Function callback) {
    _events[eventName] = callback;
  }

  void off(String eventName) {
    _events.remove(eventName);
  }

  void emit(String eventName, dynamic data) {
    if (_events.containsKey(eventName)) {
      _events[eventName]!(data);
    }
  }
}