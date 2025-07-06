import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.cadastros_categorias, (table) => {
      table.bigIncrements('id');
      table.integer('canal_id').unsigned().notNullable().references('codigo').inTable(ETableNames.cadastros_canais).onUpdate('RESTRICT').onDelete('RESTRICT');
      table.string('codigo').notNullable().index().unique();
      table.string('nome').notNullable();

      table.boolean('desativado').defaultTo(false);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.cadastros_categorias}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.cadastros_categorias).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.cadastros_categorias}`);
  });
}
