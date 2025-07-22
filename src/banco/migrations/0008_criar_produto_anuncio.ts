import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produto_anuncio, (table) => {
      table.bigIncrements('id');
      table.bigInteger('produto_id').notNullable().unsigned().references('id').inTable(ETableNames.produto).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('ean').comment('Código EAN (ean)');

      table.integer('estoque').notNullable().defaultTo(0);

      table.decimal('altura_cm', 8, 2).notNullable().defaultTo(0).comment('Altura em cm (height)');
      table.decimal('comprimento_cm', 8, 2).notNullable().defaultTo(0).comment('Comprimento em cm (length)');
      table.decimal('largura_cm', 8, 2).notNullable().defaultTo(0).comment('Largura em cm (width)');
      table.decimal('peso_gramas', 10, 2).notNullable().defaultTo(0).comment('Peso em gramas (weight)');

      table.boolean('ativo').notNullable().defaultTo(true).comment('Produto ativo para venda (active)');
      table.boolean('revisado').notNullable().defaultTo(false).comment('Produto revisado (reviewed)');
      table.boolean('arquivado').notNullable().defaultTo(false).comment('Produto arquivado');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produto_anuncio}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produto_anuncio).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produto_anuncio}`);
  });
}
