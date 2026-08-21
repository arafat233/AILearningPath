import 'dart:convert';
import 'dart:io';

import 'package:path_provider/path_provider.dart';

import 'api_service.dart';

/// A question inside a downloaded pack — carries its own answer key so it
/// can be graded with no connectivity.
class OfflineQuestion {
  final String id;
  final String questionText;
  final String topic;
  final String? subject;
  final String? difficulty;
  final List<String> options;
  final int correctIndex;
  final String? solution;

  const OfflineQuestion({
    required this.id,
    required this.questionText,
    required this.topic,
    this.subject,
    this.difficulty,
    required this.options,
    required this.correctIndex,
    this.solution,
  });

  factory OfflineQuestion.fromJson(Map<String, dynamic> json) {
    return OfflineQuestion(
      id: (json['id'] ?? '').toString(),
      questionText: (json['questionText'] ?? '').toString(),
      topic: (json['topic'] ?? '').toString(),
      subject: json['subject']?.toString(),
      difficulty: json['difficulty']?.toString(),
      options: (json['options'] is List)
          ? (json['options'] as List).map((o) => o.toString()).toList()
          : <String>[],
      correctIndex: json['correctIndex'] is int
          ? json['correctIndex'] as int
          : int.tryParse('${json['correctIndex']}') ?? 0,
      solution: json['solution']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'questionText': questionText,
        'topic': topic,
        'subject': subject,
        'difficulty': difficulty,
        'options': options,
        'correctIndex': correctIndex,
        'solution': solution,
      };
}

class OfflinePack {
  final DateTime generatedAt;
  final List<String> topics;
  final List<OfflineQuestion> questions;

  const OfflinePack({
    required this.generatedAt,
    required this.topics,
    required this.questions,
  });

  factory OfflinePack.fromJson(Map<String, dynamic> json) {
    return OfflinePack(
      generatedAt:
          DateTime.tryParse('${json['generatedAt']}') ?? DateTime.now(),
      topics: (json['topics'] is List)
          ? (json['topics'] as List).map((t) => t.toString()).toList()
          : <String>[],
      questions: (json['questions'] is List)
          ? (json['questions'] as List)
              .whereType<Map<String, dynamic>>()
              .map(OfflineQuestion.fromJson)
              .toList()
          : <OfflineQuestion>[],
    );
  }

  Map<String, dynamic> toJson() => {
        'generatedAt': generatedAt.toIso8601String(),
        'topics': topics,
        'questions': questions.map((q) => q.toJson()).toList(),
      };
}

/// Downloads practice packs to a local JSON file, queues attempts made
/// offline, and syncs them back when connectivity returns.
class OfflineService {
  OfflineService._();
  static final OfflineService instance = OfflineService._();

  Future<File> _packFile() async {
    final dir = await getApplicationDocumentsDirectory();
    return File('${dir.path}/offline_pack.json');
  }

  Future<File> _queueFile() async {
    final dir = await getApplicationDocumentsDirectory();
    return File('${dir.path}/offline_attempts.json');
  }

  /// GET /practice/offline-pack → save locally. Returns the pack.
  Future<OfflinePack> downloadPack() async {
    final response =
        await ApiService.instance.dio.get('/practice/offline-pack');
    if (response.statusCode != 200 || response.data is! Map<String, dynamic>) {
      throw Exception('Could not download pack');
    }
    final data = (response.data as Map<String, dynamic>)['data'];
    if (data is! Map<String, dynamic>) throw Exception('Bad pack response');
    final pack = OfflinePack.fromJson(data);
    final file = await _packFile();
    await file.writeAsString(jsonEncode(pack.toJson()));
    return pack;
  }

  /// Load the saved pack, or null if none downloaded yet / file corrupt.
  Future<OfflinePack?> loadPack() async {
    try {
      final file = await _packFile();
      if (!await file.exists()) return null;
      final json = jsonDecode(await file.readAsString());
      if (json is! Map<String, dynamic>) return null;
      return OfflinePack.fromJson(json);
    } catch (_) {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> _loadQueue() async {
    try {
      final file = await _queueFile();
      if (!await file.exists()) return [];
      final json = jsonDecode(await file.readAsString());
      if (json is! List) return [];
      return json.whereType<Map<String, dynamic>>().toList();
    } catch (_) {
      return [];
    }
  }

  /// Record an answer given offline; synced later via [syncAttempts].
  Future<void> queueAttempt({
    required String questionId,
    required int selectedOptionIndex,
    int? timeTaken,
  }) async {
    final queue = await _loadQueue();
    queue.add({
      'questionId': questionId,
      'selectedOptionIndex': selectedOptionIndex,
      if (timeTaken != null) 'timeTaken': timeTaken,
      'answeredAt': DateTime.now().toIso8601String(),
    });
    final file = await _queueFile();
    await file.writeAsString(jsonEncode(queue));
  }

  Future<int> pendingCount() async => (await _loadQueue()).length;

  /// POST queued attempts to /practice/sync-offline; clears the queue on
  /// success. Returns how many were synced (0 when nothing pending).
  Future<int> syncAttempts() async {
    final queue = await _loadQueue();
    if (queue.isEmpty) return 0;
    final response = await ApiService.instance.dio.post(
      '/practice/sync-offline',
      data: {'attempts': queue.take(200).toList()},
    );
    if (response.statusCode != 200) throw Exception('Sync failed');
    final remaining = queue.length > 200 ? queue.sublist(200) : <Map<String, dynamic>>[];
    final file = await _queueFile();
    await file.writeAsString(jsonEncode(remaining));
    final data = (response.data is Map<String, dynamic>)
        ? (response.data as Map<String, dynamic>)['data']
        : null;
    return (data is Map<String, dynamic> && data['synced'] is int)
        ? data['synced'] as int
        : queue.length;
  }
}
