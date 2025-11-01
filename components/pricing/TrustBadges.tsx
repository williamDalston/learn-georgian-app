export default function TrustBadges() {
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      {/* Guaranteed Safe Checkout */}
      <div className="text-center">
        <p className="text-sm font-sans text-gray-700 mb-3 font-semibold">
          Guaranteed Safe Checkout
        </p>
        
        {/* Payment Method Icons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Visa */}
          <div className="flex items-center justify-center w-16 h-10 bg-white rounded border border-gray-200 shadow-sm">
            <span className="text-xl font-bold text-blue-900 font-sans">VISA</span>
          </div>
          
          {/* Mastercard */}
          <div className="flex items-center justify-center w-16 h-10 bg-white rounded border border-gray-200 shadow-sm">
            <svg className="w-12 h-8" viewBox="0 0 40 24" fill="none">
              <circle cx="15" cy="12" r="8" fill="#EB001B" />
              <circle cx="25" cy="12" r="8" fill="#F79E1B" />
              <path
                d="M20 7.5C21.5 9.5 22 11 22 12.5C22 14 21.5 15.5 20 17.5C18.5 15.5 18 14 18 12.5C18 11 18.5 9.5 20 7.5Z"
                fill="#FF5F00"
              />
            </svg>
          </div>
          
          {/* PayPal */}
          <div className="flex items-center justify-center w-16 h-10 bg-white rounded border border-gray-200 shadow-sm px-2">
            <span className="text-xs font-bold text-blue-700 font-sans">PayPal</span>
          </div>
          
          {/* Stripe */}
          <div className="flex items-center justify-center w-16 h-10 bg-white rounded border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-purple-600 font-sans">Stripe</span>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 text-sm font-sans text-gray-600">
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>SSL Encrypted • Secure Payment Processing</span>
      </div>
    </div>
  )
}
