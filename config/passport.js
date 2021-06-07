const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('../models/Usuarios');

//estamos definiendo como se va a valida un usuario, en este caso con email y pass
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done) => {
        try {
            const usuario = await Usuarios.findOne({ where: { email, activo: 1 } });
            if (!usuario.verificarPassword(password)) {
                return done(null, false, {
                    message: 'Password Incorrecto'
                });
            }
            return done(null, usuario);

        } catch (error) {
            // el usuario no existe
            return done(null, false, {
                message: 'Esa cuenta no existe'
            });
        }
    }
));

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;