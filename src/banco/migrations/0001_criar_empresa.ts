import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.empresa, (table) => {
      table.bigIncrements('id');
      table.uuid('uuid').index().unique().notNullable().checkLength('=', 36).checkRegex(Util.UuidV4.regexUuidV4String);

      table.string('registro', 50).notNullable().unique();
      table.string('nome', 255).notNullable();
      table.string('cnpj_cpf', 50).notNullable().unique();

      table.text('pm4_token');
      table.text('pm4_token_renovacao');
      table.bigInteger('pm4_token_exp').notNullable().defaultTo(0);
      table.bigInteger('prox_sinc_p4m_token').notNullable().defaultTo(0);

      table.boolean('ativo').defaultTo(true);

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.empresa}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.empresa).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.empresa}`);
  });
}
