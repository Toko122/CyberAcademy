'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        const response = await fetch('/api/admin/me', { credentials: 'include' })

        if (!response.ok) {
          router.replace('/admin/login')
          return
        }

        const payload = await response.json()

        if (!payload.authenticated) {
          router.replace('/admin/login')
          return
        }

        if (mounted) {
          setAllowed(true)
        }

      } catch {
        router.replace('/admin/login')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkUser()

    return () => {
      mounted = false
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-200" role="status" aria-live="polite">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" aria-hidden="true" />
        <span className="text-sm font-medium">Loading admin workspace...</span>
      </div>
    )
  }

  if (!allowed) return null

  return <>{children}</>
}

export default ProtectedRoute
