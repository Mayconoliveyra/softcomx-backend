export interface ICadastroCategoria {
  id: number;

  canal_id: number;
  codigo: string;
  nome: string;

  ativo: boolean;

  created_at: string;
  updated_at?: string;
}
