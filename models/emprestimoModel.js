module.exports = () => {
    let db = require('./../connect_db')();
    let Schema = require('mongoose').Schema;

    let emprestimo = Schema({
        idlivro: {
            type: String,
            required: true
        },
        idusuario: {
            type: String,
            required: true
        },
        nome_completo: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: true
        },
        titulo: {
            type: String,
            required: true
        },
        autor: {
            type: String,
            required: true
        },
        edicao: {
            type: String,
            required: true
        },
        dataemprestimo: {
            type: String,
            required: true
        },
        dataentrega: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'ativo'
        },
    });

    return db.model('emprestimo', emprestimo);
};