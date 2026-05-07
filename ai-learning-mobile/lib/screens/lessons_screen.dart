import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../services/study_service.dart';

class LessonsScreen extends StatefulWidget {
  const LessonsScreen({super.key});

  @override
  State<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends State<LessonsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  static const List<Map<String, String>> _subjects = [
    {'value': 'Mathematics', 'label': 'Maths'},
    {'value': 'Science', 'label': 'Science'},
    {'value': 'English', 'label': 'English'},
    {'value': 'Social Science', 'label': 'Social'},
    {'value': 'Hindi', 'label': 'Hindi'},
  ];

  final Map<String, List<Topic>> _topicsBySubject = {};
  final Map<String, bool> _loading = {};
  final Map<String, String?> _errors = {};
  String _activeSubject = 'Mathematics';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _subjects.length, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        final subject = _subjects[_tabController.index]['value']!;
        setState(() => _activeSubject = subject);
        if (!_topicsBySubject.containsKey(subject)) {
          _loadTopics(subject);
        }
      }
    });

    final user = context.read<AuthProvider>().user;
    final initialSubject = user?.subject ?? 'Mathematics';
    final initialIndex = _subjects.indexWhere(
      (s) => s['value'] == initialSubject,
    );
    if (initialIndex >= 0) {
      _tabController.index = initialIndex;
      _activeSubject = initialSubject;
    }
    _loadTopics(_activeSubject);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadTopics(String subject) async {
    if (_loading[subject] == true) return;

    final user = context.read<AuthProvider>().user;

    setState(() {
      _loading[subject] = true;
      _errors[subject] = null;
    });

    try {
      final topics = await StudyService.instance.getTopics(
        subject: subject,
        grade: user?.grade,
      );
      if (mounted) {
        setState(() => _topicsBySubject[subject] = topics);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errors[subject] = e.toString());
      }
    } finally {
      if (mounted) setState(() => _loading[subject] = false);
    }
  }

  void _showTopicDetail(BuildContext context, Topic topic) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _TopicDetailSheet(topic: topic),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Lessons'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            color: kBackground,
            child: TabBar(
              controller: _tabController,
              isScrollable: true,
              labelColor: kPrimary,
              unselectedLabelColor: kTextSecondary,
              indicatorColor: kPrimary,
              indicatorWeight: 2.5,
              labelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
              ),
              tabs: _subjects
                  .map((s) => Tab(text: s['label']))
                  .toList(),
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: _subjects.map((s) {
          final subject = s['value']!;
          return _buildSubjectTab(subject);
        }).toList(),
      ),
    );
  }

  Widget _buildSubjectTab(String subject) {
    if (_loading[subject] == true) {
      return const Center(child: CircularProgressIndicator(color: kPrimary));
    }

    final error = _errors[subject];
    if (error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, color: kError, size: 48),
              const SizedBox(height: 16),
              Text(error,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: kTextSecondary)),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => _loadTopics(subject),
                style:
                    ElevatedButton.styleFrom(minimumSize: const Size(160, 44)),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    final topics = _topicsBySubject[subject];
    if (topics == null) {
      return const Center(child: CircularProgressIndicator(color: kPrimary));
    }

    if (topics.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.menu_book_outlined,
                  color: kTextTertiary, size: 56),
              const SizedBox(height: 16),
              const Text(
                'No topics yet',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    color: kTextPrimary),
              ),
              const SizedBox(height: 8),
              Text(
                'Topics for $subject will appear here.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: kTextSecondary),
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => _loadTopics(subject),
      color: kPrimary,
      child: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: topics.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (ctx, i) {
          final topic = topics[i];
          return _buildTopicCard(ctx, topic);
        },
      ),
    );
  }

  Widget _buildTopicCard(BuildContext context, Topic topic) {
    return GestureDetector(
      onTap: () => _showTopicDetail(context, topic),
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
                color: const Color(0xFF5856D6).withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.article_outlined,
                  color: Color(0xFF5856D6), size: 22),
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
                    '${topic.totalQuestions} questions available',
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
}

class _TopicDetailSheet extends StatelessWidget {
  final Topic topic;

  const _TopicDetailSheet({required this.topic});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.fromLTRB(
        24,
        20,
        24,
        MediaQuery.of(context).padding.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: kSeparator,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: const Color(0xFF5856D6).withOpacity(0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.article_outlined,
                color: Color(0xFF5856D6), size: 28),
          ),
          const SizedBox(height: 16),
          Text(
            topic.name,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: kTextPrimary,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            topic.subject,
            style: const TextStyle(fontSize: 15, color: kTextSecondary),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: kBackground,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.quiz_outlined,
                    color: kPrimary, size: 20),
                const SizedBox(width: 12),
                Text(
                  '${topic.totalQuestions} practice questions',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: kTextPrimary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.of(context).pop();
              // Signal to parent to navigate to practice
            },
            icon: const Icon(Icons.play_circle_outline_rounded),
            label: const Text('Practice this Topic'),
          ),
        ],
      ),
    );
  }
}
