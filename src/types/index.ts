export interface Convidado {
  id: string;
  nomeCompleto: string;
  confirmado: boolean;
  quantidadeAcompanhantes: number;
  mesa?: number;
  restricaoAlimentar?: string;
  dataResposta?: string;
  codigoConvite?: string;
}

export interface Despesa {
  id: string;
  descricao: string;
  categoria: string;
  valorTotal: number;
  valorJaPago: number;
  statusPagamento: 'Pago' | 'Pendente' | 'Parcial';
  dataCadastro?: string;
}

export interface Presente {
  id: string;
  nome: string;
  quem: string;
  status: 'Recebido' | 'Na lista';
  valor: number;
}

export interface Convite {
  id: string;
  codigo: string;
  nomeConvidado: string;
  usado: boolean;
  criadoEm: string;
}