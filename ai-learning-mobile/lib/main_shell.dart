import 'package:flutter/material.dart';
import 'config/theme.dart';
import 'screens/dashboard_screen.dart';
import 'screens/lessons_screen.dart';
import 'screens/practice_screen.dart';
import 'screens/profile_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  static const List<_TabItem> _tabs = [
    _TabItem(
      label: 'Dashboard',
      icon: Icons.home_outlined,
      activeIcon: Icons.home_rounded,
    ),
    _TabItem(
      label: 'Practice',
      icon: Icons.edit_outlined,
      activeIcon: Icons.edit_rounded,
    ),
    _TabItem(
      label: 'Lessons',
      icon: Icons.menu_book_outlined,
      activeIcon: Icons.menu_book_rounded,
    ),
    _TabItem(
      label: 'Profile',
      icon: Icons.person_outline_rounded,
      activeIcon: Icons.person_rounded,
    ),
  ];

  final List<Widget> _screens = const [
    DashboardScreen(),
    PracticeScreen(),
    LessonsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(color: kSeparator, width: 0.5),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          items: _tabs
              .map(
                (tab) => BottomNavigationBarItem(
                  icon: Icon(tab.icon),
                  activeIcon: Icon(tab.activeIcon),
                  label: tab.label,
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}

class _TabItem {
  final String label;
  final IconData icon;
  final IconData activeIcon;

  const _TabItem({
    required this.label,
    required this.icon,
    required this.activeIcon,
  });
}
