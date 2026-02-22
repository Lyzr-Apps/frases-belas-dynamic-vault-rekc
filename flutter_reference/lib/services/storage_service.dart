import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

/// Servico de armazenamento local usando SharedPreferences
/// Substitui o localStorage do Next.js
class StorageService {
  static const String _favoritesKey = 'frases-favoritos';
  static const String _planKey = 'frases-user-plan';
  static const String _fontKey = 'frases-selected-font';
  static const String _notifAskedKey = 'frases-notif-asked';
  static const String _notifEnabledKey = 'frases-notif-enabled';

  static SharedPreferences? _prefs;

  /// Inicializa o SharedPreferences — chamar no main() antes de runApp()
  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // ─── Favoritos ─────────────────────────────────────────────

  static List<String> loadFavorites() {
    try {
      final saved = _prefs?.getString(_favoritesKey);
      if (saved != null) {
        final decoded = jsonDecode(saved);
        if (decoded is List) {
          return decoded.cast<String>();
        }
      }
    } catch (_) {}
    return [];
  }

  static Future<void> saveFavorites(List<String> ids) async {
    try {
      await _prefs?.setString(_favoritesKey, jsonEncode(ids));
    } catch (_) {}
  }

  // ─── Plano (free / pro) ────────────────────────────────────

  static String loadPlan() {
    return _prefs?.getString(_planKey) ?? 'free';
  }

  static Future<void> savePlan(String plan) async {
    await _prefs?.setString(_planKey, plan);
  }

  static bool get isPro => loadPlan() == 'pro';

  // ─── Fonte selecionada ─────────────────────────────────────

  static int loadFont() {
    try {
      final saved = _prefs?.getString(_fontKey);
      if (saved != null) {
        final idx = int.tryParse(saved);
        if (idx != null && idx >= 0 && idx < 12) return idx;
      }
    } catch (_) {}
    return 0;
  }

  static Future<void> saveFont(int index) async {
    await _prefs?.setString(_fontKey, index.toString());
  }

  // ─── Notificacoes ──────────────────────────────────────────

  static bool get notifAsked => _prefs?.getBool(_notifAskedKey) ?? false;

  static Future<void> setNotifAsked(bool value) async {
    await _prefs?.setBool(_notifAskedKey, value);
  }

  static bool get notifEnabled => _prefs?.getBool(_notifEnabledKey) ?? false;

  static Future<void> setNotifEnabled(bool value) async {
    await _prefs?.setBool(_notifEnabledKey, value);
  }
}
