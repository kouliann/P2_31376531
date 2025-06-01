1. Base de datos SQLite

  Usas el paquete sqlite3 para manejar la base de datos.
  El archivo de base de datos se crea en contacto.db.
  Las tablas contacto y pagos se crean automáticamente si no existen.
  Integración:
  Usas métodos como db.run, db.all, y db.get para insertar y consultar datos.
  Los modelos (contacto.ts) exponen funciones como create1 y create2 para insertar registros.
  
2. reCAPTCHA de Google

  Las claves site_key y secret_key están en tu archivo .env.
  El formulario HTML incluye el widget de reCAPTCHA usando la clave de sitio.
  Integración:
  Al recibir un POST, el backend verifica el token de reCAPTCHA con una petición a https://www.google.com/recaptcha/api/siteverify usando axios.
  Solo si la verificación es exitosa se procesa el formulario.
  
3. ipstack (Geolocalización por IP)

  La clave de API de ipstack está en tu archivo .env como ipstack_key.
  Integración:
  Al recibir un formulario de contacto, obtienes la IP del usuario y haces una petición a http://api.ipstack.com/{ip}?access_key={key}.
  El país (country_name) se guarda junto con el contacto en la base de datos.
  
4. Nodemailer (Correo electrónico)
   
  Se usa un correo de Gmail y una contraseña de aplicación, ambas en el .env.
  Integración:
  Cuando se recibe un nuevo contacto, se envía un correo con los datos usando transporter.sendMail.
  
5. FakePayment API (Pagos de prueba)

  No requiere autenticación especial, solo enviar los datos correctos.
  Integración:
  En la ruta /payments, tomas los datos del formulario y construyes un objeto con los campos exactos que la API espera:
  Envías estos datos con axios.post a https://fakepayment.onrender.com/payments.
  El resultado se muestra en la vista y, si es exitoso, también se guarda el pago en la base de datos.
