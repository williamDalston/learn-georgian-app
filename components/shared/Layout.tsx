import { ReactNode } from 'react'
import Container from './Container'
import MobileNavigation from './MobileNavigation'

interface LayoutProps {
  children: ReactNode
  className?: string
  containerMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'
  showMobileNav?: boolean
}

export default function Layout({ 
  children, 
  className = '',
  containerMaxWidth = '7xl',
  showMobileNav = true
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-neutral-50 ${className} pb-safe`}>
      <Container maxWidth={containerMaxWidth}>
        {children}
      </Container>
      {showMobileNav && <MobileNavigation />}
    </div>
  )
}

