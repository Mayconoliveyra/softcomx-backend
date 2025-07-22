import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.tipo_canal, (table) => {
      table.bigIncrements('id');

      table.integer('codigo').notNullable().unique().unsigned();
      table.string('nome').notNullable();
      table.string('cnpj');
      table.string('url_logo').notNullable();

      table.boolean('ativo').defaultTo(true);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.tipo_canal}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tipo_canal).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tipo_canal}`);
  });
}
