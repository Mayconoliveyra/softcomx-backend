import { ICadastroAtributo } from '../../models/cadastroAtributo';
import { ICadastroCanal } from '../../models/cadastroCanal';
import { ICadastroCategoria } from '../../models/cadastroCategoria';
import { IEmpresa } from '../../models/empresa';
import { IErpProduto } from '../../models/erpProduto';
import { IUsuario } from '../../models/usuario';

declare module 'knex/types/tables' {
  interface Tables {
    empresas: IEmpresa;
    usuarios: IUsuario;
    erp_produtos: IErpProduto;
    cadastros_canais: ICadastroCanal;
    cadastros_atributos: ICadastroAtributo;
    cadastros_categorias: ICadastroCategoria;
  }
}
