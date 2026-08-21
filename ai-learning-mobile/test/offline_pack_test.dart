// Unit check for the offline-pack models: the JSON that goes to disk must
// round-trip losslessly, and malformed input must degrade safely — a corrupt
// pack file should never crash offline practice.
//
// Run: flutter test test/offline_pack_test.dart

import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:stellar/services/offline_service.dart';

void main() {
  final sampleJson = {
    'generatedAt': '2026-08-22T10:00:00.000Z',
    'topics': ['Trigonometry'],
    'questions': [
      {
        'id': 'q1',
        'questionText': 'What is sin 90?',
        'topic': 'Trigonometry',
        'subject': 'Math',
        'difficulty': 'easy',
        'options': ['1', '0', '-1', '0.5'],
        'correctIndex': 0,
        'solution': 'sin 90° = 1',
      },
    ],
  };

  test('pack JSON round-trips losslessly through encode/decode', () {
    final pack = OfflinePack.fromJson(sampleJson);
    final decoded = OfflinePack.fromJson(
      jsonDecode(jsonEncode(pack.toJson())) as Map<String, dynamic>,
    );

    expect(decoded.topics, ['Trigonometry']);
    expect(decoded.questions, hasLength(1));
    final q = decoded.questions.first;
    expect(q.id, 'q1');
    expect(q.options, hasLength(4));
    expect(q.correctIndex, 0);
    expect(q.solution, 'sin 90° = 1');
  });

  test('grading fields survive: selected == correctIndex decides correctness', () {
    final q = OfflinePack.fromJson(sampleJson).questions.first;
    expect(0 == q.correctIndex, isTrue); // "1" is right
    expect(1 == q.correctIndex, isFalse); // "0" is wrong
  });

  test('malformed input degrades to safe defaults instead of throwing', () {
    final pack = OfflinePack.fromJson({
      'generatedAt': 'not-a-date',
      'topics': 'not-a-list',
      'questions': [
        {'id': 42, 'options': null, 'correctIndex': '2'},
        'not-a-map',
      ],
    });

    expect(pack.topics, isEmpty);
    expect(pack.questions, hasLength(1)); // non-map entry dropped
    final q = pack.questions.first;
    expect(q.id, '42');
    expect(q.options, isEmpty);
    expect(q.correctIndex, 2); // string index parsed
  });
}
