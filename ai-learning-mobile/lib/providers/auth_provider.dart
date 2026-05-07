import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  void _setLoading(bool val) {
    _isLoading = val;
    notifyListeners();
  }

  void _setError(String? val) {
    _error = val;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  Future<void> init() async {
    _setLoading(true);
    try {
      final user = await AuthService.instance.getMe();
      _user = user;
    } catch (_) {
      _user = null;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _setError(null);
    try {
      final user = await AuthService.instance.login(email, password);
      _user = user;
      _setLoading(false);
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      _setLoading(false);
      return false;
    } catch (e) {
      _setError('Unexpected error. Please try again.');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    _setLoading(true);
    _setError(null);
    try {
      final user = await AuthService.instance.register(name, email, password);
      _user = user;
      _setLoading(false);
      return true;
    } on AuthException catch (e) {
      _setError(e.message);
      _setLoading(false);
      return false;
    } catch (e) {
      _setError('Unexpected error. Please try again.');
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    _setLoading(true);
    try {
      await AuthService.instance.logout();
    } catch (_) {}
    _user = null;
    _setLoading(false);
  }

  Future<void> saveOnboarding({
    required String grade,
    required String subject,
    required String examBoard,
  }) async {
    _setLoading(true);
    _setError(null);
    try {
      final updated = await AuthService.instance.saveOnboarding(
        grade: grade,
        subject: subject,
        examBoard: examBoard,
      );
      _user = updated;
    } on AuthException catch (e) {
      _setError(e.message);
    } catch (e) {
      _setError('Failed to save profile. Please try again.');
    } finally {
      _setLoading(false);
    }
  }

  void updateUser(User user) {
    _user = user;
    notifyListeners();
  }
}
