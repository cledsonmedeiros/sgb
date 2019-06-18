module.exports = (app) => {
  const HomeController = {
    index(req, res) {
      res.render('home/login');
    },

    login(req, res) {
      const { usuario } = req.body;
      const { email, nome } = usuario;
      
      if (email && nome) {
        usuario.produtos = [];
        req.session.usuario = usuario;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    },

    logout(req, res) {
      req.session.destroy();
      res.redirect('/login');
    }

  };
  return HomeController;
};
