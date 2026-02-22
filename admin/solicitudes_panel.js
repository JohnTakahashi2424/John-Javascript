// =============================================
// ADMIN — Gestión de Solicitudes de Registro
// Procesa el pre-registro y genera carnet único
// =============================================

const solicitudesAdmin = {
    data() {
        return {
            solicitudes: [],
            carrerasMatch: {},
            cargando: false,
            procesando: null
        };
    },
    async mounted() {
        await this.cargar();
    },
    methods: {
        async cargar() {
            this.cargando = true;
            try {
                this.solicitudes = await db.solicitudes.where('estado').equals('pendiente').toArray();
                const carrs = await db.carreras.toArray();
                this.carrerasMatch = carrs.reduce((acc, c) => {
                    acc[c.idCarrera] = c;
                    return acc;
                }, {});
            } catch (e) {
                alertify.error('Error al cargar solicitudes: ' + e.message);
            } finally {
                this.cargando = false;
            }
        },

        async aprobar(sol) {
            alertify.confirm('Aprobar Registro', `¿Confirmar la aprobación de <b>${sol.username}</b> como ${sol.tipo}? Se generará su carnet oficial automáticamente.`,
            async () => {
                this.procesando = sol.id;
                try {
                    const año = new Date().getFullYear();
                    let nuevoCarnet = '';

                    if (sol.tipo === 'Alumno') {
                        const carrera = this.carrerasMatch[sol.carreraId];
                        const codCarrera = carrera ? carrera.codigo : 'XXX';
                        
                        // Calcular correlativo
                        const prefijo = `${año}-${codCarrera}-`;
                        const alumnosAño = await db.alumnos
                            .filter(a => a.carnet && a.carnet.startsWith(prefijo))
                            .toArray();
                        
                        let ultimoNum = 0;
                        alumnosAño.forEach(a => {
                            const num = parseInt(a.carnet.split('-')[2]);
                            if (num > ultimoNum) ultimoNum = num;
                        });

                        const correlativo = (ultimoNum + 1).toString().padStart(5, '0');
                        nuevoCarnet = `${prefijo}${correlativo}`;

                    } else {
                        // Docente: DOC-AÑO-CORRELATIVO
                        const prefijo = `DOC-${año}-`;
                        const docentesAño = await db.docentes
                            .filter(d => d.carnet && d.carnet.startsWith(prefijo))
                            .toArray();

                        let ultimoNum = 0;
                        docentesAño.forEach(d => {
                            const num = parseInt(d.carnet.split('-')[2]);
                            if (num > ultimoNum) ultimoNum = num;
                        });

                        const correlativo = (ultimoNum + 1).toString().padStart(3, '0');
                        nuevoCarnet = `${prefijo}${correlativo}`;
                    }

                    // 1. Crear Usuario
                    const usuarioId = await db.usuarios.add({
                        username: sol.username,
                        email: sol.email,
                        hashPwd: sol.hashPwd,
                        rol: sol.tipo,
                        carnet: nuevoCarnet,
                        estado: 'activo'
                    });

                    // 2. Crear Perfil (Alumno o Docente)
                    if (sol.tipo === 'Alumno') {
                        await db.alumnos.add({
                            carnet: nuevoCarnet,
                            nombre: sol.nombre || sol.username,
                            usuarioId: usuarioId,
                            carreraId: sol.carreraId || '',
                            sexo: sol.sexo,
                            añoIngreso: año,
                            estado: 'activo'
                        });
                    } else {
                        await db.docentes.add({
                            carnet: nuevoCarnet,
                            nombre: sol.nombre || sol.username,
                            usuarioId: usuarioId,
                            especialidad: '',
                            sexo: sol.sexo,
                            añoIngreso: año,
                            estado: 'activo'
                        });
                    }

                    // 3. Marcar solicitud como aprobada
                    await db.solicitudes.update(sol.id, { estado: 'aprobado' });

                    alertify.success(`Registro aprobado. Carnet generado: <b>${nuevoCarnet}</b>`);
                    await this.cargar();

                } catch (e) {
                    alertify.error('Error al procesar: ' + e.message);
                } finally {
                    this.procesando = null;
                }
            }, null);
        },

        async rechazar(sol) {
            alertify.confirm('Rechazar Solicitud', `¿Estás seguro de rechazar la solicitud de ${sol.username}?`,
            async () => {
                await db.solicitudes.update(sol.id, { estado: 'rechazado' });
                alertify.warning('Solicitud rechazada');
                await this.cargar();
            }, null);
        }
    },
    template: `
        <div class="card shadow-sm border-0">
            <div class="card-header bg-danger bg-opacity-10 py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold text-danger"><i class="bi bi-person-plus-fill me-2"></i>Solicitudes de Registro Pendientes</h5>
                <button class="btn btn-sm btn-outline-danger" @click="cargar" :disabled="cargando">
                    <i class="bi bi-refresh me-1" :class="{'spinner-border spinner-border-sm': cargando}"></i> Actualizar
                </button>
            </div>
            <div class="card-body p-0">
                <div v-if="cargando && !solicitudes.length" class="p-5 text-center">
                    <div class="spinner-border text-danger" role="status"></div>
                </div>
                <div v-else-if="!solicitudes.length" class="p-5 text-center text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                    No hay solicitudes pendientes en este momento.
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-body-tertiary">
                            <tr>
                                <th class="ps-4">Usuario / Email</th>
                                <th>Tipo / Rol</th>
                                <th>Género</th>
                                <th>Carrera (si aplica)</th>
                                <th>Fecha Solicitud</th>
                                <th class="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="sol in solicitudes" :key="sol.id">
                                <td class="ps-4">
                                    <div class="fw-bold">{{ sol.username }}</div>
                                    <div class="small text-muted">{{ sol.email }}</div>
                                </td>
                                <td>
                                    <span class="badge" :class="sol.tipo==='Alumno' ? 'bg-primary' : 'bg-success'">
                                        {{ sol.tipo }}
                                    </span>
                                </td>
                                <td>{{ sol.sexo }}</td>
                                <td>
                                    <span v-if="sol.tipo==='Alumno'" class="small">
                                        {{ carrerasMatch[sol.carreraId] ? carrerasMatch[sol.carreraId].nombre : 'No especificada' }}
                                    </span>
                                    <span v-else class="text-muted">—</span>
                                </td>
                                <td class="small">{{ sol.fecha }}</td>
                                <td class="text-end pe-4">
                                    <div class="btn-group shadow-sm">
                                        <button class="btn btn-sm btn-success" @click="aprobar(sol)" :disabled="procesando === sol.id">
                                            <i class="bi bi-check-circle me-1"></i> Aprobar
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" @click="rechazar(sol)" :disabled="procesando === sol.id">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};
