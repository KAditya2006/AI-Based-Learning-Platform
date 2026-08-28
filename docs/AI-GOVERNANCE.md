# AI Governance & Safety Review

## Principle of Operation
**"AI assists decision-making but does not become the authoritative source of truth."**

The integration of Generative AI (Google Gemini) into the MoSPI Skill Intelligence platform is tightly bounded to prevent hallucination, bias, and manipulation of official competency records.

## AI Responsibilities
- **Contextualization**: Providing natural language explanations for *why* a specific learning path is recommended.
- **Drafting**: Analyzing PDF/Text materials and generating *draft* multiple-choice questions.
- **Tutoring**: Providing on-demand, contextual assistance directly related to a course being consumed.

## Deterministic Responsibilities (AI Strictly Forbidden)
- **Competency Scoring**: The calculation of an official's skill level is mathematical. An assessment score maps directly to a level (e.g., 95% = Level 5). The AI is mathematically blocked from altering this calculation.
- **Gap Classification**: The categorization of a skill gap (Critical, High, Medium, Low) is calculated by comparing `currentLevel` vs `requiredLevel`. AI cannot redefine a gap.
- **Recommendation Prioritization**: `PersonalizationService` maps recommendations to priority tiers. The AI may generate the text, but the deterministic engine dictates the priority integer.

## Human-in-the-Loop (HITL) Boundaries
- **Assessment Generation**: The `AIAssessmentService` drafts questions and inserts them into a `pendingReview` state. An authorized Admin MUST manually approve, edit, or reject the question before it enters the global `QuestionBank`. The AI cannot directly publish tests.

## Security & Prompt Safety
- **Data Minimization**: The AI is only fed the minimum required context. When asking for a recommendation, the AI receives an anonymized string of skill gaps (e.g., "Gap in Data Analysis, missing 2 levels"). Personal Identifiable Information (PII) is stripped.
- **Prompt Injection Controls**: System instructions strictly constrain the AI to output JSON arrays for programmatic parsing. Free-text replies are sanitized via `zod` schema parsing before DB ingestion.

## Failure Handling & Replaceability
- **Provider Outages**: The `GeminiAIProvider` wraps all network calls in a `withRetry` exponential backoff.
- **Deterministic Fallback**: If the provider hard-fails, `MockAIProvider` takes over, generating simple, un-contextualized but perfectly valid JSON recommendations and questions to prevent the system from crashing.
- **Provider Agnosticism**: The platform relies solely on the `IAIProvider` interface. Switching to OpenAI, Anthropic, or a self-hosted LLaMa model requires zero changes to core business logic—only a new adapter class.
