import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/theme.dart';
import 'main_shell.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/register_screen.dart';
import 'screens/splash_screen.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiService.getInstance();
  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: const StellarApp(),
    ),
  );
}

class StellarApp extends StatelessWidget {
  const StellarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Stellar',
      debugShowCheckedModeBanner: false,
      theme: stellarTheme,
      initialRoute: '/splash',
      routes: {
        '/splash': (_) => const SplashScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/onboarding': (_) => const OnboardingScreen(),
        '/': (_) => const MainShell(),
      },
    );
  }
}
