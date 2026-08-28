# AI Cost Optimization (Phase 16)

## Semantic Cache Hit Optimization
The Gemini AI provider generates contextual recommendations mapping learner skill gaps to learning resources. A single prompt can cost several tokens. 

If multiple learners have the exact same roles, departments, and gaps, generating new reasoning is a waste of LLM tokens.

**Implementation**:
- In `PersonalizationService`, we now calculate a deterministic SHA256 hash based on:
  - Learner Role & Department
  - Skill Gap severities and targeted competencies
  - Available Learning Resource IDs
- We query `CacheService` for this hash.
- If a match is found (within a 24-hour TTL window), the exact AI explanation is returned instantly without querying the Gemini API.
- **Estimated Savings**: Over 80% reduction in AI API calls during large departmental onboarding sprints where many employees share identical skill gaps.
