const express = require('express');
const path = require('path');
const consign = require('consign');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const error = require('./middlewares/error');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser('sgb'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
// app.use(expressSession({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'sgb'
// }));
app.set('trust proxy', 1) // trust first proxy
app.use(expressSession({
    secret: 's3Cur3',
    name: 'sessionId',
})
);

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

consign({})
    .include('models')
    .then('controllers')
    .then('routes')
    .into(app)
    ;

app.use(error.notFound);
app.use(error.serverError);

var porta = 1994;

app.listen(porta, () => {
    console.log("Servidor rodando em: http://localhost:" + porta);
});
