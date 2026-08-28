# External Provider Contract

This document outlines the standard architecture and implementation requirements for integrating external learning systems (such as iGOT or NSSTA) into the MoSPI Skill Intelligence Platform.

## 1. Provider Interface

All integration providers must implement the `IntegrationProvider` base class:

```typescript
export abstract class IntegrationProvider {
  abstract getProviderId(): string;
  abstract healthCheck(): Promise<boolean>;
  abstract fetchCatalog(): Promise<ExternalLearningResource[]>;
  abstract getResourceDetails(externalId: string): Promise<ExternalLearningResource | null>;
}
```

## 2. Standardized Data Transfer Objects (DTO)

All external resource payloads must be normalized to `ExternalLearningResource` before leaving the provider adapter:

```typescript
export interface ExternalLearningResource {
  externalId: string;
  title: string;
  description: string;
  durationMinutes: number;
  provider: string; // e.g., 'IGOT', 'NSSTA'
  competencyTags: string[];
  url: string;
  type: 'COURSE' | 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}
```

## 3. Resilience and Circuit Breaking

Providers must gracefully handle network degradation and strict configuration flags:

- Feature Flags: Integration must respect its configuration flag (e.g., `IGOT_ENABLED=false`). When false, providers should fall back to localized mocks or return empty sets gracefully, without crashing the application.
- Retries: Production HTTP requests should utilize exponential backoff (e.g., via `axios-retry`).
- Timeouts: Strict outbound request timeouts (e.g., `10000ms`) must be enforced to prevent the backend job service from hanging indefinitely on stale external endpoints.

## 4. Current Integrations (Phase 13)

- **iGOT Karmayogi (IGOTProvider)**: Adapter constructed. Real API configuration is behind `IGOT_ENABLED`. When disabled, uses deterministic mock catalog for UI validation.
- **NSSTA (ProgrammeProvider)**: Adapter constructed. Real API configuration is behind `NSSTA_ENABLED`. When disabled, utilizes mock structured training program data.

*Note: No real external API credentials are committed or active. Both adapters are running in safe offline test mode.*
