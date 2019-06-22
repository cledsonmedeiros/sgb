module.exports = (app) => {

    let db = require('./../connect_db')();

    return {
        index_pesquisa(req, res) {
            res.render('pesquisar/index', {
                titulo: "SGB - Pesquisar livros",
                pagina: "pesquisar",
                pg_titulo: "Pesquisar livros",
            });
        },
        pesquisar_livro(req, res) {
            const {pesquisa} = req.body;
            pesquisa.tipo = pesquisa.tipo.toString().trim();
            pesquisa.entrada = pesquisa.entrada.toString().trim();
            if (pesquisa.tipo === 'titulo'){
                db.model('livro').find(
                    { "titulo": { "$regex": pesquisa.entrada, "$options": "i" } },
                    function(err,docs) {
                        if (err) {
                            res.render('pesquisar/index', {
                                titulo: "SGB - Pesquisar livros",
                                pagina: "pesquisar",
                                pg_titulo: "Pesquisar livros",
                            });
                        }else {
                            if (docs.length > 0) {
                                res.render('pesquisar/list', {
                                    titulo: "SGB - Resultado da pesquisa",
                                    pagina: "pesquisar",
                                    pg_titulo: "Resultado da pesquisa",
                                    livros: docs
                                });
                            }else {
                                req.flash('danger', 'Nenhum resultado encontrado');
                                res.render('pesquisar/index', {
                                    titulo: "SGB - Pesquisar livros",
                                    pagina: "pesquisar",
                                    pg_titulo: "Pesquisar livros",
                                });
                            }

                        }
                    }
                );
            }
            if (pesquisa.tipo === 'autor'){
                db.model('livro').find(
                    { "autor": { "$regex": pesquisa.entrada, "$options": "i" } },
                    function(err,docs) {
                        if (err) {
                            res.render('pesquisar/index', {
                                titulo: "SGB - Pesquisar livros",
                                pagina: "pesquisar",
                                pg_titulo: "Pesquisar livros",
                            });
                        }else {
                            if (docs.length > 0) {
                                res.render('pesquisar/list', {
                                    titulo: "SGB - Resultado da pesquisa",
                                    pagina: "pesquisar",
                                    pg_titulo: "Resultado da pesquisa",
                                    livros: docs
                                });
                            }else {
                                req.flash('danger', 'Nenhum resultado encontrado');
                                res.render('pesquisar/index', {
                                    titulo: "SGB - Pesquisar livros",
                                    pagina: "pesquisar",
                                    pg_titulo: "Pesquisar livros",
                                });
                            }
                        }
                    }
                );
            }
            if (pesquisa.tipo === 'isbn'){
                db.model('livro').find(
                    { "isbn": { "$regex": pesquisa.entrada, "$options": "i" } },
                    function(err,docs) {
                        if (err) {
                            res.render('pesquisar/index', {
                                titulo: "SGB - Pesquisar livros",
                                pagina: "pesquisar",
                                pg_titulo: "Pesquisar livros",
                            });
                        }else {
                            if (docs.length > 0) {
                                res.render('pesquisar/list', {
                                    titulo: "SGB - Resultado da pesquisa",
                                    pagina: "pesquisar",
                                    pg_titulo: "Resultado da pesquisa",
                                    livros: docs
                                });
                            }else {
                                req.flash('danger', 'Nenhum resultado encontrado');
                                res.render('pesquisar/index', {
                                    titulo: "SGB - Pesquisar livros",
                                    pagina: "pesquisar",
                                    pg_titulo: "Pesquisar livros",
                                });
                            }
                        }
                    }
                );
            }
        },
    };
};