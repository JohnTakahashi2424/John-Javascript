// Database.js

/**
 * Singleton de Comunicación con el Web Worker de SQLite (OPFS)
 * Este es el ÚNICO punto de contacto para ejecutar consultas a la Base de Datos.
 */
class DatabaseService {
    constructor() {
        this.worker = new Worker(`sqlite-wasm-lib/jswasm/sqlite.worker.js?v=${new Date().getTime()}`);
        this.messageIdCounter = 0;
        this.callbacks = new Map();

        // Promesa principal de inicialización que los componentes pueden esperar (await Database.init())
        this.initPromise = new Promise((resolve, reject) => {
            this.callbacks.set('init', { resolve, reject });
            
            // Listener maestro de respuestas del Worker
            this.worker.onmessage = (evento) => {
                const data = evento.data;
                
                // Mensaje especial de inicialización
                if (data.tipo === 'init') {
                    const cb = this.callbacks.get('init');
                    if (data.exito) {
                        console.log("[Main] Database Service listo y conectado con OPFS.");
                        cb.resolve();
                    } else {
                        console.error("[Main] Falló la inicialización de la Base de Datos.", data.error);
                        cb.reject(new Error(data.error));
                    }
                    this.callbacks.delete('init');
                } 
                // Mensajes de queries CRUD normales
                else if (data.id && this.callbacks.has(data.id)) {
                    const cb = this.callbacks.get(data.id);
                    if (data.exito) {
                        cb.resolve(data.datos);
                    } else {
                        cb.reject(new Error(data.error));
                    }
                    this.callbacks.delete(data.id);
                }
            };

            // Capturar errores a nivel de script del worker (ej. Error cargando el archivo importScripts)
            this.worker.onerror = (err) => {
                console.error("[Main] Error de red o compilación en Web Worker:", err.message);
                const cb = this.callbacks.get('init');
                if (cb) {
                    cb.reject(new Error("Error conectando con el Web Worker: " + err.message));
                    this.callbacks.delete('init');
                }
            };
        });
    }

    /**
     * Espera a que la base de datos esté montada y las tablas listas.
     */
    async iniciar() {
        return this.initPromise;
    }

    /**
     * Ejecuta una consulta SQL en el Web Worker y devuelve los resultados.
     * @param {string} sql La sentencia SQL pura (ej. SELECT * FROM alumnos).
     * @param {Array} parametros Parámetros bindeados p/ seguridad [valor1, valor2].
     * @returns {Promise<Array>} El array de resultados u objetos insertados.
     */
    query(sql, parametros = []) {
        return new Promise((resolve, reject) => {
            const id = `req_${++this.messageIdCounter}`;
            this.callbacks.set(id, { resolve, reject });

            this.worker.postMessage({
                id,
                accion: 'ejecutar_sql',
                sql,
                parametros
            });
        });
    }
}

// Exportar como Singleton global
const Database = new DatabaseService();
