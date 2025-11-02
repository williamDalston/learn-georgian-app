'use client'

import Link from 'next/link'

interface CulturalPronunciationProps {
  context?: 'formal' | 'informal' | 'mixed'
  showFullGuide?: boolean
}

/**
 * CulturalPronunciation Component
 * 
 * Displays cultural context and pronunciation etiquette information
 * for learners to understand when and how to adapt pronunciation.
 */
export default function CulturalPronunciation({
  context = 'mixed',
  showFullGuide = false,
}: CulturalPronunciationProps) {
  const getFormalAdvice = () => (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <h4 className="font-semibold text-blue-900 mb-2">📘 Formal Context</h4>
      <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
        <li>Use clear, deliberate pronunciation</li>
        <li>Address elders with <strong>ბატონო</strong> (batono) or <strong>კალბატონო</strong> (kalbatono)</li>
        <li>Use formal greeting: <strong>გამარჯობათ</strong> (gamarjobat)</li>
        <li>Pronounce all syllables fully</li>
        <li>Slightly slower pace is acceptable</li>
      </ul>
    </div>
  )

  const getInformalAdvice = () => (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
      <h4 className="font-semibold text-green-900 mb-2">📗 Informal Context</h4>
      <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
        <li>Relaxed, natural pronunciation</li>
        <li>Use informal greeting: <strong>გამარჯობა</strong> (gamarjoba)</li>
        <li>First names, no titles needed</li>
        <li>Natural pace and intonation</li>
        <li>Some consonant clusters may be simplified</li>
      </ul>
    </div>
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 my-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">🌍</div>
        <div className="flex-1">
          <h3 className="font-serif text-xl text-primary-900 mb-2">
            Cultural Context: Pronunciation Etiquette
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Understanding when and how to adapt your pronunciation based on social context
            is important for effective communication in Georgian.
          </p>
        </div>
      </div>

      {/* Context-specific advice */}
      {context === 'formal' && getFormalAdvice()}
      {context === 'informal' && getInformalAdvice()}
      {context === 'mixed' && (
        <div className="space-y-4">
          {getFormalAdvice()}
          {getInformalAdvice()}
        </div>
      )}

      {/* Quick reference table */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Quick Reference</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left p-2">Context</th>
                <th className="text-left p-2">Greeting</th>
                <th className="text-left p-2">Address</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2 font-medium">Elder, first meeting</td>
                <td className="p-2">გამარჯობათ</td>
                <td className="p-2">ბატონო/კალბატონო</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 font-medium">Teacher, professor</td>
                <td className="p-2">გამარჯობათ</td>
                <td className="p-2">ბატონო/კალბატონო</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 font-medium">Business meeting</td>
                <td className="p-2">გამარჯობათ</td>
                <td className="p-2">ბატონო/კალბატონო</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 font-medium">Friend, peer</td>
                <td className="p-2">გამარჯობა</td>
                <td className="p-2">First name</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Family</td>
                <td className="p-2">გამარჯობა</td>
                <td className="p-2">Kinship terms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Link to full guide */}
      {showFullGuide && (
        <div className="border-t border-gray-200 pt-4">
          <Link
            href="/content/resources/cultural-guides/pronunciation-etiquette"
            className="text-accent hover:text-accent-dark font-medium text-sm inline-flex items-center gap-2"
          >
            Read full pronunciation etiquette guide →
          </Link>
        </div>
      )}

      {/* Cultural note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
        <p className="text-sm text-yellow-800">
          <strong>💡 Tip:</strong> Georgian culture highly values respect for elders.
          When in doubt, use formal address and clear pronunciation. It's better to be
          too formal than too informal in first meetings.
        </p>
      </div>
    </div>
  )
}

