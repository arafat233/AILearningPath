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
      opts = rawOpts.map<String>((o) {
        if (o is Map) return (o['text'] ?? '').toString();
        return o.toString();
      }).toList();
    }
    return Question(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      question: (json['questionText'] ?? json['question'] ?? '').toString(),
      options: opts,
      topic: json['topic']?.toString(),
      subject: json['subject']?.toString(),
    );
  }
}

class SubmitResult {
  final bool correct;
  final int correctOptionIndex;
  final String correctAnswer; // derived letter: A, B, C, D
  final String? explanation;
  final int points;

  const SubmitResult({
    required this.correct,
    required this.correctOptionIndex,
    required this.correctAnswer,
    this.explanation,
    required this.points,
  });

  factory SubmitResult.fromJson(Map<String, dynamic> json) {
    final data =
        json['data'] is Map<String, dynamic> ? json['data'] as Map<String, dynamic> : json;
    final isCorrect = data['isCorrect'] == true || data['correct'] == true;
    final correctIdx = _parseInt(data['correctOptionIndex'] ?? data['correctAnswer']);
    final correctLetter = correctIdx >= 0 && correctIdx <= 25
        ? String.fromCharCode(65 + correctIdx)
        : '';
    return SubmitResult(
      correct: isCorrect,
      correctOptionIndex: correctIdx,
      correctAnswer: correctLetter,
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

// ── New model classes ──────────────────────────────────────────────────────────

class StreakStatus {
  final int streak;
  final int longestStreak;
  final bool graceAvailable;

  const StreakStatus({
    required this.streak,
    required this.longestStreak,
    required this.graceAvailable,
  });

  factory StreakStatus.fromJson(Map<String, dynamic> json) {
    final data =
        json['data'] is Map<String, dynamic> ? json['data'] as Map<String, dynamic> : json;
    return StreakStatus(
      streak: _parseInt(data['streak']),
      longestStreak: _parseInt(data['longestStreak']),
      graceAvailable: data['graceAvailable'] == true,
    );
  }

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }
}

class RevisionItem {
  final String topic;
  final String urgency; // "high" | "medium" | "low"
  final int daysOverdue;

  const RevisionItem({
    required this.topic,
    required this.urgency,
    required this.daysOverdue,
  });

  factory RevisionItem.fromJson(Map<String, dynamic> json) {
    return RevisionItem(
      topic: (json['topic'] ?? '').toString(),
      urgency: (json['urgency'] ?? 'low').toString(),
      daysOverdue: _parseInt(json['daysOverdue']),
    );
  }

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }
}

class BehaviorStats {
  final int guessing;
  final int conceptError;
  final int calculationError;
  final int partialLogic;
  final int misinterpretation;
  final int total;

  const BehaviorStats({
    required this.guessing,
    required this.conceptError,
    required this.calculationError,
    required this.partialLogic,
    required this.misinterpretation,
    required this.total,
  });

  factory BehaviorStats.fromJson(Map<String, dynamic> json) {
    final g = _parseInt(json['guessing']);
    final ce = _parseInt(json['conceptError']);
    final calc = _parseInt(json['calculationError']);
    final pl = _parseInt(json['partialLogic']);
    final mi = _parseInt(json['misinterpretation']);
    final t = _parseInt(json['total']);
    return BehaviorStats(
      guessing: g,
      conceptError: ce,
      calculationError: calc,
      partialLogic: pl,
      misinterpretation: mi,
      total: t > 0 ? t : (g + ce + calc + pl + mi),
    );
  }

  double percentage(int value) {
    if (total == 0) return 0.0;
    return (value / total).clamp(0.0, 1.0);
  }

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }
}

class TopicProgress {
  final String topic;
  final double accuracy;
  final int attempts;

  const TopicProgress({
    required this.topic,
    required this.accuracy,
    required this.attempts,
  });

  factory TopicProgress.fromJson(Map<String, dynamic> json) {
    return TopicProgress(
      topic: (json['topic'] ?? json['name'] ?? '').toString(),
      accuracy: _parseDouble(json['accuracy']),
      attempts: _parseInt(json['attempts']),
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

class AnalyticsReport {
  final int totalAttempts;
  final double accuracy;
  final String? thinkingProfile;
  final BehaviorStats? behaviorStats;
  final List<TopicProgress> topicProgress;
  final Map<String, dynamic> raw;

  const AnalyticsReport({
    required this.totalAttempts,
    required this.accuracy,
    this.thinkingProfile,
    this.behaviorStats,
    required this.topicProgress,
    required this.raw,
  });

  factory AnalyticsReport.fromJson(Map<String, dynamic> json) {
    final outer =
        json['data'] is Map<String, dynamic> ? json['data'] as Map<String, dynamic> : json;

    // The response may have userProfile nested inside data
    final profile = outer['userProfile'] is Map<String, dynamic>
        ? outer['userProfile'] as Map<String, dynamic>
        : outer;

    BehaviorStats? bs;
    if (profile['behaviorStats'] is Map<String, dynamic>) {
      bs = BehaviorStats.fromJson(profile['behaviorStats'] as Map<String, dynamic>);
    }

    List<TopicProgress> tp = [];
    final rawTp = profile['topicProgress'];
    if (rawTp is List) {
      tp = rawTp
          .whereType<Map<String, dynamic>>()
          .map(TopicProgress.fromJson)
          .toList();
    }

    return AnalyticsReport(
      totalAttempts: _parseInt(profile['totalAttempts'] ?? outer['totalAttempts']),
      accuracy: _parseDouble(profile['accuracy'] ?? outer['accuracy']),
      thinkingProfile: profile['thinkingProfile']?.toString(),
      behaviorStats: bs,
      topicProgress: tp,
      raw: outer,
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

// ── Service ───────────────────────────────────────────────────────────────────

class StudyService {
  StudyService._();
  static final StudyService instance = StudyService._();

  Dio get _dio => ApiService.instance.dio;

  // GET /topics
  Future<List<Topic>> getTopics({String? subject, String? grade}) async {
    try {
      final queryParams = <String, String>{};
      if (subject != null && subject.isNotEmpty) queryParams['subject'] = subject;
      if (grade != null && grade.isNotEmpty) queryParams['grade'] = grade;

      final response = await _dio.get(
        '/topics',
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
        return list.whereType<Map<String, dynamic>>().map(Topic.fromJson).toList();
      }
      throw const StudyException('Failed to load topics');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  // POST /practice/start { topicId } → returns question directly (not wrapped in data{})
  Future<Question> startTopic(String topicId) async {
    try {
      final response = await _dio.post(
        '/practice/start',
        data: {'topicId': topicId},
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = response.data;
        Map<String, dynamic> qData = {};
        if (body is Map<String, dynamic>) {
          // Try data wrapper first, then bare question
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
      throw const StudyException('Failed to start topic');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  // POST /practice/submit { selectedOptionIndex, timeTaken }
  Future<SubmitResult> submitAnswer({
    required int selectedOptionIndex,
    int? timeTaken,
  }) async {
    try {
      final response = await _dio.post(
        '/practice/submit',
        data: {
          'selectedOptionIndex': selectedOptionIndex,
          if (timeTaken != null) 'timeTaken': timeTaken,
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

  // GET /analysis/report
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

  // GET /user/streak-status → { data: { streak, longestStreak, graceAvailable } }
  Future<StreakStatus> getStreakStatus() async {
    try {
      final response = await _dio.get('/user/streak-status');
      if (response.statusCode == 200) {
        return StreakStatus.fromJson(
          response.data is Map<String, dynamic>
              ? response.data as Map<String, dynamic>
              : {},
        );
      }
      throw const StudyException('Failed to load streak');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  // GET /user/daily-brief → { data: { ... } }
  Future<Map<String, dynamic>> getDailyBrief() async {
    try {
      final response = await _dio.get('/user/daily-brief');
      if (response.statusCode == 200) {
        final body = response.data;
        if (body is Map<String, dynamic>) {
          final data = body['data'];
          if (data is Map<String, dynamic>) return data;
          return body;
        }
      }
      throw const StudyException('Failed to load daily brief');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  // GET /revision/due → list of { topic, nextRevision, urgency }
  Future<List<RevisionItem>> getRevisionDue() async {
    try {
      final response = await _dio.get('/revision/due');
      if (response.statusCode == 200) {
        final body = response.data;
        List<dynamic> list = [];
        if (body is Map<String, dynamic>) {
          final data = body['data'];
          if (data is List) {
            list = data;
          } else if (body['items'] is List) {
            list = body['items'] as List;
          }
        } else if (body is List) {
          list = body;
        }
        return list.whereType<Map<String, dynamic>>().map(RevisionItem.fromJson).toList();
      }
      throw const StudyException('Failed to load revision due');
    } on DioException catch (e) {
      throw StudyException(_dioMessage(e));
    }
  }

  // GET /analysis/report (full analytics)
  Future<AnalyticsReport> getFullReport() async {
    try {
      final response = await _dio.get('/analysis/report');
      if (response.statusCode == 200) {
        return AnalyticsReport.fromJson(
          response.data is Map<String, dynamic>
              ? response.data as Map<String, dynamic>
              : {},
        );
      }
      throw const StudyException('Failed to load analytics');
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
