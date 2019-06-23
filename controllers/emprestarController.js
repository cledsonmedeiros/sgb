module.exports = (app) => {

    const dataAtual = function (delimitador) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //As January is 0.
        let yyyy = today.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return (mm + delimitador + dd + delimitador + yyyy);
    };

    const dataAtualFormatada = function (delimitador) {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //As January is 0.
        let yyyy = today.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return (dd + delimitador + mm + delimitador + yyyy);
    };

    function addDias(data, dias, delimitador) {
        let result = new Date(data);
        result.setDate(result.getDate() + dias);

        let dd = result.getDate();
        let mm = result.getMonth() + 1; //As January is 0.
        let yyyy = result.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return (dd + delimitador + mm + delimitador + yyyy);
    }

    const validarCPF = (cpf) => {
        let cleanCPF = cpf.replace('.', '').replace('.', '').replace('-', '');
        let Soma;
        let Resto;
        Soma = 0;

        if (cleanCPF === "00000000000" || cleanCPF === "11111111111" || cleanCPF === "22222222222" || cleanCPF === "33333333333" || cleanCPF === "44444444444" || cleanCPF === "55555555555" || cleanCPF === "66666666666" || cleanCPF === "77777777777" || cleanCPF === "88888888888" || cleanCPF === "99999999999") {
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
        index_emprestar(req, res) {

            let idlivro = req.params.id.toString();

            db.model('livro').findById(idlivro, function (err, doc) {
                if (!err) {
                    res.render('emprestar/index', {
                        titulo: "SGB - Emprestar livro",
                        pagina: "livro",
                        pg_titulo: "Emprestar livro",
                        emprestimo: {
                            'isbn': doc.isbn,
                            'cpf': ''
                        }
                    });
                }
            });
        },
        emprestar_livro(req, res) {
            let emprestimo = req.body;
            let dataEmprestimo = dataAtualFormatada('/').toString();
            let dataEntrega = addDias(dataAtual('/').toString(), 7, '/');

            emprestimo.isbn = emprestimo.isbn.toString().trim();
            emprestimo.cpf = emprestimo.cpf.toString().trim();

            // ENCONTRAR ID DO LIVRO
            db.model('livro').findOne({isbn: emprestimo.isbn}, function (err, livro) {
                if (!err) {
                    // ENCONTRAR ID DO USUARIO
                    db.model('usuario').findOne({cpf: emprestimo.cpf}, function (err, usuario) {
                        if (!err) {
                            if (usuario != null) {
                                let objeto_emprestimo = {
                                    'idlivro': livro._id,
                                    'idusuario': usuario._id,
                                    'nome_completo': (usuario.nome + " " + usuario.sobrenome),
                                    'cpf': usuario.cpf,
                                    'titulo': livro.titulo,
                                    'autor': livro.autor,
                                    'edicao': livro.edicao,
                                    'dataemprestimo': dataEmprestimo,
                                    'dataentrega': dataEntrega,
                                };
                                // VERIFICAR QUANTIDADE DE LIVROS
                                db.model('livro').findOne({isbn: emprestimo.isbn}, function (err, livro) {
                                    if (!err) {
                                        if (livro.quantidade > 0) {
                                            // SALVAR EMPRESTIMO
                                            db.model('emprestimo').insertMany(objeto_emprestimo, (error, result) => {
                                                if (!error) {
                                                    // ATUALIZAR QUANTIDADE DE LIVROS
                                                    db.model('livro').findOne({isbn: emprestimo.isbn}, function (err, livro) {
                                                        if (!err) {
                                                            livro.quantidade = livro.quantidade - 1;
                                                            // EFETUAR ATUALIZAÇÃO
                                                            db.model('livro').findOneAndUpdate({_id: objeto_emprestimo.idlivro}, livro, {new: true}, function (err, doc) {
                                                                if (!err) {
                                                                    // RECUPERAR NOVA QUANTIDADE DE LIVROS
                                                                    db.model('livro').find(null, function (err, livros) {
                                                                        if (!err) {
                                                                            req.flash('success', 'Empréstimo feito com sucesso');
                                                                            res.render('livro/list', {
                                                                                titulo: "SGB - Listar livros",
                                                                                pagina: "livro",
                                                                                livros: livros
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            db.model('livro').find(null, function (err, livros) {
                                                if (!err) {
                                                    req.flash('danger', 'Quantidade de livros insuficiente');
                                                    res.render('livro/list', {
                                                        titulo: "SGB - Listar livros",
                                                        pagina: "livro",
                                                        livros: livros
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                db.model('livro').find(null, function (err, livros) {
                                    if (!err) {
                                        req.flash('danger', 'Usuário não localizado');
                                        res.render('livro/list', {
                                            titulo: "SGB - Listar livros",
                                            pagina: "livro",
                                            livros: livros
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        },
        list_emprestimos(req, res) {
            db.model('emprestimo').find({idusuario: user._id, status: 'inativo'}, function (err, emprestimos_inativos) {
                if (emprestimos_inativos.length > 0) {
                    res.render('historico/index', {
                        titulo: "SGB - Histórico",
                        pagina: "historico",
                        pg_titulo:  'Meu histórico',
                        emprestimos: emprestimos_inativos,
                        len_emprestimos: emprestimos_inativos.length,
                    });
                } else {
                    db.model('emprestimo').find({idusuario: user._id, status: 'ativo'}, function (err, emprestimos) {
                        req.flash('danger', 'Nenhum empréstimo finalizado foi encontrado');
                        res.render('home/home', {
                            titulo: "SGB - Home",
                            pagina: "home",
                            emprestimos: emprestimos,
                            len_emprestimos: emprestimos.length,
                        });
                    });
                }
            });
        },
        renovar_emprestimo(req, res) {
            let idemprestimo = req.params.id.toString();

            db.model('emprestimo').findById(idemprestimo, function (err, emprestimo) {
                if (!err) {
                    // VERIFICAR RENOVAÇÃO
                    if (!emprestimo.renovacao) {
                        let array_data = emprestimo.dataentrega.split('/');
                        let data_formatada = array_data[1] + '/' + array_data[0] + '/' + array_data[2];

                        let novaDataEntrega = addDias(data_formatada, 7, '/');

                        emprestimo.dataentrega = novaDataEntrega;
                        emprestimo.renovacao = true;

                        // EFETUAR ATUALIZAÇÃO
                        db.model('emprestimo').findOneAndUpdate({_id: idemprestimo}, emprestimo, {new: true}, function (err, doc) {
                            if (!err) {
                                // RECUPERAR EMPRESTIMOS
                                db.model('emprestimo').find({status: 'ativo'}, function (err, emprestimos) {
                                    if (!err) {
                                        req.flash('success', 'Empréstimo renovado');
                                        res.render('home/home', {
                                            titulo: "SGB - Home",
                                            pagina: "home",
                                            emprestimos: emprestimos,
                                            len_emprestimos: emprestimos.length,
                                        });
                                    }
                                });
                            }
                        });
                    }else {
                        // RECUPERAR EMPRESTIMOS
                        db.model('emprestimo').find({status: 'ativo'}, function (err, emprestimos) {
                            if (!err) {
                                req.flash('danger', 'Empréstimo já foi renovado');
                                res.render('home/home', {
                                    titulo: "SGB - Home",
                                    pagina: "home",
                                    emprestimos: emprestimos,
                                    len_emprestimos: emprestimos.length,
                                });
                            }
                        });
                    }
                }
            });
        },
        receber_emprestimo(req, res) {
            let idemprestimo = req.params.id.toString();

            db.model('emprestimo').findById(idemprestimo, function (err, emprestimo) {
                if (!err) {
                    emprestimo.status = 'inativo';
                    emprestimo.dataentrega = dataAtualFormatada('/').toString();

                    // EFETUAR ATUALIZAÇÃO
                    db.model('emprestimo').findOneAndUpdate({_id: idemprestimo}, emprestimo, {new: true}, function (err, doc) {
                        if (!err) {
                            // RECUPERAR EMPRESTIMOS
                            db.model('emprestimo').find({status: 'ativo'}, function (err, emprestimos) {
                                if (!err) {
                                    req.flash('success', 'Empréstimo recebido');
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
                    });

                    // AJUSTAR ESTOQUE
                    db.model('livro').findOne({_id: emprestimo.idlivro}, function (err, livro) {
                        if (!err) {
                            let novaQuantidade = (parseInt(livro.quantidade) + 1);
                            livro.quantidade = novaQuantidade;

                            db.model('livro').findOneAndUpdate({_id: emprestimo.idlivro}, livro, {new: true}, function (err, doc) {
                                if (!err) {
                                    // RECUPERAR EMPRESTIMOS
                                    db.model('emprestimo').find({status: 'ativo'}, function (err, emprestimos) {
                                        if (!err) {
                                            req.flash('success', 'Empréstimo recebido');
                                            res.render('home/home', {
                                                titulo: "SGB - Home",
                                                pagina: "home",
                                                emprestimos: emprestimos,
                                                len_emprestimos: emprestimos.length,
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },
    };
};