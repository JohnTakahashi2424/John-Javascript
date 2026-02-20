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
            periodoActual: null,
            cargando: true
        };
    },
    async mounted() { await this.cargar(); },
    methods: {
        async cargar() {
            this.cargando = true;
            try {
                const [alumnos, docentes, materias, inscripciones, periodos] = await Promise.all([
                    db.alumnos.toArray(),
                    db.docentes.toArray(),
                    db.materias.toArray(),
                    db.inscripciones.toArray(),
                    db.periodos.toArray()
                ]);

                this.stats.alumnosTotal     = alumnos.length;
                this.stats.alumnosActivos   = alumnos.filter(a => (a.estado || 'activo') === 'activo').length;
                this.stats.docentesActivos  = docentes.filter(d => (d.estado || 'activo') === 'activo').length;
                this.stats.materiasTotal    = materias.length;
                this.stats.materiasHabilitadas = materias.filter(m => (m.estado || 'habilitada') === 'habilitada').length;
                this.stats.inscripcionesTotal  = inscripciones.length;
                this.periodoActual = periodos.find(p => p.estado === 'abierto') || null;
            } finally {
                this.cargando = false;
            }
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
