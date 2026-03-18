class DBService {
    constructor() {
        this.worker = new Worker('db_worker.js');
        this.messageId = 0;
        this.callbacks = new Map();
        
        this.initPromise = new Promise((resolve, reject) => {
            this.callbacks.set('init', { resolve, reject });
            
            this.worker.onmessage = (e) => {
                const data = e.data;
                
                if (data.type === 'init') {
                    if (data.success) {
                        console.log("DBService: Inicialización completada.");
                        this.callbacks.get('init').resolve();
                    } else {
                        console.error("DBService: Falló la inicialización.", data.error);
                        this.callbacks.get('init').reject(data.error);
                    }
                    this.callbacks.delete('init');
                } else if (data.id && this.callbacks.has(data.id)) {
                    const cb = this.callbacks.get(data.id);
                    if (data.success) {
                        cb.resolve(data.results);
                    } else {
                        cb.reject(new Error(data.error));
                    }
                    this.callbacks.delete(data.id);
                }
            };
        });
    }

    async init() {
        return this.initPromise;
    }

    /**
     * Ejecuta una consulta SQL genérica.
     * @param {string} sql La sentencia SQL.
     * @param {Array} params Lista de parámetros (opcional).
     * @returns {Promise<Array>} Array de objetos con los resultados.
     */
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            const id = `msg_${++this.messageId}`;
            this.callbacks.set(id, { resolve, reject });
            
            this.worker.postMessage({
                id,
                action: 'query',
                sql,
                params
            });
        });
    }

    /**
     * Ejecuta múltiples consultas en una sola transacción.
     * Útil para migraciones o inserciones masivas.
     * @param {Array} queries Array de objetos [{sql: "", params: []}]
     */
    transaction(queries) {
        return new Promise((resolve, reject) => {
            const id = `msg_${++this.messageId}`;
            this.callbacks.set(id, { resolve, reject });
            
            this.worker.postMessage({
                id,
                action: 'transaction',
                queries
            });
        });
    }
}

// Singleton accesible globalmente
const dbService = new DBService();
