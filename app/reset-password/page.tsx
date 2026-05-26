'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleRedefinir() {
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    if (senha !== confirmar) { setErro('As senhas não coincidem.'); return }
    setErro('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: senha })
    if (error) { setErro('Erro ao redefinir senha. Tente novamente.'); setLoading(false); return }
    setSucesso(true)
    setLoading(false)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase mb-2">MotoLog</p>
          <h1 className="text-white text-3xl font-bold tracking-tight">Nova senha</h1>
          <p className="text-[#666] text-sm mt-2">Digite sua nova senha abaixo.</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 flex flex-col gap-4">
          {sucesso ? (
            <div className="text-center flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a2a1a] flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="text-white font-semibold">Senha redefinida!</p>
              <p className="text-[#666] text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[#888] text-xs font-semibold tracking-widest uppercase mb-1">Nova senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#888] text-xs font-semibold tracking-widest uppercase mb-1">Confirmar senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
                />
              </div>
              {erro && <p className="text-red-400 text-sm">{erro}</p>}
              <button
                onClick={handleRedefinir}
                disabled={loading}
                className="w-full bg-[#F5A623] hover:bg-[#e09b1a] text-[#1a1a1a] font-bold py-3.5 rounded-lg text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Salvando...' : 'Redefinir senha'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}