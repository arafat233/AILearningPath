import 'package:flutter/material.dart';

import '../config/theme.dart';
import '../services/offline_service.dart';

/// Offline practice: download a pack of weak-topic questions while online,
/// practice them with zero connectivity (local grading + solutions), and
/// sync results back when a connection returns.
class OfflinePracticeScreen extends StatefulWidget {
  const OfflinePracticeScreen({super.key});

  @override
  State<OfflinePracticeScreen> createState() => _OfflinePracticeScreenState();
}

class _OfflinePracticeScreenState extends State<OfflinePracticeScreen> {
  OfflinePack? _pack;
  int _pending = 0;
  bool _busy = false;
  String? _status;

  // Practice state
  int _index = 0;
  int? _selected;
  int _correctCount = 0;
  DateTime? _questionStart;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final pack = await OfflineService.instance.loadPack();
    final pending = await OfflineService.instance.pendingCount();
    if (mounted) {
      setState(() {
        _pack = pack;
        _pending = pending;
        _index = 0;
        _selected = null;
        _correctCount = 0;
        _questionStart = DateTime.now();
      });
    }
  }

  Future<void> _download() async {
    setState(() {
      _busy = true;
      _status = null;
    });
    try {
      final pack = await OfflineService.instance.downloadPack();
      if (mounted) {
        setState(() {
          _pack = pack;
          _index = 0;
          _selected = null;
          _correctCount = 0;
          _questionStart = DateTime.now();
          _status = pack.questions.isEmpty
              ? 'No pack available yet — practice a few topics online first.'
              : 'Downloaded ${pack.questions.length} questions. You can go offline now.';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _status = 'Download failed — check your connection.');
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _sync() async {
    setState(() {
      _busy = true;
      _status = null;
    });
    try {
      final synced = await OfflineService.instance.syncAttempts();
      final pending = await OfflineService.instance.pendingCount();
      if (mounted) {
        setState(() {
          _pending = pending;
          _status = synced > 0
              ? 'Synced $synced answers to your account.'
              : 'Nothing to sync.';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() =>
            _status = 'Sync failed — your answers are safe, try again later.');
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _select(int i) async {
    if (_selected != null) return;
    final q = _pack!.questions[_index];
    final timeTaken =
        DateTime.now().difference(_questionStart ?? DateTime.now()).inSeconds;
    setState(() {
      _selected = i;
      if (i == q.correctIndex) _correctCount++;
      _pending++;
    });
    await OfflineService.instance.queueAttempt(
      questionId: q.id,
      selectedOptionIndex: i,
      timeTaken: timeTaken.clamp(1, 600),
    );
  }

  void _next() {
    setState(() {
      _index++;
      _selected = null;
      _questionStart = DateTime.now();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(
        title: const Text('Offline Practice'),
        actions: [
          if (_pending > 0)
            IconButton(
              icon: Badge(
                label: Text('$_pending'),
                child: const Icon(Icons.cloud_upload_outlined),
              ),
              onPressed: _busy ? null : _sync,
              tooltip: 'Sync $_pending answers',
            ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_pack == null || _pack!.questions.isEmpty) {
      return _buildEmptyState();
    }
    if (_index >= _pack!.questions.length) {
      return _buildDoneState();
    }
    return _buildQuestion();
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.download_for_offline_outlined,
                size: 56, color: kPrimary),
            const SizedBox(height: 16),
            const Text(
              'Download a practice pack',
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.w700, color: kTextPrimary),
            ),
            const SizedBox(height: 8),
            const Text(
              'Grab up to 40 questions on your weakest topics while you have signal — then practice anywhere, no internet needed. Your answers sync back automatically.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: kTextSecondary),
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: _busy ? null : _download,
              icon: _busy
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2))
                  : const Icon(Icons.download_rounded),
              label: Text(_busy ? 'Downloading…' : 'Download pack'),
            ),
            if (_status != null) ...[
              const SizedBox(height: 12),
              Text(_status!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 12, color: kTextSecondary)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDoneState() {
    final total = _pack!.questions.length;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.emoji_events_outlined, size: 56, color: kWarning),
            const SizedBox(height: 16),
            Text(
              'Pack complete — $_correctCount/$total correct',
              style: const TextStyle(
                  fontSize: 18, fontWeight: FontWeight.w700, color: kTextPrimary),
            ),
            const SizedBox(height: 8),
            Text(
              _pending > 0
                  ? '$_pending answers waiting to sync when you\'re back online.'
                  : 'All answers synced.',
              style: const TextStyle(fontSize: 13, color: kTextSecondary),
            ),
            const SizedBox(height: 20),
            Wrap(
              spacing: 12,
              children: [
                OutlinedButton(
                  onPressed: _busy ? null : _download,
                  child: const Text('Get a fresh pack'),
                ),
                if (_pending > 0)
                  FilledButton(
                    onPressed: _busy ? null : _sync,
                    child: Text(_busy ? 'Syncing…' : 'Sync now'),
                  ),
              ],
            ),
            if (_status != null) ...[
              const SizedBox(height: 12),
              Text(_status!,
                  style: const TextStyle(fontSize: 12, color: kTextSecondary)),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildQuestion() {
    final q = _pack!.questions[_index];
    final answered = _selected != null;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  '${q.topic} · ${_index + 1}/${_pack!.questions.length}',
                  style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: kTextSecondary),
                ),
              ),
              const Icon(Icons.wifi_off_rounded, size: 14, color: kTextTertiary),
              const SizedBox(width: 4),
              const Text('offline',
                  style: TextStyle(fontSize: 11, color: kTextTertiary)),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: kCard,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: kSeparator, width: 0.5),
            ),
            child: Text(
              q.questionText,
              style: const TextStyle(
                  fontSize: 15, height: 1.4, color: kTextPrimary),
            ),
          ),
          const SizedBox(height: 12),
          ...List.generate(q.options.length, (i) {
            Color border = kSeparator;
            Color? fill = kCard;
            if (answered) {
              if (i == q.correctIndex) {
                border = kSuccess;
                fill = kSuccess.withValues(alpha: 0.08);
              } else if (i == _selected) {
                border = kError;
                fill = kError.withValues(alpha: 0.08);
              }
            }
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: answered ? null : () => _select(i),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: fill,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: border),
                  ),
                  child: Row(
                    children: [
                      Text(
                        String.fromCharCode(65 + i),
                        style: const TextStyle(
                            fontWeight: FontWeight.w700, color: kTextSecondary),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(q.options[i],
                            style: const TextStyle(
                                fontSize: 14, color: kTextPrimary)),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
          if (answered) ...[
            const SizedBox(height: 4),
            Text(
              _selected == q.correctIndex ? 'Correct!' : 'Not quite.',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: _selected == q.correctIndex ? kSuccess : kError,
              ),
            ),
            if (q.solution != null && q.solution!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: kCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: kSeparator, width: 0.5),
                ),
                child: Text(q.solution!,
                    style: const TextStyle(
                        fontSize: 13, height: 1.4, color: kTextSecondary)),
              ),
            ],
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _next,
              child: Text(_index + 1 < _pack!.questions.length
                  ? 'Next question'
                  : 'Finish pack'),
            ),
          ],
        ],
      ),
    );
  }
}
