export interface ICadastroCanal {
  id: bigint;
  codigo: number;
  cnpj?: string | null;
  nome: string;
  sellerId?: string | null;
  url_logo: string;

  desativado: boolean;

  created_at: string;
  updated_at?: string;
}
