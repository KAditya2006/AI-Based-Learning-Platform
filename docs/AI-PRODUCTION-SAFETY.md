# AI Production Safety

As an AI-enabled government platform, strict boundaries are enforced to prevent hallucination, prompt injection, and data leakage.

## Architectural Boundaries
- **No Authoritative Scoring**: The AI is explicitly forbidden from evaluating learner assessments or assigning competency levels. These are calculated mathematically on the server in `AssessmentService.evaluateCompetencyLevel`.
- **Human-in-the-Loop Content**: AI-generated assessment questions are saved in a `DRAFT` state and MUST be explicitly approved by an Admin via the UI before entering the live question bank.

## Prompt Injection Protection
- Content uploaded by admins (PDFs, docs) for chunking goes through standard Node.js extraction buffers and is sanitized before being passed into the Gemini prompt template. 
- Prompt templates forcefully constrain the model into outputting structured JSON to limit arbitrary conversational hijacking.

## Data Leakage
- **Context Minimization**: When a learner queries the `LearningAssistant`, only their exact current `SkillGaps` and `Profile Metadata` are appended to the context. 
- **No PII**: Names and emails are NOT sent in the AI context window. Only abstract references (e.g., `Job Role`, `Required Competency`) are passed.

## Fallback Resilience
- The system is not strictly dependent on the AI API being available. If Google Gemini goes down (or hits a rate limit), `JobService` gracefully recovers and the platform switches to `MockAIProvider` for fallback questions and generic pathing.
