import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.tipo_atributo, (table) => {
      table.bigIncrements('id');

      table.string('codigo', 24).notNullable().index().unique();
      table.string('nome').notNullable();
      table.enum('atributo', ['COR', 'TAMANHO', 'SABOR', 'POTENCIA', 'VOLTAGEM']).notNullable();

      table.boolean('ativo').defaultTo(false);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.tipo_atributo}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tipo_atributo).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tipo_atributo}`);
  });
}
