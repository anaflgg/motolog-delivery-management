'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function NovaTabelaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [userId, setUserId] = useState('')
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const dataHoje = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('tabelas_diarias')
        .select('id')
        .eq('data', dataHoje)
        .single()

      if (data) router.push('/tabela/hoje')
    }
    getUser()
  }, [router, dataHoje])

async function handleCriar() {
  setErro('')
  setLoading(true)
  const supabase = createClient()

  console.log('userId:', userId)
  console.log('dataHoje:', dataHoje)

  const { data, error } = await supabase
    .from('tabelas_diarias')
    .insert({ data: dataHoje, criado_por: userId })
    .select()
    .single()

  console.log('data:', data)
  console.log('error:', error)

  if (error) { setErro('Erro ao criar tabela. Tente novamente.'); setLoading(false); return }
  router.push(`/tabela/${data.id}`)
}

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-[#666] hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div>
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">MotoLog</p>
          <h1 className="text-white font-bold text-lg">Nova tabela diária</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-6">

          <div>
            <p className="text-[#666] text-xs uppercase tracking-widest font-semibold mb-1">Data</p>
            <p className="text-white text-lg font-semibold capitalize">{hoje}</p>
          </div>

          <div className="border-t border-[#2a2a2a] pt-4">
            <p className="text-[#666] text-sm">
              Ao criar a tabela diária, você poderá adicionar as entregas do dia uma a uma.
              Só é possível criar uma tabela por dia.
            </p>
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <button
            onClick={handleCriar}
            disabled={loading}
            className="w-full bg-[#F5A623] hover:bg-[#e09b1a] text-[#1a1a1a] font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Criando...' : 'Criar tabela de hoje'}
          </button>
        </div>
      </div>
    </main>
  )
}