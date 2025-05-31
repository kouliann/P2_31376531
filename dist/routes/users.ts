import express from 'express';
import { Request, Response, Router } from 'express';
import db from '../models/sqlite';

const router: Router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'pagina principal' });
});

router.get('/pagos', (req: Request, res: Response) => {
  res.render('pagos', { title: 'Compra del servicio' });
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
        res.render('contacts', {title: 'Lista de contactos', contactos: rows });
    });
});

export default router;
