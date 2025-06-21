import db from './sqlite';


export default {
    create1(nombre: string, email: string,telefono: number, mensaje: string, ip:any, pais: string, fecha: Date) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO contacto (nombre, email,telefono, mensaje, ip, pais, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [nombre, email, telefono, mensaje, ip, pais, fecha], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        });
    },

    create2(nombre: string, email: string, servicio:string, telefono: number, tarjeta: number, mes: number, ano: number, cvv: number, monto: number, moneda: string, fecha: Date) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO pagos (nombre, email, servicio, telefono, tarjeta, mes, ano, cvv, monto, moneda, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.run(sql, [nombre, email, servicio,telefono, tarjeta, mes, ano, cvv, monto, moneda, fecha], function (error) {
                if (error) reject(error);
                else resolve(this.lastID);
            });
        });
    },

    create3 (email: string, password_hash:string, created_at:Date) {
        return new Promise((resolve, reject) => {
            const sql3 = `INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)`;

            db.run(sql3, [email, password_hash, created_at], function (error) {
                if (error) reject(error);
            else resolve(this.lastID);
            });
        });
    },
}
