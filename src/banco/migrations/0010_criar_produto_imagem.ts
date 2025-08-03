import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produto_imagem, (table) => {
      table.bigIncrements('id');
      table.bigInteger('produto_id').notNullable().unsigned().references('id').inTable(ETableNames.produto).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('url').notNullable();
      table.integer('ordem').notNullable().defaultTo(1);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at');
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produto_imagem}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produto_imagem).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produto_imagem}`);
  });
}
