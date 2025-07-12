export interface ICadastroCanal {
  id: number;

  codigo: number;
  cnpj?: string | null;
  nome: string;
  url_logo: string;

  ativo: boolean;

  created_at: string;
  updated_at?: string;
}
