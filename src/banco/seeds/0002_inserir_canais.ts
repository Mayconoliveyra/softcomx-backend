import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.cadastros_canais).first();
  if (result) {
    return;
  } else {
    const dados = [
      {
        cnpj: '15436940000103',
        id: 1,
        name: 'AMAZON',
      },
      {
        cnpj: '33041260199572',
        id: 2,
        name: 'VIA MARKETPLACE',
      },
      {
        cnpj: '47960950000121',
        id: 4,
        name: 'MAGAZINE LUIZA',
      },
      {
        cnpj: '09339936000205',
        id: 5,
        name: 'NETSHOES',
      },
      {
        cnpj: '00776574000660',
        id: 6,
        name: 'AMERICANAS MARKETPLACE',
      },
      {
        cnpj: '03007331000141',
        id: 7,
        name: 'MERCADO LIVRE',
      },
      {
        cnpj: '45543915084695',
        id: 8,
        name: 'CARREFOUR',
      },
      {
        cnpj: '10490181000135',
        id: 9,
        name: 'MADEIRA MADEIRA',
      },
      {
        cnpj: '11200418000592',
        id: 10,
        name: 'DAFITI',
      },
      {
        cnpj: '',
        id: 11,
        name: 'MAGENTO 1',
      },
      {
        cnpj: '89848543001572',
        id: 16,
        name: 'LOJAS COLOMBO',
      },
      {
        cnpj: '',
        id: 17,
        name: 'CLIMBA COMMERCE',
      },
      {
        cnpj: '11428403000152',
        id: 18,
        name: 'IGUATEMI',
      },
      {
        cnpj: '06347409006953',
        id: 19,
        name: 'CENTAURO',
      },
      {
        cnpj: '01438784006561',
        id: 20,
        name: 'LEROY MERLIN',
      },
      {
        cnpj: '26900161000125',
        id: 22,
        name: 'RAPPI',
      },
      {
        cnpj: '',
        id: 23,
        name: 'WOOCOMMERCE',
      },
      {
        cnpj: '',
        id: 24,
        name: 'VTEX',
      },
      {
        cnpj: '',
        id: 25,
        name: 'TRAY',
      },
      {
        cnpj: '35635824000112',
        id: 26,
        name: 'SHOPEE',
      },
      {
        cnpj: '45242914000105',
        id: 27,
        name: 'C&A',
      },
      {
        cnpj: '61585865024093',
        id: 28,
        name: 'DROGASIL',
      },
      {
        cnpj: '',
        id: 29,
        name: 'ISET',
      },
      {
        cnpj: '',
        id: 30,
        name: 'NOVO MUNDO',
      },
      {
        cnpj: '',
        id: 31,
        name: 'LOJAINTEGRADA',
      },
      {
        cnpj: '',
        id: 32,
        name: 'MAGENTO 2',
      },
      {
        cnpj: '92754738000162',
        id: 33,
        name: 'RENNER',
      },
      {
        cnpj: '33200056000149',
        id: 34,
        name: 'RIACHUELO',
      },
      {
        cnpj: '',
        id: 35,
        name: 'CWS',
      },
      {
        cnpj: '18552346000168',
        id: 36,
        name: 'OLIST',
      },
      {
        cnpj: '75400218000132',
        id: 37,
        name: 'CASSOL',
      },
      {
        cnpj: '',
        id: 38,
        name: 'TRAY COMMERCE',
      },
      {
        cnpj: '',
        id: 39,
        name: 'LINX',
      },
      {
        cnpj: '',
        id: 40,
        name: 'CASA VIDEO',
      },
      {
        cnpj: '02314041002202',
        id: 41,
        name: 'DECATHLON',
      },
      {
        cnpj: '',
        id: 42,
        name: 'GRUPO SOMA',
      },
      {
        cnpj: '',
        id: 43,
        name: 'MULTIFAST',
      },
      {
        cnpj: '',
        id: 44,
        name: 'ORTOBOM',
      },
      {
        cnpj: '',
        id: 45,
        name: 'VERTEM',
      },
      {
        cnpj: '61585865024093',
        id: 46,
        name: 'RDMARKETPLACE',
      },
      {
        cnpj: '',
        id: 47,
        name: 'COOPERA',
      },
      {
        cnpj: '',
        id: 48,
        name: 'RESERVA',
      },
      {
        cnpj: '',
        id: 49,
        name: 'SHOPHUB',
      },
      {
        cnpj: '',
        id: 50,
        name: 'LOJAS MM',
      },
      {
        cnpj: '',
        id: 51,
        name: 'MESBLA',
      },
      {
        cnpj: '',
        id: 52,
        name: 'CONECTALA',
      },
      {
        cnpj: '',
        id: 53,
        name: 'POLISHOP',
      },
      {
        cnpj: '',
        id: 54,
        name: 'B4C',
      },
      {
        cnpj: '',
        id: 55,
        name: 'BALAROTI',
      },
      {
        cnpj: '',
        id: 56,
        name: 'CJFASHION',
      },
      {
        cnpj: '',
        id: 57,
        name: 'CONNECTPARTS',
      },
      {
        cnpj: '',
        id: 58,
        name: 'FIBRACIRURGICA',
      },
      {
        cnpj: '',
        id: 59,
        name: 'KEEPRUNNING',
      },
      {
        cnpj: '',
        id: 60,
        name: 'PANGEIA',
      },
      {
        cnpj: '',
        id: 61,
        name: 'OFFPREMIUM',
      },
      {
        cnpj: '',
        id: 62,
        name: 'SHOPPING CALCADO',
      },
      {
        cnpj: '',
        id: 63,
        name: 'SICREDI',
      },
      {
        cnpj: '',
        id: 64,
        name: 'ALIEXPRESS',
      },
      {
        cnpj: '',
        id: 66,
        name: 'SIMPLO7',
      },
      {
        cnpj: '03002339000115',
        id: 67,
        name: 'CAMICADO',
      },
      {
        cnpj: '',
        id: 68,
        name: 'F1 COMMERCE',
      },
      {
        cnpj: '',
        id: 69,
        name: 'MKX',
      },
      {
        cnpj: '16932748000162',
        id: 70,
        name: 'NUVEMSHOP',
      },
      {
        cnpj: '',
        id: 71,
        name: 'FLEXY',
      },
      {
        cnpj: '',
        id: 72,
        name: 'MAGAZORD',
      },
      {
        cnpj: '',
        id: 73,
        name: 'TINY',
      },
      {
        cnpj: '45814425000172',
        id: 74,
        name: 'SHEIN',
      },
      {
        cnpj: '',
        id: 75,
        name: 'FARMADELIVERY',
      },
      {
        cnpj: '',
        id: 76,
        name: 'VNDA',
      },
      {
        cnpj: '',
        id: 77,
        name: 'ZEMA',
      },
      {
        cnpj: '',
        id: 78,
        name: 'SICOOB',
      },
      {
        cnpj: '',
        id: 79,
        name: 'VIAWEAR',
      },
      {
        cnpj: '',
        id: 80,
        name: 'CENTRO FASHION',
      },
      {
        cnpj: '',
        id: 81,
        name: 'PASSARELA',
      },
      {
        cnpj: '',
        id: 82,
        name: 'SHOP DOS CABELOS',
      },
      {
        cnpj: '10464223000163',
        id: 83,
        name: 'PRIVALIA',
      },
      {
        cnpj: '',
        id: 84,
        name: 'VTEX B2B',
      },
      {
        cnpj: '',
        id: 85,
        name: 'KROOZE',
      },
      {
        cnpj: '80462138000141',
        id: 86,
        name: 'POSTHAUS',
      },
      {
        cnpj: '',
        id: 87,
        name: 'WOOCOMMERCE B2B',
      },
      {
        cnpj: '',
        id: 88,
        name: 'RAMARIM',
      },
      {
        cnpj: '',
        id: 89,
        name: 'LEBISCUIT',
      },
      {
        cnpj: '',
        id: 90,
        name: 'OSCAR CALCADOS',
      },
      {
        cnpj: '',
        id: 91,
        name: 'ANGELONI',
      },
      {
        cnpj: '',
        id: 92,
        name: 'CONFORTFLEX',
      },
      {
        cnpj: '',
        id: 93,
        name: 'VENTURESHOP',
      },
      {
        cnpj: '',
        id: 94,
        name: 'PITSTOP',
      },
      {
        cnpj: '',
        id: 95,
        name: 'BELGO',
      },
      {
        cnpj: '',
        id: 96,
        name: 'DORMED',
      },
      {
        cnpj: '',
        id: 97,
        name: 'BABYBIZ',
      },
      {
        cnpj: '',
        id: 2320,
        name: 'PONTO DE VENDAS',
      },
      {
        cnpj: '08584116000712',
        id: 98,
        name: 'WEBCONTINENTAL',
      },
      {
        cnpj: '',
        id: 101,
        name: 'GRUPO ITAPUA',
      },
      {
        cnpj: '',
        id: 15,
        name: 'FASTSHOP',
      },
      {
        cnpj: '',
        id: 104,
        name: 'ARAMIS',
      },
      {
        cnpj: '',
        id: 105,
        name: 'EPOCA COSMETICOS',
      },
      {
        cnpj: '',
        id: 106,
        name: 'MATEUS MAIS',
      },
      {
        cnpj: '',
        id: 107,
        name: 'NA TERRA',
      },
      {
        cnpj: '',
        id: 108,
        name: 'RIHAPPY',
      },
      {
        cnpj: '',
        id: 111,
        name: 'MARISOL',
      },
    ];

    const dadosFormatados = dados.map((item) => ({
      codigo: item.id,
      cnpj: item.cnpj || null,
      nome: item.name,
      url_logo: ``,
      ativo: true,
    }));

    await knex(ETableNames.cadastros_canais)
      .insert(dadosFormatados)
      .then(() => {
        console.log(`DEV - Inserido dados na tabela ${ETableNames.cadastros_canais}`);
      });
  }
};
