module.exports = (app) => {

    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1)
    };

    var db = require('./../connect_db')();

    return {

        login_page(req, res){
          res.render('home/login', {titulo: "SGB - Login"});
        },

        cadastrar_page(req, res){
            res.render('home/cadastrar', {
                titulo: "SGB - Cadastrar",
                pagina: "livro"
            });
        },

        criar_usuario_acao(req, res){
            req.body.usuario.nome = capitalize(req.body.usuario.nome.toString().toLowerCase());
            req.body.usuario.sobrenome = capitalize(req.body.usuario.sobrenome.toString().toLowerCase());
            req.body.usuario.login = req.body.usuario.login.toString().toLowerCase();

            db.model('usuario').insertMany(req.body.usuario, (error, result) => {
                if (error) {
                    res.render('home/cadastro', {titulo: "SGB - Cadastrar"});
                }
                res.render('home/login', {titulo: "SGB - Login"});
            })
        },

        login_acao(req, res) {
            var username = req.body.usuario.login.toString().trim();
            var password = req.body.usuario.senha.toString().trim();

            db.model('usuario').findOne({login: username, senha: password}, function (err, user) {
                if (err){
                    console.log("Erro: " + err);
                    res.render('home/login', {titulo: "SGB - Login"});
                    return res.status(500).send();
                }else {
                    if (!user){
                        console.log("Credenciais incorretas");
                        res.render('home/login', {
                            titulo: "SGB - Home"
                        });
                        return res.status(404).send();
                    }else {
                        global.user = user;

                        res.render('home/index', {
                            titulo: "SGB - Home",
                            pagina: "home"
                        });
                        return res.status(200).send();
                    }
                }
            })
        },

        logout_acao(req, res) {
            req.session.destroy();
            res.render('home/login', {titulo: "SGB - Login"});
        },

        home_page(req, res) {
            res.render('home/index', {
                titulo: "SGB - Home",
                pagina: "home"
            });
        }
    };
};