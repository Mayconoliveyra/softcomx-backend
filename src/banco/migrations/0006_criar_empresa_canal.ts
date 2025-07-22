import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.empresa_canal, (table) => {
      table.bigIncrements('id');

      table.bigInteger('empresa_id').notNullable().unsigned().references('id').inTable(ETableNames.empresa).onUpdate('RESTRICT').onDelete('RESTRICT');
      table.bigInteger('tipo_canal_id').notNullable().unsigned().references('id').inTable(ETableNames.tipo_canal).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('codigo_vendedor');

      table.boolean('ativo').notNullable().defaultTo(true).comment('Produto ativo para venda (active)');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.empresa_canal}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.empresa_canal).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.empresa_canal}`);
  });
}
