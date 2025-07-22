import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.usuario, (table) => {
      table.bigIncrements('id');
      table.uuid('uuid').index().unique().notNullable().checkLength('=', 36).checkRegex(Util.UuidV4.regexUuidV4String);

      table.bigInteger('empresa_id').notNullable().unsigned().references('id').inTable(ETableNames.empresa).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('nome', 120).notNullable();
      table.string('email', 120).unique().notNullable();
      table.string('senha', 255).notNullable();
      table.boolean('ativo').defaultTo(true);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.usuario}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.usuario).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.usuario}`);
  });
}
