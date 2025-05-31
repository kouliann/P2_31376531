import db from './sqlite';


export default {
    create1 (nombre: string, email:string, telefono:number, mensaje:string, pais:string) {
        return new Promise((resolve, reject) => {
            const sql1 = `INSERT INTO contacto (nombre, email, telefono, mensaje, pais) VALUES (?, ?, ?, ?, ?)`;

            db.run(sql1, [nombre, email, telefono, mensaje, pais], function (error) {
                if (error) reject(error);
            else resolve(this.lastID);
            });
        });
    },

    create2 (nombre: string, email:string, telefono:number, direccion:string, tarjeta:number, mes:Date, ano:Date, cvv:number, monto:number, moneda:string) {
        return new Promise((resolve, reject) => {
            const sql2 = `INSERT INTO pagos (nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.run(sql2, [nombre, email, telefono, direccion, tarjeta, mes, ano, cvv, monto, moneda], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        })             

    }
}
