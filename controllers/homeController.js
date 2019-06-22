module.exports = (app) => {

    const capitalize = (s) => {
        if (typeof s !== 'string'){
            return '';
        }
        return s.charAt(0).toUpperCase() + s.slice(1)
    };

    const validarCPF = (cpf) => {
        let cleanCPF = cpf.replace('.', '').replace('.', '').replace('-','');
        let Soma;
        let Resto;
        Soma = 0;

        if (cleanCPF === "00000000000" || cleanCPF === "11111111111" || cleanCPF === "22222222222" || cleanCPF === "33333333333" || cleanCPF === "44444444444" || cleanCPF === "55555555555" || cleanCPF === "66666666666" || cleanCPF === "77777777777" || cleanCPF === "88888888888" || cleanCPF === "99999999999")  {
            return false;
        }
        for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) {
            Resto = 0;
        }
        if (Resto !== parseInt(cleanCPF.substring(9, 10))) {
            return false;
        }

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11)) {
            Resto = 0;
        }
        return Resto === parseInt(cleanCPF.substring(10, 11));
    };

    let db = require('./../connect_db')();

    return {
        index_page(req, res) {
            res.render('home/index', {
                titulo: "SGB - Login",
                msg: ''
            });
        },
        cadastrar_page(req, res) {
            res.render('home/cadastrar', {
                titulo: "SGB - Cadastro",
            });
        },
        create_usuario(req, res) {
            req.body.usuario.nome = capitalize(req.body.usuario.nome.toString().toLowerCase());
            req.body.usuario.sobrenome = capitalize(req.body.usuario.sobrenome.toString().toLowerCase());
            req.body.usuario.login = req.body.usuario.login.toString().toLowerCase();
            let cpf = req.body.usuario.cpf.toString();
            if(validarCPF(cpf)){
                db.model('usuario').insertMany(req.body.usuario, (error, result) => {
                    if (error) {
                        res.render('home/cadastrar', {titulo: "SGB - Cadastrar"});
                    }
                    res.render('home/index', {
                        titulo: "SGB - Login",
                        msg: null
                    });
                })
            }else {
                console.log('CPF inválido: ' + cpf);
                res.render('home/cadastrar', {titulo: "SGB - Cadastrar"});
            }


        },
        autenticar(req, res){
            var username = req.body.usuario.login.toString().trim();
            var password = req.body.usuario.senha.toString().trim();

            db.model('usuario').findOne({login: username, senha: password}, function (err, user) {
                if (err){
                    // console.log("Erro: " + err);
                    req.flash('danger', 'Falha no servidor');
                    res.render('home/index', {titulo: "SGB - Login"});
                }else {
                    if (!user){
                        res.render('home/index', {
                            titulo: "SGB - Home",
                            msg: 'erro'
                        });
                    }else {
                        global.user = user;

                        if (user.tipo === 'admin') {
                            db.model('emprestimo').find({status: 'ativo'}, function (err, emprestimos) {
                                if (!err) {
                                    res.render('home/home', {
                                        titulo: "SGB - Home",
                                        pagina: "home",
                                        emprestimos: emprestimos,
                                        len_emprestimos: emprestimos.length,
                                        // livros: livros
                                    });
                                }
                            });
                        }else {
                            db.model('emprestimo').find({idusuario: user._id, status: 'ativo'}, function (err, emprestimos) {
                                if (!err) {
                                    res.render('home/home', {
                                        titulo: "SGB - Home",
                                        pagina: "home",
                                        emprestimos: emprestimos,
                                        len_emprestimos: emprestimos.length,
                                        // livros: livros
                                    });
                                }
                            });
                        }
                    }
                }
            })
        },
        logout(req, res) {
            req.session.destroy();
            res.render('home/index', {
                titulo: "SGB - Login",
                msg: 'sucesso'
            });
        },

        home_page(req, res) {

            if (user.tipo === 'admin') {
                db.model('emprestimo').find({status: 'ativo'}, function (err, emprestimos) {
                    if (!err) {
                        res.render('home/home', {
                            titulo: "SGB - Home",
                            pagina: "home",
                            emprestimos: emprestimos,
                            len_emprestimos: emprestimos.length,
                            // livros: livros
                        });
                    }
                });
            }else {
                db.model('emprestimo').find({idusuario: user._id, status: 'ativo'}, function (err, emprestimos) {
                    if (!err) {
                        res.render('home/home', {
                            titulo: "SGB - Home",
                            pagina: "home",
                            emprestimos: emprestimos,
                            len_emprestimos: emprestimos.length,
                            // livros: livros
                        });
                    }
                });
            }

            // res.render('home/home', {
            //     titulo: "SGB - Home",
            //     pagina: "home"
            // });
        }
    };
};