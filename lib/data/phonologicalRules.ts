/**
 * Phonological Rules Database
 * 
 * Collection of Georgian phonological rules and patterns
 * for reference and structured learning.
 */

export interface PhonologicalRule {
  id: string
  name: string
  description: string
  category: 'consonant' | 'vowel' | 'allophony' | 'sandhi' | 'stress'
  examples: string[]
  exception?: string
  ipa?: string
  importance: 'critical' | 'high' | 'medium' | 'low'
}

export const phonologicalRules: PhonologicalRule[] = [
  {
    id: 'ejective-production',
    name: 'Ejective Consonant Production',
    description: 'Ejectives are produced with simultaneous closure of the glottis and oral place of articulation. Air pressure builds up in the pharynx and is released with a sharp pop.',
    category: 'consonant',
    ipa: '[kʼ], [pʼ], [tʼ], [tsʼ], [tʃʼ], [qʼ]',
    examples: [
      'კატა (cat) - [kʼɑtʼɑ]',
      'პარი (spring) - [pʼɑri]',
      'ტატა (dad) - [tʼɑtʼɑ]',
    ],
    importance: 'critical',
  },
  {
    id: 'aspirated-production',
    name: 'Aspirated Consonant Production',
    description: 'Aspirated consonants are produced with a burst of air following the consonant release. The aspiration is stronger than in English.',
    category: 'consonant',
    ipa: '[tʰ], [pʰ], [kʰ], [tʃʰ]',
    examples: [
      'თევზა (eagle) - [tʰɛvzɑ]',
      'ფერი (color) - [pʰɛri]',
      'ქალი (woman) - [kʰɑli]',
      'ჩირი (mouth) - [tʃʰiri]',
    ],
    importance: 'critical',
  },
  {
    id: 'tripartite-consonant-system',
    name: 'Tripartite Consonant Distinction',
    description: 'Georgian has three-way distinctions for several consonant places: voiced, aspirated, and ejective. For example: [b] vs [pʰ] vs [pʼ].',
    category: 'consonant',
    examples: [
      'ბ (voiced): ბარი [bɑri] "bar"',
      'ფ (aspirated): ფარი [pʰɑri] "shield"',
      'პ (ejective): პარი [pʼɑri] "spring"',
    ],
    importance: 'critical',
    exception: 'Note: Not all places of articulation have all three types.',
  },
  {
    id: 'trilled-r',
    name: 'Trilled R Production',
    description: 'The Georgian რ is produced as a trill, with the tongue tip vibrating rapidly against the alveolar ridge.',
    category: 'consonant',
    ipa: '[r]',
    examples: [
      'რა [rɑ] "what"',
      'სახელი [sɑxɛli] "name"',
      'როგორ [rɔɡɔr] "how"',
    ],
    importance: 'high',
  },
  {
    id: 'velar-pharyngeal-fricatives',
    name: 'Guttural Fricatives',
    description: 'Georgian has voiced [ɣ] and voiceless [x] fricatives produced in the back of the throat (velar/pharyngeal region).',
    category: 'consonant',
    ipa: '[ɣ], [x]',
    examples: [
      'ღამე (night) - [ɣɑmɛ] - voiced',
      'ხარი (bull) - [xɑri] - voiceless',
      'ღვთის (God\'s) - [ɣvtis]',
    ],
    importance: 'high',
  },
  {
    id: 'vowel-quality',
    name: 'Vowel Quality',
    description: 'Georgian has five vowel phonemes that are relatively stable in quality, not heavily reduced or diphthongized.',
    category: 'vowel',
    ipa: '[ɑ], [ɛ], [i], [ɔ], [u]',
    examples: [
      'ა [ɑ] - /sa// house',
      'ე [ɛ] - /dedɛ/ mother',
      'ი [i] - /ɡɑmɑrd͡ʒɔbɑ/ hello',
      'ო [ɔ] - /ɡɔ/ this',
      'უ [u] - /u/ and',
    ],
    importance: 'medium',
  },
  {
    id: 'consonant-clusters',
    name: 'Complex Consonant Clusters',
    description: 'Georgian allows extremely complex consonant clusters, including sequences of 6-8 consonants without vowels.',
    category: 'consonant',
    examples: [
      'გრძელი [ɡrd͡zɛli] - long',
      'ღვთის [ɣvtis] - God\'s',
      'მწვრთნელი [mtsʼvrtnɛli] - coach',
      'გჭირდებათ [ɡtʃʼirdɛbɑtʰ] - you need',
    ],
    importance: 'high',
    exception: 'Some clusters are difficult for non-native speakers and require careful practice.',
  },
  {
    id: 'stress-pattern',
    name: 'Word Stress Pattern',
    description: 'Georgian stress typically falls on the first syllable of the word.',
    category: 'stress',
    examples: [
      'გამარჯობა [ˈɡɑmɑrd͡ʒɔbɑ] - stress on first syllable',
      'სახელი [ˈsɑxɛli] - stress on first syllable',
      'კატა [ˈkʼɑtʼɑ] - stress on first syllable',
    ],
    importance: 'medium',
    exception: 'Some compounds and derived words may have stress on other syllables.',
  },
  {
    id: 'voice-assimilation',
    name: 'Voicing Assimilation',
    description: 'In consonant clusters, voicing may spread from one consonant to adjacent consonants.',
    category: 'sandhi',
    examples: [
      'გრ consonant cluster with voicing harmony',
    ],
    importance: 'low',
    exception: 'Not as systematic as in some languages.',
  },
  {
    id: 'palatalization',
    name: 'Palatalization',
    description: 'Consonants before front vowels may become palatalized (softened).',
    category: 'allophony',
    examples: [
      'კ before ი may sound slightly different',
    ],
    importance: 'low',
    exception: 'This is a subtle phonetic phenomenon, not phonemic.',
  },
  {
    id: 'geminate-clusters',
    name: 'Geminate Consonants',
    description: 'Georgian allows geminate (doubled) consonants which are pronounced as single long consonants.',
    category: 'consonant',
    examples: [
      'დაუძახებს [dɑud͡zɑxɛbs] - with geminate sounds',
    ],
    importance: 'medium',
  },
  {
    id: 'ejective-glottalization',
    name: 'Glottal Closure in Ejectives',
    description: 'The glottis remains closed throughout the production of ejective consonants, creating a distinctive "popping" release.',
    category: 'consonant',
    ipa: 'Glottalic airstream mechanism',
    examples: [
      'Every ejective requires glottal closure and glottalic release',
    ],
    importance: 'critical',
  },
]

/**
 * Get rules by category
 */
export function getRulesByCategory(category: PhonologicalRule['category']): PhonologicalRule[] {
  return phonologicalRules.filter((rule) => rule.category === category)
}

/**
 * Get critical rules only
 */
export function getCriticalRules(): PhonologicalRule[] {
  return phonologicalRules.filter((rule) => rule.importance === 'critical')
}

/**
 * Search rules by keyword
 */
export function searchRules(query: string): PhonologicalRule[] {
  const lowerQuery = query.toLowerCase()
  return phonologicalRules.filter((rule) =>
    rule.name.toLowerCase().includes(lowerQuery) ||
    rule.description.toLowerCase().includes(lowerQuery) ||
    rule.examples.some((ex) => ex.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get rule by ID
 */
export function getRuleById(id: string): PhonologicalRule | undefined {
  return phonologicalRules.find((rule) => rule.id === id)
}

