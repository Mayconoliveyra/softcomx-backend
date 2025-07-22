import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.empresa).first();
  if (result) {
    return;
  } else {
    await knex(ETableNames.empresa)
      .insert([{ id: 1, uuid: '0d2fa944-102e-4f65-bd3a-920f0dc62b47', nome: 'SOFTCOM TESTE', registro: '53539', cnpj_cpf: '99999999000191' }])
      .then(() => {
        console.log(`DEV - Inserido dados na tabela ${ETableNames.empresa}`);
      });
  }
};
