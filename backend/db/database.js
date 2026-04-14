require('dotenv').config();
const path = require('path');
const knex = require('knex');

const dbClient = process.env.DB_CLIENT || 'sqlite3';
const connection = process.env.DATABASE_URL ||
  (dbClient === 'sqlite3'
    ? { filename: path.resolve(__dirname, 'finance.db') }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || (dbClient === 'pg' ? 5432 : 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'meubolso'
      });

const db = knex({
  client: dbClient,
  connection,
  useNullAsDefault: dbClient === 'sqlite3'
});

async function initialize() {
  if (!(await db.schema.hasTable('categories'))) {
    await db.schema.createTable('categories', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('type').notNullable();
    });
  }

  if (!(await db.schema.hasTable('transactions'))) {
    await db.schema.createTable('transactions', (table) => {
      table.increments('id').primary();
      table.string('type').notNullable();
      table.decimal('amount', 14, 2).notNullable();
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
      table.date('date').notNullable();
      table.text('description');
    });
  }

  if (!(await db.schema.hasTable('goals'))) {
    await db.schema.createTable('goals', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.decimal('target_amount', 14, 2).notNullable();
      table.decimal('current_amount', 14, 2).notNullable().defaultTo(0);
      table.date('deadline');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  const count = await db('categories').count({ count: 'id' }).first();
  if (Number(count.count) === 0) {
    await db('categories').insert([
      { name: 'Alimentação', type: 'expense' },
      { name: 'Transporte', type: 'expense' },
      { name: 'Lazer', type: 'expense' },
      { name: 'Salário', type: 'income' },
      { name: 'Outros', type: 'income' }
    ]);
  }
}

module.exports = { db, initialize };
