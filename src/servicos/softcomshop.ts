import qs from 'qs';

import { Repositorios } from '../repositorios';

import { Axios } from '../servicos/axios';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import {
  ICriarDispositivo,
  ICriarToken,
  ISSCriarDispositivo,
  ISSResponseBase,
  ISSCriarToken,
  ISSGetProdutos,
  ISSGetGrupos,
  ISSGetCombos,
  ISSGetCombosItens,
  ISSGetEmpresa,
} from './types/softcomshop';

const MODULO = '[Softcomshop]';

const criarDispositivo = async (erp_url: string): Promise<IRetorno<ICriarDispositivo>> => {
  try {
    const url = new URL(erp_url);

    const client_id = url.searchParams.get('client_id');
    const device_name = url.searchParams.get('device_name');

    if (!client_id || !device_name) {
      return {
        sucesso: false,
        dados: null,
        erro: 'Parâmetros obrigatórios ausentes na URL (client_id ou device_name)',
        total: 1,
      };
    }

    const data = qs.stringify({
      client_id,
      device_id: device_name,
    });

    const response = await Axios.defaultAxios.post<ISSResponseBase<ISSCriarDispositivo>>(url.origin + url.pathname, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      maxBodyLength: Infinity,
    });

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao gerar dispositivo.',
        total: 1,
      };
    }

    const dadosFormat = {
      url_base: response.data.data.resources.url_base,
      client_id: response.data.data.client_id,
      client_secret: response.data.data.client_secret,
      empresa_cnpj: response.data.data.empresa_cnpj,
      empresa_fantasia: response.data.data.empresa_fantasia,
    };

    return {
      sucesso: true,
      dados: dadosFormat,
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao criar dispositivo | URL: ${erp_url}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const criarToken = async (base_url: string, client_id: string, client_secret: string): Promise<IRetorno<ICriarToken>> => {
  try {
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id,
      client_secret,
    });

    const response = await Axios.defaultAxios.post<ISSResponseBase<ISSCriarToken>>(`${base_url}/authentication/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao gerar token.',
        total: 1,
      };
    }

    const expiresIn = response.data.data.expires_in; // segundos
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const dadosFormat = {
      token: response.data.data.token,
      expiresAt: expiresAt,
    };

    return {
      sucesso: true,
      dados: dadosFormat,
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao gerar token | Client: ${client_id}`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getEmpresa = async (empresaId: number): Promise<IRetorno<ISSGetEmpresa>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const response = await apiAxiosSS.get<ISSResponseBase<ISSGetEmpresa>>(`/api/empresa`);

    if (response.data.code !== 1) {
      return {
        sucesso: false,
        dados: null,
        erro: response.data.human || 'Erro ao consultar dados da empresa.',
        total: 1,
      };
    }

    return {
      sucesso: true,
      dados: response.data.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados da empresa.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getProdutos = async (empresaId: number): Promise<IRetorno<ISSGetProdutos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const result: ISSGetProdutos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetProdutos[]>>(`/api/produtos/produtos/page/${page}`);

      if (response.data.code !== 1) {
        return {
          sucesso: false,
          dados: null,
          erro: response.data.human || 'Erro ao consultar produtos',
          total: 1,
        };
      }

      const produtos = response.data.data;
      const currentPage = response.data.meta.page.current;
      countPages = response.data.meta.page.count;

      result.push(...produtos);

      if (currentPage !== countPages) {
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

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getGrupos = async (empresaId: number): Promise<IRetorno<ISSGetGrupos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const result: ISSGetGrupos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetGrupos[]>>(`/api/produtos/grupos/page/${page}`);

      if (response.data.code !== 1) {
        return {
          sucesso: false,
          dados: null,
          erro: response.data.human || 'Erro ao consultar grupos',
          total: 1,
        };
      }

      const grupos = response.data.data;
      const currentPage = response.data.meta.page.current;
      countPages = response.data.meta.page.count;

      result.push(...grupos);

      if (currentPage !== countPages) {
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
    Util.Log.error(`${MODULO} | Erro ao consultar grupos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const getCombos = async (empresaId: number): Promise<IRetorno<ISSGetCombos[]>> => {
  try {
    const apiAxiosSS = await Axios.axiosSoftcomshop(empresaId);
    if (typeof apiAxiosSS === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosSS,
        total: 1,
      };
    }
    const result: ISSGetCombos[] = [];

    let page = 1;
    let countPages = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosSS.get<ISSResponseBase<ISSGetCombos[]>>(`/api/restaurantes/produto-combo?page=${page}`);

      if (!response.data) {
        return {
          sucesso: false,
          dados: null,
          erro: 'Erro ao consultar combos',
          total: 1,
        };
      }

      const combos = response.data.data;
      const currentPage = response.data.current_page;
      countPages = response.data.last_page;

      result.push(...combos);

      if (currentPage !== countPages) {
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
    Util.Log.error(`${MODULO} | Erro ao consultar combos.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

export const SoftcomShop = {
  criarDispositivo,
  criarToken,
  getEmpresa,
  getProdutos,
  getGrupos,
  getCombos,
};
