export interface ICadastroCategoria {
  id: bigint;
  canal_id: number;
  codigo: string;
  nome: string;

  desativado: boolean;

  created_at: string;
  updated_at?: string;
}
