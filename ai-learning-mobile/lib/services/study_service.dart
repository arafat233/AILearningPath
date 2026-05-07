import 'package:dio/dio.dart';
import 'api_service.dart';

class StudyException implements Exception {
  final String message;
  const StudyException(this.message);

  @override
  String toString() => message;
}

class Topic {
  final String id;
  final String name;
  final String subject;
  final int totalQuestions;

  const Topic({
    required this.id,
    required this.name,
    required this.subject,
    required this.totalQuestions,
  });

  factory Topic.fromJson(Map<String, dynamic> json) {
    return Topic(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      subject: (json['subject'] ?? '').toString(),
      totalQuestions: _parseInt(json['totalQuestions']),
    );
  }

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }
}

class Question {
  final String id;
  final String question;
  final List<String> options;
  final String? topic;
  final String? subject;

  const Question({
    required this.id,
    required this.question,
    required this.options,
    this.topic,
    this.subject,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    List<String> opts = [];
    final rawOpts = json['options'];
    if (rawOpts is List) {
      opts = rawOpts.map((o) => o.toString()).toList();
    }
    return Question(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      question: (json['question'] ?? '').toString(),
      options: opts,
      topic: json['topic']?.toString(),
      subject: json['subject']?.toString(),
    );
  }
}

class SubmitResult {
  final bool correct;
  final String correctAnswer;
  final String? explanation;
  final int points;

  const SubmitResult({
    required this.correct,
    required this.correctAnswer,
    this.explanation,
    required this.points,
  });

  factory SubmitResult.fromJson(Map<String, dynamic> json) {
    final data = json['data'] is Map<String, dynamic> ? json['data'] as Map<String, dynamic> : json;
    return SubmitResult(
      correct: data['correct'] == true,
      correctAnswer: (data['correctAnswer'] ?? '').toString(),
      explanation: data['explanation']?.toString(),
      points: _parseInt(data['points']),
    );
  }

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }
}

class StudyReport {
  final int totalAttempts;
  final double accuracy;
  final int topicsMastered;
  final Map<String, dynamic> raw;

  const StudyReport({
    required this.totalAttempts,
    required this.accuracy,
    required this.topicsMastered,
    required this.raw,
  });

  factory StudyReport.fromJson(Map<String, dynamic> json) {
    final data = json['data'] is Map<String, dynamic>
        ? json['data'] as Map<String, dynamic>
        : json;
    return StudyReport(
      totalAttempts: _parseInt(data['totalAttempts']),
      accuracy: _parseDouble(data['accuracy']),
      topicsMastered: _parseInt(data['topicsMastered']),
      raw: data,
    );
  }

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }

  static double _parseDouble(dynamic val) {
    if (val == null) return 0.0;
    if (val is double) return val;
    if (val is int) return val.toDouble();
    return double.tryParse(val.toString()) ?? 0.0;
  }
}

class StudyService {
  StudyService._();
  static final StudyService instance = StudyService._();

  Dio get _dio => ApiService.instance.dio;

  Future<List<Topic>> getTopics({String? subject, String? grade}) async {
    try {
      final queryParams = <String, String>{};
      if (subject != null && subject.isNotEmpty) queryParams['subject'] = subject;
      if (grade != null && grade.isNotEmpty) queryParams['grade'] = grade;

      final response = await _dio.get(
        '/practice/topics',
        queryParameters: queryParams.isEmpty ? null : queryParams,
      );

      if (response.statusCode == 200) {
        final body = response.data;
        List<dynamic> list = [];
        if (body is Map<String, dynamic>) {
          final data = body['data'];
          if (data is List) {
            list = data;
          } else if (data is Map<String, dynamic>) {
            final topics = data['topics'];
            if (topics is List) list = topics;
          } else if (body['topics'] is List) {
            list = body['topics'] as List;
          }
        } else if (body is List) {
          list = body;
        }
        return list
            .whereType<Map<String, dynamic>>()
            .map(Topic.fromJson)
            .toList();
      }
      throw const StudyException('Failed to load topics');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  Future<Question> getQuestion({
    required String subject,
    String? topic,
    String? grade,
  }) async {
    try {
      final queryParams = <String, String>{'subject': subject};
      if (topic != null && topic.isNotEmpty) queryParams['topic'] = topic;
      if (grade != null && grade.isNotEmpty) queryParams['grade'] = grade;

      final response = await _dio.get(
        '/practice/question',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200) {
        final body = response.data;
        Map<String, dynamic> qData = {};
        if (body is Map<String, dynamic>) {
          final data = body['data'];
          if (data is Map<String, dynamic>) {
            final q = data['question'];
            qData = q is Map<String, dynamic> ? q : data;
          } else {
            qData = body;
          }
        }
        return Question.fromJson(qData);
      }
      throw const StudyException('Failed to load question');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  Future<SubmitResult> submitAnswer({
    required String questionId,
    required String selected,
    int? timeSpent,
  }) async {
    try {
      final response = await _dio.post(
        '/practice/submit',
        data: {
          'questionId': questionId,
          'selected': selected,
          if (timeSpent != null) 'timeSpent': timeSpent,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return SubmitResult.fromJson(
          response.data is Map<String, dynamic>
              ? response.data as Map<String, dynamic>
              : {},
        );
      }
      throw const StudyException('Failed to submit answer');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  Future<StudyReport> getReport() async {
    try {
      final response = await _dio.get('/analysis/report');
      if (response.statusCode == 200) {
        return StudyReport.fromJson(
          response.data is Map<String, dynamic>
              ? response.data as Map<String, dynamic>
              : {},
        );
      }
      throw const StudyException('Failed to load report');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  Future<String> getAIAdvice() async {
    try {
      final response = await _dio.get('/ai/advice');
      if (response.statusCode == 200) {
        final body = response.data;
        if (body is Map<String, dynamic>) {
          final data = body['data'];
          if (data is Map<String, dynamic>) {
            return (data['advice'] ?? data['message'] ?? '').toString();
          }
          return (body['advice'] ?? body['message'] ?? '').toString();
        }
        return body.toString();
      }
      throw const StudyException('Failed to load AI advice');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  String _dioMessage(DioException e) {
    if (e.response != null) {
      final data = e.response?.data;
      if (data is Map<String, dynamic>) {
        return (data['message'] ?? data['error'] ?? 'Request failed').toString();
      }
      return 'Request failed (${e.response?.statusCode})';
    }
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return 'Connection timed out. Check your internet.';
    }
    return 'Network error. Please try again.';
  }
}
