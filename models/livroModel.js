module.exports = () => {
    let db = require('./../connect_db')();
    let Schema = require('mongoose').Schema;

    let livro = Schema({
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
        isbn: {
            type: String,
            required: true,
            unique: true
        },
        quantidade: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'ativo'
        },
    });

    return db.model('livro', livro);
};