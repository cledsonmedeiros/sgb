module.exports = (app) => {

    let db = require('./../connect_db')();

    return {
        index_livro(req, res) {
            db.model('livro').find(null, function (err, livros) {
                if (!err) {
                    res.render('livro/index', {
                        titulo: "SGB - Cadastrar livro",
                        pagina: "livro",
                        pg_titulo: "Cadastrar livro",
                        livro: {
                            _id: "",
                            titulo: "",
                            autor: "",
                            edicao: "",
                            isbn: "",
                            quantidade: ""
                        },
                        lenLivros: livros.length
                    });
                }
            });
        },
        create_livro(req, res) {
            const {livro} = req.body;

            livro.edicao = livro.edicao.toString();
            livro.quantidade = livro.quantidade.toString();
            if (livro._id === '') {
                livro._id = null;

                db.model('livro').insertMany(livro, (error) => {
                    if (error) {
                        console.log("Falha ao criar livro: " + error);
                        res.render('home/login', {titulo: "SGB - Login"});
                    } else {
                        db.model('livro').find(null, function (err, livros) {
                            if (!err) {
                                res.render('livro/index', {
                                    titulo: "SGB - Cadastrar livro",
                                    pagina: "livro",
                                    livro: {
                                        _id: "",
                                        titulo: "",
                                        autor: "",
                                        edicao: "",
                                        isbn: "",
                                        quantidade: ""
                                    },
                                    lenLivros: livros.length,
                                    pg_titulo: "Cadastrar livro"
                                });
                            }
                        });
                    }
                })
            } else {
                db.model('livro').findOneAndUpdate({_id: req.body.livro._id}, req.body.livro, {new: true}, function (err, doc) {
                    // console.log('atualizado: ' + doc);
                    if (!err){
                        db.model('livro').find(null, function (err, livros) {
                            if (err) {
                                console.log("Falha ao listar livros: " + err);
                                res.render('livro/index', {
                                    titulo: "SGB - Cadastrar livro",
                                    pagina: "livro"
                                });
                            } else {
                                res.render('livro/list', {
                                    titulo: "SGB - Listar livros",
                                    pagina: "livro",
                                    livros: livros
                                });
                            }
                        });
                    }else{
                        console.log('falha: ' + err);
                    }
                });
            }
        },
        list_livro(req, res) {
            db.model('livro').find(null, function (err, livros) {
                if (err) {
                    console.log("Falha ao listar livros: " + err);
                    res.render('livro/index', {
                        titulo: "SGB - Cadastrar livro",
                        pagina: "livro"
                    });
                } else {
                    res.render('livro/list', {
                        titulo: "SGB - Listar livros",
                        pagina: "livro",
                        livros: livros
                    });
                }
            });
        },
        update_livro(req, res) {
            db.model('livro').findById(req.params.id, function (err, doc) {
                if (!err) {
                    res.render('livro/index', {
                        titulo: "SGB - Editar livro",
                        pagina: "livro",
                        livro: doc,
                        lenLivros: doc.length,
                        pg_titulo: "Editar livro"
                    });
                }
            });
        },
        delete_livro(req, res) {
            db.model('livro').findByIdAndRemove(req.params.id, function (err) {
                if (!err) {

                    db.model('livro').find(null, function (err, livros) {
                        if (err) {
                            console.log("Falha ao deletar livro: " + err);
                            res.render('livro/index', {
                                titulo: "SGB - Cadastrar livro",
                                pagina: "livro"
                            });
                        } else {
                            res.render('livro/list', {
                                titulo: "SGB - Listar livros",
                                pagina: "livro",
                                livros_len: livros.length,
                                livros: livros
                            });
                        }
                    });
                } else {
                    console.log('falha ao deletar: ' + err);
                    res.render('home/login');
                }
            });
        },
    };
};