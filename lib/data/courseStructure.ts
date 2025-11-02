// Course structure based on Expert Curriculum Blueprint (A1-C1)
// CEFR-aligned Georgian language learning course

export interface Lesson {
  id: string
  title: string
  description: string
  detailedDescription?: string // Extended description with more context
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  moduleNumber: number
  lessonNumber: number
  duration: number // in minutes
  estimatedHours: number
  keyConcepts: string[]
  learningObjectives?: string[] // What students will be able to do
  prerequisites?: string[] // Previous lessons or concepts needed
  videoUrl?: string
  exerciseMaterials?: {
    name: string
    url: string
    type?: 'pdf' | 'audio' | 'interactive' | 'worksheet'
  }[]
  vocabulary?: {
    georgian: string
    transliteration: string
    translation: string
    ipa?: string
    example?: string
  }[]
  isCompleted?: boolean
}

export interface Level {
  code: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  name: string
  description: string
  estimatedHours: { min: number; max: number }
  focus: string
  canDoMilestones: string[]
  keyChallenge: string
  lessons: Lesson[]
}

export const courseStructure: Level[] = [
  {
    code: 'A1',
    name: 'Script + Phonology',
    description: 'Master the Mkhedruli alphabet and foundational phonetics',
    estimatedHours: { min: 80, max: 120 },
    focus: 'Script + Phonology',
    canDoMilestones: [
      'Read/write Mkhedruli script',
      'Distinguish ejective consonants',
      'Introduce yourself formally using Batono/Kalbatono',
      'Read a 50-word text in Mkhedruli script'
    ],
    keyChallenge: 'Pronunciation fossilization',
    lessons: [
      {
        id: 'a1-1',
        title: 'Introduction: The Georgian Alphabet (Mkhedruli)',
        description: 'Learn the 33 letters of the Mkhedruli script. Master the basic letter forms and understand that Georgian has no uppercase/lowercase distinction.',
        detailedDescription: 'Begin your journey into Georgian by mastering the beautiful Mkhedruli alphabet. This comprehensive introduction covers all 33 letters, organized into vowels and consonants. You\'ll learn about unique Georgian sounds like ejective consonants and guttural fricatives, with clear pronunciation guidance and visual aids to help you recognize and write each letter.',
        level: 'A1',
        moduleNumber: 1,
        lessonNumber: 1,
        duration: 45,
        estimatedHours: 0.75,
        keyConcepts: ['Mkhedruli script', '33 letters', 'Letter forms', 'Vowels and consonants', 'No case distinction'],
        learningObjectives: [
          'Recognize all 33 letters of the Mkhedruli alphabet',
          'Understand that Georgian has no uppercase/lowercase distinction',
          'Identify basic letter forms and their shapes',
          'Begin writing simple letter combinations'
        ],
        vocabulary: [
          {
            georgian: 'ასო',
            transliteration: 'aso',
            translation: 'letter (of the alphabet)',
            ipa: '/ɑsɔ/',
            example: 'ეს არის ასო - This is a letter'
          },
          {
            georgian: 'მხედრული',
            transliteration: 'mkhedruli',
            translation: 'Mkhedruli (script)',
            ipa: '/mxɛdruli/',
            example: 'მხედრული არის ქართული დამწერლობა - Mkhedruli is Georgian writing'
          }
        ]
      },
      {
        id: 'a1-2',
        title: 'Stop Consonants: Voiced, Aspirated, and Ejective',
        description: 'Master the tripartite system of stop consonants. Practice distinguishing between voiced (ბ /b/), aspirated (თ /tʰ/), and ejective (კ /kʼ/) consonants.',
        level: 'A1',
        moduleNumber: 1,
        lessonNumber: 2,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Voiced stops', 'Aspirated stops', 'Ejective consonants', 'IPA symbols'],
      },
      {
        id: 'a1-3',
        title: 'Ejective Consonants Deep Dive',
        description: 'Intensive practice with ejective consonants (კ, პ, ტ, წ, ჭ, ყ). Learn to produce the glottal closure and "pop" sound that distinguishes ejectives.',
        level: 'A1',
        moduleNumber: 1,
        lessonNumber: 3,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Ejective articulation', 'Glottal closure', 'Pronunciation drills'],
      },
      {
        id: 'a1-4',
        title: 'Additional Difficult Sounds: Trilled R and Gutturals',
        description: 'Practice the alveolar trilled რ /r/ and guttural fricatives ღ /ɣ/ and ხ /x/. Prepare for complex consonant clusters.',
        level: 'A1',
        moduleNumber: 1,
        lessonNumber: 4,
        duration: 45,
        estimatedHours: 0.75,
        keyConcepts: ['Trilled r', 'Guttural fricatives', 'Consonant clusters'],
      },
      {
        id: 'a1-5',
        title: 'Basic Greetings and Survival Phrases',
        description: 'Learn essential greetings (gamarjoba), expressions of gratitude (didi madloba), and basic survival phrases. Introduction to formal address system.',
        detailedDescription: 'Master the essential phrases you\'ll use every day in Georgia. This lesson covers greetings for all occasions, proper expressions of gratitude, and introduces the important formal address system (Batono/Kalbatono) that shows respect in Georgian culture. Learn when to use formal vs informal greetings and practice real-world scenarios.',
        level: 'A1',
        moduleNumber: 1,
        lessonNumber: 5,
        duration: 30,
        estimatedHours: 0.5,
        keyConcepts: ['Greetings', 'Formal address', 'Survival phrases', 'Batono/Kalbatono', 'Cultural etiquette'],
        learningObjectives: [
          'Greet people formally and informally in Georgian',
          'Express gratitude and basic courtesy',
          'Introduce yourself using the formal address system',
          'Use essential survival phrases for daily interactions'
        ],
        prerequisites: ['Basic familiarity with Georgian alphabet'],
        vocabulary: [
          {
            georgian: 'გამარჯობა',
            transliteration: 'gamarjoba',
            translation: 'hello',
            ipa: '/ɡɑmɑrd͡ʒɔbɑ/',
            example: 'გამარჯობა, როგორ ხართ? - Hello, how are you?'
          },
          {
            georgian: 'ნახვამდის',
            transliteration: 'nakhvamdis',
            translation: 'goodbye',
            ipa: '/nɑxvɑmdis/',
            example: 'ნახვამდის, გმადლობთ! - Goodbye, thank you!'
          },
          {
            georgian: 'დიდი მადლობა',
            transliteration: 'didi madloba',
            translation: 'thank you very much',
            ipa: '/didi mɑdlɔbɑ/',
            example: 'დიდი მადლობა თქვენი დახმარებისთვის - Thank you very much for your help'
          },
          {
            georgian: 'ბატონო',
            transliteration: 'batono',
            translation: 'sir / Mr.',
            ipa: '/bɑtʼɔnɔ/',
            example: 'გამარჯობა, ბატონო - Hello, sir'
          },
          {
            georgian: 'ქალბატონო',
            transliteration: 'kalbatono',
            translation: 'madam / Mrs. / Ms.',
            ipa: '/kɑlbɑtʼɔnɔ/',
            example: 'გამარჯობა, ქალბატონო - Hello, madam'
          }
        ]
      },
      {
        id: 'a1-6',
        title: 'SRS Setup and Daily Practice Routine',
        description: 'Set up a Spaced Repetition System (SRS) using Anki or Memrise. Learn best practices for daily phonetic drills and vocabulary acquisition.',
        level: 'A1',
        moduleNumber: 1,
        lessonNumber: 6,
        duration: 30,
        estimatedHours: 0.5,
        keyConcepts: ['SRS systems', 'Anki setup', 'Daily practice routine', 'Vocabulary frequency lists'],
      },
    ],
  },
  {
    code: 'A2',
    name: 'Nouns + SVO Basics',
    description: 'Master noun declension, cases, and basic sentence structure',
    estimatedHours: { min: 120, max: 150 },
    focus: 'Nouns + SVO Basics',
    canDoMilestones: [
      'Build 500-word vocabulary',
      'Form simple sentences with cases',
      'Use formal vs. informal register',
      'Navigate basic postposition-case relationships'
    ],
    keyChallenge: 'Postposition-case sync',
    lessons: [
      {
        id: 'a2-1',
        title: 'Introduction to Noun Cases: Nominative, Dative, Genitive',
        description: 'Learn the three fundamental cases: Nominative (dictionary form), Dative (direct objects, indirect objects), and Genitive (possession). Understand the lack of grammatical gender.',
        detailedDescription: 'Enter the world of Georgian grammar! This foundational lesson introduces noun cases, which are fundamental to Georgian sentence structure. Learn how Georgian changes noun endings to show their role in sentences, eliminating the need for strict word order. Master the three essential cases with clear examples, transformations, and practice exercises.',
        level: 'A2',
        moduleNumber: 2,
        lessonNumber: 1,
        duration: 50,
        estimatedHours: 0.83,
        keyConcepts: ['Nominative case', 'Dative case', 'Genitive case', 'No grammatical gender', 'Case endings'],
        learningObjectives: [
          'Understand the concept of noun cases in Georgian',
          'Recognize and use the Nominative case (dictionary form)',
          'Recognize and use the Dative case (for direct and indirect objects)',
          'Recognize and use the Genitive case (for possession)',
          'Understand that Georgian has no grammatical gender'
        ],
        prerequisites: ['A1 level completed', 'Basic vocabulary knowledge'],
        vocabulary: [
          {
            georgian: 'კატა',
            transliteration: 'kat\'a',
            translation: 'cat',
            ipa: '/kʼɑtʼɑ/',
            example: 'კატა ხედავს - The cat sees (Nominative)'
          },
          {
            georgian: 'კატას',
            transliteration: 'kat\'as',
            translation: 'cat (Dative)',
            ipa: '/kʼɑtʼɑs/',
            example: 'მე ვხედავ კატას - I see the cat (Dative)'
          },
          {
            georgian: 'კატის',
            transliteration: 'kat\'is',
            translation: 'of the cat / cat\'s',
            ipa: '/kʼɑtʼis/',
            example: 'კატის სახლი - The cat\'s house (Genitive)'
          }
        ]
      },
      {
        id: 'a2-2',
        title: 'Pluralization and Case Suffixes',
        description: 'Master plural formation using the -eb suffix inserted between root and case suffix. Practice plural declension across cases.',
        level: 'A2',
        moduleNumber: 2,
        lessonNumber: 2,
        duration: 45,
        estimatedHours: 0.75,
        keyConcepts: ['Plural formation', '-eb suffix', 'Case suffixes'],
      },
      {
        id: 'a2-3',
        title: 'Postpositions and Case Requirements',
        description: 'Learn how postpositions (-tvis, -shi, -dan) determine case requirements. Master the Noun → Case → Postposition linkage pattern.',
        level: 'A2',
        moduleNumber: 2,
        lessonNumber: 3,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Postpositions', 'Case-postposition pairing', 'Noun inflection'],
      },
      {
        id: 'a2-4',
        title: 'SVO Sentence Structure Basics',
        description: 'Build simple Subject-Verb-Object sentences. Practice basic verb conjugation with Series I verbs in the present tense.',
        level: 'A2',
        moduleNumber: 2,
        lessonNumber: 4,
        duration: 50,
        estimatedHours: 0.83,
        keyConcepts: ['SVO structure', 'Basic verbs', 'Present tense', 'Series I'],
      },
      {
        id: 'a2-5',
        title: 'High-Frequency Vocabulary (500 Words)',
        description: 'Systematically acquire 500 high-frequency words using the Swadesh list equivalent. Focus on daily life, family, and basic activities.',
        level: 'A2',
        moduleNumber: 2,
        lessonNumber: 5,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Vocabulary acquisition', 'High-frequency words', 'Daily vocabulary'],
      },
      {
        id: 'a2-6',
        title: 'Formal Address and Cultural Etiquette',
        description: 'Master the formal address system (Batono/Kalbatono). Learn when to use formal vs. informal register based on social hierarchy and context.',
        level: 'A2',
        moduleNumber: 2,
        lessonNumber: 6,
        duration: 40,
        estimatedHours: 0.67,
        keyConcepts: ['Formal address', 'Social hierarchy', 'Cultural etiquette'],
      },
    ],
  },
  {
    code: 'B1',
    name: 'Series I Verbs',
    description: 'Master polypersonal verb morphology and Series I conjugation',
    estimatedHours: { min: 150, max: 200 },
    focus: 'Series I Verbs',
    canDoMilestones: [
      'Hold 5-10 minute conversations',
      'Narrate using present/future tenses',
      'Use Dative, Genitive, and Instrumental cases correctly',
      'Understand basic verb structure'
    ],
    keyChallenge: 'Polypersonal preverbs',
    lessons: [
      {
        id: 'b1-1',
        title: 'Introduction to Polypersonal Verbs',
        description: 'Understand how Georgian verbs agree with subject, direct object, and indirect object simultaneously. Learn the verb structure: Preverb – Person Marker – Version Vowel – Root – Thematic Suffix – Plural Marker.',
        detailedDescription: 'Discover one of Georgian\'s most fascinating features: polypersonal verbs! Georgian verbs can simultaneously agree with the subject, direct object, AND indirect object - something that makes Georgian unique among European languages. Learn the complex verb structure step-by-step with clear explanations, breakdowns, and examples that make this challenging topic accessible.',
        level: 'B1',
        moduleNumber: 3,
        lessonNumber: 1,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Polypersonalism', 'Verb structure', 'Person markers', 'Agreement', 'Verb morphology'],
        learningObjectives: [
          'Understand how Georgian verbs agree with multiple arguments',
          'Identify the components of Georgian verb structure',
          'Recognize person markers in verb conjugations',
          'Begin analyzing verb forms systematically'
        ],
        prerequisites: ['A2 level completed', 'Understanding of cases', 'Basic verb vocabulary']
      },
      {
        id: 'b1-2',
        title: 'Preverbs: Directionality and Perfective Aspect',
        description: 'Master preverbs (მი-, მო-, გა-, შე-) that indicate directionality and transform imperfective to perfective aspect. Understand their absence in Series I imperfective tenses.',
        level: 'B1',
        moduleNumber: 3,
        lessonNumber: 2,
        duration: 55,
        estimatedHours: 0.92,
        keyConcepts: ['Preverbs', 'Directionality', 'Perfective aspect', 'Future tense formation'],
      },
      {
        id: 'b1-3',
        title: 'Version Vowels: Subjective (ი-) and Objective (უ-)',
        description: 'Learn how version vowels change verb meaning. Master subjective version (for oneself) and objective version (for a third party).',
        level: 'B1',
        moduleNumber: 3,
        lessonNumber: 3,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Version vowels', 'Subjective version', 'Objective version', 'Benefactive'],
      },
      {
        id: 'b1-4',
        title: 'Class I (Transitive) Verbs and Series I Conjugation',
        description: 'Master Class I transitive verbs in Series I (Present/Future). Understand Nominative-Accusative alignment: Subject in Nominative, Direct Object in Dative.',
        level: 'B1',
        moduleNumber: 3,
        lessonNumber: 4,
        duration: 65,
        estimatedHours: 1.08,
        keyConcepts: ['Class I verbs', 'Transitive verbs', 'Series I', 'Nominative-Accusative alignment'],
      },
      {
        id: 'b1-5',
        title: 'Class IV (Indirect) Verbs: Emotions and Perception',
        description: 'Learn Class IV indirect verbs (to want, to know, to like). Master the Dative-Nominative alignment where experiencer takes Dative case.',
        level: 'B1',
        moduleNumber: 3,
        lessonNumber: 5,
        duration: 55,
        estimatedHours: 0.92,
        keyConcepts: ['Class IV verbs', 'Indirect verbs', 'Dative-Nominative alignment', 'Emotion verbs'],
      },
      {
        id: 'b1-6',
        title: 'Conversation Practice: Present and Future Tenses',
        description: 'Practice extended conversations using Series I verbs. Build confidence in 5-10 minute dialogues about daily routine, hobbies, and future plans.',
        level: 'B1',
        moduleNumber: 3,
        lessonNumber: 6,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Conversation practice', 'Present tense', 'Future tense', 'Daily dialogues'],
      },
    ],
  },
  {
    code: 'B2',
    name: 'Series II/III + Ergativity',
    description: 'Master split-ergativity and advanced verb classes',
    estimatedHours: { min: 200, max: 250 },
    focus: 'Series II/III + Ergativity',
    canDoMilestones: [
      'Debate past events fluently',
      'Handle split-ergative alignment correctly',
      'Use Series II (Aorist) and Series III (Perfect)',
      'Navigate verb class-screeve matrix'
    ],
    keyChallenge: 'Verb class-screeve matrix',
    lessons: [
      {
        id: 'b2-1',
        title: 'Split-Ergativity: The Case Shift Paradigm',
        description: 'Understand how Georgian shifts from Nominative-Accusative (Series I) to Ergative-Absolutive (Series II). Learn why this happens based on Tense-Aspect-Mood features.',
        detailedDescription: 'Explore one of Georgian grammar\'s most advanced concepts: split-ergativity. Georgian uniquely changes its case alignment system depending on tense and aspect - a feature that challenges even advanced learners. This comprehensive lesson breaks down the case shift paradigm with detailed explanations, comparisons, and examples showing how subjects are marked differently in present vs past tenses.',
        level: 'B2',
        moduleNumber: 4,
        lessonNumber: 1,
        duration: 70,
        estimatedHours: 1.17,
        keyConcepts: ['Split-ergativity', 'Ergative-Absolutive', 'Case shift', 'TAM features', 'Case alignment'],
        learningObjectives: [
          'Understand the concept of split-ergativity',
          'Recognize when Georgian uses Nominative-Accusative vs Ergative-Absolutive alignment',
          'Identify the role of Tense-Aspect-Mood in case marking',
          'Apply case shift rules in practice sentences'
        ],
        prerequisites: ['B1 level completed', 'Understanding of verb series', 'Mastery of basic cases']
      },
      {
        id: 'b2-2',
        title: 'Series II (Aorist): Simple Past Formation',
        description: 'Master the Aorist tense using perfective stems (root + preverb). Learn new polypersonal agreement markers that track both Ergative subject and Nominative object.',
        level: 'B2',
        moduleNumber: 4,
        lessonNumber: 2,
        duration: 75,
        estimatedHours: 1.25,
        keyConcepts: ['Aorist', 'Series II', 'Perfective stems', 'Ergative case'],
      },
      {
        id: 'b2-3',
        title: 'Ergative Case Marking in Past Transitive Verbs',
        description: 'Practice using Ergative case (-m suffix) for transitive subjects in the past. Learn to recognize when to use Ergative vs. Nominative based on verb class and tense.',
        level: 'B2',
        moduleNumber: 4,
        lessonNumber: 3,
        duration: 70,
        estimatedHours: 1.17,
        keyConcepts: ['Ergative case', 'Transitive verbs', 'Past tense', 'Case marking'],
      },
      {
        id: 'b2-4',
        title: 'Class II (Intransitive) and Class III (Medial) Verbs',
        description: 'Master Class II intransitive verbs that retain Nominative alignment. Learn Class III medial verbs and their unique alignment patterns.',
        level: 'B2',
        moduleNumber: 4,
        lessonNumber: 4,
        duration: 65,
        estimatedHours: 1.08,
        keyConcepts: ['Class II verbs', 'Class III verbs', 'Intransitive', 'Medial verbs'],
      },
      {
        id: 'b2-5',
        title: 'Series III: Perfect and Pluperfect',
        description: 'Learn Series III (Perfect screeves) formation and usage. Understand how perfect aspect interacts with different verb classes.',
        level: 'B2',
        moduleNumber: 4,
        lessonNumber: 5,
        duration: 70,
        estimatedHours: 1.17,
        keyConcepts: ['Series III', 'Perfect tense', 'Pluperfect', 'Aspect'],
      },
      {
        id: 'b2-6',
        title: 'Navigating the Verb Class-Screeve Matrix',
        description: 'Consolidate knowledge by systematically linking Verb Class (I, II, III, IV) to Screeve Series (I, II, III) to determine correct Case Alignment. Practice complex sentences.',
        level: 'B2',
        moduleNumber: 4,
        lessonNumber: 6,
        duration: 75,
        estimatedHours: 1.25,
        keyConcepts: ['Verb matrix', 'Systematic conjugation', 'Case alignment', 'Complex sentences'],
      },
    ],
  },
  {
    code: 'C1',
    name: 'Fluency + Idioms',
    description: 'Achieve conversational fluency with advanced syntax and cultural competence',
    estimatedHours: { min: 250, max: 300 },
    focus: 'Fluency + Idioms',
    canDoMilestones: [
      'Participate in 30-minute debates on current events',
      'Read unedited Georgian news with 80%+ comprehension',
      'Use 10+ common idioms correctly',
      'Navigate formal vs. informal register appropriately'
    ],
    keyChallenge: 'Pragmatic nuance',
    lessons: [
      {
        id: 'c1-1',
        title: 'Advanced Syntax: Relative Clauses',
        description: 'Master relative clause formation using wh-phrases with -c enclitic (romel-ma=c) or complementizer rom. Learn non-finite relative clauses using participles.',
        detailedDescription: 'Reach advanced proficiency in Georgian syntax by mastering relative clauses. This lesson covers multiple ways to form relative clauses in Georgian, including wh-phrases with the -c enclitic, complementizer constructions, and elegant participle-based non-finite relative clauses. Learn to express complex thoughts with native-like sophistication through detailed examples and practice with authentic Georgian texts.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 1,
        duration: 70,
        estimatedHours: 1.17,
        keyConcepts: ['Relative clauses', 'Wh-phrases', 'Enclitics', 'Participles', 'Complex syntax'],
        learningObjectives: [
          'Form relative clauses using wh-phrases with -c enclitic',
          'Use complementizer rom in relative clauses',
          'Create non-finite relative clauses with participles',
          'Understand nuances between different relative clause types'
        ],
        prerequisites: ['B2 level completed', 'Advanced verb knowledge', 'Understanding of complex sentences']
      },
      {
        id: 'c1-2',
        title: 'Complex Sentence Embedding',
        description: 'Build complex sentences with multiple embedded clauses. Practice coordinating and subordinating structures at an advanced level.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 2,
        duration: 65,
        estimatedHours: 1.08,
        keyConcepts: ['Sentence embedding', 'Complex structures', 'Coordination', 'Subordination'],
      },
      {
        id: 'c1-3',
        title: 'Idiomatic Expressions and Cultural Language',
        description: 'Learn essential Georgian idioms: "born on a happy star" (lucky), "ears dropped" (sad), "sitting on a donkey" (stubborn). Understand cultural context and appropriate usage.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 3,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Idioms', 'Cultural language', 'Pragmatics', 'Register'],
      },
      {
        id: 'c1-4',
        title: 'Formal vs. Informal Register Mastery',
        description: 'Master register switching based on social hierarchy, age, and professional context. Know when to use titles/surnames vs. first names.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 4,
        duration: 55,
        estimatedHours: 0.92,
        keyConcepts: ['Register', 'Formal vs. informal', 'Social hierarchy', 'Contextual appropriateness'],
      },
      {
        id: 'c1-5',
        title: 'The Supra: Cultural Immersion and Etiquette',
        description: 'Deep dive into Georgian traditional feast (Supra) customs. Learn toastmaster (Tamada) role, toast protocol (Gaumarjos!), and social rules (not leaving without permission).',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 5,
        duration: 60,
        estimatedHours: 1,
        keyConcepts: ['Supra', 'Tamada', 'Cultural rituals', 'Social customs'],
      },
      {
        id: 'c1-6',
        title: 'Reading Native Materials: News and Literature',
        description: 'Practice reading unedited Georgian news (formula.ge) and literary texts. Build comprehension skills and vocabulary through authentic materials.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 6,
        duration: 70,
        estimatedHours: 1.17,
        keyConcepts: ['Native materials', 'News reading', 'Literature', 'Authentic texts'],
      },
      {
        id: 'c1-7',
        title: 'Advanced Conversation: Debates and Discussions',
        description: 'Participate in extended debates on current events, politics, and culture. Practice nuanced argumentation and complex opinion expression.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 7,
        duration: 75,
        estimatedHours: 1.25,
        keyConcepts: ['Debates', 'Advanced conversation', 'Argumentation', 'Opinion expression'],
      },
      {
        id: 'c1-8',
        title: 'Pragmatic Mastery: Context and Implicature',
        description: 'Understand implied meanings, cultural subtext, and pragmatic nuances. Master the subtleties of Georgian communication beyond literal translation.',
        level: 'C1',
        moduleNumber: 5,
        lessonNumber: 8,
        duration: 70,
        estimatedHours: 1.17,
        keyConcepts: ['Pragmatics', 'Implicature', 'Cultural subtext', 'Communication nuances'],
      },
    ],
  },
]

// Helper function to get all lessons flattened
export function getAllLessons(): Lesson[] {
  return courseStructure.flatMap((level) => level.lessons)
}

// Helper function to get lessons by level
export function getLessonsByLevel(level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'): Lesson[] {
  const levelData = courseStructure.find((l) => l.code === level)
  return levelData?.lessons || []
}

// Helper function to get next lesson
export function getNextLesson(completedLessonIds: string[]): Lesson | undefined {
  const allLessons = getAllLessons()
  return allLessons.find((lesson) => !completedLessonIds.includes(lesson.id))
}

// Helper function to get lesson by ID
export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id)
}

// Helper function to get total lesson count
export function getTotalLessonCount(): number {
  return getAllLessons().length
}

