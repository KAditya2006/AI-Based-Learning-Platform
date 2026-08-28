# End-to-End Learning Intelligence Loop (Phase 8)

This document describes the implementation of the core intelligence loop that ties together assessment, competency scoring, gap analysis, AI recommendations, and dynamic learning paths.

## The Architecture

The Learning Intelligence Loop is a closed-loop system where learner actions trigger deterministic competency updates, which in turn recalculate skill gaps, and finally invoke the AI recommendation engine to rebuild dynamic learning paths.

### 1. Trigger: The Assessment Event
The loop begins when a learner completes a Diagnostic Assessment or a Learning Resource with an embedded evaluation.

**Component**: `QuizService.submitQuiz`
- Calculates the score deterministically.
- Retrieves the learner's previous competency level from the `CompetencyHistory`.
- Evaluates the new level using the `AssessmentService.evaluateCompetencyLevel` rules.

### 2. Deterministic Scoring Rules
The AI does **not** determine the score or the level jump. The scoring engine is strictly deterministic to comply with MoSPI's authoritative framework.
- **Score ≥ 95%**: Jumps **+2 levels** (if sufficient questions in pool).
- **Score 80-94%**: Jumps **+1 level**.
- **Score 50-79%**: **0 change**.
- **Score < 50%**: Drops **-1 level** (Minimum Level 1).

### 3. Competency & Skill Gap Recalculation
Once the new level is determined, the `AssessmentService.submitAssessment` function updates the `CompetencyHistory` and triggers the `SkillGapService.updateGaps`.

**Component**: `SkillGapService.updateGaps`
- Compares the `newLevel` against the `requiredLevel` from the learner's mapped `Role` profile.
- Recalculates the `gapSize = requiredLevel - currentLevel`.
- Reclassifies the gap:
  - Gap = 0: `NO_GAP` (Classification 0)
  - Gap = 1: `MINOR` (Classification 1)
  - Gap = 2: `MODERATE` (Classification 2)
  - Gap = 3: `HIGH` (Classification 3)
  - Gap ≥ 4: `CRITICAL` (Classification 4)
- Generates an `evidence` string explaining exactly why the gap changed (e.g., "Assessment 'Data Privacy Basics' scored 85.00%. Level increased 1 -> 2. Gap reduced 3 -> 2.").

### 4. Asynchronous AI Recommendations
With the new gaps recorded, an asynchronous job (`JobService`) triggers `AILearnerService.generateRecommendations`.

**Component**: `AILearnerService.generateRecommendations`
- Fetches all `MODERATE`, `HIGH`, and `CRITICAL` skill gaps (Classification ≥ 2).
- Queries internal `LearningResource` catalogs.
- Queries external catalogs (iGOT Karmayogi and NSSTA Programmes) based on the specific competency names of the gaps.
- Passes this unified, multi-source catalog to the AI.
- The AI selects the best resources to address the specific role context and gap sizes, returning `resourceId`, `priority`, and a textual `reason`.
- Recommendations are mapped back to their respective sources (`INTERNAL`, `IGOT`, `NSSTA`) and stored.

### 5. Dynamic Learning Path Generation
The final step is converting the raw recommendations into an actionable, sequential Learning Path.

**Component**: `LearningPathService.generateLearningPath`
- Invalidates any existing active learning paths for the user.
- Fetches the prioritized AI recommendations.
- Compiles them into an ordered `sequence`, maintaining the `source` and `externalId`/`resourceId` bindings.
- The frontend `LearningPath.tsx` visualizes this sequence, allowing the user to seamlessly jump into an internal interactive course or redirect to an external provider (iGOT/NSSTA) portal.

## AI Boundaries
- **AI CAN**: Recommend resources, explain *why* a resource fits a gap, parse chat messages, validate MCQ text.
- **AI CANNOT**: Assign competency levels, determine gap sizes, or evaluate raw assessment scores. These remain strictly deterministic and auditable.
