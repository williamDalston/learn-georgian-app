'use client'

import { useEffect, useState, ReactNode } from 'react'
import { isSlowConnection, getConnectionInfo } from '@/lib/utils/performance'

interface NetworkAwareProps {
  children: ReactNode
  slowConnectionFallback?: ReactNode
  onConnectionChange?: (isSlow: boolean) => void
}

/**
 * Component that adapts based on network connection
 * Shows fallback content for slow connections
 */
export default function NetworkAware({
  children,
  slowConnectionFallback,
  onConnectionChange,
}: NetworkAwareProps) {
  const [isSlow, setIsSlow] = useState(false)
  const [connectionInfo, setConnectionInfo] = useState<ReturnType<typeof getConnectionInfo>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkConnection = () => {
      const slow = isSlowConnection()
      const info = getConnectionInfo()
      
      setIsSlow(slow)
      setConnectionInfo(info)
      onConnectionChange?.(slow)

      // Log connection info in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Network connection:', {
          isSlow,
          ...info,
        })
      }
    }

    // Initial check
    checkConnection()

    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      connection.addEventListener('change', checkConnection)
      return () => {
        connection.removeEventListener('change', checkConnection)
      }
    }
  }, [isSlow, onConnectionChange])

  // Show fallback for slow connections if provided
  if (isSlow && slowConnectionFallback) {
    return <>{slowConnectionFallback}</>
  }

  // Optionally reduce quality for slow connections
  const shouldReduceQuality = isSlow || connectionInfo.saveData

  return (
    <div data-slow-connection={isSlow} data-save-data={connectionInfo.saveData}>
      {children}
    </div>
  )
}

/**
 * Hook to check if connection is slow
 */
export function useNetworkStatus() {
  const [isSlow, setIsSlow] = useState(false)
  const [connectionInfo, setConnectionInfo] = useState<ReturnType<typeof getConnectionInfo>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkConnection = () => {
      setIsSlow(isSlowConnection())
      setConnectionInfo(getConnectionInfo())
    }

    checkConnection()

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      connection.addEventListener('change', checkConnection)
      return () => {
        connection.removeEventListener('change', checkConnection)
      }
    }
  }, [])

  return { isSlow, connectionInfo }
}

