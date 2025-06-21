import express, { NextFunction, response } from 'express';
import contacto from '../models/contacto';
import db from '../models/sqlite';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv';
import  session from 'express-session';
import bcrypt from 'bcryptjs';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, Router } from 'express';
dotenv.config();

/* GET home page. */

let router: Router = express.Router();

router.use(session({
    secret: process.env.secretSession || 'secretKey',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,               
        sameSite: 'lax',               
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 15 * 60 * 1000   
    }
}));

router.use(passport.initialize());
router.use(passport.session());





router.get('/', (req: Request, res: Response) => {
  res.render('index', {
    title: 'Safe&Home',
    siteKey: process.env.site_key,
    og: {
      title: 'Safe&Home - Seguridad para tu hogar',
      description: 'Protege tu hogar con nuestros servicios de vigilancia y tecnología.',
      url: 'https://p2-31376531.onrender.com',
      image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
    }
  });
});

router.get('/payments', function (req: Request, res: Response) {
  res.render('pagos', {
    title: 'Compra del Servicio',
    siteKey: process.env.site_key,
    og: {
      title: 'Safe&Home - Seguridad para tu hogar',
      description: 'Solicita uno de nuestros servicios de seguridad y protección para tu hogar.',
      url: 'https://p2-31376531.onrender.com/payments',
      image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
    }
});
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
  },
  function(accessToken, refreshToken, profile, done) {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    if (!email) {
      return done(null, false, { message: 'No se pudo obtener el email de Google.' });
    }
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'El email no está registrado.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj as any);
});


router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/adminMenu');
  }
);



function isAuthenticated(req: any, res: Response, next: NextFunction) {
  if ((req.isAuthenticated && req.isAuthenticated()) || req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.get('/login', function (req: Request, res: Response) {
  res.render('login', { title: 'Login de Administrador', og: {
      title: 'Safe&Home - Seguridad para tu hogar',
      description: 'Inicio de sesión para administradores',
      url: 'https://p2-31376531.onrender.com/login',
      image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
    }});
})

router.get('/adminMenu', isAuthenticated, (req, res) => {
  res.render('adminMenu', { title:'Menu de Administrador', user: req.user, og: {
      title: 'Safe&Home - Seguridad para tu hogar',
      description: 'Administración de contactos, pagos y usuarios',
      url: 'https://p2-31376531.onrender.com/adminMenu',
      image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
    } });
});


interface contacto {
    id: number;
    nombre: string;
    email: string;
    mensaje: string;
    ip:any;
    pais: string;
    fecha: Date;

}

interface users {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
}

interface pagos {
    id: number;
    nombre: string;
    email: string;
    servicio: string;
    monto: number;
    moneda: string;
    fecha: Date;
}
router.get('/admin/contacts', function (req, res) {

    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }

    const query1 = 'SELECT * FROM contacto';

    db.all(query1, (err: Error | null, rows: contacto[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.render('contacts', { title: 'Lista de contactos',contactos: rows, og: {
          title: 'Safe&Home - Seguridad para tu hogar',
          description: 'Lista de contactos recibidos',
          url: 'https://p2-31376531.onrender.com/admin/contacts',
          image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
        }});
    });
});

router.get('/admin/payments', function (req, res){
    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }
    const query2 = 'SELECT * FROM pagos';

    db.all(query2, (err: Error | null, rows: pagos[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.render('payments', { title:'Lista de pagos',pagos: rows, og: {
      title: 'Safe&Home - Seguridad para tu hogar',
      description: 'pagos realizados por los servicios de seguridad',
      url: 'https://p2-31376531.onrender.com/admin/payments',
      image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
    } });
    });

})

router.get('/admin/users', function (req, res){
    const referer = req.get('Referer');
    if (!referer || !referer.includes('/')) {
        return res.redirect('/login');
    }
    const query3 = 'SELECT * FROM users';

    db.all(query3, (err: Error | null, rows: users[]) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.render('registros', { title: 'Lista de usuarios registrados', users: rows, og: {
      title: 'Safe&Home - Seguridad para tu hogar',
      description: 'Lista de administradores registrados',
      url: 'https://p2-31376531.onrender.com/admin/users',
      image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
    } });
    });

})


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

            contacto.create1(nombre, email, telefono, mensaje, ip, pais, new Date())
            .then( async (id) => {
                // Enviar correo
                const mailOptions = {
                from:'safeandhome06@gmail.com',
                to: 'eliannibethpadrino@gmail.com',
                subject: 'Nuevo contacto de Safe&Home',
                html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><b>Nombre:</b> ${nombre}</p>
                <p><b>email:</b> ${email}</p>
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

    const {nombre, email, servicio ,telefono, tarjeta, mes, ano, cvv, monto, moneda, fecha} = req.body;

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
            "card-number": tarjeta,
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
            const paymentResponse = await axios.post('https://fakepayment.onrender.com/payments', data,{ headers:{ Authorization: `Bearer ${process.env.fakePaymentKey}` } });
            
            await contacto.create2(nombre, email, servicio, telefono, tarjeta, mes, ano, cvv, monto, moneda, new Date());
              
                res.render('pagos', {
                  title: 'Compra del Servicio',
                  siteKey: process.env.site_key,
                  paymentResult: paymentResponse.data,
                  og: {
                    title: 'Safe&Home - Seguridad para tu hogar',
                    description: 'Solicita uno de nuestros servicios de seguridad y protección para tu hogar.',
                    url: 'https://p2-31376531.onrender.com/payments',
                    image: 'https://p2-31376531.onrender.com/images/camara2.jpg'
                  }
                });

                console.log('Pago procesado exitosamente:', paymentResponse.data);
                
            
        } catch (error: any) {
            console.error('Error en el pago:', error.response?.data || error.message);
            res.status(500).send('Error al procesar el pago');
        }
});

router.post('/login', (req: any, res: Response) => {
    const { email, password } = req.body;


    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user: users | undefined) => {
        if (err) return res.status(500).send('Error en la base de datos');
        if (!user || !user.password_hash) return res.status(401).send('Usuario o contraseña incorrectos');
        if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).send('Contraseña incorrecta');
        req.session.user = user;
        res.redirect('/adminMenu');
    });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});



export default router;