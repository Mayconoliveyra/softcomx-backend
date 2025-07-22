import { Knex } from 'knex';

import { Util } from '../../util';

import { ETableNames } from '../eTableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.produto, (table) => {
      table.bigIncrements('id');
      table.bigInteger('empresa_id').notNullable().unsigned().references('id').inTable(ETableNames.empresa).onUpdate('RESTRICT').onDelete('RESTRICT');

      table.string('nome', 100).notNullable().comment('Nome do produto (name)');
      table.text('descricao', 'longtext').notNullable().defaultTo('Sem descrição').comment('Descrição do produto (description)');

      table.decimal('preco_venda', 10, 2).notNullable().defaultTo(0).comment('Preço de venda (price)');
      table.decimal('preco_custo', 10, 2).notNullable().defaultTo(0).comment('Preço de custo (costPrice)');

      table.decimal('preco_promocional', 10, 2).notNullable().defaultTo(0).comment('Preço promocional (salePrice)');
      table.timestamp('promocao_data_inicio').comment('Data de Início do preço promocional em todos canais de vendas (saleDateStart)');
      table.timestamp('promocao_data_final').comment('Data de Fim do preço promocional em todos canais de vendas (saleDateEnd)');

      table
        .enu('genero', ['Selecione', 'Feminino', 'Masculino', 'Menina', 'Menino', 'Unissex', 'Bebê'])
        .notNullable()
        .defaultTo('Selecione')
        .comment('Gênero (gender)');
      table.enu('condicao', ['Selecione', 'Novo', 'Usado']).notNullable().defaultTo('Selecione').comment('Condição: novo ou usado (condition)');
      table.enu('origem', ['Selecione', 'Nacional', 'Importado']).notNullable().defaultTo('Selecione').comment('Origem do produto (origin)');

      table.string('ncm', 8).comment('Código NCM (ncm)');
      table.string('marca', 60).comment('Marca do produto (brand)');
      table.string('modelo', 60).comment('Modelo do produto (model)');
      table.decimal('garantia_meses', 4, 1).comment('Garantia em meses (warranty)');
      table.integer('dias_cross_docking').comment('Dias para despacho (crossDockingDays)');
      table.string('codigo_anatel', 60).comment('Código Anatel (anatelCode)');
      table.string('codigo_anvisa', 60).comment('Registro Anvisa (anvisaCode)');
      table.string('codigo_inmetro', 60).comment('Registro Inmetro (inmetroCode)');
      table.string('codigo_mapa', 60).comment('Registro Mapa (mapaCode)');
      table.string('codigo_fabricante', 60).comment('Part number do fabricante (manufacturerPartNumber)');

      table
        .enu('unidade_medida', [
          'Selecione',
          'UN',
          'KG',
          'G',
          'MG',
          'M',
          'M²',
          'M³',
          'CM',
          'CM²',
          'CM³',
          'MM',
          'MM²',
          'MM³',
          'OZ',
          'LB',
          'FT',
          'FT²',
          'FT³',
          'IN',
          'IN²',
          'IN³',
        ])
        .notNullable()
        .defaultTo('un')
        .comment('Unidade de medida (measurementUnit)');

      table.boolean('ativo').notNullable().defaultTo(true).comment('Produto ativo para venda (active)');
      table.boolean('revisado').notNullable().defaultTo(false).comment('Produto revisado (reviewed)');
      table.boolean('arquivado').notNullable().defaultTo(false).comment('Produto arquivado');

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
    })
    .then(() => {
      Util.Log.info(`# Criado tabela ${ETableNames.produto}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.produto).then(() => {
    Util.Log.info(`# Excluído tabela ${ETableNames.produto}`);
  });
}
