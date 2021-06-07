const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta Usuario'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask',
        error
    })
}

exports.crearCuenta = async(req, res) => {
    const { email, password } = req.body;
    try {
        await Usuarios.create({
            email,
            password
        });

        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`
        const usuario = { email };

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        req.flash('error', error.errors.map(err => err.message));
        res.render('crearCuenta', {
            nombrePagina: 'Crear Cuenta Usuario',
            mensajes: req.flash(),
            email,
            password
        })
    }
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

exports.confrimarCuenta = async(req, res) => {
    const usuario = await Usuarios.findOne({ where: { email: req.params.email } });
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Su cuenta ha sido activada');
    res.redirect('/iniciar-sesion');
}