module.exports = (app) => {
  const { emprestarController } = app.controllers;

  // INDEX
  app.get('/livro/emprestar/:id', emprestarController.index_emprestar);

  // EMPRESTRAR
  app.post('/emprestar/livro', emprestarController.emprestar_livro);

  // HISTÓRICO
  app.get('/historico', emprestarController.list_emprestimos);

  // RENOVAR EMPRÉSTIMO
  app.get('/emprestimo/renovar/:id', emprestarController.renovar_emprestimo);

  // RECEBER EMPRÉSTIMO
  app.get('/emprestimo/receber/:id', emprestarController.receber_emprestimo);

  // DELETE
  // app.get('/livro/delete/:id', pesquisarController.delete_livro);
};