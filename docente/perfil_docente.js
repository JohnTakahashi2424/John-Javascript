// =============================================
// Mi Perfil — Portal Docente
// =============================================
const perfilDocente = {
    data() {
        return {
            cargando: true,
            guardando: false,
            perfil: { nombre: '', email: '', telefono: '', especialidad: '', codigo: '' },
            pwd: { actual: '', nueva: '', confirmar: '', mostrarActual: false, mostrarNueva: false },
            cambiandoPwd: false,
            _userId: null,
            _docenteId: null,
        };
    },
    async mounted() { await this.cargar(); },
    methods: {
        async hashPassword(pwd) {
            const data = new TextEncoder().encode(pwd);
            const buf  = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
        },
        async cargar() {
            this.cargando = true;
            try {
                const s = JSON.parse(sessionStorage.getItem('sesionUniversidad') || '{}');
                const username = s.username || '';
                const codigo   = s.codigo   || '';

                const usuario = await db.usuarios.where('username').equals(username).first();
                if (usuario) { this._userId = usuario.id; this.perfil.email = usuario.email || ''; }

                let docente = null;
                if (codigo) docente = await db.docentes.where('codigo').equals(codigo).first();
                if (!docente && username) {
                    const todos = await db.docentes.toArray();
                    docente = todos.find(d =>
                        (d.nombre || '').toLowerCase().includes(username.toLowerCase()) ||
                        username.toLowerCase().includes((d.nombre || '').split(' ')[0].toLowerCase())
                    ) || null;
                }
                if (docente) {
                    this._docenteId  = docente.idDocente;
                    this.perfil.nombre      = docente.nombre      || '';
                    this.perfil.telefono    = docente.telefono    || '';
                    this.perfil.especialidad= docente.especialidad|| '';
                    this.perfil.codigo      = docente.codigo      || '';
                    if (!this.perfil.email) this.perfil.email = docente.email || '';
                }
            } finally { this.cargando = false; }
        },
        async guardar() {
            if (!this.perfil.nombre.trim()) { alertify.error('El nombre es obligatorio.'); return; }
            this.guardando = true;
            try {
                if (this._docenteId) {
                    await db.docentes.update(this._docenteId, {
                        nombre:       this.perfil.nombre.trim(),
                        email:        this.perfil.email.trim(),
                        telefono:     this.perfil.telefono.trim(),
                        especialidad: this.perfil.especialidad.trim(),
                    });
                }
                if (this._userId) await db.usuarios.update(this._userId, { email: this.perfil.email.trim() });
                alertify.success('✅ Perfil actualizado correctamente.');
            } catch(e) { alertify.error('Error: ' + e.message); }
            finally { this.guardando = false; }
        },
        async cambiarPassword() {
            if (!this.pwd.actual) { alertify.error('Ingresa tu contraseña actual.'); return; }
            if (this.pwd.nueva.length < 6) { alertify.error('La nueva contraseña debe tener al menos 6 caracteres.'); return; }
            if (this.pwd.nueva !== this.pwd.confirmar) { alertify.error('Las contraseñas no coinciden.'); return; }
            this.cambiandoPwd = true;
            try {
                const usuario = await db.usuarios.get(this._userId);
                const hashActual = await this.hashPassword(this.pwd.actual);
                if (!usuario || usuario.hashPwd !== hashActual) { alertify.error('Contraseña actual incorrecta.'); return; }
                const hashNueva = await this.hashPassword(this.pwd.nueva);
                await db.usuarios.update(this._userId, { hashPwd: hashNueva });
                this.pwd = { actual: '', nueva: '', confirmar: '', mostrarActual: false, mostrarNueva: false };
                alertify.success('🔑 Contraseña actualizada.');
            } catch(e) { alertify.error('Error: ' + e.message); }
            finally { this.cambiandoPwd = false; }
        }
    },
    template: `
    <div>
        <div class="d-flex align-items-center mb-3 border-bottom pb-2">
            <i class="bi bi-person-circle me-2 fs-5 text-secondary"></i>
            <h5 class="mb-0 fw-semibold">Mi Perfil</h5>
        </div>
        <div v-if="cargando" class="text-center py-5"><div class="spinner-border text-secondary"></div></div>
        <div v-else class="row g-4">
            <div class="col-lg-7">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white fw-semibold border-bottom">
                        <i class="bi bi-person me-2 text-success"></i>Datos Personales
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-sm-6">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Código de Docente</label>
                                <input :value="perfil.codigo" class="form-control form-control-sm bg-light" readonly>
                                <div class="form-text">Asignado por el administrador.</div>
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Especialidad</label>
                                <input v-model="perfil.especialidad" class="form-control form-control-sm" placeholder="Ej. Ingeniería de Software">
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Nombre completo *</label>
                                <input v-model="perfil.nombre" class="form-control form-control-sm" placeholder="Tu nombre completo">
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Correo electrónico</label>
                                <input v-model="perfil.email" type="email" class="form-control form-control-sm" placeholder="correo@ejemplo.com">
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Teléfono</label>
                                <input v-model="perfil.telefono" class="form-control form-control-sm" placeholder="7777-1234">
                            </div>
                            <div class="col-12 text-end">
                                <button class="btn btn-sm fw-semibold px-4 text-white" style="background-color:#1a5c30;"
                                        @click="guardar" :disabled="guardando">
                                    <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                                    <i v-else class="bi bi-save me-1"></i>Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white fw-semibold border-bottom">
                        <i class="bi bi-lock me-2 text-warning"></i>Cambiar Contraseña
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Contraseña actual</label>
                                <div class="input-group input-group-sm">
                                    <input v-model="pwd.actual" :type="pwd.mostrarActual?'text':'password'" class="form-control" placeholder="••••••">
                                    <button class="btn btn-outline-secondary" @click="pwd.mostrarActual=!pwd.mostrarActual">
                                        <i :class="pwd.mostrarActual?'bi bi-eye-slash':'bi bi-eye'"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Nueva contraseña</label>
                                <div class="input-group input-group-sm">
                                    <input v-model="pwd.nueva" :type="pwd.mostrarNueva?'text':'password'" class="form-control" placeholder="Mín. 6 caracteres">
                                    <button class="btn btn-outline-secondary" @click="pwd.mostrarNueva=!pwd.mostrarNueva">
                                        <i :class="pwd.mostrarNueva?'bi bi-eye-slash':'bi bi-eye'"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold text-muted text-uppercase">Confirmar nueva</label>
                                <input v-model="pwd.confirmar" type="password" class="form-control form-control-sm" placeholder="Repite">
                                <div v-if="pwd.confirmar && pwd.nueva!==pwd.confirmar" class="form-text text-danger">No coinciden.</div>
                            </div>
                            <div class="col-12 text-end">
                                <button class="btn btn-sm btn-outline-warning fw-semibold px-4"
                                        @click="cambiarPassword" :disabled="cambiandoPwd">
                                    <span v-if="cambiandoPwd" class="spinner-border spinner-border-sm me-1"></span>
                                    <i v-else class="bi bi-key me-1"></i>Cambiar contraseña
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};
