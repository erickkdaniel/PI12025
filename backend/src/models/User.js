// models/User.js
const db = require('../config/db');

class User {
    constructor(carnetID, nombres, apellidos, correo, pass) {
        this.carnetID = parseInt(carnetID)
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.pass = pass;
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM user');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
        return rows[0];
    }

    static async findByCarnet(carnet_id) {
        const [rows] = await db.query('SELECT * FROM user WHERE REGISTRO_ACADEMICO = ?', [carnet_id]);
        return rows[0];
    }

    static async getByEmail(correo) {
        const [rows] = await db.query('SELECT * FROM user WHERE correo_electronico = ?', [correo]);
        return rows[0];
    }

    static async getCredentialsByEmail(correo) {
        const [rows] = await db.query('SELECT correo_electronico, contraseña FROM user WHERE correo_electronico = ?', [correo]);
        return rows[0];
    }

    async save() {
        try {
            const [result] = await db.query(
                'INSERT INTO user (REGISTRO_ACADEMICO, NOMBRES, APELLIDOS, CONTRASEÑA, CORREO_ELECTRONICO) VALUES (?, ?, ?, ?, ?)',
                [this.carnetID, this.nombres, this.apellidos, this.pass, this.correo ]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            throw new Error('Error al guardar el usuario');
        }
    }

    static async update(id, userData) {
        const { carnetID, nombres, apellidos, correo: correo_electronico } = userData;
        const [result] = await db.query(
            'UPDATE user SET REGISTRO_ACADEMICO = ?, nombres = ?, apellidos = ?, correo_electronico = ? WHERE id = ?',
            [carnetID, nombres, apellidos, correo_electronico, id]
        );

        if (result.affectedRows === 0) {
            throw new Error('User not found or no changes made');
        }

        return { message: 'User updated successfully' };
    }

    static async delete(id) {
        await db.query('DELETE FROM user WHERE ID = ?', [id]);
    }

    static async delete_by_carnet_id(carnet_id) {
        await db.query('DELETE FROM user WHERE REGISTRO_ACADEMICO = ?', [carnet_id])
    }

    static async resetPassword(carnet_id, correo, new_pass) {
        const query = `
        UPDATE user 
        SET contraseña = ? 
        WHERE REGISTRO_ACADEMICO = ? AND correo_electronico = ?
        `;
        const [result] = await db.query(query, [new_pass, carnet_id, correo]);
        if (result.affectedRows === 0) {
            throw new Error('User not found and password not updated');
        }

        return { message: 'Password updated successfully' };
    }
}

module.exports = User;
