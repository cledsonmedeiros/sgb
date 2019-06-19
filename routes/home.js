module.exports = (app) => {
  const { homeController } = app.controllers;

  // NAVEGAÇÃO
  app.get('/', homeController.index_page);
  app.get('/index', homeController.index_page);
  app.get('/cadastrar', homeController.cadastrar_page);
  app.get('/home', homeController.home_page);

  // AÇÕES
  app.post('/entrar', homeController.autenticar);
  app.post('/create_usuario', homeController.create_usuario);
  app.get('/logout', homeController.logout);

};