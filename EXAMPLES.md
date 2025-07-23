# PDF Text Extraction Examples

## What Happens When User Uploads PDF Script

### 1. **File Upload Process**:
```
📁 Processing file: my-script.pdf (application/pdf)
📄 Extracting text from PDF: my-script.pdf
📚 PDF loaded. Pages: 120
📖 Extracted page 1: 1024 characters
📖 Extracted page 2: 967 characters
...
📖 Extracted page 120: 543 characters
✅ PDF text extraction completed. Total characters: 125000
📝 File content extracted: 125000 characters
✅ Text content validated. First 200 characters:
FADE IN:

EXT. SUBURBAN STREET - DAY

A quiet residential street lined with oak trees. Birds chirp in the distance. SARAH MITCHELL (32), a determined journalist with tired...
```

### 2. **What Gets Sent to Gemini 2.5 Pro**:
```
🚀 Starting scene breakdown analysis for project: 1753268620479
📝 Script content length: 125000 characters
📋 Script content preview (first 300 characters):
FADE IN:

EXT. SUBURBAN STREET - DAY

A quiet residential street lined with oak trees. Birds chirp in the distance. SARAH MITCHELL (32), a determined journalist with tired eyes, steps out of her Honda Civic. She glances at the house number - 1247. This is it.

SARAH
(under her breath)
Here we go...
```

### 3. **Validation Checks**:
- ✅ Ensures extracted text is longer than 100 characters
- ✅ Validates that content doesn't contain "PDF file:" (no file references)
- ✅ Shows preview of actual script content before sending to AI
- ✅ Confirms we're sending actual text content, not PDF binary data

### 4. **Error Handling**:
```
❌ Script content is too short. Please ensure the file contains readable text.
❌ PDF text extraction failed. The file might be corrupted or contain unreadable text.
❌ Invalid script content: PDF text was not extracted properly
```

## Result: Gemini 2.5 Pro Receives Clean Script Text

Instead of receiving:
```
PDF file: my-script.pdf
```

Gemini receives:
```
FADE IN:

EXT. SUBURBAN STREET - DAY

A quiet residential street lined with oak trees...
[Full 125,000 character script content]
```

This ensures accurate scene breakdown analysis based on actual script content!