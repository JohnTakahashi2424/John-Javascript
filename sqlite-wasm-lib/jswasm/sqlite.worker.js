// sqlite.worker.js

// Importar la librería nativa alojada en nuestro servidor local, en el MISMO directorio que este worker
importScripts('sqlite3.js?v=' + new Date().getTime());

let db = null;

async function inicializarBaseDeDatos() {
    try {
        console.log("[Worker] Inicializando @sqlite.org/sqlite-wasm...");
        
        // Inicializar el módulo WASM
        const sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
            // Ahora localizará sqlite3.wasm relattivo al mismo directorio
            locateFile: (file) => file + '?v=' + new Date().getTime()
        });

        console.log(`[Worker] SQLite WASM cargado a la perfección. Versión: ${sqlite3.version.libVersion}`);

        // Intentar habilitar el High-Performance SAHPool VFS (No requiere SharedArrayBuffer ni COOP/COEP)
        if (sqlite3.installOpfsSAHPoolVfs) {
            try {
                // Instala el VFS y lo hace el predeterminado para oo1.DB
                await sqlite3.installOpfsSAHPoolVfs({
                    clearOnInit: false
                });
                console.log("[Worker] OPFS SAHPool VFS activado. Procediendo a montar bbdd persistente.");
                
                // Abrimos (o creamos) la base de datos permanentemente a través de SAHPool.
                // NOTA: SAHPool rechaza los nombres con '/' inicial, debe ser nombre plano.
                db = new sqlite3.oo1.DB('db_academica.sqlite3', 'c');
                console.log("[Worker] Base de datos persistente registrada exitosamente.");
            } catch (e) {
                console.warn("[Worker] ADVERTENCIA: Entorno restrictivo para SAHPool. Intentando KVVFS (LocalStorage)...", e);
                try {
                    db = new sqlite3.oo1.DB('local', 'c', 'kvvfs');
                    console.log("[Worker] KVVFS (LocalStorage) montado con éxito.");
                } catch(e2) {
                    console.warn("[Worker] KVVFS falló. Usando memoria RAM temporal.", e2);
                    db = new sqlite3.oo1.DB(':memory:', 'c');
                }
            }
        } else {
            console.warn("[Worker] ADVERTENCIA CRÍTICA: Funciones OPFS ausentes en la build. Se usará LocalStorage (KVVFS) temporal.");
            try {
                db = new sqlite3.oo1.DB('local', 'c', 'kvvfs');
            } catch(e3) {
                db = new sqlite3.oo1.DB(':memory:', 'c');
            }
        }

        crearEstructuraTablasBase();

        postMessage({ tipo: 'init', exito: true });
    } catch (error) {
        console.error("[Worker] Error fatal al inicializar SQLite:", error);
        postMessage({ tipo: 'init', exito: false, error: error.message });
    }
}

function crearEstructuraTablasBase() {
    console.log("[Worker] Validando/Creando esquema base de datos 'db_academica'...");
    
    // Esquema de creación de base de datos desde db_academica.sql
    try {
        db.exec("BEGIN TRANSACTION;");
        db.exec(`
            CREATE TABLE IF NOT EXISTS alumnos (
                idAlumno VARCHAR(10) PRIMARY KEY,
                codigo VARCHAR(15) UNIQUE NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                direccion VARCHAR(200),
                email VARCHAR(100),
                telefono VARCHAR(15)
            );
            CREATE TABLE IF NOT EXISTS materias (
                idMateria VARCHAR(10) PRIMARY KEY,
                codigo VARCHAR(15) UNIQUE NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                uv INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS docentes (
                idDocente VARCHAR(10) PRIMARY KEY,
                codigo VARCHAR(15) UNIQUE NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                direccion VARCHAR(200),
                email VARCHAR(100),
                telefono VARCHAR(15),
                escalafon VARCHAR(50)
            );
            CREATE TABLE IF NOT EXISTS matriculas (
                idMatricula VARCHAR(10) PRIMARY KEY,
                idAlumno VARCHAR(10) NOT NULL,
                ciclo VARCHAR(20) NOT NULL,
                fecha VARCHAR(20) NOT NULL,
                pago DECIMAL(10,2),
                FOREIGN KEY (idAlumno) REFERENCES alumnos(idAlumno) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS inscripciones (
                idInscripcion VARCHAR(10) PRIMARY KEY,
                idAlumno VARCHAR(10) NOT NULL,
                idMateria VARCHAR(10) NOT NULL,
                ciclo VARCHAR(20) NOT NULL,
                fecha VARCHAR(20) NOT NULL,
                FOREIGN KEY (idAlumno) REFERENCES alumnos(idAlumno) ON DELETE CASCADE,
                FOREIGN KEY (idMateria) REFERENCES materias(idMateria) ON DELETE CASCADE
            );
        `);
        db.exec("COMMIT;");
        console.log("[Worker] Estructura creada correctamente.");
    } catch (error) {
        if(db) db.exec("ROLLBACK;");
        console.error("[Worker] Error creando tablas:", error);
        throw error;
    }
}

// Interceptor de Mensajes (El único puerto de comunicación CRUD)
self.onmessage = async (evento) => {
    const { id, accion, sql, parametros } = evento.data;

    if (accion === 'ejecutar_sql') {
        try {
            if (!db) throw new Error("Base de datos OPFS no disponible.");

            let resultados = [];
            // rowMode: 'object' convierte las filas (row) de arrays a objetos JS literales {columna: valor}
            db.exec({
                sql: sql,
                bind: parametros || [],
                rowMode: 'object',
                resultRows: resultados
            });

            // Devolver Promesa/Mensaje completo
            postMessage({ id, exito: true, datos: resultados });
        } catch (error) {
            postMessage({ id, exito: false, error: error.message });
        }
    }
};

// Disparador principal de arranque
inicializarBaseDeDatos();
