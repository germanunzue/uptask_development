const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser')
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//cargo el archivo de configuracion
require('dotenv').config({
    path: 'variables.env'
})

// helpers
const helpers = require('./helpers');

//crear la conexcion a la BD
const db = require('./config/db');

// importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

/* Utilizo sync para que se creen las tablas o los campos que tenemos en nuestro modelos y no esten en la BD */
db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch((err) => console.log(err));


// crear una app express
const app = express();

// cargar archivos estaticos
app.use(express.static('public'));

// habilitar pug
app.set('view engine', 'pug');

app.use(expressValidator());

// habilitar bodyparse para leer datos de un formulario
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Agregar la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

app.use(flash());

app.use(cookieParser());

app.use(session({
    secret: 'superSecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// agrego en la variable de forma global, para que se pueda acceder desde cualquier lado
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;

    next();
});


// rutas para el home
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

app.listen(port, host, () => {
    console.log(`El servidor esta funcionando en la URL: http://${host}:${port}`)
});