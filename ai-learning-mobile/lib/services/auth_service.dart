import 'package:dio/dio.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthException implements Exception {
  final String message;
  const AuthException(this.message);

  @override
  String toString() => message;
}

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  Dio get _dio => ApiService.instance.dio;

  Future<User> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email.trim(), 'password': password},
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractUser(response.data);
        return User.fromJson(data);
      }

      final msg = _extractError(response.data) ?? 'Login failed';
      throw AuthException(msg);
    } on DioException catch (e) {
      throw AuthException(_dioMessage(e));
    }
  }

  Future<User> register(String name, String email, String password) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'name': name.trim(),
          'email': email.trim(),
          'password': password,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractUser(response.data);
        return User.fromJson(data);
      }

      final msg = _extractError(response.data) ?? 'Registration failed';
      throw AuthException(msg);
    } on DioException catch (e) {
      throw AuthException(_dioMessage(e));
    }
  }

  Future<User?> getMe() async {
    try {
      final response = await _dio.get('/auth/me');

      if (response.statusCode == 200) {
        final data = _extractUser(response.data);
        return User.fromJson(data);
      }
      return null;
    } on DioException catch (_) {
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (_) {}
    await ApiService.instance.clearCookies();
  }

  Future<User> saveOnboarding({
    required String grade,
    required String subject,
    required String examBoard,
  }) async {
    try {
      final response = await _dio.put(
        '/auth/profile',
        data: {
          'grade': grade,
          'subject': subject,
          'examBoard': examBoard,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _extractUser(response.data);
        return User.fromJson(data);
      }

      final msg = _extractError(response.data) ?? 'Failed to save profile';
      throw AuthException(msg);
    } on DioException catch (e) {
      throw AuthException(_dioMessage(e));
    }
  }

  Map<String, dynamic> _extractUser(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      final data = responseData['data'];
      if (data is Map<String, dynamic>) {
        final user = data['user'];
        if (user is Map<String, dynamic>) return user;
        return data;
      }
      final user = responseData['user'];
      if (user is Map<String, dynamic>) return user;
    }
    throw const AuthException('Unexpected response format');
  }

  String? _extractError(dynamic responseData) {
    if (responseData is Map<String, dynamic>) {
      return (responseData['message'] ??
              responseData['error'] ??
              responseData['msg'])
          ?.toString();
    }
    return null;
  }

  String _dioMessage(DioException e) {
    if (e.response != null) {
      return _extractError(e.response?.data) ??
          'Request failed (${e.response?.statusCode})';
    }
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return 'Connection timed out. Check your internet.';
    }
    return 'Network error. Please try again.';
  }
}
