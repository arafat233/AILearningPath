class User {
  final String id;
  final String name;
  final String email;
  final String? role;
  final String? grade;
  final String? subject;
  final String? examBoard;
  final String? schoolName;
  final String? thinkingProfile;
  final bool isPaid;
  final int totalAttempts;
  final double accuracy;

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.role,
    this.grade,
    this.subject,
    this.examBoard,
    this.schoolName,
    this.thinkingProfile,
    this.isPaid = false,
    this.totalAttempts = 0,
    this.accuracy = 0.0,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: (json['_id'] ?? json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      role: json['role']?.toString(),
      grade: json['grade']?.toString(),
      subject: json['subject']?.toString(),
      examBoard: json['examBoard']?.toString(),
      schoolName: json['schoolName']?.toString(),
      thinkingProfile: json['thinkingProfile']?.toString(),
      isPaid: json['isPaid'] == true,
      totalAttempts: _parseInt(json['totalAttempts']),
      accuracy: _parseDouble(json['accuracy']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      if (role != null) 'role': role,
      if (grade != null) 'grade': grade,
      if (subject != null) 'subject': subject,
      if (examBoard != null) 'examBoard': examBoard,
      if (schoolName != null) 'schoolName': schoolName,
      if (thinkingProfile != null) 'thinkingProfile': thinkingProfile,
      'isPaid': isPaid,
      'totalAttempts': totalAttempts,
      'accuracy': accuracy,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? role,
    String? grade,
    String? subject,
    String? examBoard,
    String? schoolName,
    String? thinkingProfile,
    bool? isPaid,
    int? totalAttempts,
    double? accuracy,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      grade: grade ?? this.grade,
      subject: subject ?? this.subject,
      examBoard: examBoard ?? this.examBoard,
      schoolName: schoolName ?? this.schoolName,
      thinkingProfile: thinkingProfile ?? this.thinkingProfile,
      isPaid: isPaid ?? this.isPaid,
      totalAttempts: totalAttempts ?? this.totalAttempts,
      accuracy: accuracy ?? this.accuracy,
    );
  }

  bool get hasOnboarded =>
      grade != null && grade!.isNotEmpty &&
      subject != null && subject!.isNotEmpty;

  String get initials {
    final parts = name.trim().split(' ');
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
  }

  String get planLabel => isPaid ? 'Pro' : 'Free';

  static int _parseInt(dynamic val) {
    if (val == null) return 0;
    if (val is int) return val;
    if (val is double) return val.toInt();
    return int.tryParse(val.toString()) ?? 0;
  }

  static double _parseDouble(dynamic val) {
    if (val == null) return 0.0;
    if (val is double) return val;
    if (val is int) return val.toDouble();
    return double.tryParse(val.toString()) ?? 0.0;
  }

  @override
  String toString() =>
      'User(id: $id, name: $name, email: $email, grade: $grade, subject: $subject)';
}
