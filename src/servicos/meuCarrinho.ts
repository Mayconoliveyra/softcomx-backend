import { Axios } from '../servicos/axios';
import {
  IAutenticar,
  IGetEmpresa,
  IGetUsuario,
  IMCAutenticar,
  IMCErroValidacao,
  IMCGetCategorias,
  IMCGetEmpresa,
  IMCGetUsuario,
  IMCGetProdutoVariacao,
  IMCGetProdutos,
  IMCAddImgPorUrl,
  IMCCriarCategoria,
  IMCCriarProduto,
  IMCCriarVariacaoItem,
  IMCCriarVariacaoCabecalho,
  IMCCriarVariacaoCabecalhoResponse,
  IMCCriarVariacaoItemResponse,
  IMCGetProdutoVariacaoResponse,
} from '../servicos/types/meuCarrinho';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Servicos } from '.';

const BASE_URL_MC = 'https://api.meucarrinho.delivery';

const MODULO = '[Meu Carrinho]';

const formatarErroValidacao = (erro: any): string => {
  try {
    const responseData = erro?.response?.data as IMCErroValidacao;

    // Se for estrutura conhecida de validação
    if (responseData?.errors && typeof responseData.errors === 'object') {
      return Object.entries(responseData.errors)
        .map(([campo, mensagens]) => `${campo.toUpperCase()}: ${(mensagens as string[]).join(', ')}`)
        .join('; ');
    }

    // Se tiver título de erro HTTP padrão
    if (responseData?.title) return responseData.title;

    // Fallback
    return 'Erro desconhecido ao processar a requisição.';
  } catch (err) {
    return 'Erro inesperado ao tratar erro.';
  }
};

const autenticar = async (usuario: string, senha: string): Promise<IRetorno<IAutenticar>> => {
  try {
    const response = await Axios.defaultAxios.post<IMCAutenticar>(`${BASE_URL_MC}/auth/token`, {
      username: usuario,
      password: senha,
    });

    // O token do meu carrinho expira em 4horas = "expiresIn: 14400" = 14400s
    // Logo, na minha aplicação era vai expirar em 3horas, isso evita erros na hora de fazer requisição.
    const newExpToken = Math.floor(Date.now() / 1000) + 3 * 60 * 60;

    return {
      sucesso: true,
      dados: { token: response.data.token, expiresAt: newExpToken },
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao autenticar usuário`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getUsuario = async (token: string): Promise<IRetorno<IGetUsuario>> => {
  try {
    const response = await Axios.defaultAxios.get<IMCGetUsuario>(`${BASE_URL_MC}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      sucesso: true,
      dados: { merchantId: response.data.id },
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados do usuário`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getEmpresa = async (empresaId: number, merchantId: string, token?: string): Promise<IRetorno<IGetEmpresa>> => {
  try {
    // Se não for passado o "token", vou utilizar os dados da tabela empresa.
    if (!token) {
      const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
      if (typeof apiAxiosMC === 'string') {
        return {
          sucesso: false,
          dados: null,
          erro: apiAxiosMC,
          total: 1,
        };
      }

      const response = await apiAxiosMC.get<IMCGetEmpresa>(`/merchants/${merchantId}`);

      return {
        sucesso: true,
        dados: { nome: response.data.name || '', cnpj: response.data.cnpj || '' },
        erro: null,
        total: 1,
      };
    }

    const response = await Axios.defaultAxios.get<IMCGetEmpresa>(`${BASE_URL_MC}/merchants/${merchantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      sucesso: true,
      dados: { nome: response.data.name || '', cnpj: response.data.cnpj || '' },
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados da empresa`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getCategorias = async (empresaId: number, merchantId: string): Promise<IRetorno<IMCGetCategorias[]>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.get<IMCGetCategorias[]>(`/categories?merchantId=${merchantId}`);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: response.data?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getProdutos = async (empresaId: number): Promise<IRetorno<IMCGetProdutos[]>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }
    const result: IMCGetProdutos[] = [];

    const pageSize = 500;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosMC.get<IMCGetProdutos[]>(`/products?pageNumber=${page}&pageSize=${pageSize}`);
      const produtos = response.data;

      if (produtos.length > 0) {
        result.push(...produtos);
        page += 1;
      } else {
        hasMore = false;
      }
    }

    return {
      sucesso: true,
      dados: result,
      erro: null,
      total: result?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar produtos.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getProdutoVariacao = async (empresaId: number, produtoId: string): Promise<IRetorno<IMCGetProdutoVariacaoResponse[] | []>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.get<IMCGetProdutoVariacao>(`/products/${produtoId}`);

    return {
      sucesso: true,
      dados: response.data.variations,
      erro: null,
      total: response.data?.variations?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar produto por id.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const addImgPorUrl = async (empresaId: number, produtoId: string, url: string): Promise<IRetorno<IMCAddImgPorUrl>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const body = {
      url: url,
      jpegQuality: 100,
    };

    const response = await apiAxiosMC.post<IMCAddImgPorUrl>(`/products/${produtoId}/images/url`, body);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao adicionar imagem pela url.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const deleteCategoriaPorId = async (empresaId: number, categoriaId: string): Promise<IRetorno<{ id: string }>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.delete(`/categories/${categoriaId}`).catch((error) => {
      if (error.response && error.response.status === 404) {
        // Categoria não encontrada
        Util.Log.warn(`Categoria ${categoriaId} não existente no Meu Carrinho.`);
      } else {
        throw error; // Relança o erro para ser tratado no nível superior, se necessário
      }
    });

    return {
      sucesso: true,
      dados: { id: categoriaId },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao remover categoria.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeCategoria = async (
  empresaId: number,
  categoriaId: string,
  novaDisponibilidade: 'AVAILABLE' | 'UNAVAILABLE',
): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/categories/${categoriaId}/availability/${novaDisponibilidade}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar a disponibilidade da categoria.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeProduto = async (empresaId: number, produtoId: string, novaDisponibilidade: 'AVAILABLE' | 'UNAVAILABLE'): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/products/${produtoId}/availability/${novaDisponibilidade}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar a disponibilidade do produto.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeVariacaoItem = async (
  empresaId: number,
  variacaoId: string,
  variacaoItemId: string,
  novaDisponibilidade: 'AVAILABLE' | 'UNAVAILABLE',
): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/variations/${variacaoId}/items/${variacaoItemId}/availability/${novaDisponibilidade}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar a disponibilidade da variação item.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarCategoria = async (empresaId: number, novaCategoria: IMCCriarCategoria): Promise<IRetorno<IMCGetCategorias>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCGetCategorias>(`/categories`, novaCategoria);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar categoria.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarProduto = async (empresaId: number, novoProduto: IMCCriarProduto): Promise<IRetorno<IMCGetProdutos>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCGetProdutos>(`/products`, novoProduto);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar produto.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarVariacaoCabecalho = async (
  empresaId: number,
  produtoId: string,
  novaVariacaoCabecalho: IMCCriarVariacaoCabecalho,
): Promise<IRetorno<IMCCriarVariacaoCabecalhoResponse>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCCriarVariacaoCabecalhoResponse>(`/products/${produtoId}/variations`, novaVariacaoCabecalho);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar o cabeçalho da variação.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarVariacaoItem = async (
  empresaId: number,
  variacaoId: string,
  novaVariacaoItem: IMCCriarVariacaoItem,
): Promise<IRetorno<IMCCriarVariacaoItemResponse>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCCriarVariacaoItemResponse>(`/variations/${variacaoId}/items`, novaVariacaoItem);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar o item da variação.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const deleteProdutoPorId = async (empresaId: number, produtoId: string): Promise<IRetorno<{ id: string }>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.delete(`/products/${produtoId}`).catch((error) => {
      if (error.response && error.response.status === 404) {
        // Categoria não encontrada
        Util.Log.warn(`Produto ${produtoId} não existente no Meu Carrinho.`);
      } else {
        throw error; // Relança o erro para ser tratado no nível superior, se necessário
      }
    });

    return {
      sucesso: true,
      dados: { id: produtoId },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao remover produto por id.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atOrdenarVariacaoCabecalho = async (empresaId: number, produtoId: string, variacaoId: string, priority: number): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const body = [{ id: variacaoId, priority: priority }];

    await apiAxiosMC.patch(`/products/${produtoId}/variations/reorder`, body);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar ordenação do cabeçalho da variação.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atControleEstoque = async (empresaId: number, produtoId: string, active: boolean): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/products/${produtoId}/stock/${active}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar controle de estoque.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidade = async (empresaId: number, produtos: { id: string; availability: 'AVAILABLE' | 'UNAVAILABLE' }[]): Promise<IRetorno<string>> => {
  function dividirEmLotes<T>(array: T[], size: number): T[][] {
    const resultado = [];
    for (let i = 0; i < array.length; i += size) {
      resultado.push(array.slice(i, i + size));
    }
    return resultado;
  }

  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const lotes = dividirEmLotes(produtos, 15); // Dividindo em lotes de 15

    for (const lote of lotes) {
      // Usando Promise.all para processar o lote em paralelo
      await Promise.all(
        lote.map(async ({ id, availability }) => {
          try {
            await apiAxiosMC.patch(`/products/${id}/availability/${availability}`);
          } catch (error) {
            Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade para ID ${id}`, error);
          }
        }),
      );
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeVariacao = async (
  empresaId: number,
  variacoes: { variationId: string; id: string; availability: 'AVAILABLE' | 'UNAVAILABLE' }[],
): Promise<IRetorno<string>> => {
  function dividirEmLotes<T>(array: T[], size: number): T[][] {
    const resultado = [];
    for (let i = 0; i < array.length; i += size) {
      resultado.push(array.slice(i, i + size));
    }
    return resultado;
  }

  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const lotes = dividirEmLotes(variacoes, 15); // Dividindo em lotes de 15

    for (const lote of lotes) {
      // Usando Promise.all para processar o lote em paralelo
      await Promise.all(
        lote.map(async ({ variationId, id, availability }) => {
          try {
            await apiAxiosMC.patch(`/variations/${variationId}/items/${id}/availability/${availability}`);
          } catch (error) {
            Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade da variação ID ${id}`, error);
          }
        }),
      );
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade das variações em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atEstoque = async (empresaId: number, produtos: { id: string; stock: number }[]): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const pageSize = 100; // Tamanho do lote
    let startIndex = 0; // Índice inicial
    let endIndex = pageSize; // Índice final

    while (startIndex < produtos.length) {
      // Dividindo os dados em lotes de 100
      const batch = produtos.slice(startIndex, endIndex);

      // Enviando o lote para a API
      await apiAxiosMC.patch(`/products/stock`, batch);

      // Atualizando os índices para o próximo lote
      startIndex = endIndex;
      endIndex += pageSize;
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar estoque em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atEstoqueVariacao = async (empresaId: number, variacoes: { variationId: string; id: string; stock: number }[]): Promise<IRetorno<string>> => {
  function agruparPorVariationId(data: { variationId: string; id: string; stock: number }[], limit: number) {
    const grupos: Record<string, { variationId: string; id: string; stock: number }[]> = {};

    // Agrupar por variationId
    data.forEach((item) => {
      if (!grupos[item.variationId]) {
        grupos[item.variationId] = [];
      }
      grupos[item.variationId].push(item);
    });

    // Dividir em lotes de no máximo `limit`
    const lotes: { variationId: string; id: string; stock: number }[][] = [];
    Object.values(grupos).forEach((group) => {
      for (let i = 0; i < group.length; i += limit) {
        lotes.push(group.slice(i, i + limit));
      }
    });

    return lotes;
  }
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const pageSize = 50; // Limite de 50 produtos por lote
    const lotes = agruparPorVariationId(variacoes, pageSize); // Agrupa e divide em lotes

    for (const batch of lotes) {
      const variationId = batch[0].variationId; // Código da variação

      // Enviando o lote para a API
      await apiAxiosMC.patch(`/variations/${variationId}/items/stock`, batch);
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar estoque das variações em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const zerarCadastros = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  try {
    const allCategoriasMc = await getCategorias(empresaId, merchantId);
    if (!allCategoriasMc.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allCategoriasMc.erro,
        total: 1,
      };
    }

    for (const categoria of allCategoriasMc.dados) {
      const resDeleteCategoriaPorId = await deleteCategoriaPorId(empresaId, categoria.id);

      if (!resDeleteCategoriaPorId.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resDeleteCategoriaPorId.erro,
          total: 1,
        };
      }
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao zerar cadastros.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

export const MeuCarrinho = {
  autenticar,
  getUsuario,
  getEmpresa,
  getCategorias,
  getProdutos,
  getProdutoVariacao,
  criarCategoria,
  criarProduto,
  criarVariacaoCabecalho,
  criarVariacaoItem,
  atOrdenarVariacaoCabecalho,
  atDisponibilidadeCategoria,
  atDisponibilidadeProduto,
  atDisponibilidadeVariacaoItem,
  atControleEstoque,
  atDisponibilidade,
  atDisponibilidadeVariacao,
  atEstoque,
  atEstoqueVariacao,
  deleteCategoriaPorId,
  deleteProdutoPorId,
  addImgPorUrl,
  zerarCadastros,
};
