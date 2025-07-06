export interface ICadastroAtributo {
  id: bigint;
  codigo: string;
  nome: string;
  atributo: 'COR' | 'TAMANHO' | 'SABOR' | 'POTENCIA' | 'VOLTAGEM';
  desativado: boolean;

  created_at: string;
  updated_at?: string;
}
