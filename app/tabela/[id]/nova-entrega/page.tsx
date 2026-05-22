'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const FORMAS_PAGAMENTO = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix_pago', label: 'Pix pago' },
  { value: 'pix_hora', label: 'Pix na hora' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'convenio', label: 'Convênio' },
  { value: 'crediario', label: 'Crediário' },
]

export default function NovaEntregaPage() {
  const router = useRouter()
  const params = useParams()
  const tabelaId = params.id as string
  const agora = new Date().toTimeString().slice(0, 5)

  const [operadorNome, setOperadorNome] = useState('')
  const [horario, setHorario] = useState(agora)
  const [valor, setValor] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('dinheiro')
  const [temTroco, setTemTroco] = useState(false)
  const [valorTroco, setValorTroco] = useState('')
  const [eReceita, setEReceita] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSalvar() {
    if (!operadorNome.trim()) { setErro('Informe o nome do operador.'); return }
    if (!valor || isNaN(Number(valor))) { setErro('Informe um valor válido.'); return }
    setErro('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('entregas').insert({
      tabela_id: tabelaId,
      operador_nome: operadorNome.trim(),
      horario,
      valor: Number(valor),
      forma_pagamento: formaPagamento,
      tem_troco: temTroco,
      valor_troco: temTroco && valorTroco ? Number(valorTroco) : null,
      e_receita: eReceita,
    })
    if (error) { setErro('Erro ao salvar entrega.'); setLoading(false); return }
    router.push(`/tabela/${tabelaId}`)
  }

  const inputClass = "w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
  const labelClass = "text-[#888] text-xs font-semibold tracking-widest uppercase mb-1 block"
  const toggleClass = (active: boolean) => `flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-[#F5A623] text-[#1a1a1a]' : 'text-[#666] hover:text-[#999]'}`

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
          <h1 className="text-white font-bold text-lg">Nova entrega</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Operador</label>
          <input className={inputClass} placeholder="Nome de quem fez a venda" value={operadorNome} onChange={e => setOperadorNome(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Horário</label>
          <input type="time" className={inputClass} value={horario} onChange={e => setHorario(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Valor da venda (R$)</label>
          <input type="number" className={inputClass} placeholder="0,00" value={valor} onChange={e => setValor(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Forma de pagamento</label>
          <div className="grid grid-cols-3 gap-2">
            {FORMAS_PAGAMENTO.map(f => (
              <button key={f.value} onClick={() => setFormaPagamento(f.value)}
                className={`py-2.5 text-sm font-semibold rounded-xl border transition-colors ${formaPagamento === f.value ? 'bg-[#F5A623] text-[#1a1a1a] border-[#F5A623]' : 'bg-[#1a1a1a] text-[#666] border-[#2a2a2a] hover:border-[#444]'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Tem troco?</label>
          <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1 gap-1">
            <button onClick={() => setTemTroco(false)} className={toggleClass(!temTroco)}>Não</button>
            <button onClick={() => setTemTroco(true)} className={toggleClass(temTroco)}>Sim</button>
          </div>
        </div>

        {temTroco && (
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Valor do troco (R$)</label>
            <input type="number" className={inputClass} placeholder="0,00" value={valorTroco} onChange={e => setValorTroco(e.target.value)} />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Venda com receita?</label>
          <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1 gap-1">
            <button onClick={() => setEReceita(false)} className={toggleClass(!eReceita)}>Não</button>
            <button onClick={() => setEReceita(true)} className={toggleClass(eReceita)}>Sim</button>
          </div>
        </div>

        {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}

        <button onClick={handleSalvar} disabled={loading}
          className="w-full bg-[#F5A623] hover:bg-[#e09b1a] text-[#1a1a1a] font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60 mt-2">
          {loading ? 'Salvando...' : 'Salvar entrega'}
        </button>
      </div>
    </main>
  )
}