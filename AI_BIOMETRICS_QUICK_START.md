# 🚀 AI & Biometrics Quick Start Guide

**National SGBV Case Portal - AI & Biometrics Features**

---

## 🤖 Lady Justice AI Assistant

### How to Use

1. **Access the AI**
   - Look for the floating purple button in the bottom-right corner
   - Click to open the chat interface

2. **Ask Questions**
   ```
   Examples:
   - "What is the penalty for rape under VAPPA?"
   - "How do I collect evidence properly?"
   - "What services are available for victims?"
   - "What are the steps to file a case?"
   - "Which section covers FGM?"
   ```

3. **Get Recommendations**
   - Click on suggestion chips for quick queries
   - View resources and reference materials
   - Check confidence scores

### AI Categories

| Category | What It Covers |
|----------|----------------|
| **Legal Guidance** | Laws, sections, penalties, legal framework |
| **Evidence Guidance** | Collection, preservation, chain of custody |
| **Victim Support** | Services, helplines, resources, assistance |
| **Procedural Guidance** | Step-by-step processes, workflows |
| **Documentation** | Forms, templates, report writing |
| **General** | Overview, capabilities, help |

---

## 📸 Facial Recognition

### Upload Perpetrator Photo

1. **Navigate to Perpetrator Details**
   - Go to case detail page
   - Click on perpetrator section

2. **Upload Photo**
   - Click the upload area
   - Select image (JPG, PNG)
   - Max size: 5MB
   - Wait for processing

3. **Review Results**
   - Facial Recognition ID
   - Confidence score
   - Image quality
   - Biometric verification status
   - Match alerts (if any)

### Photo Guidelines

✅ **DO:**
- Use clear, front-facing photos
- Ensure good lighting
- Keep face fully visible
- Remove sunglasses/masks
- Use recent photos

❌ **DON'T:**
- Use blurry images
- Use side profiles
- Use group photos
- Use low-resolution images
- Use photos with obstructions

---

## 🔍 Match Detection

### What Happens When You Upload

1. **Face Detection** - System detects face in image
2. **Feature Extraction** - Generates 128D embeddings
3. **Quality Check** - Assesses image quality
4. **Database Search** - Searches for similar faces
5. **Match Alert** - Notifies if matches found

### Match Alerts

**If Match Found:**
```
⚠️ Potential Match Found!
- Review match details
- Verify identity
- Check for duplicate entries
- Link related cases
```

**If No Match:**
```
✅ No matching faces found
- New biometric entry
- Unique identification
- Added to database
```

---

## 💡 Use Cases

### For Investigators

**1. Legal Research**
```
Ask Lady Justice:
"What laws apply to child marriage?"
"What is the penalty for FGM?"
"Which section covers spousal battery?"
```

**2. Perpetrator Identification**
```
- Upload suspect photo
- Check for matches
- Identify repeat offenders
- Link related cases
```

**3. Case Guidance**
```
Ask Lady Justice:
"How do I handle evidence?"
"What are the next steps?"
"What documents do I need?"
```

### For Prosecutors

**1. Legal Precedents**
```
Ask Lady Justice:
"What are similar cases?"
"What is the conviction rate?"
"What evidence is needed?"
```

**2. Case Analysis**
```
- Get AI recommendations
- Identify case strengths
- Review legal framework
```

### For Administrators

**1. Duplicate Prevention**
```
- Upload photos for all perpetrators
- System detects duplicates
- Maintain data integrity
```

**2. System Monitoring**
```
- Track biometric verifications
- Monitor AI usage
- Review audit logs
```

---

## 🔐 Security & Privacy

### Biometric Data
- ✅ Encrypted storage
- ✅ Access controlled
- ✅ Audit logged
- ✅ Secure transmission

### AI Interactions
- ✅ Session authenticated
- ✅ Queries logged
- ✅ User tracked
- ✅ Context isolated

---

## 📊 API Endpoints

### Facial Recognition
```typescript
POST /api/perpetrators/[id]/upload-photo
Body: FormData with 'photo' file

Response:
{
  success: true,
  facialData: {
    facialRecognitionId: "FACE-...",
    confidence: 0.95,
    imageQuality: 0.92
  },
  matches: {
    found: boolean,
    count: number,
    topMatch: {...}
  }
}
```

### Lady Justice AI
```typescript
POST /api/ai/lady-justice
Body: {
  query: string,
  context?: {
    caseId?: string,
    caseType?: string,
    status?: string
  }
}

Response:
{
  response: {
    message: string,
    suggestions: string[],
    resources: string[],
    confidence: number,
    category: string
  }
}
```

### Case Recommendations
```typescript
POST /api/ai/case-recommendations
Body: {
  caseId: string
}

Response:
{
  recommendations: string[],
  nextSteps: string[],
  warnings: string[]
}
```

---

## 🎯 Best Practices

### Using Lady Justice AI

1. **Be Specific**
   - ❌ "Tell me about laws"
   - ✅ "What is the penalty for rape under VAPPA Section 1?"

2. **Provide Context**
   - Include case type
   - Mention specific circumstances
   - Reference relevant laws

3. **Review Suggestions**
   - Click on suggestion chips
   - Explore resources
   - Check confidence scores

### Using Facial Recognition

1. **Photo Quality**
   - Use high-resolution images
   - Ensure proper lighting
   - Front-facing photos only

2. **Verification**
   - Review match results carefully
   - Verify identity manually
   - Document verification process

3. **Privacy**
   - Only upload authorized photos
   - Follow data protection guidelines
   - Maintain confidentiality

---

## 🆘 Troubleshooting

### Facial Recognition Issues

**"Face not detected"**
- Ensure face is clearly visible
- Check lighting
- Use front-facing photo
- Remove obstructions

**"Image quality too low"**
- Use higher resolution image
- Improve lighting
- Reduce blur
- Try different photo

**"File too large"**
- Compress image
- Max size: 5MB
- Use JPG format

### AI Assistant Issues

**"No response"**
- Check internet connection
- Refresh page
- Try again
- Contact support

**"Low confidence"**
- Rephrase question
- Be more specific
- Provide context
- Try different query

---

## 📞 Support

### Getting Help

**Lady Justice AI:**
- Type "help" in chat
- Ask "What can you do?"
- Review suggestions

**Technical Support:**
- Contact system administrator
- Check documentation
- Review audit logs

---

## ✨ Tips & Tricks

### Maximize AI Efficiency

1. **Use Suggestion Chips** - Quick access to common queries
2. **Provide Context** - Include case details for better responses
3. **Explore Categories** - Different types of guidance available
4. **Save Responses** - Copy important information

### Optimize Biometric Matching

1. **Upload Multiple Photos** - Different angles if available
2. **Regular Updates** - Update photos periodically
3. **Quality First** - Always use best quality images
4. **Verify Matches** - Always manually verify AI matches

---

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- Using Lady Justice AI
- Uploading perpetrator photos
- Interpreting match results
- Best practices guide

### Documentation
- AI_AND_BIOMETRICS_IMPLEMENTATION.md
- FINAL_SYSTEM_SUMMARY.md
- API.md

---

**🚀 Ready to use AI & Biometrics features!**

*For detailed technical documentation, see AI_AND_BIOMETRICS_IMPLEMENTATION.md*

