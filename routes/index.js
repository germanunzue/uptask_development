const express = require('express');
const {
    render
} = require('pug');
const router = express.Router();

// importo express validator

const {
    body
} = require('express-validator/check');

// importamos los controladores 

const proyectosController = require('../controllers/proyectosControllers');
const tareasController = require('../controllers/tareasControllers');
const usuariosController = require('../controllers/usuariosControllers');
const authController = require('../controllers/authControllers');

module.exports = function() {
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), /* valido cada campo que venga en el body */
        proyectosController.nuevoProyecto);

    //listar proyectos
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), /* valido cada campo que venga en el body */
        proyectosController.actualizarProyecto
    );

    //eliminar proyectos
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // Tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //actualiza tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);

    //iniciar session 
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    router.get('/cerrar-sesion', authController.cerrarSesion);

    //reestablecer contrasena
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarTocken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    //confirmar cuenta
    router.get('/confirmar/:email', usuariosController.confrimarCuenta);


    return router;
}