import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.empresas).first();
  if (result) {
    return;
  } else {
    await knex(ETableNames.empresas)
      .insert([{ id: 1, nome: 'teste', registro: '123', cnpj_cpf: '123' }])
      .then(() => {
        console.log(`DEV - Inserido dados na tabela ${ETableNames.empresas}`);
      });
  }
};
