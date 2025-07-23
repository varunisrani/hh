# Gemini API Responses

This folder is intended to store raw JSON responses from the Gemini 2.5 Pro API.

## File Structure

Each response file follows this naming pattern:
```
gemini-response-{projectId}-{timestamp}.json
```

## Contents

Each JSON file contains:
- `projectId`: The project identifier
- `timestamp`: When the analysis was performed
- `model`: The Gemini model used (gemini-2.5-pro)
- `thinkingMode`: Whether thinking mode was enabled
- `actualOutput`: The clean, parsed scene breakdown data (SceneBreakdownOutput)
- `metadata`: Additional information like generation time and token usage

## Browser Environment Note

Since this is a browser-based application, JSON files are automatically downloaded to the user's Downloads folder rather than saved directly to this directory. This folder serves as documentation for the intended storage structure.

## localStorage Storage

All raw responses are also stored in the browser's localStorage under the key `gemini_raw_responses` for persistence and debugging purposes.