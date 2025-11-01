'use client'

interface BillingToggleProps {
  billingCycle: 'monthly' | 'annual'
  onToggle: (cycle: 'monthly' | 'annual') => void
}

export default function BillingToggle({ billingCycle, onToggle }: BillingToggleProps) {
  const handleToggle = () => {
    onToggle(billingCycle === 'monthly' ? 'annual' : 'monthly')
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap px-4 sm:px-0">
      <button
        onClick={handleToggle}
        className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-lg font-sans font-semibold transition-all touch-manipulation min-h-[44px] sm:min-h-0 ${
          billingCycle === 'monthly'
            ? 'text-primary-900 bg-primary-50 border-2 border-primary-900'
            : 'text-gray-600 bg-white border-2 border-gray-200 active:bg-gray-50'
        }`}
        aria-pressed={billingCycle === 'monthly'}
      >
        Monthly
      </button>
      
      <button
        onClick={handleToggle}
        className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-lg font-sans font-semibold transition-all touch-manipulation min-h-[44px] sm:min-h-0 relative ${
          billingCycle === 'annual'
            ? 'text-primary-900 bg-primary-50 border-2 border-primary-900'
            : 'text-gray-600 bg-white border-2 border-gray-200 active:bg-gray-50'
        }`}
        aria-pressed={billingCycle === 'annual'}
      >
        Annual
        {billingCycle === 'annual' && (
          <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full sm:ml-2 sm:relative sm:top-0 sm:right-0">
            Save 40%
          </span>
        )}
      </button>
      
      {/* Desktop toggle switch (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={handleToggle}
          className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 touch-manipulation"
          role="switch"
          aria-checked={billingCycle === 'annual'}
          aria-label="Toggle billing cycle"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
              billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

