module.exports = () => {
    let db = require('./../connect_db')();
    // let mongoose = require('mongoose');
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
            index: {unique: true}
        },
        quantidade: {
            type: Number,
            required: true
        }
    });

    return db.model('livro', livro);
};