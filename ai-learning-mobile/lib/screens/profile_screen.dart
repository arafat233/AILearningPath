import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/user.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (_, auth, __) {
        final user = auth.user;
        if (user == null) {
          return const Scaffold(
            backgroundColor: kBackground,
            body: Center(child: CircularProgressIndicator(color: kPrimary)),
          );
        }
        return _ProfileView(user: user, auth: auth);
      },
    );
  }
}

class _ProfileView extends StatelessWidget {
  final User user;
  final AuthProvider auth;

  const _ProfileView({required this.user, required this.auth});

  Future<void> _logout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Log Out'),
        content:
            const Text('Are you sure you want to log out of your account?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: kError),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    await auth.logout();

    if (context.mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (_) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBackground,
      appBar: AppBar(title: const Text('Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _buildAvatar(),
            const SizedBox(height: 24),
            _buildInfoCard(),
            const SizedBox(height: 16),
            _buildStatsCard(),
            const SizedBox(height: 16),
            if (user.thinkingProfile != null &&
                user.thinkingProfile!.isNotEmpty) ...[
              _buildThinkingProfileCard(),
              const SizedBox(height: 16),
            ],
            _buildLogoutButton(context),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatar() {
    return Column(
      children: [
        Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            color: kPrimary,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: kPrimary.withOpacity(0.3),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Center(
            child: Text(
              user.initials,
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          user.name,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: kTextPrimary,
            letterSpacing: -0.3,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          user.email,
          style: const TextStyle(fontSize: 15, color: kTextSecondary),
        ),
        const SizedBox(height: 12),
        _buildPlanBadge(),
      ],
    );
  }

  Widget _buildPlanBadge() {
    final isPro = user.isPaid;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      decoration: BoxDecoration(
        color: isPro ? kWarning.withOpacity(0.12) : kBackground,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isPro ? kWarning.withOpacity(0.5) : kSeparator,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isPro ? Icons.star_rounded : Icons.person_outline_rounded,
            size: 14,
            color: isPro ? kWarning : kTextSecondary,
          ),
          const SizedBox(width: 5),
          Text(
            isPro ? 'Pro Plan' : 'Free Plan',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isPro ? kWarning : kTextSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard() {
    return Container(
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          _buildInfoRow(
            icon: Icons.school_outlined,
            label: 'Grade',
            value: user.grade != null ? 'Grade ${user.grade}' : 'Not set',
          ),
          const Divider(height: 1, indent: 56),
          _buildInfoRow(
            icon: Icons.subject_rounded,
            label: 'Subject',
            value: user.subject ?? 'Not set',
          ),
          const Divider(height: 1, indent: 56),
          _buildInfoRow(
            icon: Icons.assignment_outlined,
            label: 'Exam Board',
            value: user.examBoard ?? 'Not set',
          ),
          if (user.schoolName != null && user.schoolName!.isNotEmpty) ...[
            const Divider(height: 1, indent: 56),
            _buildInfoRow(
              icon: Icons.business_outlined,
              label: 'School',
              value: user.schoolName!,
            ),
          ],
          if (user.role != null && user.role!.isNotEmpty) ...[
            const Divider(height: 1, indent: 56),
            _buildInfoRow(
              icon: Icons.badge_outlined,
              label: 'Role',
              value: _capitalise(user.role!),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Icon(icon, color: kTextSecondary, size: 20),
          const SizedBox(width: 12),
          SizedBox(
            width: 90,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                color: kTextSecondary,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: kTextPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsCard() {
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
            'Your Progress',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: kTextPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildStatItem(
                  icon: Icons.quiz_outlined,
                  value: user.totalAttempts.toString(),
                  label: 'Attempts',
                  color: kPrimary,
                ),
              ),
              Container(width: 1, height: 48, color: kSeparator),
              Expanded(
                child: _buildStatItem(
                  icon: Icons.track_changes_rounded,
                  value: '${user.accuracy.toStringAsFixed(0)}%',
                  label: 'Accuracy',
                  color: kSuccess,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Column(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
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
    );
  }

  Widget _buildThinkingProfileCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: kCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF5856D6).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.psychology_outlined,
                color: Color(0xFF5856D6), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Thinking Profile',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: kTextSecondary,
                    letterSpacing: 0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  user.thinkingProfile!,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF5856D6),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (_, auth, __) {
        return OutlinedButton.icon(
          onPressed: auth.isLoading ? null : () => _logout(context),
          icon: auth.isLoading
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: kError),
                )
              : const Icon(Icons.logout_rounded),
          label: const Text('Log Out'),
          style: OutlinedButton.styleFrom(
            foregroundColor: kError,
            side: const BorderSide(color: kError, width: 1.5),
          ),
        );
      },
    );
  }

  String _capitalise(String s) =>
      s.isEmpty ? s : s[0].toUpperCase() + s.substring(1).toLowerCase();
}
