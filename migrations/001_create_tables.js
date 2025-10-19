exports.up = function(knex) {
  return knex.schema
    .createTable('usuarios', function(table) {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('email', 150).unique().notNullable();
      table.string('password_hash', 255).notNullable();
      table.timestamps(true, true);
    })
    .createTable('novelas', function(table) {
      table.increments('id').primary();
      table.string('titulo', 200).notNullable();
      table.text('descricao');
      table.integer('usuario_id').unsigned().notNullable();
      table.timestamps(true, true);
      
      table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
    })
    .createTable('capitulos', function(table) {
      table.increments('id').primary();
      table.string('titulo', 200).notNullable();
      table.text('conteudo').notNullable();
      table.integer('novela_id').unsigned().notNullable();
      table.integer('usuario_id').unsigned().notNullable();
      table.timestamps(true, true);
      
      table.foreign('novela_id').references('id').inTable('novelas').onDelete('CASCADE');
      table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
    })
    .then(function() {
      // Criar índices
      return knex.raw(`
        CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
        CREATE INDEX IF NOT EXISTS idx_novelas_usuario_id ON novelas(usuario_id);
        CREATE INDEX IF NOT EXISTS idx_capitulos_novela_id ON capitulos(novela_id);
        CREATE INDEX IF NOT EXISTS idx_capitulos_usuario_id ON capitulos(usuario_id);
      `);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('capitulos')
    .dropTableIfExists('novelas')
    .dropTableIfExists('usuarios');
};