async function migrarDexieASqlite() {
    try {
        console.log("Iniciando proceso de migración de IndexedDB a SQLite WASM...");
        
        // Esperar a que SQLite esté listo
        await dbService.init();
        
        // Tablas a migrar
        const tablas = ['alumnos', 'materias', 'docentes', 'matriculas', 'inscripciones'];
        let totalRegistros = 0;
        const queries = [];
        
        for (const nombreTabla of tablas) {
            if (db && db[nombreTabla]) {
                const registros = await db[nombreTabla].toArray();
                console.log(`Leídos ${registros.length} registros de Dexie para tabla: ${nombreTabla}`);
                
                for (const reg of registros) {
                    if (nombreTabla === 'alumnos') {
                        queries.push({
                            sql: `INSERT OR REPLACE INTO alumnos (idAlumno, codigo, nombre, direccion, email, telefono) VALUES (?, ?, ?, ?, ?, ?)`,
                            params: [reg.idAlumno, reg.codigo, reg.nombre, reg.direccion, reg.email, reg.telefono]
                        });
                    } else if (nombreTabla === 'materias') {
                        queries.push({
                            sql: `INSERT OR REPLACE INTO materias (idMateria, codigo, nombre, uv) VALUES (?, ?, ?, ?)`,
                            params: [reg.idMateria, reg.codigo, reg.nombre, reg.uv]
                        });
                    } else if (nombreTabla === 'docentes') {
                        queries.push({
                            sql: `INSERT OR REPLACE INTO docentes (idDocente, codigo, nombre, direccion, email, telefono, escalafon) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            params: [reg.idDocente, reg.codigo, reg.nombre, reg.direccion, reg.email, reg.telefono, reg.escalafon]
                        });
                    } else if (nombreTabla === 'matriculas') {
                        queries.push({
                            sql: `INSERT OR REPLACE INTO matriculas (idMatricula, idAlumno, ciclo, fecha, pago) VALUES (?, ?, ?, ?, ?)`,
                            params: [reg.idMatricula, reg.idAlumno, reg.ciclo, reg.fecha, reg.pago]
                        });
                    } else if (nombreTabla === 'inscripciones') {
                        queries.push({
                            sql: `INSERT OR REPLACE INTO inscripciones (idInscripcion, idAlumno, idMateria, ciclo, fecha) VALUES (?, ?, ?, ?, ?)`,
                            params: [reg.idInscripcion, reg.idAlumno, reg.idMateria, reg.ciclo, reg.fecha]
                        });
                    }
                    totalRegistros++;
                }
            }
        }
        
        if (totalRegistros > 0) {
            console.log(`Enviando ${totalRegistros} sentencias a SQLite en una sola transacción...`);
            await dbService.transaction(queries);
            console.log("Migración completada con éxito. Los datos ahora viven en SQLite OPFS.");
            if (typeof alertify !== 'undefined') {
                alertify.success("Datos migrados exitosamente a SQLite OPFS.");
            }
        } else {
            console.log("No se encontraron registros en Dexie para migrar.");
        }
        
    } catch (error) {
        console.error("Error durante la migración:", error);
        if (typeof alertify !== 'undefined') {
            alertify.error("Error en la migración de datos.");
        }
    }
}

// Para ejecutar la migración manualmente desde la consola: migrarDexieASqlite()
window.migrarDexieASqlite = migrarDexieASqlite;
