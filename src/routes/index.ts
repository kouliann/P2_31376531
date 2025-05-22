import express, { NextFunction } from 'express';
import contacto from '../models/contacto';
import db from '../models/sqlite';


/* GET home page. */
import { Request, Response, Router } from 'express';

let router: Router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Safe&Home' });
});

router.get('/pagos', function (req: Request, res: Response) {
  res.render('pagos', { title: 'Compra del Servicio'});
});

interface contacto {
    id: number;
    nombre: string;
    email: string;
    telefono: number;
    mensaje: string;

}
router.get('/admin/contacts', function (req, res) {
    const query = 'SELECT * FROM contacto';

    db.all(query, (err: Error | null, rows: contacto[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Renderizar la vista 'index.ejs' y pasar los resultados de la consulta
        res.render('contacts', { contactos: rows });
    });
});

router.post('/contacto', function(req: Request, res: Response, next:NextFunction){
  const {id, nombre, email, telefono, mensaje} = req.body;
  

  console.log(req.body);

  contacto.create1(nombre, email, telefono, mensaje)
  .then((id) => {
    res.redirect('/');
    console.log('prueba 2')
  })

  
  .catch(error => {
    console.error('Error al guardar el contacto:', error);
    return res.status(500).send('Error al guardar el contacto');
  });
});


router.post('/pagos', function(req: Request, res: Response, next:NextFunction){
  const {nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
  

  console.log(req.body);

  contacto.create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda)
  .then((id) => {
    res.redirect('/');
    console.log('prueba 2')
  })

  
  .catch(error => {
    console.error('Error al guardar el contacto:', error);
    return res.status(500).send('Error al guardar el contacto');
  });
});
export default router;