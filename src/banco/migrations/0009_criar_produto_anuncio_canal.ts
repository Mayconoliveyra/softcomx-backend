import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produto_anuncio_canal, (table) => {
      table.bigIncrements('id');
      table
        .bigInteger('produto_anuncio_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ETableNames.produto_anuncio)
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT');

      table
        .bigInteger('empresa_canal_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ETableNames.empresa_canal)
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
      table.timestamp('deleted_at').notNullable().defaultTo(knex.fn.now());
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produto_anuncio_canal}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produto_anuncio_canal).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produto_anuncio_canal}`);
  });
}
