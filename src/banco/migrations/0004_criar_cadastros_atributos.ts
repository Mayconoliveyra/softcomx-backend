import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.cadastros_atributos, (table) => {
      table.bigIncrements('id');
      table.string('codigo', 24).notNullable().index().unique();
      table.string('nome').notNullable();
      table.enum('atributo', ['COR', 'TAMANHO', 'SABOR', 'POTENCIA', 'VOLTAGEM']).notNullable();
      table.boolean('desativado').defaultTo(false);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.cadastros_atributos}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.cadastros_atributos).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.cadastros_atributos}`);
  });
}
