module.exports = (app) => {

    let db = require('./../connect_db')();

    return {
        index_livro(req, res) {

            let validar = {
                'titulo': false,
                'autor': false,
                'edicao': false,
                'isbn': false,
                'quantidade': false,
            };

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
                        lenLivros: livros.length,
                        txtBtn: "<i class=\"fas fa-plus\"></i> Cadastrar",
                        validacoes: validar
                    });
                }
            });
        },
        create_livro(req, res) {
            const {livro} = req.body;
            livro.titulo = livro.titulo.toString().trim();
            livro.autor = livro.autor.toString().trim();
            livro.edicao = livro.edicao.toString().trim();
            livro.isbn = livro.isbn.toString().trim().trim();
            livro.quantidade = livro.quantidade.toString().trim();

            if (livro._id === '') {
                livro._id = null;

                let validacoes = {
                    'titulo': livro.titulo === '',
                    'autor': livro.autor === '',
                    'edicao': livro.edicao === '',
                    'isbn': livro.isbn === '',
                    'quantidade': livro.quantidade === '',
                };

                if (validacoes.titulo || validacoes.autor || validacoes.edicao || validacoes.isbn || validacoes.quantidade){

                    // console.log("entrou");

                    db.model('livro').find(null, function (err, livros) {
                        if (!err) {

                            let validar = {
                                'titulo': livro.titulo === '',
                                'autor': livro.autor === '',
                                'edicao': livro.edicao === '',
                                'isbn': livro.isbn === '',
                                'quantidade': livro.quantidade === '',
                            };

                            res.render('livro/index', {
                                titulo: "SGB - Cadastrar livro",
                                pagina: "livro",
                                livro: {
                                    _id: "",
                                    titulo: livro.titulo,
                                    autor: livro.autor,
                                    edicao: livro.edicao,
                                    isbn: livro.isbn,
                                    quantidade: livro.quantidade
                                },
                                lenLivros: livros.length,
                                pg_titulo: "Cadastrar livro",
                                txtBtn: "<i class=\"fas fa-plus\"></i> Cadastrar",
                                validacoes: validar
                            });
                        }
                    });
                }else {
                    db.model('livro').insertMany(livro, (error) => {
                        if (error) {
                            db.model('livro').find(null, function (err, livros) {
                                if (!err) {

                                    let validar = {
                                        'titulo': false,
                                        'autor': false,
                                        'edicao': false,
                                        'isbn': false,
                                        'quantidade': false,
                                    };

                                    req.flash('danger', 'Falha ao cadastrar livro.');
                                    res.render('livro/index', {
                                        titulo: "SGB - Cadastrar livro",
                                        pagina: "livro",
                                        livro: {
                                            _id: "",
                                            titulo: '',
                                            autor: '',
                                            edicao: '',
                                            isbn: '',
                                            quantidade: ''
                                        },
                                        lenLivros: livros.length,
                                        pg_titulo: "Cadastrar livro",
                                        txtBtn: "<i class=\"fas fa-plus\"></i> Cadastrar",
                                        validacoes: validar
                                    });
                                }
                            });

                        } else {
                            db.model('livro').find(null, function (err, livros) {
                                if (!err) {

                                    let validar = {
                                        'titulo': false,
                                        'autor': false,
                                        'edicao': false,
                                        'isbn': false,
                                        'quantidade': false,
                                    };

                                    req.flash('success', 'Livro cadastrado com sucesso');
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
                                        pg_titulo: "Cadastrar livro",
                                        txtBtn: "<i class=\"fas fa-plus\"></i> Cadastrar",
                                        validacoes: validar
                                    });
                                }
                            });
                        }
                    })
                }
            } else {
                db.model('livro').findOneAndUpdate({_id: req.body.livro._id}, req.body.livro, {new: true}, function (err, doc) {
                    // console.log('atualizado: ' + doc);
                    if (!err){

                        // console.log('entrou aqui');

                        let validar = {
                            'titulo': livro.titulo === '',
                            'autor': livro.autor === '',
                            'edicao': livro.edicao === '',
                            'isbn': livro.isbn === '',
                            'quantidade': livro.quantidade === '',
                        };

                        db.model('livro').find(null, function (err, livros) {
                            if (err) {
                                console.log("Falha ao listar livros: " + err);
                                res.render('livro/index', {
                                    titulo: "SGB - Cadastrar livro",
                                    pagina: "livro"
                                });
                            } else {
                                req.flash('success', 'Livro editado com sucesso!');
                                res.render('livro/list', {
                                    titulo: "SGB - Listar livros",
                                    pagina: "livro",
                                    livros: livros,
                                    validacoes: validar
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

                // console.log('entrou aqui');

                let validar = {
                    'titulo': false,
                    'autor': false,
                    'edicao': false,
                    'isbn': false,
                    'quantidade': false,
                };


                if (!err) {
                    res.render('livro/index', {
                        titulo: "SGB - Editar livro",
                        pagina: "livro",
                        livro: doc,
                        lenLivros: doc.length,
                        pg_titulo: "Editar livro",
                        txtBtn: "<i class=\"fas fa-save\"></i> Guardar",
                        validacoes: validar
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
                            req.flash('success', 'Livro deletado com sucesso!');
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