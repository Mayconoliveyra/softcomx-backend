import { Knex } from 'knex';

import { ETableNames } from '../eTableNames';
import { ICadastroAtributo } from '../models/cadastroAtributo';
const { NODE_ENV } = process.env;

export const seed = async (knex: Knex) => {
  if (NODE_ENV === 'production') return;

  const result = await knex(ETableNames.cadastros_atributos).first();
  if (result) {
    return;
  } else {
    const atributos: Omit<ICadastroAtributo, 'created_at'>[] = [
      { id: 1, codigo: '6384d2bcb9f239000161ce1b', nome: 'LILAS/PRATA', atributo: 'COR', ativo: true },
      { id: 2, codigo: '5cae4bc93ff07d0001c6c99b', nome: 'XGG', atributo: 'TAMANHO', ativo: true },
      { id: 3, codigo: '61855b40a08a2f00015eea12', nome: '1020V', atributo: 'VOLTAGEM', ativo: true },
      { id: 4, codigo: '60aea8080aa25c000166a662', nome: 'Morango', atributo: 'SABOR', ativo: true },
      { id: 5, codigo: '5e021f22ea047f0001d51bc1', nome: 'H1', atributo: 'POTENCIA', ativo: true },
    ];

    await knex(ETableNames.cadastros_atributos)
      .insert(atributos)
      .then(() => {
        console.log(`DEV - Inserido dados na tabela ${ETableNames.cadastros_atributos}`);
      });
  }
};
