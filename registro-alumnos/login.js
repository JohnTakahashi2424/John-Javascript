// =============================================
// COMPONENTE: LOGIN / REGISTRO
// SHA-256 via Web Crypto API | sessionStorage
// =============================================

const login = {
    emits: ['login-exitoso'],
    data() {
        return {
            vista: 'login',
            mostrarPass: false,
            mostrarPassReg: false,
            mostrarPassConf: false,

            loginForm: { identificador: '', password: '' },

            regForm: {
                username: '',
                codigo: '',
                email: '',
                password: '',
                confirmar: '',
                rol: 'Alumno',
                codigoAdmin: ''
            },

            cargando: false
        };
    },
    methods: {
        async hashPassword(pwd) {
            const data = new TextEncoder().encode(pwd);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0')).join('');
        },

        // ── LOGIN ────────────────────────────────────────────────────
        async iniciarSesion() {
            const id = this.loginForm.identificador.trim();
            if (!id || !this.loginForm.password) {
                alertify.error('Por favor completa todos los campos.');
                return;
            }
            this.cargando = true;
            try {
                // Buscar por username, codigo o email (en ese orden)
                let usuario = await db.usuarios.where('username').equalsIgnoreCase(id).first();
                if (!usuario) usuario = await db.usuarios.where('codigo').equalsIgnoreCase(id).first();
                if (!usuario) usuario = await db.usuarios.where('email').equalsIgnoreCase(id).first();

                if (!usuario) {
                    alertify.error('No se encontró ninguna cuenta con ese usuario, código o correo.');
                    return;
                }

                // Verificar estado de cuenta
                if (usuario.estado === 'inactivo') {
                    alertify.error('Tu cuenta está desactivada. Contacta al administrador.');
                    return;
                }

                const hashIngresado = await this.hashPassword(this.loginForm.password);
                if (hashIngresado !== usuario.hashPwd) {
                    alertify.error('Contraseña incorrecta.');
                    return;
                }

                // Guardar sesión en sessionStorage
                const sesionData = { autenticado: true, username: usuario.username, rol: usuario.rol, id: usuario.id, codigo: usuario.codigo || '' };
                sessionStorage.setItem('sesionUniversidad', JSON.stringify(sesionData));

                alertify.success(`¡Bienvenido, ${usuario.username}!`);

                // Redirigir según rol
                if (usuario.rol === 'Admin') {
                    window.location.href = 'admin/admin.html';
                    return;
                }
                if (usuario.rol === 'Docente') {
                    window.location.href = 'docente/docente.html';
                    return;
                }

                this.$emit('login-exitoso', { username: usuario.username, rol: usuario.rol, codigo: usuario.codigo || '' });

            } catch (e) {
                alertify.error('Error al iniciar sesión: ' + e.message);
            } finally {
                this.cargando = false;
            }
        },

        // ── REGISTRO ─────────────────────────────────────────────────
        async registrar() {
            const { username, codigo, email, password, confirmar, rol, codigoAdmin } = this.regForm;

            if (!username || !password || !confirmar) {
                alertify.error('Completa los campos obligatorios: usuario, contraseña y confirmación.');
                return;
            }
            if (username.length < 4) { alertify.error('El usuario debe tener al menos 4 caracteres.'); return; }
            if (password.length < 6) { alertify.error('La contraseña debe tener al menos 6 caracteres.'); return; }
            if (password !== confirmar) { alertify.error('Las contraseñas no coinciden.'); return; }
            if (email && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
                alertify.error('El formato del correo no es válido.');
                return;
            }
            // Validar código secreto para Admin
            if (rol === 'Admin' && codigoAdmin !== 'ADMIN-2026') {
                alertify.error('Código de administrador incorrecto.');
                return;
            }

            this.cargando = true;
            try {
                const existeUser = await db.usuarios.where('username').equalsIgnoreCase(username).first();
                if (existeUser) { alertify.error('Ese nombre de usuario ya está en uso.'); return; }
                if (codigo) {
                    const existeCod = await db.usuarios.where('codigo').equalsIgnoreCase(codigo).first();
                    if (existeCod) { alertify.error('Ese código ya tiene una cuenta asociada.'); return; }
                }
                if (email) {
                    const existeEmail = await db.usuarios.where('email').equalsIgnoreCase(email).first();
                    if (existeEmail) { alertify.error('Ese correo ya tiene una cuenta asociada.'); return; }
                }

                const hashPwd = await this.hashPassword(password);
                await db.usuarios.add({
                    username, codigo: codigo || '', email: email || '',
                    hashPwd, rol, estado: 'activo'
                });

                // Crear perfil en la tabla correspondiente si no existe
                if (rol === 'Alumno') {
                    const existePerfil = codigo
                        ? await db.alumnos.where('codigo').equalsIgnoreCase(codigo).first()
                        : null;
                    if (!existePerfil) {
                        await db.alumnos.add({
                            codigo:    codigo || '',
                            nombre:    username,
                            email:     email  || '',
                            carrera:   '',
                            carreraId: '',
                            telefono:  '',
                            direccion: '',
                            estado:    'activo'
                        });
                    }
                } else if (rol === 'Docente') {
                    const existePerfil = codigo
                        ? await db.docentes.where('codigo').equalsIgnoreCase(codigo).first()
                        : null;
                    if (!existePerfil) {
                        await db.docentes.add({
                            codigo:       codigo || '',
                            nombre:       username,
                            email:        email  || '',
                            especialidad: '',
                            telefono:     '',
                            estado:       'activo'
                        });
                    }
                }

                alertify.success('¡Cuenta creada! Ahora puedes iniciar sesión.');
                this.regForm = { username: '', codigo: '', email: '', password: '', confirmar: '', rol: 'Alumno', codigoAdmin: '' };
                this.vista = 'login';

            } catch (e) {
                alertify.error('Error al registrar: ' + e.message);
            } finally {
                this.cargando = false;
            }
        },

        cambiarVista(v) {
            this.vista = v;
            this.loginForm = { identificador: '', password: '' };
            this.regForm = { username: '', codigo: '', email: '', password: '', confirmar: '', rol: 'Alumno', codigoAdmin: '' };
            this.mostrarPass = false;
            this.mostrarPassReg = false;
            this.mostrarPassConf = false;
        }
    },
    template: `
        <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background-color:#f0f4f8;">
            <div class="w-100" style="max-width: 440px;">

                <!-- Marca -->
                <div class="text-center mb-4">
                    <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style="width:72px;height:72px;background-color:#1a3a5c;">
                        <i class="bi bi-mortarboard-fill text-white" style="font-size:2rem;"></i>
                    </div>
                    <h4 class="fw-bold mb-0" style="color:#1a3a5c;">Sistema Académico</h4>
                    <small class="text-muted text-uppercase" style="letter-spacing:1px;font-size:.7rem;">Gestión Universitaria</small>
                </div>

                <div class="card border-0 shadow">

                    <!-- Tabs -->
                    <div class="card-header bg-white border-bottom p-0">
                        <ul class="nav nav-tabs border-0">
                            <li class="nav-item w-50 text-center">
                                <a class="nav-link rounded-0 py-3 fw-semibold"
                                   :class="vista==='login' ? 'active border-bottom border-2 text-primary' : 'text-muted'"
                                   href="#" @click.prevent="cambiarVista('login')">
                                    <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión
                                </a>
                            </li>
                            <li class="nav-item w-50 text-center">
                                <a class="nav-link rounded-0 py-3 fw-semibold"
                                   :class="vista==='registro' ? 'active border-bottom border-2 text-primary' : 'text-muted'"
                                   href="#" @click.prevent="cambiarVista('registro')">
                                    <i class="bi bi-person-plus me-1"></i>Crear cuenta
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- ═══ LOGIN ═══ -->
                    <div v-if="vista==='login'" class="card-body p-4">
                        <form @submit.prevent="iniciarSesion">
                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-muted">
                                    Usuario / Código / Correo
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-person-circle text-muted"></i>
                                    </span>
                                    <input v-model="loginForm.identificador" type="text"
                                           class="form-control border-start-0"
                                           placeholder="Usuario, código de estudiante o correo"
                                           autocomplete="username" required>
                                </div>
                                <div class="text-muted mt-1" style="font-size:.72rem;">
                                    <i class="bi bi-info-circle me-1"></i>Puedes usar tu nombre de usuario, código o correo electrónico.
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-semibold small text-uppercase text-muted">Contraseña</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-lock text-muted"></i>
                                    </span>
                                    <input v-model="loginForm.password"
                                           :type="mostrarPass ? 'text' : 'password'"
                                           class="form-control border-start-0 border-end-0"
                                           placeholder="••••••••" autocomplete="current-password" required>
                                    <button type="button" class="input-group-text bg-light"
                                            @click="mostrarPass = !mostrarPass">
                                        <i :class="mostrarPass ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn fw-semibold"
                                        style="background-color:#1a3a5c; color:white;" :disabled="cargando">
                                    <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                                    {{ cargando ? 'Verificando...' : 'Iniciar sesión' }}
                                </button>
                            </div>
                        </form>
                        <hr class="my-4">
                        <p class="text-center text-muted small mb-0">
                            ¿No tienes cuenta?
                            <a href="#" class="fw-semibold text-decoration-none" @click.prevent="cambiarVista('registro')">Regístrate aquí</a>
                        </p>
                    </div>

                    <!-- ═══ REGISTRO ═══ -->
                    <div v-if="vista==='registro'" class="card-body p-4">
                        <form @submit.prevent="registrar">

                            <!-- Tipo de cuenta -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-muted">Tipo de cuenta</label>
                                <div class="d-flex gap-2">
                                    <div v-for="r in ['Alumno','Docente','Admin']" :key="r"
                                         class="form-check flex-fill border rounded p-2 m-0"
                                         :class="regForm.rol===r ? 'border-primary bg-primary bg-opacity-10' : ''">
                                        <input class="form-check-input" type="radio" :id="'rol'+r" :value="r" v-model="regForm.rol">
                                        <label class="form-check-label d-flex align-items-center gap-1 small fw-semibold" :for="'rol'+r">
                                            <i :class="r==='Alumno' ? 'bi bi-person-badge text-primary' : r==='Docente' ? 'bi bi-person-workspace text-success' : 'bi bi-shield-lock text-danger'"></i>
                                            {{ r }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Código secreto Admin -->
                            <div v-if="regForm.rol==='Admin'" class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-muted">Código de administrador</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0">
                                        <i class="bi bi-shield-lock text-danger"></i>
                                    </span>
                                    <input v-model="regForm.codigoAdmin" type="password"
                                           class="form-control border-start-0"
                                           placeholder="Código institucional secreto" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-muted">Nombre de usuario <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-person text-muted"></i></span>
                                    <input v-model="regForm.username" type="text" class="form-control border-start-0"
                                           placeholder="Mínimo 4 caracteres" minlength="4" required autocomplete="username">
                                </div>
                            </div>

                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <label class="form-label fw-semibold small text-uppercase text-muted">
                                        Código <span class="text-muted fw-normal">(opcional)</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="bi bi-card-text text-muted"></i></span>
                                        <input v-model="regForm.codigo" type="text" class="form-control border-start-0" placeholder="Ej. A-001">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <label class="form-label fw-semibold small text-uppercase text-muted">
                                        Correo <span class="text-muted fw-normal">(opcional)</span>
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                                        <input v-model="regForm.email" type="email" class="form-control border-start-0" placeholder="correo@uni.edu" autocomplete="email">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-muted">Contraseña <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-lock text-muted"></i></span>
                                    <input v-model="regForm.password" :type="mostrarPassReg ? 'text' : 'password'"
                                           class="form-control border-start-0 border-end-0"
                                           placeholder="Mínimo 6 caracteres" minlength="6" required>
                                    <button type="button" class="input-group-text bg-light" @click="mostrarPassReg=!mostrarPassReg">
                                        <i :class="mostrarPassReg ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-muted">Confirmar contraseña <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-shield-lock text-muted"></i></span>
                                    <input v-model="regForm.confirmar" :type="mostrarPassConf ? 'text' : 'password'"
                                           class="form-control border-end-0"
                                           :class="regForm.confirmar && regForm.confirmar !== regForm.password ? 'is-invalid border-start-0' : 'border-start-0'"
                                           placeholder="Repite tu contraseña" required>
                                    <button type="button" class="input-group-text bg-light" @click="mostrarPassConf=!mostrarPassConf">
                                        <i :class="mostrarPassConf ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-muted"></i>
                                    </button>
                                </div>
                                <div v-if="regForm.confirmar && regForm.confirmar !== regForm.password" class="text-danger small mt-1">
                                    <i class="bi bi-x-circle me-1"></i>Las contraseñas no coinciden
                                </div>
                            </div>

                            <div class="alert alert-light border d-flex align-items-start gap-2 py-2 px-3 mb-3">
                                <i class="bi bi-shield-check text-success mt-1 flex-shrink-0"></i>
                                <small class="text-muted">Contraseña encriptada con <strong>SHA-256</strong>. Nunca se almacena en texto plano.</small>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn fw-semibold"
                                        :class="regForm.rol==='Admin' ? 'btn-danger' : regForm.rol==='Docente' ? 'btn-success' : 'btn-primary'"
                                        :disabled="cargando">
                                    <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-person-check me-2"></i>
                                    {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
                                </button>
                            </div>
                        </form>
                        <hr class="my-4">
                        <p class="text-center text-muted small mb-0">
                            ¿Ya tienes cuenta?
                            <a href="#" class="fw-semibold text-decoration-none" @click.prevent="cambiarVista('login')">Inicia sesión</a>
                        </p>
                    </div>

                </div>

                <p class="text-center text-muted mt-4" style="font-size:.72rem;">
                    <i class="bi bi-lock-fill me-1"></i>Acceso restringido — Sistema Académico © 2026
                </p>
            </div>
        </div>
    `
};
