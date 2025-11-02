# Agent Content Creation Guide

## ✅ **Infrastructure Ready - Start Creating Real Content!**

All technical systems are in place. Agents can now create comprehensive, production-ready lesson content.

---

## 📁 Content File Structure

Each lesson should have its own folder with these files:

```
/content/lessons/
  /a1/
    /a1-1/
      ✅ video-script.md        - Detailed lesson script (REQUIRED)
      ✅ exercises.json          - Interactive exercises (REQUIRED)
      ✅ vocabulary.json         - Lesson vocabulary (REQUIRED)
      ✅ worksheet.md            - Practice worksheet (OPTIONAL but recommended)
      ✅ quiz.json               - Lesson assessment (REQUIRED)
      ✅ audio-script.md         - Pronunciation guide script (OPTIONAL)
```

---

## 📝 Content Creation Standards

### 1. Video Script (`video-script.md`)

**Required Elements:**
- Learning objectives (3-5 clear goals)
- Key concepts list
- Detailed script with timing markers
- Visual element descriptions
- Practice exercises embedded in script
- Summary section
- Assignment/homework

**Example Format:**
```markdown
# Lesson [ID]: [Title]

**Level:** [A1-A2-B1-B2-C1]
**Duration:** [X] minutes

## Learning Objectives
- [Clear, measurable objective 1]
- [Clear, measurable objective 2]

## Key Concepts
- [Concept 1]
- [Concept 2]

## Video Script

### Opening (0:00 - 0:30)
[Instructor greeting and lesson overview]

### Main Content (0:30 - [end])
[Detailed script with timing markers]
```

**See:** `/content/lessons/a1/a1-1/video-script.md` for complete example

---

### 2. Exercises (`exercises.json`)

**Exercise Types Available:**
- `multiple-choice` - Choose correct answer
- `fill-blank` - Complete sentences/forms
- `matching` - Match items (letters to sounds, words to translations)
- `audio` - Pronunciation practice with recording
- `writing` - Write Georgian text
- `translation` - Translate between Georgian and English

**Required Structure:**
- Each exercise needs: id, type, title, instructions, points, questions
- Each question needs: id, question, correctAnswer, explanation
- Include Georgian text where relevant
- Provide clear explanations for correct answers

**See:** `/content/lessons/a1/a1-1/exercises.json` for complete example

---

### 3. Vocabulary (`vocabulary.json`)

**Required for Each Word:**
- Georgian text (in Mkhedruli script)
- Transliteration (romanized)
- Translation (English)
- IPA pronunciation (International Phonetic Alphabet)
- Part of speech (noun, verb, etc.)
- Example sentence (with transliteration and translation)
- Notes (usage tips, cultural context)

**See:** `/content/lessons/a1/a1-1/vocabulary.json` for complete example

---

### 4. Quiz (`quiz.json`)

**Purpose:** Final assessment for lesson mastery

**Required:**
- 5-10 questions covering all key concepts
- Mix of question types
- Passing score (recommend 70-80%)
- Time limit (optional)
- Detailed explanations for all answers

---

### 5. Worksheet (`worksheet.md`)

**Purpose:** Printable practice materials

**Include:**
- Writing practice (copy letters/words)
- Fill-in exercises
- Translation practice
- Answer key (separate or at end)

---

## 🎯 Quality Checklist Per Lesson

Before marking a lesson complete, ensure:

### Video Script
- [ ] Script is 40-75 minutes of content (based on lesson duration)
- [ ] Timing markers every 2-5 minutes
- [ ] Clear explanations suitable for target level
- [ ] Visual elements described (what to show on screen)
- [ ] Practice exercises embedded
- [ ] Cultural context included where relevant
- [ ] Summary and assignment sections included

### Exercises
- [ ] 3-5 exercises per lesson
- [ ] Minimum 10 questions total
- [ ] Mix of exercise types
- [ ] All questions have clear explanations
- [ ] Georgian text properly formatted
- [ ] Difficulty matches lesson level

### Vocabulary
- [ ] All key vocabulary from lesson included
- [ ] Minimum 5-10 new words per lesson
- [ ] IPA pronunciation for each word
- [ ] Example sentence for each word
- [ ] Cultural/usage notes where relevant

### Quiz
- [ ] Tests all key concepts from lesson
- [ ] 5-10 questions minimum
- [ ] Passing score defined
- [ ] Explanations for all answers

---

## 📚 Agent Assignments

### **Agent 1: A1 Level (Lessons 1-6)**
**Target:** Complete foundational content for alphabet and phonology

**Lessons:**
- `a1-1/` - ✅ Started (has video-script.md, exercises.json, vocabulary.json)
- `a1-2/` - ⚠️ Needs all files
- `a1-3/` - ⚠️ Needs all files
- `a1-4/` - ⚠️ Needs all files
- `a1-5/` - ⚠️ Has video-script.md only
- `a1-6/` - ⚠️ Needs all files

**Priority Files Per Lesson:**
1. video-script.md (most important)
2. exercises.json
3. vocabulary.json
4. quiz.json
5. worksheet.md (can come later)

---

### **Agent 2: A2 Level (Lessons 7-12)**
**Target:** Noun morphology and basic sentence construction

**Lessons:**
- `a2-1/` - ⚠️ Has video-script.md only
- `a2-2/` through `a2-6/` - ⚠️ Need all files

**Focus:** Case system, postpositions, SVO structure

---

### **Agents 3-8: B1, B2, C1 Levels**
**Target:** Complete all remaining lessons (17 lessons total)

**Status:** Need complete content for all lessons

---

## 🔄 Content Integration

Content is automatically loaded from `/content/lessons/` folders:
- Files are loaded dynamically when lesson is accessed
- Missing files won't break the app (graceful fallbacks)
- Content merges with `courseStructure.ts` data

**To test:** Create content files and they'll appear in the lesson player automatically!

---

## ✅ **Ready to Create Real Content!**

**Next Steps:**
1. Agents start with video-script.md (highest priority)
2. Then create exercises.json and vocabulary.json
3. Add quiz.json and worksheet.md
4. Test content in lesson player
5. Iterate based on quality feedback

**Reference:** Use `/content/lessons/a1/a1-1/` as the quality standard example.

**Go build amazing Georgian language learning content!** 🚀



