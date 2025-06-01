import express, { NextFunction, response } from 'express';
import contacto from '../models/contacto';
import db from '../models/sqlite';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv';
dotenv.config();

/* GET home page. */
import { Request, Response, Router } from 'express';



let router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Safe&Home', siteKey: process.env.site_key });
});

router.get('/payments', function (req: Request, res: Response) {
  res.render('pagos', { title: 'Compra del Servicio', siteKey: process.env.site_key});
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
        res.render('contacts', { title: 'Lista de contactos',contactos: rows });
    });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.gmail,     
        pass:  process.env.pass,    
    }
});

router.post('/contacto', async (req:any, res:any, next:NextFunction) => {
    const recaptchaToken = req.body['g-recaptcha-response'];
    const secretKey = process.env.secret_key; 
    interface RecaptchaResponse {
        success: boolean;
        challenge_ts?: string;
        hostname?: string;
        "error-codes"?: string[];
    }
    
  // Verifica el token con Google 
      const response = await axios.post<RecaptchaResponse>(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);
            const {id, nombre, email, telefono, mensaje} = req.body;
            console.log(req.body);
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            
            let pais = '';
            
            try {
                const ipstackKey = process.env.ipstack_key;
                const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${ipstackKey}`);
                const location = response.data as { country_name?: string };
                pais = location.country_name || '';
                console.log('Ubicación del usuario:', location);
            } catch (err) {
                console.error('Error consultando ipstack:', err);
            }

            contacto.create1(nombre, email, telefono, mensaje, pais)
            .then( async (id) => {
                // Enviar correo
                const mailOptions = {
                from:'safeandhome06@gmail.com',
                to: 'programacion2ais@yopmail.com',
                subject: 'Nuevo contacto de Safe&Home',
                html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><b>Nombre:</b> ${nombre}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Teléfono:</b> ${telefono}</p>
                <p><b>Mensaje:</b> ${mensaje}</p>
                <p><b>Pais:</b> ${pais}</p>
                    `};

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Correo enviado y contacto guardado exitosamente');
                    res.redirect('/');
                } catch (mailError) {
                    console.error('Error al enviar el correo:', mailError);
                }
            })
        
      
});


router.post('/payments', async function(req: Request, res: Response, next:NextFunction){

    const {nombre, email, telefono, tarjeta, mes, ano, cvv, monto, moneda} = req.body;
    console.log(req.body);

    const recaptchaToken = req.body['g-recaptcha-response'];
    const secretKey = process.env.secret_key; 

    interface RecaptchaResponse {
        success: boolean;
        challenge_ts?: string;
        hostname?: string;
        "error-codes"?: string[];
    }
    const response = await axios.post<RecaptchaResponse>(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);

        const data ={
            "amount": parseFloat(monto),
            "card-number": parseInt(tarjeta),
            "cvv": parseInt(cvv),
            "expiration-month": parseInt(mes),
            "expiration-year": parseInt(ano),
            "full-name": nombre,
            "currency": moneda,
            "description": "Pago por servicio de Safe&Home",
            "reference": uuidv4()
        }

        console.log('Datos enviados a la API:', data);
 

        try {
            const paymentResponse = await axios.post('https://fakepayment.onrender.com/payments', data,{ headers:{ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMzFUMTk6MDM6MjQuMTY4WiIsImlhdCI6MTc0ODcxODIwNH0.4ReF44CDSr99WXF_MzL27FsFec0vM-NePdA39HOGtxU' }});
            
            await contacto.create2(nombre, email, telefono, tarjeta, mes, ano, cvv, monto, moneda);

                res.render('pagos', {
                    title: 'Compra del Servicio',
                    siteKey: process.env.site_key,
                    paymentResult: paymentResponse.data
                });
            
        } catch (error: any) {
            console.error('Error en el pago:', error.response?.data || error.message);
            res.status(500).send('Error al procesar el pago');
        }
});
export default router;