# Topic 31.4: Anagram & Frequency Problems

**Module**: M31 (DSA3) | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW
**Module 31 Progress**: 4/5 | **Course Progress**: 153 topics (89.9%)

## Key Concepts
- **Anagram test**: same length + same character frequencies
- **int[26] frequency array**: O(1) space for lowercase alpha — always prefer over HashMap
- **isAnagram**: `freq[c-'a']++` for s, `--freq[c-'a'] < 0` return false for early exit
- **Anagram key (sort)**: `Arrays.sort(chars)` → `new String(chars)` — O(m log m) per word
- **Anagram key (freq)**: encode int[26] as '#'-separated string — O(m) per word — faster!
- **Group anagrams**: HashMap<sortedKey, List<String>> — group all same-key words
- **findAllAnagrams**: fixed sliding window of size p.length() with int[26] comparison — O(n)
- **minWindowSubstring**: `required` counter — decrement when char covered, increment when uncovered. Shrink when required==0
- **Ransom note**: count magazine letters, then subtract ransom letters — negative → false
- **First unique char**: two-pass: count freqs, find first with freq==1
- **Sort by frequency**: bucket sort (bucket index = frequency) — O(n)
- **Top K frequent**: min-heap of size k — O(n log k)
- **at most k distinct**: variable sliding window, HashMap, shrink when map.size() > k

## Files: topic.json, exercises.json, project.json, README.md
