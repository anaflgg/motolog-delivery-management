export type Role = 'operador' | 'motoboy' | 'admin'
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito'
export type StatusEntrega = 'pendente' | 'confirmado'

export interface Profile {
  id: string
  nome: string
  numero_motoboy: number | null
  role: Role
  created_at: string
}

export interface Entrega {
  id: string
  operador_id: string
  cliente_nome: string
  data_entrega: string
  horario: string
  valor: number
  forma_pagamento: FormaPagamento
  tem_troco: boolean
  valor_troco: number | null
  e_receita: boolean
  observacoes: string | null
  status: StatusEntrega
  created_at: string
  profiles?: Profile
}

export interface Confirmacao {
  id: string
  entrega_id: string
  motoboy_id: string
  confirmado_em: string
}