'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Entrega {
  id: string
  horario: string
  valor: number
  forma_pagamento: string
  tem_troco: boolean
  valor_troco: number | null
  numero_motoboy: number | null
  motoboy_confirmado: boolean
  cancelada: boolean
}

const FORMA_LABEL: Record<string, string> = {
  dinheiro: 'Dinheiro',
  pix_pago: 'Pix pago',
  pix_hora: 'Pix na hora',
  cartao: 'Cartão',
  convenio: 'Convênio',
  crediario: 'Crediário',
}

export default function BaixaDetalhePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [data, setData] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()

      const { data: tabela } = await supabase
        .from('tabelas_diarias')
        .select('data')
        .eq('id', id)
        .single()

      if (tabela) {
        setData(new Date(tabela.data + 'T12:00:00').toLocaleDateString('pt-BR', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        }))
      }

      const { data: rows } = await supabase
        .from('entregas')
        .select('id, horario, valor, forma_pagamento, tem_troco, valor_troco, numero_motoboy, motoboy_confirmado, cancelada')
        .eq('tabela_id', id)
        .order('horario', { ascending: false })

      if (rows) setEntregas(rows)
      setLoading(false)
    }
    carregar()
  }, [id])

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[#666] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div>
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">MotoLog</p>
          <h1 className="text-white font-bold text-lg capitalize">{data || 'Carregando...'}</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <p className="text-[#666] text-sm text-center py-10">Carregando...</p>
        ) : entregas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#444] text-sm">Nenhuma entrega neste dia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {entregas.map((e) => (
              <div
                key={e.id}
                className={`rounded-2xl px-4 py-3 border ${
                  e.cancelada
                    ? 'bg-[#1a0a0a] border-[#5a1a1a]'
                    : e.motoboy_confirmado
                    ? 'bg-[#0a1a0a] border-[#1a4a1a]'
                    : 'bg-[#1a1a1a] border-[#2a2a2a]'
                }`}
              >
                <div className="flex items-center gap-3">

                  <p className={`text-sm font-mono font-bold tabular-nums flex-shrink-0 ${e.cancelada ? 'text-[#555]' : 'text-white'}`}>
                    {e.horario.slice(0, 5)}
                  </p>

                  <span className="text-[#333] text-xs">·</span>

                  <p className={`text-sm font-bold flex-shrink-0 ${e.cancelada ? 'text-[#555] line-through' : 'text-[#F5A623]'}`}>
                    R$ {Number(e.valor).toFixed(2).replace('.', ',')}
                  </p>

                  <span className="text-[#333] text-xs">·</span>

                  <p className="text-[#666] text-xs flex-shrink-0">{FORMA_LABEL[e.forma_pagamento]}</p>

                  <div className="ml-auto flex-shrink-0">
                    {e.cancelada ? (
                      <span className="text-[#e05555] text-xs font-semibold">Cancelada</span>
                    ) : e.numero_motoboy ? (
                      <span className={`text-base font-bold ${e.motoboy_confirmado ? 'text-[#4ade80]' : 'text-[#aaa]'}`}>
                        #{e.numero_motoboy} {e.motoboy_confirmado ? '✓' : ''}
                      </span>
                    ) : (
                      <span className="text-[#333] text-xs">sem motoboy</span>
                    )}
                  </div>

                </div>

                {e.tem_troco && !e.cancelada && (
                  <div className="mt-1.5 pt-1.5 border-t border-[#ffffff08]">
                    <p className="text-[#555] text-xs">
                      Troco R$ {Number(e.valor_troco).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}