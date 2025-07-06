// src/services/axios.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

import { Repositorios } from '../repositorios';

import { Util } from '../util';

const DEFAULT_TIMEOUT = 60 * 1000; // 60 segundos
const DEFAULT_TIMEOUT_IM = 60 * 1000; // 60 segundos

// Interface para configurar novas instâncias
interface IAxiosInstanceParams extends AxiosRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Interceptor de resposta
const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// Interceptor de erro
const errorInterceptor = (error: AxiosError): Promise<never> => {
  // Aqui você pode customizar o tratamento: exibir logs, throw custom error, etc.
  Util.Log.error('Erro na requisição Axios:', {
    url: error.config?.url,
    method: error.config?.method,
    message: error.message,
    response: error.response?.data,
  });

  return Promise.reject(error);
};

// Factory de instância de Axios
export const createAxiosInstance = ({ baseURL, timeout = DEFAULT_TIMEOUT, headers, ...rest }: IAxiosInstanceParams = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers,
    ...rest,
  });

  instance.interceptors.response.use(responseInterceptor, errorInterceptor);

  return instance;
};

const axiosApiMarketplace = async (empresaId: number) => {
  try {
    const empresa = await Repositorios.Empresa.consultarPrimeiroRegistro([{ coluna: 'id', operador: '=', valor: empresaId }]);

    if (!empresa.sucesso) {
      return empresa.erro;
    }

    if (!empresa.dados.api_im_client_id || !empresa.dados.api_im_client_secret || !empresa.dados.api_im_empresa_id) {
      return `Os parâmetros são obrigatórios: api_im_client_id:${empresa.dados.api_im_client_id}; api_im_client_secret:${empresa.dados.api_im_client_secret}; api_im_empresa_id:${empresa.dados.api_im_empresa_id};`;
    }

    return Axios.createAxiosInstance({
      baseURL: 'https://api-imkt.softcomservices.com',
      timeout: DEFAULT_TIMEOUT_IM,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: empresa.dados.api_im_client_id,
        password: empresa.dados.api_im_client_secret,
      },
    });
  } catch (error) {
    Util.Log.error(`[Api Marketplace] | Erro ao criar ou atualizar instância axios.`, error);

    return Util.Msg.erroInesperado;
  }
};

// Instância padrão
export const defaultAxios: AxiosInstance = createAxiosInstance();

export const Axios = {
  createAxiosInstance,
  defaultAxios,
  axiosApiMarketplace,
};
