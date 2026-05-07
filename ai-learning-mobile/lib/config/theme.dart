import 'package:flutter/material.dart';

const Color kPrimary = Color(0xFF007AFF);
const Color kBackground = Color(0xFFF2F2F7);
const Color kCard = Color(0xFFFFFFFF);
const Color kError = Color(0xFFFF3B30);
const Color kTextPrimary = Color(0xFF1C1C1E);
const Color kTextSecondary = Color(0xFF6D6D72);
const Color kTextTertiary = Color(0xFFAEAEB2);
const Color kSeparator = Color(0xFFE5E5EA);
const Color kSuccess = Color(0xFF34C759);
const Color kWarning = Color(0xFFFF9500);

final ThemeData stellarTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: kPrimary,
    brightness: Brightness.light,
    primary: kPrimary,
    background: kBackground,
    surface: kCard,
    error: kError,
    onPrimary: Colors.white,
    onBackground: kTextPrimary,
    onSurface: kTextPrimary,
  ),
  scaffoldBackgroundColor: kBackground,
  cardTheme: CardTheme(
    elevation: 0,
    color: kCard,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    margin: EdgeInsets.zero,
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: kBackground,
    foregroundColor: kTextPrimary,
    elevation: 0,
    scrolledUnderElevation: 0,
    centerTitle: false,
    titleTextStyle: TextStyle(
      fontFamily: '.SF Pro Display',
      fontSize: 22,
      fontWeight: FontWeight.w700,
      color: kTextPrimary,
      letterSpacing: -0.5,
    ),
  ),
  textTheme: const TextTheme(
    displayLarge: TextStyle(
      fontSize: 34,
      fontWeight: FontWeight.w700,
      color: kTextPrimary,
      letterSpacing: -1.0,
    ),
    displayMedium: TextStyle(
      fontSize: 28,
      fontWeight: FontWeight.w700,
      color: kTextPrimary,
      letterSpacing: -0.5,
    ),
    headlineLarge: TextStyle(
      fontSize: 22,
      fontWeight: FontWeight.w700,
      color: kTextPrimary,
      letterSpacing: -0.3,
    ),
    headlineMedium: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.w600,
      color: kTextPrimary,
      letterSpacing: -0.2,
    ),
    titleLarge: TextStyle(
      fontSize: 17,
      fontWeight: FontWeight.w600,
      color: kTextPrimary,
      letterSpacing: -0.1,
    ),
    titleMedium: TextStyle(
      fontSize: 15,
      fontWeight: FontWeight.w500,
      color: kTextPrimary,
    ),
    bodyLarge: TextStyle(
      fontSize: 15,
      fontWeight: FontWeight.w400,
      color: kTextPrimary,
      height: 1.5,
    ),
    bodyMedium: TextStyle(
      fontSize: 13,
      fontWeight: FontWeight.w400,
      color: kTextSecondary,
      height: 1.4,
    ),
    labelLarge: TextStyle(
      fontSize: 15,
      fontWeight: FontWeight.w600,
      color: kPrimary,
      letterSpacing: 0,
    ),
    labelMedium: TextStyle(
      fontSize: 13,
      fontWeight: FontWeight.w500,
      color: kTextSecondary,
    ),
    labelSmall: TextStyle(
      fontSize: 11,
      fontWeight: FontWeight.w400,
      color: kTextTertiary,
      letterSpacing: 0.2,
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: kCard,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: kSeparator, width: 1),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: kSeparator, width: 1),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: kPrimary, width: 1.5),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: kError, width: 1),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: kError, width: 1.5),
    ),
    labelStyle: const TextStyle(
      fontSize: 15,
      color: kTextSecondary,
      fontWeight: FontWeight.w400,
    ),
    hintStyle: const TextStyle(
      fontSize: 15,
      color: kTextTertiary,
      fontWeight: FontWeight.w400,
    ),
    errorStyle: const TextStyle(
      fontSize: 12,
      color: kError,
    ),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: kPrimary,
      foregroundColor: Colors.white,
      minimumSize: const Size(double.infinity, 50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      elevation: 0,
      textStyle: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        letterSpacing: 0,
      ),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: kPrimary,
      textStyle: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w500,
      ),
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      foregroundColor: kPrimary,
      minimumSize: const Size(double.infinity, 50),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      side: const BorderSide(color: kPrimary, width: 1.5),
      textStyle: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w600,
      ),
    ),
  ),
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    backgroundColor: kCard,
    selectedItemColor: kPrimary,
    unselectedItemColor: kTextTertiary,
    showSelectedLabels: true,
    showUnselectedLabels: true,
    type: BottomNavigationBarType.fixed,
    elevation: 0,
    selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
    unselectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w400),
  ),
  chipTheme: ChipThemeData(
    backgroundColor: kBackground,
    labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
    side: const BorderSide(color: kSeparator),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
  ),
  dividerTheme: const DividerThemeData(
    color: kSeparator,
    thickness: 0.5,
    space: 0,
  ),
  snackBarTheme: SnackBarThemeData(
    backgroundColor: kTextPrimary,
    contentTextStyle: const TextStyle(color: Colors.white, fontSize: 14),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    behavior: SnackBarBehavior.floating,
  ),
);
