'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setNome(user.user_metadata?.nome || user.email || '')
    }
    getUser()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">MotoLog</p>
          <h1 className="text-white font-bold text-lg">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#666] text-sm hidden sm:block">{nome}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-[#888] hover:text-white border border-[#2a2a2a] hover:border-[#444] px-4 py-2 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-[#666] text-sm">Em construção — as próximas funcionalidades vêm aqui.</p>
      </div>
    </main>
  )
}