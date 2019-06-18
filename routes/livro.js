module.exports = (app) => {
  const { livroController } = app.controllers;

  // INDEX
  app.get('/livro', livroController.index_livro);
  app.get('/livro/index', livroController.index_livro);

  // CREATE
  app.post('/livro/create', livroController.create_livro);

  // READ
  app.get('/livro/list', livroController.list_livro);

  // UPDATE
  app.get('/livro/edit/:id', livroController.update_livro);

  // DELETE
  app.get('/livro/delete/:id', livroController.delete_livro);
};