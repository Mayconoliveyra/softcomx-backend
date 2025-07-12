export interface IEmpresa {
  id: number;
  uuid: string;

  registro: string;
  nome: string;
  cnpj_cpf: string;

  pm4_token?: string | null;
  pm4_token_renovacao?: string | null;
  pm4_token_exp: number;
  prox_sinc_p4m_token: number;

  ativo: boolean;

  created_at: string;
  updated_at?: string;
}
