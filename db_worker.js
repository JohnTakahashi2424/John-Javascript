importScripts('sqlite-wasm-lib/jswasm/sqlite3.js');

let db = null;

async function initDb() {
    try {
        console.log("Inicializando SQLite WASM...");
        const sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });
        
        console.log("SQLite WASM cargado. Versión:", sqlite3.version.libVersion);
        
        // Determinar si OPFS está disponible
        if ('opfs' in sqlite3.oo1.OpfsDb.prototype) {
            console.log("OPFS VFS está soportado.");
        } else {
            console.warn("OPFS VFS NO está soportado en este entorno. Se usarán tipos de almacenamiento efímeros o alternativos.");
        }

        // Abrir la base de datos usando OPFS
        try {
            db = new sqlite3.oo1.OpfsDb('/db_academica.sqlite3');
            console.log("Base de datos OPFS abierta con éxito.");
        } catch (e) {
            console.error("Error abriendo OPFS Db, usando base de datos en memoria p/ fallback.", e);
            db = new sqlite3.oo1.DB('/db_academica.sqlite3', 'c');
        }

        // Crear tablas si no existen basadas en db_academica.sql
        db.exec(`
            CREATE TABLE IF NOT EXISTS alumnos (
                idAlumno VARCHAR(10) PRIMARY KEY,
                codigo VARCHAR(15),
                nombre VARCHAR(100),
                direccion VARCHAR(200),
                email VARCHAR(100),
                telefono VARCHAR(15)
            );
            CREATE TABLE IF NOT EXISTS materias (
                idMateria VARCHAR(10) PRIMARY KEY,
                codigo VARCHAR(15),
                nombre VARCHAR(100),
                uv INTEGER
            );
            CREATE TABLE IF NOT EXISTS docentes (
                idDocente VARCHAR(10) PRIMARY KEY,
                codigo VARCHAR(15),
                nombre VARCHAR(100),
                direccion VARCHAR(200),
                email VARCHAR(100),
                telefono VARCHAR(15),
                escalafon VARCHAR(50)
            );
            CREATE TABLE IF NOT EXISTS matriculas (
                idMatricula VARCHAR(10) PRIMARY KEY,
                idAlumno VARCHAR(10),
                ciclo VARCHAR(20),
                fecha VARCHAR(20),
                pago DECIMAL(10,2)
            );
            CREATE TABLE IF NOT EXISTS inscripciones (
                idInscripcion VARCHAR(10) PRIMARY KEY,
                idAlumno VARCHAR(10),
                idMateria VARCHAR(10),
                ciclo VARCHAR(20),
                fecha VARCHAR(20)
            );
        `);

        console.log("Tablas verificadas/creadas correctamente.");
        postMessage({ type: 'init', success: true });
    } catch (err) {
        console.error("Error inicializando SQLite:", err);
        postMessage({ type: 'init', success: false, error: err.message });
    }
}

self.onmessage = async function(e) {
    const { id, action, sql, params } = e.data;
    
    if (action === 'query') {
        try {
            if (!db) throw new Error("Database no inicializada");
            
            let results = [];
            // rowMode: 'object' devuelve resultados como un array de objetos (columnName: value)
            db.exec({
                sql: sql,
                bind: params || [],
                rowMode: 'object',
                resultRows: results
            });
            postMessage({ id, success: true, results });
        } catch (err) {
            postMessage({ id, success: false, error: err.message });
        }
    } else if (action === 'transaction') {
        // Enviar un array de objetos con { sql, params }
        try {
            if (!db) throw new Error("Database no inicializada");
            const queries = e.data.queries;
            
            db.exec("BEGIN TRANSACTION;");
            for (let q of queries) {
                db.exec({ sql: q.sql, bind: q.params || [] });
            }
            db.exec("COMMIT;");
            
            postMessage({ id, success: true });
        } catch (err) {
            if (db) db.exec("ROLLBACK;");
            postMessage({ id, success: false, error: err.message });
        }
    }
};

initDb();
