'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import CTAButton from './CTAButton'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'The Teacher', href: '#teacher', icon: '👨‍🏫' },
  { label: 'Login', href: '/login', icon: '🔐' },
]

export default function MobileNavigation() {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const handleItemPress = (href: string) => {
    setActiveItem(href)
    // Reset after animation
    setTimeout(() => setActiveItem(null), 200)
  }

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm bg-white/95"
      aria-label="Mobile navigation"
    >
      <div className="px-2 py-2">
        {/* Main Navigation Items */}
        <div className="flex items-center justify-around mb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '#teacher' && pathname.includes('teacher'))
            const isPressed = activeItem === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleItemPress(item.href)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] min-h-[44px] touch-manipulation ${
                  isActive
                    ? 'text-accent bg-accent/10 scale-105'
                    : isPressed
                    ? 'text-accent bg-gray-100 scale-95'
                    : 'text-gray-600 active:text-accent active:bg-gray-50 active:scale-95'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-xl mb-1 transition-transform duration-200" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-xs font-sans font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Prominent CTA Button */}
        <div className="px-2">
          <CTAButton 
            href="/subscribe" 
            variant="primary" 
            className="w-full py-3 text-base font-bold"
          >
            Start Trial
          </CTAButton>
        </div>
      </div>
      
      {/* Safe area padding for devices with notches (iOS) */}
      <div 
        className="bg-white" 
        style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
      />
    </nav>
  )
}

