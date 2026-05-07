import 'dart:io';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

class ApiService {
  static ApiService? _instance;
  late final Dio _dio;
  late final PersistCookieJar _cookieJar;

  static const String _baseUrl = 'https://stellaredu.in/api';

  ApiService._();

  static Future<ApiService> getInstance() async {
    if (_instance == null) {
      final service = ApiService._();
      await service._init();
      _instance = service;
    }
    return _instance!;
  }

  static ApiService get instance {
    if (_instance == null) {
      throw StateError('ApiService not initialised — call getInstance() first');
    }
    return _instance!;
  }

  Future<void> _init() async {
    final appDocDir = await getApplicationDocumentsDirectory();
    final cookiesPath = '${appDocDir.path}/.cookies/';
    _cookieJar = PersistCookieJar(
      storage: FileStorage(cookiesPath),
      ignoreExpires: false,
    );

    _dio = Dio(BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) => status != null && status < 500,
    ));

    _dio.interceptors.add(CookieManager(_cookieJar));
    _dio.interceptors.add(_CsrfInterceptor(_cookieJar));
    _dio.interceptors.add(_LoggingInterceptor());
  }

  Dio get dio => _dio;
  PersistCookieJar get cookieJar => _cookieJar;

  Future<bool> isAuthenticated() async {
    try {
      final uri = Uri.parse(_baseUrl);
      final cookies = await _cookieJar.loadForRequest(uri);
      return cookies.any(
        (c) => c.name == '__Host-token' || c.name == 'token',
      );
    } catch (_) {
      return false;
    }
  }

  Future<void> clearCookies() async {
    try {
      await _cookieJar.deleteAll();
    } catch (_) {}
  }
}

class _CsrfInterceptor extends Interceptor {
  final PersistCookieJar _jar;

  _CsrfInterceptor(this._jar);

  static const _skipMethods = {'GET', 'HEAD', 'OPTIONS'};

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (_skipMethods.contains(options.method.toUpperCase())) {
      handler.next(options);
      return;
    }

    try {
      final uri = Uri.parse('https://stellaredu.in');
      final cookies = await _jar.loadForRequest(uri);
      final csrfCookie = cookies.firstWhere(
        (c) => c.name == '__Host-csrf' || c.name == 'csrf',
        orElse: () => Cookie('', ''),
      );
      if (csrfCookie.value.isNotEmpty) {
        options.headers['x-csrf-token'] = csrfCookie.value;
      }
    } catch (_) {}

    handler.next(options);
  }
}

class _LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // ignore: avoid_print
    print('[API] ${options.method} ${options.path}');
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // ignore: avoid_print
    print('[API] ERROR ${err.response?.statusCode} ${err.requestOptions.path}: ${err.message}');
    handler.next(err);
  }
}
