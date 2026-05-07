import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../services/study_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  StudyReport? _report;
  String? _aiAdvice;
  bool _loadingReport = false;
  bool _loadingAdvice = false;
  bool _adviceExpanded = false;
  String? _reportError;
  String? _adviceError;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    _loadReport();
    _loadAdvice();
  }

  Future<void> _loadReport() async {
    setState(() {
      _loadingReport = true;
      _reportError = null;
    });
    try {
      final report = await StudyService.instance.getReport();
      if (mounted) setState(() => _report = report);
    } catch (e) {
      if (mounted) setState(() => _reportError = e.toString());
    } finally {
      if (mounted) setState(() => _loadingReport = false);
    }
  }

  Future<void> _loadAdvice() async {
    setState(() {
      _loadingAdvice = true;
      _adviceError = null;
    });
    try {
      final advice = await StudyService.instance.getAIAdvice();
      if (mounted) setState(() => _aiAdvice = advice);
    } catch (e) {
      if (mounted) setState(() => _adviceError = e.toString());
    } finally {
      if (mounted) setState(() => _loadingAdvice = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: RefreshIndicator(
        onRefresh: _loadData,
        color: kPrimary,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            _buildAppBar(),
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  _buildGreeting(),
                  const SizedBox(height: 20),
                  _buildStatsRow(),
                  const SizedBox(height: 20),
                  _buildAIAdviceCard(),
                  const SizedBox(height: 20),
                  _buildQuickActions(),
                  const SizedBox(height: 40),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverAppBar _buildAppBar() {
    return const SliverAppBar(
      title: Text('Dashboard'),
      floating: true,
      snap: true,
      backgroundColor: kBackground,
    );
  }

  Widget _buildGreeting() {
    return Consumer<AuthProvider>(
      builder: (_, auth, __) {
        final user = auth.user;
        final hour = DateTime.now().hour;
        final greeting = hour < 12
            ? 'Good morning'
            : hour < 17
                ? 'Good afternoon'
                : 'Good evening';

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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$greeting,',
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.white.withOpacity(0.85),
                  fontWeight: FontWeight.w400,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                user?.name.split(' ').first ?? 'Student',
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: -0.5,
                ),
              ),
              if (user?.grade != null || user?.subject != null) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    if (user?.grade != null)
                      _buildWhiteChip('Grade ${user!.grade}'),
                    if (user?.subject != null)
                      _buildWhiteChip(user!.subject!),
                    if (user?.examBoard != null)
                      _buildWhiteChip(user!.examBoard!),
                  ],
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildWhiteChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 12,
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildStatsRow() {
    if (_loadingReport) {
      return _buildStatsShimmer();
    }

    final user = context.read<AuthProvider>().user;
    final attempts = _report?.totalAttempts ?? user?.totalAttempts ?? 0;
    final accuracy = _report?.accuracy ?? user?.accuracy ?? 0.0;
    final mastered = _report?.topicsMastered ?? 0;

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            icon: Icons.quiz_outlined,
            value: attempts.toString(),
            label: 'Attempts',
            color: const Color(0xFF5856D6),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            icon: Icons.track_changes_rounded,
            value: '${accuracy.toStringAsFixed(0)}%',
            label: 'Accuracy',
            color: kSuccess,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            icon: Icons.verified_rounded,
            value: mastered.toString(),
            label: 'Mastered',
            color: kWarning,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsShimmer() {
    return Row(
      children: List.generate(3, (i) {
        return Expanded(
          child: Container(
            height: 90,
            margin: EdgeInsets.only(right: i < 2 ? 12 : 0),
            decoration: BoxDecoration(
              color: kCard,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2, color: kPrimary),
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: kTextPrimary,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: kTextSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAIAdviceCard() {
    return Container(
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _adviceExpanded = !_adviceExpanded),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(12),
              topRight: Radius.circular(12),
              bottomLeft: Radius.circular(12),
              bottomRight: Radius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: kPrimary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.auto_awesome_rounded,
                        color: kPrimary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'AI Study Advice',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: kTextPrimary,
                      ),
                    ),
                  ),
                  AnimatedRotation(
                    turns: _adviceExpanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const Icon(Icons.keyboard_arrow_down_rounded,
                        color: kTextSecondary),
                  ),
                ],
              ),
            ),
          ),
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: _buildAdviceContent(),
            crossFadeState: _adviceExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 250),
          ),
        ],
      ),
    );
  }

  Widget _buildAdviceContent() {
    if (_loadingAdvice) {
      return const Padding(
        padding: EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: Center(
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: 8),
            child: CircularProgressIndicator(strokeWidth: 2, color: kPrimary),
          ),
        ),
      );
    }
    if (_adviceError != null) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: kError.withOpacity(0.08),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            _adviceError!,
            style: const TextStyle(fontSize: 13, color: kError),
          ),
        ),
      );
    }
    if (_aiAdvice == null || _aiAdvice!.isEmpty) {
      return const Padding(
        padding: EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: Text(
          'No advice available yet. Keep practising to get personalised insights!',
          style: TextStyle(fontSize: 14, color: kTextSecondary),
        ),
      );
    }
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        children: [
          Container(height: 0.5, color: kSeparator),
          const SizedBox(height: 12),
          Text(
            _aiAdvice!,
            style: const TextStyle(
              fontSize: 14,
              color: kTextPrimary,
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Quick Actions',
            style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                icon: Icons.play_circle_outline_rounded,
                label: 'Start Practice',
                color: kPrimary,
                onTap: () {
                  // Navigate to Practice tab (index 1)
                  final shell =
                      context.findAncestorStateOfType<State>() as dynamic;
                  try {
                    shell.setState(() => shell._currentIndex = 1);
                  } catch (_) {}
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildActionCard(
                icon: Icons.menu_book_outlined,
                label: 'View Lessons',
                color: const Color(0xFF5856D6),
                onTap: () {},
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
