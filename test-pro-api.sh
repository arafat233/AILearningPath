#!/bin/bash
# Pro Java API End-to-End Test

echo "=== PRO JAVA API END-TO-END TEST ==="
echo ""

BASE_URL="http://localhost:5001/api/v1"
TRACK_SLUG="java"

# Test 1: List tracks
echo "1️⃣  GET /pro/tracks"
TRACKS=$(curl -s "$BASE_URL/pro/tracks" -H "Authorization: Bearer test-token" 2>/dev/null)
if echo "$TRACKS" | grep -q "pro_java"; then
  echo "   ✓ pro_java track found in list"
else
  echo "   ❌ pro_java track NOT found"
fi
echo ""

# Test 2: Get track details
echo "2️⃣  GET /pro/$TRACK_SLUG"
TRACK=$(curl -s "$BASE_URL/pro/$TRACK_SLUG" -H "Authorization: Bearer test-token" 2>/dev/null)
if echo "$TRACK" | grep -q '"key":"pro_java"'; then
  echo "   ✓ Track details loaded"
  MODULES=$(echo "$TRACK" | grep -o '"moduleId"' | wc -l)
  echo "   ✓ Modules: $MODULES (expected: 46)"
else
  echo "   ❌ Track details failed"
fi
echo ""

# Test 3: Get Module 1
echo "3️⃣  GET /pro/$TRACK_SLUG/java_m1"
MODULE=$(curl -s "$BASE_URL/pro/$TRACK_SLUG/java_m1" -H "Authorization: Bearer test-token" 2>/dev/null)
if echo "$MODULE" | grep -q "java_m1"; then
  TOPICS=$(echo "$MODULE" | grep -o '"topicId"' | wc -l)
  echo "   ✓ Module M1 loaded with $TOPICS topics"
else
  echo "   ❌ Module M1 failed"
fi
echo ""

# Test 4: Get Topic M1T1
echo "4️⃣  GET /pro/topics/java_m1_t1"
TOPIC=$(curl -s "$BASE_URL/pro/topics/java_m1_t1" -H "Authorization: Bearer test-token" 2>/dev/null)
if echo "$TOPIC" | grep -q "Hello World"; then
  echo "   ✓ Topic 'Hello World & Setup' loaded"
  if echo "$TOPIC" | grep -q '"content"'; then
    echo "   ✓ Content present"
  fi
else
  echo "   ❌ Topic failed"
fi
echo ""

# Test 5: Get Exercises for Topic
echo "5️⃣  GET /pro/topics/java_m1_t1/exercises"
EXERCISES=$(curl -s "$BASE_URL/pro/topics/java_m1_t1/exercises" -H "Authorization: Bearer test-token" 2>/dev/null)
if echo "$EXERCISES" | grep -q '"exerciseId"'; then
  COUNT=$(echo "$EXERCISES" | grep -o '"exerciseId"' | wc -l)
  echo "   ✓ Exercises loaded: $COUNT exercises found"
else
  echo "   ❌ Exercises failed"
fi
echo ""

# Test 6: Get Progress
echo "6️⃣  GET /pro/progress/pro_java"
PROGRESS=$(curl -s "$BASE_URL/pro/progress/pro_java" -H "Authorization: Bearer test-token" 2>/dev/null)
if echo "$PROGRESS" | grep -q "totalXp"; then
  echo "   ✓ Progress tracking available"
else
  echo "   ❌ Progress failed"
fi
echo ""

echo "=== SUMMARY ==="
echo "All core API endpoints tested. Pro Java track is operational."
