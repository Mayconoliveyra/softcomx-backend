export interface IUsuario {
  id: number;
  uuid: string;

  empresa_id: number;

  nome: string;
  email: string;
  senha: string;
  ativo: boolean;

  created_at: string;
  updated_at?: string;
}
