---
type: community
cohesion: 0.13
members: 21
---

# Analysis & Auth Controllers

**Cohesion:** 0.13 - loosely connected
**Members:** 21 nodes

## Members
- [[analysisController.js]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\analysisController.js
- [[authController.js]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[buildAccuracyHistory()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\analysisController.js
- [[buildWeaknessMap()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\analysisController.js
- [[computeDynamicDifficulty()]] - code - E:\AILearningPath\ai-learning-backend\backend\services\scoringService.js
- [[createTransporter()]] - code - E:\AILearningPath\ai-learning-backend\backend\utils\email.js
- [[email.js]] - code - E:\AILearningPath\ai-learning-backend\backend\utils\email.js
- [[forgotPassword()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[getReport()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\analysisController.js
- [[getStreak()]] - code - E:\AILearningPath\ai-learning-backend\backend\services\streakService.js
- [[login()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[register()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[resetPassword()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[safeUser()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[save()]] - code - E:\AILearningPath\ai-learning-backend\backend\utils\questionGenerator.js
- [[selfLearningService.js]] - code - E:\AILearningPath\ai-learning-backend\backend\services\selfLearningService.js
- [[sendEmail()]] - code - E:\AILearningPath\ai-learning-backend\backend\utils\email.js
- [[signToken()]] - code - E:\AILearningPath\ai-learning-backend\backend\controllers\authController.js
- [[streakService.js]] - code - E:\AILearningPath\ai-learning-backend\backend\services\streakService.js
- [[updateQuestionStats()]] - code - E:\AILearningPath\ai-learning-backend\backend\services\selfLearningService.js
- [[updateStreak()]] - code - E:\AILearningPath\ai-learning-backend\backend\services\streakService.js

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Analysis_&_Auth_Controllers
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Admin & AI Controllers]]
- 2 edges to [[_COMMUNITY_Adaptive Learning & AI Engine]]
- 1 edge to [[_COMMUNITY_Exam & Scoring Services]]
- 1 edge to [[_COMMUNITY_Question Generator Utilities]]

## Top bridge nodes
- [[save()]] - degree 6, connects to 2 communities
- [[getReport()]] - degree 5, connects to 1 community
- [[updateQuestionStats()]] - degree 4, connects to 1 community
- [[updateStreak()]] - degree 3, connects to 1 community
- [[computeDynamicDifficulty()]] - degree 2, connects to 1 community