'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ListaDias from '@/components/ui/ListaDias'

export default function BaixaPage() {
  const router = useRouter()
  const [tabelas, setTabelas] = useState<{ id: string; data: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('tabelas_diarias')
        .select('id, data')
        .eq('criado_por', user.id)
        .order('data', { ascending: false })

      if (data) setTabelas(data)
      setLoading(false)
    }
    carregar()
  }, [router])

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="text-[#666] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div>
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">MotoLog</p>
          <h1 className="text-white font-bold text-lg">Dar baixa em entregas</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <p className="text-[#666] text-sm text-center py-10">Carregando...</p>
        ) : tabelas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#444] text-sm">Nenhuma tabela encontrada.</p>
          </div>
        ) : (
          <ListaDias tabelas={tabelas} destino="baixa" />
        )}
      </div>
    </main>
  )
}