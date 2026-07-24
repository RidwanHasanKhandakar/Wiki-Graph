# Browser Extension

## Responsibilities

- Detect Wikipedia pages
- Detect article changes
- Track browsing path
- Send updates to backend

## Files

background.js

Handles background events.

content.js

Extracts article information.

manifest.json

Extension configuration.

## Workflow

```
Wikipedia

↓

Content Script

↓

Background Script

↓

Backend API
```