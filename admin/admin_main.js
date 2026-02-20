// =============================================
// ADMIN — Vue App Principal
// Verificación de sesión + DB compartida
// =============================================

const db = new Dexie('universidad');
db.version(1).stores({ alumnos:'idAlumno,codigo,nombre', materias:'idMateria,codigo,nombre', docentes:'idDocente,codigo,nombre', matricula:'idMatricula,codigo,nombreAlumno', inscripciones:'idInscripcion,idMatricula,idMateria' });
db.version(2).stores({ alumnos:'idAlumno,codigo,nombre', materias:'idMateria,codigo,nombre', docentes:'idDocente,codigo,nombre', matricula:'idMatricula,codigo,nombreAlumno', inscripciones:'idInscripcion,idMatricula,idMateria', usuarios:'++id,username,rol' });
db.version(3).stores({ alumnos:'idAlumno,codigo,nombre', materias:'idMateria,codigo,nombre', docentes:'idDocente,codigo,nombre', matricula:'idMatricula,codigo,nombreAlumno', inscripciones:'idInscripcion,idMatricula,idMateria', usuarios:'++id,username,codigo,email,rol' });
db.version(4).stores({ alumnos:'idAlumno,codigo,nombre,carrera,estado', materias:'idMateria,codigo,nombre,docenteId,estado', docentes:'idDocente,codigo,nombre,especialidad,estado', matricula:'idMatricula,codigo,nombreAlumno,idAlumno,periodoId,estado', inscripciones:'idInscripcion,idMatricula,idMateria,idAlumno', periodos:'++idPeriodo,año,ciclo,estado', usuarios:'++id,username,codigo,email,rol,estado' });
db.version(5).stores({ alumnos:'idAlumno,codigo,nombre,carrera,carreraId,estado', materias:'idMateria,codigo,nombre,docenteId,carreraId,carrera,estado', docentes:'idDocente,codigo,nombre,especialidad,estado', matricula:'idMatricula,codigo,nombreAlumno,idAlumno,periodoId,estado', inscripciones:'idInscripcion,idMatricula,idMateria,idAlumno', periodos:'++idPeriodo,año,ciclo,estado', carreras:'++idCarrera,codigo,nombre,estado', evaluaciones:'++id,idInscripcion,idMateria,computo,estado', usuarios:'++id,username,codigo,email,rol,estado' });
db.version(6).stores({ alumnos:'idAlumno,codigo,nombre,carrera,carreraId,foto,estado', materias:'idMateria,codigo,nombre,docenteId,carreraId,carrera,estado', docentes:'idDocente,codigo,nombre,especialidad,foto,estado', matricula:'idMatricula,codigo,nombreAlumno,idAlumno,periodoId,estado', inscripciones:'idInscripcion,idMatricula,idMateria,idAlumno', periodos:'++idPeriodo,año,ciclo,estado', carreras:'++idCarrera,codigo,nombre,estado', evaluaciones:'++id,idInscripcion,idMateria,computo,estado', usuarios:'++id,username,codigo,email,rol,estado' });

const adminApp = Vue.createApp({
    data() {
        return {
            modulo: 'dashboard',
            adminSesion: { username: '', rol: '' },
            sidebarVisible: true,
            windowWidth: window.innerWidth,
            menuItems: [
                { id: 'dashboard',      label: 'Dashboard',      icon: 'bi bi-speedometer2' },
                { id: 'alumnos',        label: 'Alumnos',        icon: 'bi bi-person-badge' },
                { id: 'docentes',       label: 'Docentes',       icon: 'bi bi-person-workspace' },
                { id: 'carreras',       label: 'Carreras',       icon: 'bi bi-building' },
                { id: 'materias',       label: 'Materias',       icon: 'bi bi-book' },
                { id: 'periodos',       label: 'Períodos',      icon: 'bi bi-calendar-check' },
                { id: 'inscripciones',  label: 'Inscripciones',  icon: 'bi bi-pencil-square' },
                { id: 'estadisticas',   label: 'Estadísticas',   icon: 'bi bi-bar-chart-line' },
                { id: 'perfil',         label: 'Mi Cuenta',      icon: 'bi bi-person-gear' },
            ]
        };
    },
    created() {
        // Verificar sesión Admin
        try {
            const stored = sessionStorage.getItem('sesionUniversidad');
            if (!stored) { window.location.href = '../index.html'; return; }
            const s = JSON.parse(stored);
            if (!s || s.rol !== 'Admin') { window.location.href = '../index.html'; return; }
            this.adminSesion.username = s.username;
            this.adminSesion.rol = s.rol;
        } catch(e) {
            window.location.href = '../index.html';
        }
        window.addEventListener('resize', () => { this.windowWidth = window.innerWidth; });
        // Sincronizar cuentas de usuarios con sus perfiles (alumno/docente)
        this.$nextTick(() => this.sincronizarPerfiles());
    },
    methods: {
        cerrarSesion() {
            sessionStorage.removeItem('sesionUniversidad');
            window.location.href = '../index.html';
        },
        async sincronizarPerfiles() {
            try {
                const usuarios = await db.usuarios.toArray();
                for (const u of usuarios) {
                    if (u.rol === 'Alumno') {
                        const existePerfil = u.codigo
                            ? await db.alumnos.where('codigo').equalsIgnoreCase(u.codigo).first()
                            : await db.alumnos.filter(a => (a.nombre||'').toLowerCase() === (u.username||'').toLowerCase()).first();
                        if (!existePerfil) {
                            await db.alumnos.add({
                                codigo: u.codigo || '', nombre: u.username,
                                email: u.email || '', carrera: '', carreraId: '',
                                telefono: '', direccion: '', estado: 'activo'
                            });
                        }
                    } else if (u.rol === 'Docente') {
                        const existePerfil = u.codigo
                            ? await db.docentes.where('codigo').equalsIgnoreCase(u.codigo).first()
                            : await db.docentes.filter(d => (d.nombre||'').toLowerCase() === (u.username||'').toLowerCase()).first();
                        if (!existePerfil) {
                            await db.docentes.add({
                                codigo: u.codigo || '', nombre: u.username,
                                email: u.email || '', especialidad: '',
                                telefono: '', estado: 'activo'
                            });
                        }
                    }
                }
            } catch(e) { console.warn('sincronizarPerfiles:', e); }
        }
    }
});

adminApp.component('admin-dashboard',    adminDashboard);
adminApp.component('alumnos-admin',      alumnosAdmin);
adminApp.component('docentes-admin',     docentesAdmin);
adminApp.component('carreras-admin',     carrerasAdmin);
adminApp.component('materias-admin',     materiasAdmin);
adminApp.component('periodos-admin',     periodosAdmin);
adminApp.component('inscripciones-admin',inscripcionesAdmin);
adminApp.component('estadisticas-admin', estadisticasAdmin);
adminApp.component('perfil-admin',       perfilAdmin);

adminApp.mount('#adminApp');
