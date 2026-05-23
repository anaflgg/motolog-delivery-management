'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [nome, setNome] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setErro('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) { setErro('Email ou senha inválidos.'); setLoading(false); return }
    router.push('/dashboard')
  }

  async function handleCadastro() {
    setErro('')
    if (!nome.trim()) { setErro('Informe seu nome completo.'); return }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return }
    if (senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    })
    if (error) { setErro('Erro ao criar conta. Tente novamente.'); setLoading(false); return }
    setErro('')
    alert('Conta criada! Verifique seu email para confirmar.')
    setTab('login')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-[#F5A623] text-xs font-semibold tracking-widest uppercase mb-2">
            MotoLog
          </p>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Gestão de Entregas
          </h1>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#2a2a2a]">

          <div className="flex border-b border-[#2a2a2a]">
            <button
              onClick={() => { setTab('login'); setErro('') }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === 'login'
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623]'
                  : 'text-[#666] hover:text-[#999]'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setTab('cadastro'); setErro('') }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                tab === 'cadastro'
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623]'
                  : 'text-[#666] hover:text-[#999]'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">

            {tab === 'cadastro' && (
              <div className="flex flex-col gap-1">
                <label className="text-[#888] text-xs font-semibold tracking-widest uppercase">
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="João Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-xs font-semibold tracking-widest uppercase">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#888] text-xs font-semibold tracking-widest uppercase">
                Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#999] transition-colors"
                >
                  {mostrarSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {tab === 'cadastro' && (
              <div className="flex flex-col gap-1">
                <label className="text-[#888] text-xs font-semibold tracking-widest uppercase">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="bg-[#111] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#F5A623] transition-colors"
                />
              </div>
            )}

            {tab === 'login' && (
              <div className="text-right -mt-2">
                <span className="text-[#F5A623] text-sm cursor-pointer hover:underline">
                  Esqueceu a senha?
                </span>
              </div>
            )}

            {erro && (
              <p className="text-red-400 text-sm text-center">{erro}</p>
            )}

            <button
              onClick={tab === 'login' ? handleLogin : handleCadastro}
              disabled={loading}
              className="w-full bg-[#F5A623] hover:bg-[#e09b1a] text-[#1a1a1a] font-bold py-3.5 rounded-lg text-sm transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
            </button>

          </div>
        </div>

        <p className="text-center text-[#444] text-xs mt-6">
          MotoLog © 2026 — Desenvolvido por Ana Ananias
        </p>
      </div>
    </main>
  )
}