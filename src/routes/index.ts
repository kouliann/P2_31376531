import express, { NextFunction, response } from 'express';
import contacto from '../models/contacto';
import db from '../models/sqlite';
import axios from 'axios';
import nodemailer from 'nodemailer';

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'safeandhome06@gmail.com',      // Cambia por tu correo
        pass: 'stella24'        // Usa una contraseña de aplicación si usas Gmail
    }
});

router.post('/contacto', async (req:any, res:any, next:NextFunction) => {
    const recaptchaToken = req.body['g-recaptcha-response'];
    const secretKey = '6Lfa9kgrAAAAAPm0i2kaFv_anh0_QFPIMrzpeC6Y'; 

     interface RecaptchaResponse {
        success: boolean;
        challenge_ts?: string;
        hostname?: string;
        "error-codes"?: string[];
    }
  // Verifica el token con Google
    try{  
      const response = await axios.post<RecaptchaResponse>(
          `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
      );
      if(response.data.success===true){ 
      const {id, nombre, email, telefono, mensaje} = req.body;

      console.log(req.body);

      contacto.create1(nombre, email, telefono, mensaje)
      .then( (id) => {
        // Enviar correo
        const mailOptions = {
        from: '"Safe&Home" <safeandhome06@gmail.com>', // Cambia por tu correo
        to: 'eliannibethpadrino@correo.com', // Lista de destinatarios
        subject: 'Nuevo contacto de Safe&Home',
        html: `
          <h3>Nuevo mensaje de contacto</h3>
          <p><b>Nombre:</b> ${nombre}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Teléfono:</b> ${telefono}</p>
          <p><b>Mensaje:</b> ${mensaje}</p>
              `};

        try {
           transporter.sendMail(mailOptions);
          console.log('Correo enviado exitosamente');
          res.redirect('/');
        } catch (mailError) {
          console.error('Error al enviar el correo:', mailError);
          res.status(500).send('Error al enviar el correo');
       }
            
      })
      
      .catch(error => {
        console.error('Error al guardar el contacto:', error);
        return res.status(500).send('Error al guardar el contacto');
      });

   }else (!response.data.success) 
          return res.status(400).send('reCAPTCHA no válido');
      
    } catch (error) {
        return res.status(500).send('Error al verificar reCAPTCHA');
    }

    // Si pasa el reCAPTCHA, procesa el formulario

    
   
});


router.post('/pagos', function(req: Request, res: Response, next:NextFunction){
  const {nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
  console.log(req.body);

  contacto.create2(nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda)
  .then((id) => {
    res.redirect('/');
  })

  .catch(error => {
    console.error('Error al guardar el contacto:', error);
    return res.status(500).send('Error al guardar el contacto');
  });
});
export default router;