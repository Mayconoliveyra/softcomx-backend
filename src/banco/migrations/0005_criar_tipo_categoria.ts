import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.tipo_categoria, (table) => {
      table.bigIncrements('id');
      table.bigInteger('tipo_canal_id').unsigned().notNullable().references('id').inTable(ETableNames.tipo_canal).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('codigo').notNullable().index().unique();
      table.string('nome').notNullable();

      table.boolean('ativo').defaultTo(false);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.tipo_categoria}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.tipo_categoria).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.tipo_categoria}`);
  });
}
