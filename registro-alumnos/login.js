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
                email: '',
                password: '',
                confirmar: '',
                rol: 'Alumno',
                sexo: 'Masculino', // Valor por defecto
                carreraId: ''
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
                // Buscar únicamente por username o email (El código/carnet ya no se usa para login)
                let usuario = await db.usuarios.where('username').equalsIgnoreCase(id).first();
                if (!usuario) usuario = await db.usuarios.where('email').equalsIgnoreCase(id).first();

                if (!usuario) {
                    alertify.error('No se encontró ninguna cuenta con ese usuario o correo.');
                    return;
                }

                // Verificar estado de cuenta (Usuario)
                if (usuario.estado === 'inactivo') {
                    alertify.error('Tu cuenta está desactivada. Contacta al administrador.');
                    return;
                }

                // Verificar estado del perfil específico (Alumno/Docente)
                // Esto es necesario porque el Admin desactiva desde el panel de Alumnos/Docentes
                if (usuario.rol === 'Alumno') {
                    // Buscar perfil primero por usuarioId (FK v9), fallback a carnet (v10)
                    let perfil = usuario.id
                        ? await db.alumnos.where('usuarioId').equals(usuario.id).first()
                        : null;
                    if (!perfil && usuario.carnet)
                        perfil = await db.alumnos.where('carnet').equalsIgnoreCase(usuario.carnet).first();

                    if (!perfil) {
                        alertify.alert('Error de Cuenta', 'Tu usuario existe pero no se encontró tu expediente de Alumno. Posiblemente fue eliminado. Contacta al administrador.');
                        return;
                    }
                    if (perfil.estado === 'inactivo') {
                        alertify.error('Tu expediente de alumno ha sido desactivado. Contacta a registro académico.');
                        return;
                    }
                } else if (usuario.rol === 'Docente') {
                    // Buscar perfil primero por usuarioId (FK v9), fallback a carnet (v10)
                    let perfil = usuario.id
                        ? await db.docentes.where('usuarioId').equals(usuario.id).first()
                        : null;
                    if (!perfil && usuario.carnet)
                        perfil = await db.docentes.where('carnet').equalsIgnoreCase(usuario.carnet).first();

                    if (!perfil) {
                        alertify.alert('Error de Cuenta', 'Tu usuario existe pero no se encontró tu perfil Docente. Posiblemente fue eliminado. Contacta al administrador.');
                        return;
                    }
                    if (perfil.estado === 'inactivo') {
                        alertify.error('Tu perfil docente ha sido desactivado. Contacta a recursos humanos.');
                        return;
                    }
                }

                const hashIngresado = await this.hashPassword(this.loginForm.password);
                if (hashIngresado !== usuario.hashPwd) {
                    alertify.error('Contraseña incorrecta.');
                    return;
                }

                // Guardar sesión en sessionStorage
                const sesionData = { autenticado: true, username: usuario.username, rol: usuario.rol, id: usuario.id, carnet: usuario.carnet || '' };
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

                this.$emit('login-exitoso', { username: usuario.username, rol: usuario.rol, carnet: usuario.carnet || '' });

            } catch (e) {
                alertify.error('Error al iniciar sesión: ' + e.message);
            } finally {
                this.cargando = false;
            }
        },

        // ── REGISTRO ─────────────────────────────────────────────────
        async registrar() {
            // Validar que no haya sesión activa
            const sesion = sessionStorage.getItem('sesionUniversidad');
            if (sesion) {
                alertify.warning('Ya tienes una sesión activa. No es necesario registrarte de nuevo.');
                return;
            }

            const { username, email, password, confirmar, rol, sexo, codigoAdmin, carreraId } = this.regForm;

            if (!username || !password || !confirmar || !email) {
                alertify.error('Completa los campos obligatorios: usuario, correo, contraseña y confirmación.');
                return;
            }
            if (username.length < 4) { alertify.error('El usuario debe tener al menos 4 caracteres.'); return; }
            if (password.length < 6) { alertify.error('La contraseña debe tener al menos 6 caracteres.'); return; }
            if (password !== confirmar) { alertify.error('Las contraseñas no coinciden.'); return; }
            if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
                alertify.error('El formato del correo no es válido.');
                return;
            }
            
            // Validar código secreto para Admin (creación directa)
            if (rol === 'Admin' && codigoAdmin !== 'ADMIN-2026') {
                alertify.error('Código de administrador incorrecto.');
                return;
            }

            this.cargando = true;
            try {
                const existeUser = await db.usuarios.where('username').equalsIgnoreCase(username).first();
                if (existeUser) { alertify.error('Ese nombre de usuario ya está en uso.'); return; }
                
                const existeEmail = await db.usuarios.where('email').equalsIgnoreCase(email).first();
                if (existeEmail) { alertify.error('Ese correo ya tiene una cuenta asociada.'); return; }

                const existeSolicitud = await db.solicitudes.where('email').equalsIgnoreCase(email).first();
                if (existeSolicitud) { alertify.error('Ya existe una solicitud pendiente con este correo.'); return; }

                // 2. Si es Admin, crear directamente (como antes)
                if (rol === 'Admin') {
                    const hashPwd = await this.hashPassword(password);
                    await db.usuarios.add({
                        username, email, hashPwd, rol, carnet: 'ADMIN', estado: 'activo'
                    });
                    alertify.success('¡Administrador creado!');
                    this.cambiarVista('login');
                    return;
                }

                // 3. Si es Alumno/Docente, crear una SOLICITUD (Pre-registro)
                // El carnet real lo generará el Admin al aprobar.
                const hashPwd = await this.hashPassword(password);
                
                await db.solicitudes.add({
                    tipo: rol,
                    nombre: username, // Se usará para el perfil
                    username,
                    email,
                    hashPwd,
                    sexo,
                    carreraId: rol === 'Alumno' ? (carreraId || '') : '',
                    fecha: new Date().toLocaleString(),
                    estado: 'pendiente'
                });

                alertify.alert('Solicitud Enviada', 'Tu solicitud ha sido enviada. El sistema generará tu carnet oficial una vez que el administrador apruebe tu registro.');
                this.regForm = { username: '', email: '', password: '', confirmar: '', rol: 'Alumno', sexo: 'Masculino', carreraId: '' };
                this.cambiarVista('login');

            } catch (e) {
                alertify.error('Error al registrar: ' + e.message);
            } finally {
                this.cargando = false;
            }
        },

        // se eliminó solicitarToken ya que el carnet se genera al aprobar solicitud

        cambiarVista(v) {
            this.vista = v;
            this.loginForm = { identificador: '', password: '' };
            this.regForm = { username: '', email: '', password: '', confirmar: '', rol: 'Alumno', sexo: 'Masculino', carreraId: '' };
            this.mostrarPass = false;
            this.mostrarPassReg = false;
            this.mostrarPassConf = false;
        }
    },
    template: `
        <div class="min-vh-100 d-flex align-items-center justify-content-center bg-body">
            <div class="w-100" style="max-width: 440px;">
                <!-- Marca -->
                <div class="text-center mb-4">
                    <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                         style="width:72px;height:72px;background-color:#1a3a5c;">
                        <i class="bi bi-mortarboard-fill text-white" style="font-size:2rem;"></i>
                    </div>
                    <h4 class="fw-bold mb-0 text-body">Sistema Académico</h4>
                    <small class="text-body-secondary text-uppercase" style="letter-spacing:1px;font-size:.7rem;">Gestión Universitaria</small>
                </div>

                <div class="card border-0 shadow-sm bg-body-tertiary">
                    <!-- Tabs -->
                    <div class="card-header bg-transparent border-bottom-0 p-0">
                        <ul class="nav nav-tabs border-0 flex-nowrap">
                            <li class="nav-item w-50 text-center">
                                <a class="nav-link rounded-0 py-3 fw-semibold border-0 border-bottom border-2"
                                   :class="vista==='login' ? 'active text-primary border-primary' : 'text-body-secondary'"
                                   href="#" @click.prevent="cambiarVista('login')">
                                    <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión
                                </a>
                            </li>
                            <li class="nav-item w-50 text-center">
                                <a class="nav-link rounded-0 py-3 fw-semibold border-0 border-bottom border-2"
                                   :class="vista==='registro' ? 'active text-primary border-primary' : 'text-body-secondary'"
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
                                <label class="form-label fw-semibold small text-uppercase text-body-secondary">
                                    Nombre de Usuario / Correo Electrónico
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-body-secondary border-end-0">
                                        <i class="bi bi-person-circle text-body-secondary"></i>
                                    </span>
                                    <input v-model="loginForm.identificador" type="text"
                                           class="form-control border-start-0 bg-transparent"
                                           placeholder="Ej. juan.perez o juan@uni.edu"
                                           autocomplete="username" required>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-semibold small text-uppercase text-body-secondary">Contraseña</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-body-secondary border-end-0">
                                        <i class="bi bi-lock text-body-secondary"></i>
                                    </span>
                                    <input v-model="loginForm.password"
                                           :type="mostrarPass ? 'text' : 'password'"
                                           class="form-control border-start-0 border-end-0 bg-transparent"
                                           placeholder="••••••••" autocomplete="current-password" required>
                                    <button type="button" class="input-group-text bg-body-secondary"
                                            @click="mostrarPass = !mostrarPass">
                                        <i :class="mostrarPass ? 'bi bi-eye-slash' : 'bi bi-eye'" class="text-body-secondary"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="d-grid shadow-sm">
                                <button type="submit" class="btn fw-semibold"
                                        style="background-color:#1a3a5c; color:white;" :disabled="cargando">
                                    <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                                    {{ cargando ? 'Verificando...' : 'Iniciar sesión' }}
                                </button>
                            </div>
                        </form>
                        <hr class="my-4 border-secondary-subtle">
                        <p class="text-center text-body-secondary small mb-0">
                            ¿No tienes cuenta?
                            <a href="#" class="fw-semibold text-decoration-none" @click.prevent="cambiarVista('registro')">Regístrate aquí</a>
                        </p>
                    </div>

                    <!-- ═══ REGISTRO (SOLICITUD) ═══ -->
                    <div v-if="vista==='registro'" class="card-body p-4">
                        <form @submit.prevent="registrar">

                            <!-- Tipo de cuenta -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-body-secondary">Tipo de cuenta</label>
                                <div class="d-flex gap-2">
                                    <div v-for="r in ['Alumno','Docente','Admin']" :key="r"
                                         class="form-check flex-fill border rounded p-2 m-0 shadow-sm"
                                         :class="regForm.rol===r ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'">
                                        <input class="form-check-input" type="radio" :id="'rol'+r" :value="r" v-model="regForm.rol">
                                        <label class="form-check-label d-flex align-items-center gap-1 small fw-semibold" :for="'rol'+r">
                                            <i :class="r==='Alumno' ? 'bi bi-person-badge text-primary' : r==='Docente' ? 'bi bi-person-workspace text-success' : 'bi bi-shield-lock text-danger'"></i>
                                            {{ r }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Género -->
                            <div v-if="regForm.rol !== 'Admin'" class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-body-secondary">Sexo</label>
                                <div class="d-flex gap-2">
                                    <div v-for="s in ['Masculino','Femenino']" :key="s"
                                         class="form-check flex-fill border rounded p-2 m-0 shadow-sm"
                                         :class="regForm.sexo===s ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'">
                                        <input class="form-check-input" type="radio" :id="'sexo'+s" :value="s" v-model="regForm.sexo">
                                        <label class="form-check-label d-flex align-items-center gap-1 small fw-semibold" :for="'sexo'+s">
                                            <i :class="s==='Masculino' ? 'bi bi-gender-male text-primary' : 'bi bi-gender-female text-danger'"></i>
                                            {{ s }}
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-body-secondary">Nombre de usuario <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-body-tertiary border-end-0"><i class="bi bi-person text-body-secondary"></i></span>
                                    <input v-model="regForm.username" type="text" class="form-control border-start-0 bg-transparent"
                                           placeholder="Ej. juan.perez" minlength="4" required autocomplete="username">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold small text-uppercase text-body-secondary">
                                    Correo Electrónico <span class="text-danger">*</span>
                                </label>
                                <div class="input-group">
                                    <span class="input-group-text bg-body-tertiary border-end-0"><i class="bi bi-envelope text-body-secondary"></i></span>
                                    <input v-model="regForm.email" type="email" class="form-control border-start-0 bg-transparent" placeholder="ejemplo@uni.edu" required autocomplete="email">
                                </div>
                            </div>

                            <div class="mb-4">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <label class="form-label fw-semibold small text-uppercase text-body-secondary">Contraseña</label>
                                        <div class="input-group">
                                            <input v-model="regForm.password" :type="mostrarPassReg ? 'text' : 'password'"
                                                   class="form-control bg-transparent" placeholder="Mínimo 6" minlength="6" required>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label fw-semibold small text-uppercase text-body-secondary">Confirmar</label>
                                        <div class="input-group">
                                            <input v-model="regForm.confirmar" :type="mostrarPassReg ? 'text' : 'password'"
                                                   class="form-control bg-transparent" placeholder="Repite" required>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-grid shadow-sm">
                                <button type="submit" class="btn fw-semibold text-white py-2"
                                        :class="regForm.rol==='Admin' ? 'btn-danger' : regForm.rol==='Docente' ? 'btn-success' : 'btn-primary'"
                                        :disabled="cargando">
                                    <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-send me-2"></i>
                                    {{ cargando ? 'Enviando...' : (regForm.rol==='Admin' ? 'Crear Administrador' : 'Enviar Solicitud de Registro') }}
                                </button>
                            </div>
                        </form>
                        <hr class="my-4 border-secondary-subtle">
                        <p class="text-center text-body-secondary small mb-0">
                            ¿Ya tienes cuenta?
                            <a href="#" class="fw-semibold text-decoration-none" @click.prevent="cambiarVista('login')">Inicia sesión</a>
                        </p>
                    </div>

                </div>

                <p class="text-center text-body-secondary mt-4" style="font-size:.72rem;">
                    <i class="bi bi-lock-fill me-1"></i>Acceso restringido — Sistema Académico © 2026
                </p>
            </div>
        </div>
    `
};
