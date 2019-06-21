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