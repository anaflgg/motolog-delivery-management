'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Entrega {
  id: string
  operador_nome: string
  horario: string
  cliente_nome: string | null
  valor: number
  forma_pagamento: string
  tem_troco: boolean
  valor_troco: number | null
  e_receita: boolean
  observacoes: string | null
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

export default function HistoricoDetalhePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [dataFormatada, setDataFormatada] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalEntrega, setModalEntrega] = useState<Entrega | null>(null)
  const [clienteNome, setClienteNome] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [numeroMotoboy, setNumeroMotoboy] = useState('')
  const [motoboyConfirmado, setMotoboyConfirmado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [confirmandoDelete, setConfirmandoDelete] = useState(false)

  async function carregar() {
    const supabase = createClient()

    const { data: tabela } = await supabase
      .from('tabelas_diarias')
      .select('data')
      .eq('id', id)
      .single()

    if (tabela) {
      setDataFormatada(new Date(tabela.data + 'T12:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
      }))
    }

    const { data } = await supabase
      .from('entregas')
      .select('*')
      .eq('tabela_id', id)
      .order('horario', { ascending: false })

    if (data) setEntregas(data)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [id])

  function abrirModal(e: Entrega) {
    setModalEntrega(e)
    setClienteNome(e.cliente_nome || '')
    setObservacoes(e.observacoes || '')
    setNumeroMotoboy(e.numero_motoboy ? String(e.numero_motoboy) : '')
    setMotoboyConfirmado(e.motoboy_confirmado)
    setConfirmandoDelete(false)
  }

  function fecharModal() {
    setModalEntrega(null)
    setConfirmandoDelete(false)
  }

  async function handleSalvarModal() {
    if (!modalEntrega) return
    setSalvando(true)
    const supabase = createClient()
    await supabase.from('entregas').update({
      cliente_nome: clienteNome.trim() || null,
      observacoes: observacoes.trim() || null,
      numero_motoboy: numeroMotoboy ? Number(numeroMotoboy) : null,
      motoboy_confirmado: motoboyConfirmado,
    }).eq('id', modalEntrega.id)
    setSalvando(false)
    fecharModal()
    carregar()
  }

  async function handleCancelarEntrega() {
    if (!modalEntrega) return
    setSalvando(true)
    const supabase = createClient()
    await supabase.from('entregas').update({
      cancelada: !modalEntrega.cancelada,
    }).eq('id', modalEntrega.id)
    setSalvando(false)
    fecharModal()
    carregar()
  }

  async function handleDeletarEntrega() {
    if (!modalEntrega) return
    setSalvando(true)
    const supabase = createClient()
    await supabase.from('entregas').delete().eq('id', modalEntrega.id)
    setSalvando(false)
    fecharModal()
    carregar()
  }

  function cardStyle(e: Entrega) {
    if (e.cancelada) return 'bg-[#1a0a0a] border-[#5a1a1a] hover:border-[#8a2a2a]'
    if (e.motoboy_confirmado) return 'bg-[#0a1a0a] border-[#1a4a1a] hover:border-[#2a6a2a]'
    return 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#F5A623]'
  }

  const inputClass = "w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
  const labelClass = "text-[#888] text-xs font-semibold tracking-widest uppercase mb-1 block"
  const toggleClass = (active: boolean) => `flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-[#F5A623] text-[#1a1a1a]' : 'text-[#666] hover:text-[#999]'}`

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[#666] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase">MotoLog</p>
          <h1 className="text-white font-bold text-lg capitalize">{dataFormatada || 'Carregando...'}</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-[#666] text-sm text-center py-10">Carregando...</p>
        ) : entregas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#444] text-sm">Nenhuma entrega registrada neste dia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entregas.map((e) => (
              <button
                key={e.id}
                onClick={() => abrirModal(e)}
                className={`border rounded-2xl p-4 text-left transition-colors w-full ${cardStyle(e)}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {e.cliente_nome || <span className="text-[#555] italic">Cliente não informado</span>}
                    </p>
                    <p className="text-[#666] text-xs mt-0.5">{e.operador_nome} · {e.horario.slice(0, 5)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-[#F5A623] font-bold text-sm whitespace-nowrap">
                      R$ {Number(e.valor).toFixed(2).replace('.', ',')}
                    </p>
                    {e.cancelada && <span className="text-[#e05555] text-xs font-semibold">Cancelada</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#2a2a2a] text-[#aaa] text-xs px-2.5 py-1 rounded-lg">{FORMA_LABEL[e.forma_pagamento]}</span>
                  {e.tem_troco && <span className="bg-[#2a2a2a] text-[#aaa] text-xs px-2.5 py-1 rounded-lg">Troco R$ {Number(e.valor_troco).toFixed(2).replace('.', ',')}</span>}
                  {e.e_receita && <span className="bg-[#1a2a1a] text-[#4ade80] text-xs px-2.5 py-1 rounded-lg">Receita</span>}
                  {e.numero_motoboy && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg ${e.motoboy_confirmado ? 'bg-[#1a2a1a] text-[#4ade80]' : 'bg-[#2a2a2a] text-[#aaa]'}`}>
                      Motoboy #{e.numero_motoboy} {e.motoboy_confirmado ? '✓' : ''}
                    </span>
                  )}
                </div>
                {e.observacoes && <p className="text-[#555] text-xs mt-2 border-t border-[#2a2a2a] pt-2">{e.observacoes}</p>}
              </button>
            ))}
          </div>
        )}
      </div>

      {modalEntrega && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0" onClick={fecharModal}>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold">{modalEntrega.operador_nome} · {modalEntrega.horario.slice(0, 5)}</p>
                <p className="text-[#F5A623] font-bold">R$ {Number(modalEntrega.valor).toFixed(2).replace('.', ',')}</p>
              </div>
              <button onClick={fecharModal} className="text-[#666] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="border-t border-[#2a2a2a] pt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Nome do cliente (opcional)</label>
                <input className={inputClass} placeholder="Nome do cliente" value={clienteNome} onChange={e => setClienteNome(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Observações (opcional)</label>
                <textarea className={`${inputClass} resize-none h-20`} placeholder="Alguma observação..." value={observacoes} onChange={e => setObservacoes(e.target.value)} />
              </div>

              <div className="border-t border-[#2a2a2a] pt-4">
                <label className={labelClass}>Acerto com motoboy</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" className={`${inputClass} flex-1`} placeholder="Número do motoboy" value={numeroMotoboy} onChange={e => setNumeroMotoboy(e.target.value)} />
                  <div className="flex bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-1 gap-1 flex-shrink-0">
                    <button onClick={() => setMotoboyConfirmado(false)} className={toggleClass(!motoboyConfirmado)}>—</button>
                    <button onClick={() => setMotoboyConfirmado(true)} className={toggleClass(motoboyConfirmado)}>OK</button>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSalvarModal} disabled={salvando}
              className="w-full bg-[#F5A623] hover:bg-[#e09b1a] text-[#1a1a1a] font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleCancelarEntrega}
                disabled={salvando}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-60 ${
                  modalEntrega.cancelada
                    ? 'border-[#2a4a2a] text-[#4ade80] hover:bg-[#0a1a0a]'
                    : 'border-[#4a2a2a] text-[#e05555] hover:bg-[#1a0a0a]'
                }`}>
                {modalEntrega.cancelada ? 'Desfazer cancelamento' : 'Cancelar entrega'}
              </button>

              {!confirmandoDelete ? (
                <button
                  onClick={() => setConfirmandoDelete(true)}
                  disabled={salvando}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#3a3a3a] text-[#666] hover:border-[#e05555] hover:text-[#e05555] transition-colors disabled:opacity-60">
                  Deletar
                </button>
              ) : (
                <button
                  onClick={handleDeletarEntrega}
                  disabled={salvando}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#e05555] text-white hover:bg-[#c04444] transition-colors disabled:opacity-60">
                  Confirmar
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </main>
  )
}