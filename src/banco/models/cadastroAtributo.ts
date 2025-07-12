export interface ICadastroAtributo {
  id: number;

  codigo: string;
  nome: string;
  atributo: 'COR' | 'TAMANHO' | 'SABOR' | 'POTENCIA' | 'VOLTAGEM';

  ativo: boolean;

  created_at: string;
  updated_at?: string;
}
