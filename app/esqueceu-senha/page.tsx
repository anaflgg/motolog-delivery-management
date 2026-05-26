'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function EsqueceuSenhaPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleEnviar() {
    if (!email.trim()) { setErro('Informe seu email.'); return }
    setErro('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setErro('Erro ao enviar email. Tente novamente.'); setLoading(false); return }
    setEnviado(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase mb-2">MotoLog</p>
          <h1 className="text-white text-3xl font-bold tracking-tight">Esqueceu a senha?</h1>
          <p className="text-[#666] text-sm mt-2">Sem problema, a gente resolve.</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6">
          {enviado ? (
            <div className="text-center flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a2a1a] flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="text-white font-semibold">Email enviado!</p>
              <p className="text-[#666] text-sm">Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
              <button onClick={() => router.push('/login')} className="text-[#F5A623] text-sm hover:underline">
                Voltar ao login
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[#888] text-xs font-semibold tracking-widest uppercase mb-1">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
                />
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              <button
                onClick={handleEnviar}
                disabled={loading}
                className="w-full bg-[#F5A623] hover:bg-[#e09b1a] text-[#1a1a1a] font-bold py-3.5 rounded-lg text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
              </button>
              <button onClick={() => router.push('/login')} className="text-[#666] text-sm hover:text-white transition-colors text-center">
                Voltar ao login
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}