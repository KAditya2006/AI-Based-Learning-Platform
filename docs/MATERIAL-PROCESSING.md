# Material Processing Pipeline

## Overview
To generate high-quality assessments and provide contextual RAG (Retrieval-Augmented Generation) chat, the platform must ingest government policies, manuals, and technical documents.

## Workflow

1. **Upload**: Administrator uploads a document via the Admin UI.
2. **Ingestion**: The backend accepts the file (metadata is saved in `Material` collection).
3. **Chunking Job**: An asynchronous `AIJob` is spawned.
   - Text is extracted from the document.
   - Text is split into semantic chunks (e.g., ~500 words each).
   - Each chunk is stored in the `MaterialChunk` collection.
4. **Availability**: Once `processingStatus` reaches `READY`, the document is available in the **AI Assessment Studio** for question generation.

## Security & Privacy
- Uploaded materials are mapped strictly to the internal Mongo Collections.
- Materials are NEVER used to fine-tune external models unless an explicit enterprise agreement exists.
- PII must be scrubbed before passing chunks to the `ExternalAIProvider`.
