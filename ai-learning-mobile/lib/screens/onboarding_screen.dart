import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _step = 0;
  String? _grade;
  String? _subject;
  String? _examBoard;

  static const List<String> _grades = [
    '6', '7', '8', '9', '10', '11', '12',
  ];

  static const List<Map<String, String>> _subjects = [
    {'value': 'Mathematics', 'label': 'Mathematics', 'icon': '📐'},
    {'value': 'Science', 'label': 'Science', 'icon': '🔬'},
    {'value': 'English', 'label': 'English', 'icon': '📖'},
    {'value': 'Social Science', 'label': 'Social Science', 'icon': '🌍'},
    {'value': 'Hindi', 'label': 'Hindi', 'icon': '🖊️'},
  ];

  static const List<Map<String, String>> _boards = [
    {'value': 'CBSE', 'label': 'CBSE', 'desc': 'Central Board of Secondary Education'},
    {'value': 'ICSE', 'label': 'ICSE', 'desc': 'Indian Certificate of Secondary Education'},
    {'value': 'State Board', 'label': 'State Board', 'desc': 'State government curriculum'},
  ];

  bool get _canProceed {
    if (_step == 0) return _grade != null;
    if (_step == 1) return _subject != null;
    if (_step == 2) return _examBoard != null;
    return false;
  }

  Future<void> _proceed() async {
    if (_step < 2) {
      setState(() => _step++);
      return;
    }

    final auth = context.read<AuthProvider>();
    await auth.saveOnboarding(
      grade: _grade!,
      subject: _subject!,
      examBoard: _examBoard!,
    );

    if (!mounted) return;

    if (auth.error == null) {
      Navigator.of(context).pushReplacementNamed('/');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.error!),
          backgroundColor: kError,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      body: SafeArea(
        child: Column(
          children: [
            _buildProgressBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  transitionBuilder: (child, anim) => FadeTransition(
                    opacity: anim,
                    child: SlideTransition(
                      position: Tween<Offset>(
                        begin: const Offset(0.1, 0),
                        end: Offset.zero,
                      ).animate(anim),
                      child: child,
                    ),
                  ),
                  child: _buildStep(key: ValueKey(_step)),
                ),
              ),
            ),
            _buildBottomBar(),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: List.generate(3, (i) {
              final isActive = i <= _step;
              return Expanded(
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  height: 4,
                  margin: EdgeInsets.only(right: i < 2 ? 6 : 0),
                  decoration: BoxDecoration(
                    color: isActive ? kPrimary : kSeparator,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 12),
          Text(
            'Step ${_step + 1} of 3',
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(color: kTextTertiary),
          ),
        ],
      ),
    );
  }

  Widget _buildStep({required Key key}) {
    switch (_step) {
      case 0:
        return _buildGradeStep(key: key);
      case 1:
        return _buildSubjectStep(key: key);
      case 2:
        return _buildBoardStep(key: key);
      default:
        return const SizedBox.shrink(key: Key('empty'));
    }
  }

  Widget _buildGradeStep({required Key key}) {
    return Column(
      key: key,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        Text('Which grade are you in?',
            style: Theme.of(context).textTheme.headlineLarge),
        const SizedBox(height: 8),
        Text(
          'We\'ll personalise your content for your grade level.',
          style: Theme.of(context)
              .textTheme
              .bodyLarge
              ?.copyWith(color: kTextSecondary),
        ),
        const SizedBox(height: 32),
        GridView.count(
          crossAxisCount: 4,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.1,
          children: _grades.map((g) {
            final selected = _grade == g;
            return GestureDetector(
              onTap: () => setState(() => _grade = g),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: selected ? kPrimary : kCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? kPrimary : kSeparator,
                    width: selected ? 2 : 1,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Grade',
                      style: TextStyle(
                        fontSize: 10,
                        color: selected ? Colors.white.withOpacity(0.8) : kTextTertiary,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    Text(
                      g,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        color: selected ? Colors.white : kTextPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildSubjectStep({required Key key}) {
    return Column(
      key: key,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        Text('What\'s your main subject?',
            style: Theme.of(context).textTheme.headlineLarge),
        const SizedBox(height: 8),
        Text(
          'Pick the subject you want to focus on first.',
          style: Theme.of(context)
              .textTheme
              .bodyLarge
              ?.copyWith(color: kTextSecondary),
        ),
        const SizedBox(height: 32),
        Column(
          children: _subjects.map((s) {
            final selected = _subject == s['value'];
            return GestureDetector(
              onTap: () => setState(() => _subject = s['value']),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: selected ? kPrimary.withOpacity(0.06) : kCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? kPrimary : kSeparator,
                    width: selected ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Text(s['icon']!, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 16),
                    Text(
                      s['label']!,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: selected ? kPrimary : kTextPrimary,
                      ),
                    ),
                    const Spacer(),
                    if (selected)
                      const Icon(Icons.check_circle_rounded,
                          color: kPrimary, size: 22),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildBoardStep({required Key key}) {
    return Column(
      key: key,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        Text('Which exam board?',
            style: Theme.of(context).textTheme.headlineLarge),
        const SizedBox(height: 8),
        Text(
          'We\'ll align questions to your curriculum.',
          style: Theme.of(context)
              .textTheme
              .bodyLarge
              ?.copyWith(color: kTextSecondary),
        ),
        const SizedBox(height: 32),
        Column(
          children: _boards.map((b) {
            final selected = _examBoard == b['value'];
            return GestureDetector(
              onTap: () => setState(() => _examBoard = b['value']),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: selected ? kPrimary.withOpacity(0.06) : kCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? kPrimary : kSeparator,
                    width: selected ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            b['label']!,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: selected ? kPrimary : kTextPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            b['desc']!,
                            style: TextStyle(
                              fontSize: 13,
                              color: selected
                                  ? kPrimary.withOpacity(0.7)
                                  : kTextSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (selected)
                      const Icon(Icons.check_circle_rounded,
                          color: kPrimary, size: 22),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildBottomBar() {
    return Consumer<AuthProvider>(
      builder: (_, auth, __) {
        return Container(
          padding: EdgeInsets.fromLTRB(
              24, 16, 24, MediaQuery.of(context).padding.bottom + 16),
          decoration: const BoxDecoration(
            color: kCard,
            border: Border(top: BorderSide(color: kSeparator, width: 0.5)),
          ),
          child: Row(
            children: [
              if (_step > 0)
                OutlinedButton(
                  onPressed: () => setState(() => _step--),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(80, 50),
                  ),
                  child: const Text('Back'),
                ),
              if (_step > 0) const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: (_canProceed && !auth.isLoading) ? _proceed : null,
                  child: auth.isLoading && _step == 2
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            color: Colors.white,
                          ),
                        )
                      : Text(_step == 2 ? 'Get Started' : 'Continue'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
