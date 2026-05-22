'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [primeiroNome, setPrimeiroNome] = useState('')

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const nomeCompleto = user.user_metadata?.nome || user.email || ''
      setPrimeiroNome(nomeCompleto.split(' ')[0])
    }
    getUser()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const iniciais = primeiroNome.slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">MotoLog</p>
          <h1 className="text-white font-bold text-lg">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-[#F5A623] text-xs font-bold">
            {iniciais}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#888] border border-[#2a2a2a] hover:border-[#444] hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-white text-2xl font-bold">
            Bem-vindo(a), {primeiroNome}!
          </h2>
          <p className="text-[#666] text-sm mt-1">O que vamos fazer hoje?</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/tabela/nova')}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#F5A623] rounded-2xl p-5 flex items-center gap-4 transition-colors text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#2a1f00] flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Nova tabela diária</p>
              <p className="text-[#666] text-xs mt-0.5">Iniciar o registro de entregas de hoje</p>
            </div>
            <span className="ml-auto text-[#444] group-hover:text-[#F5A623] text-xl transition-colors">›</span>
          </button>

          <button
            onClick={() => router.push('/tabela/hoje')}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#F5A623] rounded-2xl p-5 flex items-center gap-4 transition-colors text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#2a1f00] flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Tabela de hoje</p>
              <p className="text-[#666] text-xs mt-0.5">Acessar e adicionar entregas do dia</p>
            </div>
            <span className="ml-auto text-[#444] group-hover:text-[#F5A623] text-xl transition-colors">›</span>
          </button>

          <button
            onClick={() => router.push('/historico')}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#888] rounded-2xl p-5 flex items-center gap-4 transition-colors text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1f1f1f] flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Histórico</p>
              <p className="text-[#666] text-xs mt-0.5">Consultar tabelas de dias anteriores</p>
            </div>
            <span className="ml-auto text-[#444] group-hover:text-white text-xl transition-colors">›</span>
          </button>
        </div>
      </div>
    </main>
  )
}