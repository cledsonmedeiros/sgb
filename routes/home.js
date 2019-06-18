module.exports = (app) => {
  const { homeController } = app.controllers;

  // ROTAS LOGIN
  app.get('/', homeController.login_page);

  app.get('/login', homeController.login_page);
  app.get('/index', homeController.login_page);
  app.post('/entrar', homeController.login_acao);
  app.get('/logout', homeController.logout_acao);
  app.get('/home', homeController.home_page);

  // ROTAS CADASTRAR
  app.get('/signup', homeController.cadastrar_page);
  app.post('/criar_usuario', homeController.criar_usuario_acao);
};