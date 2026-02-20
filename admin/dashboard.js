// =============================================
// ADMIN — Dashboard
// =============================================

const adminDashboard = {
    data() {
        return {
            stats: {
                alumnosActivos: 0, alumnosTotal: 0,
                docentesActivos: 0,
                materiasHabilitadas: 0, materiasTotal: 0,
                inscripcionesTotal: 0
            },
            cargando: true,
            mostrarSolicitudes: false,
            solicitudesPendientes: []
        };
    },
    async mounted() { await this.cargar(); },
    methods: {
        async cargar() {
            this.cargando = true;
            try {
                const [alumnos, docentes, materias, inscripciones, periodos, solicitudes] = await Promise.all([
                    db.alumnos.toArray(),
                    db.docentes.toArray(),
                    db.materias.toArray(),
                    db.inscripciones.toArray(),
                    db.periodos.toArray(),
                    db.solicitudes.where('estado').equals('pendiente').toArray()
                ]);

                this.stats.alumnosTotal     = alumnos.length;
                this.stats.alumnosActivos   = alumnos.filter(a => (a.estado || 'activo') === 'activo').length;
                this.stats.docentesActivos  = docentes.filter(d => (d.estado || 'activo') === 'activo').length;
                this.stats.materiasTotal    = materias.length;
                this.stats.materiasHabilitadas = materias.filter(m => (m.estado || 'habilitada') === 'habilitada').length;
                this.stats.inscripcionesTotal  = inscripciones.length;
                this.periodoActual = periodos.find(p => p.estado === 'abierto') || null;
                
                this.solicitudesPendientes = solicitudes;
            } finally {
                this.cargando = false;
            }
        },
        async depurarUsuarios() {
            // ... (código existente) ...
            alertify.confirm('Depurar Usuarios Fantasmas', 'Esta acción buscará y eliminará usuarios que quedaron huérfanos (sin perfil de Alumno o Docente asociado) debido a pruebas anteriores. ¿Deseas continuar?', async () => {
                let eliminados = 0;
                const usuarios = await db.usuarios.toArray();
                
                for (const u of usuarios) {
                    if (u.rol === 'Admin') continue;

                    let existe = false;
                    if (u.rol === 'Alumno') {
                        const porCodigo = u.codigo ? await db.alumnos.where('codigo').equalsIgnoreCase(u.codigo).count() : 0;
                        const porNombre = await db.alumnos.where('nombre').equalsIgnoreCase(u.username).count();
                        existe = (porCodigo > 0 || porNombre > 0);
                    } else if (u.rol === 'Docente') {
                        const porCodigo = u.codigo ? await db.docentes.where('codigo').equalsIgnoreCase(u.codigo).count() : 0;
                        const porNombre = await db.docentes.where('nombre').equalsIgnoreCase(u.username).count();
                        existe = (porCodigo > 0 || porNombre > 0);
                    }

                    if (!existe) {
                        await db.usuarios.delete(u.id);
                        eliminados++;
                    }
                }
                
                if (eliminados > 0) {
                    alertify.success(`Se eliminaron ${eliminados} usuarios fantasmas.`);
                } else {
                    alertify.message('No se encontraron usuarios fantasmas. Todo limpio.');
                }
            }, () => {}).set('labels', {ok:'Sí, Depurar', cancel:'Cancelar'});
        },
        verSolicitudes() {
            this.mostrarSolicitudes = !this.mostrarSolicitudes;
            if (this.mostrarSolicitudes) {
                // Recargar solicitudes para asegurar datos frescos
                db.solicitudes.where('estado').equals('pendiente').toArray().then(s => this.solicitudesPendientes = s);
            }
        },
        async aprobarSolicitud(solicitud) {
            // 1. Buscar si ya existe el perfil
            let perfil = null;
            let collection = null;

            if (solicitud.tipo === 'Alumno') {
                collection = db.alumnos;
                perfil = await collection.where('codigo').equalsIgnoreCase(solicitud.codigo).first();
            } else {
                collection = db.docentes;
                perfil = await collection.where('codigo').equalsIgnoreCase(solicitud.codigo).first();
            }

            // 2. Generar Token
            const prefix = solicitud.tipo === 'Alumno' ? 'ALU-' : 'DOC-';
            const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
            const token = `${prefix}${randomPart}`;

            // 3. Lógica: Vincular o Crear
            if (perfil) {
                // Caso A: Existe -> Actualizar (Vincular)
                if (!confirm(`El perfil para ${solicitud.nombre} (${solicitud.codigo}) YA EXISTE. \n\n¿Deseas actualizar su token de acceso?`)) return;
                
                if (solicitud.tipo === 'Alumno') {
                    await db.alumnos.update(perfil.idAlumno, { tokenAcceso: token });
                } else {
                    await db.docentes.update(perfil.idDocente, { tokenAcceso: token });
                }

            } else {
                // Caso B: No Existe -> Crear Nuevo
                if (!confirm(`El perfil con código ${solicitud.codigo} NO EXISTE en la base de datos. \n\n¿Deseas CREAR un nuevo perfil para ${solicitud.nombre} y generarle el token?`)) return;

                if (solicitud.tipo === 'Alumno') {
                    await db.alumnos.add({
                        codigo: solicitud.codigo,
                        nombre: solicitud.nombre,
                        carrera: '', carreraId: '', // Se llenarán después
                        estado: 'activo',
                        tokenAcceso: token,
                        email: '', telefono: '', direccion: '', foto: ''
                    });
                } else {
                    await db.docentes.add({
                        codigo: solicitud.codigo,
                        nombre: solicitud.nombre,
                        especialidad: '', // Se llenará después
                        estado: 'activo',
                        tokenAcceso: token,
                        email: '', telefono: '', foto: ''
                    });
                }
            }

            // 4. Borrar solicitud y notificar
            await db.solicitudes.delete(solicitud.id);
            this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.id !== solicitud.id);

            alertify.alert('Solicitud Procesada', `
                <div class="text-center">
                    <div class="mb-3">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                    </div>
                    <p class="mb-2">El token para <b>${solicitud.nombre}</b> es:</p>
                    <h2 class="text-primary fw-bold my-3 user-select-all">${token}</h2>
                    <p class="mb-0 text-muted small">Cópialo y envíalo al usuario para que pueda registrarse.</p>
                </div>
            `);
        }
    },
    template: `
        <div>
            <div class="d-flex align-items-center mb-4 border-bottom pb-2">
                <i class="bi bi-speedometer2 me-2 fs-5 text-secondary"></i>
                <h5 class="mb-0 fw-semibold">Dashboard</h5>
                <button class="btn btn-sm btn-outline-secondary ms-auto" @click="cargar">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
            </div>

            <div v-if="cargando" class="text-center py-5">
                <div class="spinner-border text-secondary"></div>
            </div>

            <div v-else>
                <!-- Período activo -->
                <div class="alert d-flex align-items-center gap-3 mb-4"
                     :class="periodoActual ? 'alert-success' : 'alert-warning'">
                    <i :class="periodoActual ? 'bi bi-calendar-check-fill' : 'bi bi-calendar-x-fill'" class="fs-4"></i>
                    <div>
                        <div class="fw-semibold">
                            {{ periodoActual ? 'Período de matrícula ABIERTO' : 'Sin período de matrícula activo' }}
                        </div>
                        <small v-if="periodoActual">
                            Ciclo {{ periodoActual.ciclo }} — {{ periodoActual.año }}
                        </small>
                        <small v-else>Ve a <strong>Períodos</strong> para abrir uno.</small>
                    </div>
                </div>

                <!-- Cards de estadísticas -->
                <div class="row g-3 mb-4">
                    <div class="col-sm-6 col-xl-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                                         style="width:48px;height:48px;background:#e8f0fe;">
                                        <i class="bi bi-person-badge text-primary fs-5"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold fs-4 lh-1">{{ stats.alumnosActivos }}</div>
                                        <div class="text-muted small">Alumnos activos</div>
                                    </div>
                                </div>
                                <div class="mt-2 text-muted" style="font-size:.75rem;">
                                    {{ stats.alumnosTotal - stats.alumnosActivos }} inactivos · {{ stats.alumnosTotal }} total
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                                         style="width:48px;height:48px;background:#e6f4ea;">
                                        <i class="bi bi-person-workspace text-success fs-5"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold fs-4 lh-1">{{ stats.docentesActivos }}</div>
                                        <div class="text-muted small">Docentes activos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                                         style="width:48px;height:48px;background:#fff3cd;">
                                        <i class="bi bi-book text-warning fs-5"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold fs-4 lh-1">{{ stats.materiasHabilitadas }}</div>
                                        <div class="text-muted small">Materias habilitadas</div>
                                    </div>
                                </div>
                                <div class="mt-2 text-muted" style="font-size:.75rem;">
                                    {{ stats.materiasTotal }} registradas en total
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                                         style="width:48px;height:48px;background:#fce8f3;">
                                        <i class="bi bi-pencil-square text-danger fs-5"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold fs-4 lh-1">{{ stats.inscripcionesTotal }}</div>
                                        <div class="text-muted small">Inscripciones totales</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Accesos Rápidos y Mantenimiento -->
                <div class="row mb-4">
                    <div class="col-md-12">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body p-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <h5 class="card-title fw-bold text-secondary mb-1">Mantenimiento Global</h5>
                                    <p class="text-muted small mb-0">Herramientas & Solicitudes pendientes.</p>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-primary" @click="verSolicitudes">
                                        <i class="bi bi-envelope-paper me-2"></i>Ver Solicitudes
                                    </button>
                                    <button class="btn btn-outline-danger" @click="depurarUsuarios">
                                        <i class="bi bi-tools me-2"></i>Depurar Usuarios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sección de Solicitudes Pendientes (Toggle) -->
                <div v-if="mostrarSolicitudes" class="row mb-4 animate__animated animate__fadeIn">
                    <div class="col-12">
                        <div class="card border-primary shadow-sm bg-primary bg-opacity-10">
                            <div class="card-header bg-transparent border-primary border-opacity-25 fw-bold text-primary d-flex justify-content-between align-items-center">
                                <span><i class="bi bi-envelope-paper me-2"></i>Solicitudes de Token Pendientes</span>
                                <button class="btn btn-sm btn-close" @click="mostrarSolicitudes = false"></button>
                            </div>
                            <div class="card-body p-0">
                                <div v-if="solicitudesPendientes.length === 0" class="p-4 text-center text-muted">
                                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                    No hay solicitudes pendientes en este momento.
                                </div>
                                <div v-else class="list-group list-group-flush">
                                    <div v-for="s in solicitudesPendientes" :key="s.id" class="list-group-item bg-transparent d-flex justify-content-between align-items-center p-3">
                                        <div>
                                            <div class="fw-bold fs-5 text-dark">
                                                {{ s.nombre }}
                                                <span class="badge rounded-pill ms-2" :class="s.tipo === 'Docente' ? 'bg-success' : 'bg-primary'">{{ s.tipo }}</span>
                                            </div>
                                            <div class="small text-muted">
                                                <i class="bi bi-card-text me-1"></i>Código: <strong>{{ s.codigo }}</strong>
                                                <span class="mx-2">|</span>
                                                <i class="bi bi-clock me-1"></i>{{ s.fecha }}
                                            </div>
                                        </div>
                                        <button class="btn btn-success shadow-sm" @click="aprobarSolicitud(s)">
                                            <i class="bi bi-check-lg me-1"></i>Generar Token
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Jerarquía institucional -->
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-bottom fw-semibold small text-uppercase text-muted">
                        <i class="bi bi-diagram-3 me-1"></i>Flujo institucional
                    </div>
                    <div class="card-body">
                        <div class="d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            <span class="badge bg-danger fs-6 px-3 py-2">Admin</span>
                            <i class="bi bi-arrow-right text-muted"></i>
                            <span class="badge bg-success px-3 py-2">Gestiona Docentes</span>
                            <i class="bi bi-arrow-right text-muted"></i>
                            <span class="badge bg-warning text-dark px-3 py-2">Crea Materias</span>
                            <i class="bi bi-arrow-right text-muted"></i>
                            <span class="badge bg-info text-dark px-3 py-2">Abre Período</span>
                            <i class="bi bi-arrow-right text-muted"></i>
                            <span class="badge bg-primary px-3 py-2">Alumno se matricula</span>
                            <i class="bi bi-arrow-right text-muted"></i>
                            <span class="badge bg-secondary px-3 py-2">Se inscribe en materias</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};
