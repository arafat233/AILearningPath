import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/user.dart';
import '../providers/auth_provider.dart';
import '../services/study_service.dart';

enum _PracticePhase { topics, question, result }

class PracticeScreen extends StatefulWidget {
  const PracticeScreen({super.key});

  @override
  State<PracticeScreen> createState() => _PracticeScreenState();
}

class _PracticeScreenState extends State<PracticeScreen> {
  _PracticePhase _phase = _PracticePhase.topics;

  // Topics phase
  List<Topic> _topics = [];
  bool _loadingTopics = false;
  String? _topicsError;
  Topic? _selectedTopic;

  // Question phase
  Question? _currentQuestion;
  bool _loadingQuestion = false;
  String? _questionError;
  int? _selectedOption; // index 0-3, not letter
  SubmitResult? _lastResult;
  bool _submitting = false;
  int _streak = 0;
  DateTime? _questionStartTime;

  @override
  void initState() {
    super.initState();
    _loadTopics();
  }

  User? get _user => context.read<AuthProvider>().user;

  Future<void> _loadTopics() async {
    setState(() {
      _loadingTopics = true;
      _topicsError = null;
    });
    try {
      final topics = await StudyService.instance.getTopics(
        subject: _user?.subject,
        grade: _user?.grade,
      );
      if (mounted) setState(() => _topics = topics);
    } catch (e) {
      if (mounted) setState(() => _topicsError = e.toString());
    } finally {
      if (mounted) setState(() => _loadingTopics = false);
    }
  }

  Future<void> _startTopic(Topic topic) async {
    setState(() {
      _selectedTopic = topic;
      _phase = _PracticePhase.question;
      _loadingQuestion = true;
      _questionError = null;
      _currentQuestion = null;
      _selectedOption = null;
      _lastResult = null;
    });
    await _fetchNextQuestion();
  }

  Future<void> _fetchNextQuestion() async {
    setState(() {
      _loadingQuestion = true;
      _questionError = null;
      _selectedOption = null;
      _lastResult = null;
      _questionStartTime = DateTime.now();
    });
    try {
      final question = await StudyService.instance.startTopic(_selectedTopic!.id);
      if (mounted) {
        setState(() {
          _currentQuestion = question;
          _questionStartTime = DateTime.now();
        });
      }
    } catch (e) {
      if (mounted) setState(() => _questionError = e.toString());
    } finally {
      if (mounted) setState(() => _loadingQuestion = false);
    }
  }

  Future<void> _selectOption(int index) async {
    if (_selectedOption != null || _submitting) return;

    setState(() {
      _selectedOption = index;
      _submitting = true;
    });

    final timeTaken = _questionStartTime != null
        ? DateTime.now().difference(_questionStartTime!).inSeconds
        : null;

    try {
      final result = await StudyService.instance.submitAnswer(
        selectedOptionIndex: index,
        timeTaken: timeTaken,
      );
      if (mounted) {
        setState(() {
          _lastResult = result;
          if (result.correct) {
            _streak++;
          } else {
            _streak = 0;
          }
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Submit failed: $e'),
            backgroundColor: kError,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _exitPractice() {
    setState(() {
      _phase = _PracticePhase.topics;
      _selectedTopic = null;
      _currentQuestion = null;
      _selectedOption = null;
      _lastResult = null;
      _streak = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (_phase) {
      case _PracticePhase.topics:
        return _buildTopicsPhase();
      case _PracticePhase.question:
        return _buildQuestionPhase();
      case _PracticePhase.result:
        return _buildTopicsPhase();
    }
  }

  // ---- TOPICS PHASE ----

  Widget _buildTopicsPhase() {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Practice'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadTopics,
            tooltip: 'Refresh topics',
          ),
        ],
      ),
      body: _buildTopicsBody(),
    );
  }

  Widget _buildTopicsBody() {
    if (_loadingTopics) {
      return const Center(
        child: CircularProgressIndicator(color: kPrimary),
      );
    }

    if (_topicsError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, color: kError, size: 48),
              const SizedBox(height: 16),
              Text(
                _topicsError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: kTextSecondary),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _loadTopics,
                style: ElevatedButton.styleFrom(minimumSize: const Size(160, 44)),
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      );
    }

    if (_topics.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.school_outlined, color: kTextTertiary, size: 56),
              const SizedBox(height: 16),
              const Text(
                'No topics found',
                style: TextStyle(
                    fontSize: 17, fontWeight: FontWeight.w600, color: kTextPrimary),
              ),
              const SizedBox(height: 8),
              const Text(
                'Complete onboarding to see topics for your subject.',
                textAlign: TextAlign.center,
                style: TextStyle(color: kTextSecondary),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: _topics.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, i) => _buildTopicCard(_topics[i]),
    );
  }

  Widget _buildTopicCard(Topic topic) {
    return GestureDetector(
      onTap: () => _startTopic(topic),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: kCard,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: kPrimary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.topic_outlined, color: kPrimary, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    topic.name,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: kTextPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${topic.totalQuestions} questions',
                    style: const TextStyle(
                      fontSize: 13,
                      color: kTextSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: kTextTertiary),
          ],
        ),
      ),
    );
  }

  // ---- QUESTION PHASE ----

  Widget _buildQuestionPhase() {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: _exitPractice,
        ),
        title: Text(_selectedTopic?.name ?? 'Practice'),
        actions: [
          if (_streak > 0)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Row(
                children: [
                  const Text('🔥', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 4),
                  Text(
                    '$_streak',
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: kWarning,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
      body: _buildQuestionBody(),
    );
  }

  Widget _buildQuestionBody() {
    if (_loadingQuestion) {
      return const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(color: kPrimary),
            SizedBox(height: 16),
            Text('Loading question…', style: TextStyle(color: kTextSecondary)),
          ],
        ),
      );
    }

    if (_questionError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, color: kError, size: 48),
              const SizedBox(height: 16),
              Text(
                _questionError!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: kTextSecondary),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _fetchNextQuestion,
                style: ElevatedButton.styleFrom(minimumSize: const Size(160, 44)),
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      );
    }

    if (_currentQuestion == null) return const SizedBox.shrink();

    final q = _currentQuestion!;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildQuestionCard(q),
          const SizedBox(height: 20),
          ...q.options.asMap().entries.map((e) {
            final idx = e.key;
            final opt = e.value;
            final letter = String.fromCharCode(65 + idx); // A, B, C, D
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildOptionTile(index: idx, letter: letter, text: opt),
            );
          }),
          if (_lastResult != null) ...[
            const SizedBox(height: 8),
            _buildResultCard(_lastResult!),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _fetchNextQuestion,
              child: const Text('Next Question'),
            ),
          ],
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildQuestionCard(Question q) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        q.question,
        style: const TextStyle(
          fontSize: 17,
          fontWeight: FontWeight.w500,
          color: kTextPrimary,
          height: 1.6,
        ),
      ),
    );
  }

  Widget _buildOptionTile({
    required int index,
    required String letter,
    required String text,
  }) {
    final isSelected = _selectedOption == index;
    final hasResult = _lastResult != null;
    final isCorrect = hasResult && _lastResult!.correctOptionIndex == index;
    final isWrong = isSelected && hasResult && !_lastResult!.correct;

    Color bgColor = kCard;
    Color borderColor = kSeparator;
    Color textColor = kTextPrimary;
    Color letterBg = kBackground;
    Color letterColor = kTextSecondary;

    if (isCorrect) {
      bgColor = kSuccess.withOpacity(0.08);
      borderColor = kSuccess;
      textColor = kTextPrimary;
      letterBg = kSuccess;
      letterColor = Colors.white;
    } else if (isWrong) {
      bgColor = kError.withOpacity(0.08);
      borderColor = kError;
      textColor = kTextPrimary;
      letterBg = kError;
      letterColor = Colors.white;
    } else if (isSelected) {
      bgColor = kPrimary.withOpacity(0.08);
      borderColor = kPrimary;
      letterBg = kPrimary;
      letterColor = Colors.white;
    }

    return GestureDetector(
      onTap: hasResult ? null : () => _selectOption(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: borderColor, width: isSelected ? 1.5 : 1),
        ),
        child: Row(
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: letterBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  letter,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: letterColor,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w400,
                  color: textColor,
                  height: 1.4,
                ),
              ),
            ),
            if (isCorrect)
              const Icon(Icons.check_circle_rounded, color: kSuccess, size: 20)
            else if (isWrong)
              const Icon(Icons.cancel_rounded, color: kError, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard(SubmitResult result) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: result.correct
            ? kSuccess.withOpacity(0.08)
            : kError.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: result.correct
              ? kSuccess.withOpacity(0.4)
              : kError.withOpacity(0.4),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                result.correct
                    ? Icons.check_circle_rounded
                    : Icons.cancel_rounded,
                color: result.correct ? kSuccess : kError,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                result.correct ? 'Correct! +${result.points} pts' : 'Incorrect',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: result.correct ? kSuccess : kError,
                ),
              ),
              if (_streak > 1) ...[
                const SizedBox(width: 8),
                Text('🔥 $_streak streak!', style: const TextStyle(fontSize: 13)),
              ],
            ],
          ),
          if (result.explanation != null && result.explanation!.isNotEmpty) ...[
            const SizedBox(height: 10),
            Container(height: 0.5, color: kSeparator),
            const SizedBox(height: 10),
            const Text(
              'Explanation',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: kTextSecondary,
                letterSpacing: 0.4,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              result.explanation!,
              style: const TextStyle(
                fontSize: 14,
                color: kTextPrimary,
                height: 1.5,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
