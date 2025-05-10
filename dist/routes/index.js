"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contacto_1 = __importDefault(require("../models/contacto"));
const router = express_1.default.Router();
router.use(express_1.default.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('index', { title: 'Safe&Home' });
});

router.get('/pagos', function(req, res) {
    res.render('pagos', { title: 'Compra del Servicio' });
});

router.post('/contacto', function (req, res, next) {
    const { nombre, email, telefono, mensaje } = req.body;
    console.log(req.body);
    contacto_1.default.create1(nombre, email, telefono, mensaje)
        .then((id) => {
        res.redirect('/');
<<<<<<< HEAD
        
=======
        console.log('prueba 2');
>>>>>>> 426cad25f69fc642d2eb521bc2b8fb834b5e8adb
    })
        .catch(error => {
        console.error('Error al guardar el contacto:', error);
        return res.status(500).send('Error al guardar el contacto');
    });
});

<<<<<<< HEAD
=======



>>>>>>> 426cad25f69fc642d2eb521bc2b8fb834b5e8adb
router.post('/pagos', function (req, res, next) {
    const { nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
    console.log(req.body);
    
    contacto_1.default.create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda)
        .then((id) => {
        res.redirect('/pagos');
<<<<<<< HEAD
=======
        console.log('prueba 3');
>>>>>>> 426cad25f69fc642d2eb521bc2b8fb834b5e8adb
    })
        .catch(error => {
        console.error('Error al guardar el contacto:', error);
        return res.status(500).send('Error al guardar el contacto');
    });
});
exports.default = router;
