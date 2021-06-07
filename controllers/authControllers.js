const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}


exports.enviarTocken = async(req, res) => {
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save({ usuario });

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

    await enviarEmail.enviar({
        usuario,
        subject: 'Resetar Contraseña',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}


exports.actualizarPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('correcto', 'Tu contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}