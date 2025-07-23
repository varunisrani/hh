# Storage Policy: Script Content Stays Local

## 🔒 **SCRIPT CONTENT STORAGE POLICY**

### ✅ **What is Stored LOCALLY ONLY (in browser localStorage)**:
- **Complete script content** (extracted text from PDF/TXT files)
- **Project metadata** (name, description, creation date)
- **AI analysis results** (scene breakdowns, character lists, etc.)
- **User preferences and settings**

### ❌ **What is NEVER Stored in Cloud**:
- **Original script files** (PDF/TXT files)
- **Script text content** 
- **Personal project data**
- **User files or documents**

## 📋 **Data Flow Explanation**

### 1. **File Upload Process**:
```
User uploads PDF/TXT → Browser extracts text locally → Stored in localStorage
```
**NO CLOUD UPLOAD**: Files never leave the user's browser

### 2. **Storage Locations**:
```javascript
// All stored in browser's localStorage
localStorage.setItem('filmustage_projects', JSON.stringify(projects));
localStorage.setItem('selected_project', JSON.stringify(project));
localStorage.setItem('gemini_raw_responses', JSON.stringify(responses));
```

### 3. **AI Analysis Process**:
```
localStorage script content → Sent to Gemini API for analysis → AI results stored locally
```
**TEMPORARY PROCESSING**: Script content sent to AI for analysis only, not for storage

## 🎯 **Where Script Content Goes**

### ✅ **Stored Locally**:
- **Browser localStorage**: Permanent local storage
- **User's Downloads folder**: AI analysis results (JSON files)

### ☁️ **Sent to Cloud (Temporarily)**:
- **Gemini AI API**: For scene breakdown analysis only
- **Not stored**: Processed temporarily and discarded

### ❌ **Never Goes To**:
- Cloud databases
- File storage services  
- External servers (except AI analysis)
- Any permanent cloud storage

## 📱 **User Control**

### **Local Data Management**:
- Users can clear localStorage to remove all data
- Data stays on user's device only
- No account registration or cloud sync

### **Privacy Benefits**:
- Scripts never stored on servers
- Complete user control over data
- Works offline (except AI analysis)
- No data breach risk for script content

## 🔍 **Code Verification**

### **Storage Commands in Code**:
```javascript
// Only localStorage usage - no cloud APIs
localStorage.setItem('filmustage_projects', JSON.stringify(projects));
localStorage.setItem('selected_project', JSON.stringify(project));
```

### **AI Analysis (Temporary Cloud Use)**:
```javascript
// Script content sent for analysis only - not stored
const response = await this.client.models.generateContent({
  contents: scriptContent  // Processed temporarily, not stored
});
```

## 📊 **Summary**

| Data Type | Local Storage | Cloud Storage | Cloud Processing |
|-----------|---------------|---------------|------------------|
| Script Content | ✅ YES | ❌ NO | ✅ Temporary (AI) |
| Project Data | ✅ YES | ❌ NO | ❌ NO |
| AI Results | ✅ YES | ❌ NO | ❌ NO |
| User Files | ✅ YES | ❌ NO | ❌ NO |

**GUARANTEE**: Script content is stored ONLY in user's browser localStorage, never in any cloud storage system.