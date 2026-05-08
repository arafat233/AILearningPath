import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../services/study_service.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  AnalyticsReport? _report;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadReport();
  }

  Future<void> _loadReport() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final report = await StudyService.instance.getFullReport();
      if (mounted) setState(() => _report = report);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  // ── Profile descriptions ───────────────────────────────────────────────────

  static const Map<String, _ProfileMeta> _profiles = {
    'Guesser': _ProfileMeta(
      icon: Icons.casino_outlined,
      description: 'You often answer quickly without thinking through the options.',
    ),
    'Surface Learner': _ProfileMeta(
      icon: Icons.remove_red_eye_outlined,
      description: 'You recognise patterns but sometimes miss deeper concepts.',
    ),
    'Overthinker': _ProfileMeta(
      icon: Icons.psychology_outlined,
      description: 'You spend extra time but your instincts are often right.',
    ),
    'Pattern Recognizer': _ProfileMeta(
      icon: Icons.grid_view_outlined,
      description: 'You excel at spotting familiar patterns in questions.',
    ),
    'Deep Thinker': _ProfileMeta(
      icon: Icons.lightbulb_outlined,
      description: 'You reason carefully and rarely make impulsive mistakes.',
    ),
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Analytics'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadReport,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: kPrimary),
      );
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, color: kError, size: 48),
              const SizedBox(height: 16),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: kTextSecondary),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _loadReport,
                style: ElevatedButton.styleFrom(minimumSize: const Size(160, 44)),
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      );
    }

    if (_report == null) {
      return const Center(
        child: Text(
          'No analytics data yet.',
          style: TextStyle(color: kTextSecondary),
        ),
      );
    }

    final report = _report!;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildThinkingProfileCard(report.thinkingProfile),
          const SizedBox(height: 20),
          _buildPerformanceStats(report),
          const SizedBox(height: 20),
          if (report.behaviorStats != null) ...[
            _buildBehaviorStats(report.behaviorStats!),
            const SizedBox(height: 20),
          ],
          if (report.topicProgress.isNotEmpty) ...[
            _buildTopicProgress(report.topicProgress),
            const SizedBox(height: 20),
          ],
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  // ── Thinking profile ─────────────────────────────────────────────────────────

  Widget _buildThinkingProfileCard(String? profileName) {
    final meta = profileName != null ? _profiles[profileName] : null;
    final icon = meta?.icon ?? Icons.school_outlined;
    final description = meta?.description ?? 'Complete more practice to unlock your thinking profile.';
    final label = profileName ?? 'Not determined yet';

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [kPrimary, Color(0xFF0066DD)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Thinking Profile',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white70,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.4,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.white.withOpacity(0.85),
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Performance stats ────────────────────────────────────────────────────────

  Widget _buildPerformanceStats(AnalyticsReport report) {
    final topicsInProgress = report.topicProgress.where((t) => t.attempts > 0).length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Performance',
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w600,
            color: kTextPrimary,
            letterSpacing: -0.1,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatTile(
                icon: Icons.quiz_outlined,
                value: report.totalAttempts.toString(),
                label: 'Total Attempts',
                color: const Color(0xFF5856D6),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatTile(
                icon: Icons.track_changes_rounded,
                value: '${report.accuracy.toStringAsFixed(1)}%',
                label: 'Accuracy',
                color: kSuccess,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatTile(
                icon: Icons.trending_up_rounded,
                value: topicsInProgress.toString(),
                label: 'In Progress',
                color: kWarning,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatTile({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: kTextPrimary,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: kTextSecondary,
            ),
          ),
        ],
      ),
    );
  }

  // ── Behavior stats ───────────────────────────────────────────────────────────

  Widget _buildBehaviorStats(BehaviorStats bs) {
    final rows = [
      _BehaviorRow('Guessing', bs.guessing, bs.percentage(bs.guessing)),
      _BehaviorRow('Concept Error', bs.conceptError, bs.percentage(bs.conceptError)),
      _BehaviorRow('Calc Error', bs.calculationError, bs.percentage(bs.calculationError)),
      _BehaviorRow('Partial Logic', bs.partialLogic, bs.percentage(bs.partialLogic)),
      _BehaviorRow('Misinterpretation', bs.misinterpretation, bs.percentage(bs.misinterpretation)),
    ];

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'How You Make Mistakes',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: kTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Based on ${bs.total} error${bs.total == 1 ? '' : 's'} analysed',
            style: const TextStyle(
              fontSize: 12,
              color: kTextSecondary,
            ),
          ),
          const SizedBox(height: 16),
          ...rows.map((row) => _buildBehaviorBar(row)),
        ],
      ),
    );
  }

  Widget _buildBehaviorBar(_BehaviorRow row) {
    final pct = (row.fraction * 100).round();
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                row.label,
                style: const TextStyle(
                  fontSize: 13,
                  color: kTextPrimary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                '$pct%',
                style: const TextStyle(
                  fontSize: 13,
                  color: kTextSecondary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          LayoutBuilder(
            builder: (context, constraints) {
              return Container(
                height: 6,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: kBackground,
                  borderRadius: BorderRadius.circular(3),
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    height: 6,
                    width: constraints.maxWidth * row.fraction,
                    decoration: BoxDecoration(
                      color: _barColor(row.fraction),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Color _barColor(double fraction) {
    if (fraction >= 0.4) return kError;
    if (fraction >= 0.2) return kWarning;
    return kSuccess;
  }

  // ── Topic progress ───────────────────────────────────────────────────────────

  Widget _buildTopicProgress(List<TopicProgress> progress) {
    // Top 10 by attempts
    final sorted = [...progress]
      ..sort((a, b) => b.attempts.compareTo(a.attempts));
    final top = sorted.take(10).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Topic Progress',
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w600,
            color: kTextPrimary,
            letterSpacing: -0.1,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: kCard,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: top.asMap().entries.map((e) {
              final idx = e.key;
              final topic = e.value;
              final isLast = idx == top.length - 1;
              return _buildTopicRow(topic, isLast: isLast);
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildTopicRow(TopicProgress topic, {required bool isLast}) {
    final accuracyFraction = (topic.accuracy / 100).clamp(0.0, 1.0);
    Color accuracyColor;
    if (topic.accuracy >= 70) {
      accuracyColor = kSuccess;
    } else if (topic.accuracy >= 40) {
      accuracyColor = kWarning;
    } else {
      accuracyColor = kError;
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Expanded(
                flex: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      topic.topic,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: kTextPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${topic.attempts} attempt${topic.attempts == 1 ? '' : 's'}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: kTextSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 4,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${topic.accuracy.toStringAsFixed(0)}%',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: accuracyColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        return Container(
                          height: 5,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: kBackground,
                            borderRadius: BorderRadius.circular(3),
                          ),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: Container(
                              height: 5,
                              width: constraints.maxWidth * accuracyFraction,
                              decoration: BoxDecoration(
                                color: accuracyColor,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (!isLast)
          Container(height: 0.5, color: kSeparator, margin: const EdgeInsets.symmetric(horizontal: 16)),
      ],
    );
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

class _ProfileMeta {
  final IconData icon;
  final String description;
  const _ProfileMeta({required this.icon, required this.description});
}

class _BehaviorRow {
  final String label;
  final int count;
  final double fraction;
  const _BehaviorRow(this.label, this.count, this.fraction);
}
