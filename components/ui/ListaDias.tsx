'use client'

import { useRouter } from 'next/navigation'

interface ListaDiasProps {
  tabelas: { id: string; data: string }[]
  destino: 'historico' | 'baixa'
}

export default function ListaDias({ tabelas, destino }: ListaDiasProps) {
  const router = useRouter()

  function formatarData(data: string) {
    return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {tabelas.map((t) => (
        <button
          key={t.id}
          onClick={() => router.push(`/${destino}/${t.id}`)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#F5A623] rounded-2xl px-5 py-4 text-left transition-colors group"
        >
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-semibold capitalize">
              {formatarData(t.data)}
            </p>
            <span className="text-[#444] group-hover:text-[#F5A623] text-xl transition-colors">›</span>
          </div>
        </button>
      ))}
    </div>
  )
}