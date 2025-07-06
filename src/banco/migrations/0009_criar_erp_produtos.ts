import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.erp_produtos, (table) => {
      table.bigIncrements('id');
      table.bigInteger('empresa_id').unsigned().notNullable().references('id').inTable(ETableNames.empresas).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.integer('codigo').notNullable().index();
      table.integer('codigo_sku').notNullable().index();

      table.string('nome', 255).notNullable();
      table.decimal('preco_venda', 15, 2).notNullable();
      table.decimal('preco_venda_a', 15, 2).notNullable();
      table.decimal('preco_venda_b', 15, 2).notNullable();
      table.decimal('preco_venda_c', 15, 2).notNullable();
      table.decimal('preco_venda_d', 15, 2).notNullable();

      table.decimal('preco_custo', 15, 2).notNullable();
      table.integer('estoque').notNullable();

      table.string('cod_nfe', 100).nullable();
      table.string('cod_referencia', 100).nullable();
      table.string('cod_barras_grade', 100).nullable();
      table.string('marca', 255).notNullable();
      table.string('grupo', 255).notNullable();
      table.integer('grupo_id').notNullable();
      table.string('unid_medida', 255).notNullable();
      table.string('tamanho', 255).nullable();
      table.string('cor', 255).nullable();
      table.string('ncm', 8).nullable();
      table.string('cest', 7).nullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));

      table.unique(['codigo_sku', 'empresa_id'], { indexName: 'idx_unique_produto_codigoSku_empresaId' });
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.erp_produtos}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.erp_produtos).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.erp_produtos}`);
  });
}
