export interface IErpProduto {
  id: bigint;
  empresa_id: bigint;

  codigo: number;
  codigo_sku: number;

  nome: string;
  preco_venda: number;
  preco_venda_a: number;
  preco_venda_b: number;
  preco_venda_c: number;
  preco_venda_d: number;

  preco_custo: number;
  estoque: number;

  cod_nfe?: string | null;
  cod_referencia?: string | null;
  cod_barras_grade?: string | null;
  marca: string;
  grupo: string;
  grupo_id: number;
  unid_medida: string;
  tamanho?: string | null;
  cor?: string | null;
  ncm?: string | null;
  cest?: string | null;

  created_at: string;
  updated_at?: string;
}
