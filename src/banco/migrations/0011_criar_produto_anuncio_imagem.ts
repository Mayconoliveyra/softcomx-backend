import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produto_anuncio_imagem, (table) => {
      table.bigIncrements('id');
      table
        .bigInteger('produto_imagem_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ETableNames.produto_imagem)
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT');

      table
        .bigInteger('produto_anuncio_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ETableNames.produto_anuncio)
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produto_anuncio_imagem}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produto_anuncio_imagem).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produto_anuncio_imagem}`);
  });
}
