const db = require('../config/db');

class Publication {
    constructor(fecha_creacion, contenido, propietario){
        this.fecha_creacion = fecha_creacion;
        this.contenido = contenido;
        this.propietario = propietario;
    }

    static async getAllPublications() {
        const query = `
        SELECT 
            p.id_publicacion, 
            p.fecha_creacion, 
            p.mensaje AS contenido, 
            CONCAT(u.nombres, ' ', u.apellidos) AS propietario,
            GROUP_CONCAT(DISTINCT CONCAT(c.nombres, ' ', c.apellidos) SEPARATOR ', ') AS catedraticos,
            GROUP_CONCAT(DISTINCT cu.nombre SEPARATOR ', ') AS cursos
        FROM 
            Publicaciones p
        JOIN 
            User u ON p.id_usuario = u.ID
        LEFT JOIN 
            Catedraticos c ON p.id_catedratico = c.id_catedratico
        LEFT JOIN 
            Cursos cu ON p.id_curso = cu.id_curso
        GROUP BY 
            p.id_publicacion, p.fecha_creacion, p.mensaje, u.nombres, u.apellidos;
    `;

        const [rows] = await db.query(query);
        return rows;
    }

    async save() {
        try {
            const [result] = await db.query(
                'INSERT INTO Publicaciones (id_usuario, tipo, id_curso, id_catedratico, mensaje, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)',
                [this.id_usuario, this.tipo, this.id_curso, this.id_catedratico, this.mensaje, this.fecha_creacion]
            );
            return result.insertId;
        } catch (error) {
            console.log(error);
            console.error('Error al guardar la publicación:', error);
            throw new Error('Error al guardar la publicación');
        }
    }

    async createPublicationCatedratico(catedraticoId) {
        try {
            const publication_id = this.save();
            const [result] = await db.query(
                'INSERT INTO publicacion_catedratico (publicacion_id, catedratico_id) VALUES (?, ?)',
                [publication_id , catedraticoId]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al agregar el catedrático a la publicación:', error);
            throw new Error('Error al agregar el catedrático a la publicación');
        }
    }

    async createPublicationCurso(cursoId) {
        try {
            const publication_id = this.save();
            const [result] = await db.query(
                'INSERT INTO publicacion_curso (publicacion_id, curso_id) VALUES (?, ?)',
                [publication_id , cursoId]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al agregar el curso a la publicación:', error);
            throw new Error('Error al agregar el curso a la publicación');
        }
    }

    static async getAllPublicationCursos() {
        const query = `
    SELECT 
        p.id_publicacion,
        p.fecha_creacion,
        p.mensaje AS contenido,
        CONCAT(u.nombres, ' ', u.apellidos) AS propietario,
        cu.nombre AS nombre_curso
    FROM 
        Publicaciones p
    LEFT JOIN 
        Cursos cu ON p.id_curso = cu.id_curso
    LEFT JOIN 
        USER u ON p.id_usuario = u.ID;
`;

        const [rows] = await db.query(query);
        return rows;
    }

    static async getAllPublicationCatedraticos() {
        const query = `
            SELECT 
                p.id,
                p.fecha_creacion,
                p.contenido,
                CONCAT(u.nombres, ' ', u.apellidos) AS propietario,
                c.nombres,
                c.apellidos
            FROM 
                publicaciones p
            LEFT JOIN 
                publicacion_catedratico pc ON p.id = pc.publicacion_id
            LEFT JOIN 
                catedraticos c ON pc.catedratico_id = c.id
            LEFT JOIN 
                USER u ON p.propietario = u.ID
        `;

        const [rows] = await db.query(query);
        return rows;
    }

    static async getPublicationByCursoName(cursoName) {
        const query = `
            SELECT 
                p.id,
                p.fecha_creacion,
                p.contenido,
                CONCAT(u.nombres, ' ', u.apellidos) AS propietario
            FROM 
                publicaciones p
            LEFT JOIN 
                publicacion_curso pc ON p.id = pc.publicacion_id
            LEFT JOIN 
                cursos cu ON pc.curso_id = cu.id
            LEFT JOIN 
                USER u ON p.propietario = u.ID
            WHERE 
                cu.nombre_curso LIKE ?
        `;
        const searchPattern = `%${cursoName}%`;
        const [rows] = await db.query(query, [searchPattern]);
        return rows;
    }

    static async getPublicationByCatedraticoName(catedraticoName) {
        const query = `
            SELECT 
                p.id,
                p.fecha_creacion,
                p.contenido,
                CONCAT(u.nombres, ' ', u.apellidos) AS propietario
            FROM 
                publicaciones p
            LEFT JOIN 
                publicacion_catedratico pc ON p.id = pc.publicacion_id
            LEFT JOIN 
                catedraticos c ON pc.catedratico_id = c.id
            LEFT JOIN 
                USER u ON p.propietario = u.ID
            WHERE 
                c.nombres LIKE ? OR c.apellidos LIKE ?
        `;
        const searchPattern = `%${catedraticoName}%`;
        const [rows] = await db.query(query, [searchPattern, searchPattern]);
        return rows;
    }
}

module.exports = Publication;