// =============================================
// BASE DE DATOS (Dexie / IndexedDB)
// =============================================
const db = new Dexie('universidad');
db.version(1).stores({
    alumnos:      'idAlumno, codigo, nombre',
    materias:     'idMateria, codigo, nombre',
    docentes:     'idDocente, codigo, nombre',
    matricula:    'idMatricula, codigo, nombreAlumno',
    inscripciones:'idInscripcion, idMatricula, idMateria'
});
db.version(2).stores({
    alumnos:      'idAlumno, codigo, nombre',
    materias:     'idMateria, codigo, nombre',
    docentes:     'idDocente, codigo, nombre',
    matricula:    'idMatricula, codigo, nombreAlumno',
    inscripciones:'idInscripcion, idMatricula, idMateria',
    usuarios:     '++id, username, rol'
});
db.version(3).stores({
    alumnos:      'idAlumno, codigo, nombre',
    materias:     'idMateria, codigo, nombre',
    docentes:     'idDocente, codigo, nombre',
    matricula:    'idMatricula, codigo, nombreAlumno',
    inscripciones:'idInscripcion, idMatricula, idMateria',
    usuarios:     '++id, username, codigo, email, rol'
});
db.version(4).stores({
    alumnos:      'idAlumno, codigo, nombre, carrera, estado',
    materias:     'idMateria, codigo, nombre, docenteId, estado',
    docentes:     'idDocente, codigo, nombre, especialidad, estado',
    matricula:    'idMatricula, codigo, nombreAlumno, idAlumno, periodoId, estado',
    inscripciones:'idInscripcion, idMatricula, idMateria, idAlumno',
    periodos:     '++idPeriodo, año, ciclo, estado',
    usuarios:     '++id, username, codigo, email, rol, estado'
});
db.version(5).stores({
    alumnos:      'idAlumno, codigo, nombre, carrera, carreraId, estado',
    materias:     'idMateria, codigo, nombre, docenteId, carreraId, carrera, estado',
    docentes:     'idDocente, codigo, nombre, especialidad, estado',
    matricula:    'idMatricula, codigo, nombreAlumno, idAlumno, periodoId, estado',
    inscripciones:'idInscripcion, idMatricula, idMateria, idAlumno',
    periodos:     '++idPeriodo, año, ciclo, estado',
    carreras:     '++idCarrera, codigo, nombre, estado',
    evaluaciones: '++id, idInscripcion, idMateria, computo, estado',
    usuarios:     '++id, username, codigo, email, rol, estado'
});

// =============================================
// APP VUE
// =============================================
const app = Vue.createApp({
    data(){
        return {
            sesion: {
                autenticado: false,
                username: '',
                rol: ''
            },
            forms:{
                alumnos:               { mostrar: false },
                busqueda_alumnos:      { mostrar: false },
                materias:              { mostrar: false },
                busqueda_materias:     { mostrar: false },
                docentes:              { mostrar: false },
                busqueda_docentes:     { mostrar: false },
                matricula:             { mostrar: false },
                busqueda_matricula:    { mostrar: false },
                inscripciones:         { mostrar: false },
                busqueda_inscripciones:{ mostrar: false },
                mis_notas:             { mostrar: false },
                mi_perfil:             { mostrar: false },
            }
        };
    },
    created(){
        // Restaurar sesión desde sessionStorage al recargar la página
        try {
            const stored = sessionStorage.getItem('sesionUniversidad');
            if (stored) {
                const s = JSON.parse(stored);
                if (s && s.autenticado && s.rol !== 'Admin') {
                    this.sesion.autenticado = true;
                    this.sesion.username    = s.username;
                    this.sesion.rol         = s.rol;
                }
            }
        } catch(e) { /* sesión corrupta, ignorar */ }
    },
    methods:{
        abrirVentana(nombre){
            // Cierra todos los paneles y abre solo el seleccionado
            for(const key in this.forms){
                this.forms[key].mostrar = false;
            }
            this.forms[nombre].mostrar = true;
        },
        buscar(refBusqueda, metodo){
            this.$refs[refBusqueda][metodo]();
        },
        modificar(refForm, metodo, datos){
            this.forms[refForm].mostrar  = true;
            // Oculta el panel de búsqueda correspondiente
            const busquedaKey = 'busqueda_' + refForm;
            if(this.forms[busquedaKey]) this.forms[busquedaKey].mostrar = false;
            this.$refs[refForm][metodo](datos);
        },
        loginExitoso({ username, rol, codigo }) {
            this.sesion.autenticado = true;
            this.sesion.username    = username;
            this.sesion.rol         = rol;
            sessionStorage.setItem('sesionUniversidad', JSON.stringify({ autenticado: true, username, rol, codigo: codigo || '' }));
        },
        cerrarSesion() {
            sessionStorage.removeItem('sesionUniversidad');
            this.sesion.autenticado = false;
            this.sesion.username    = '';
            this.sesion.rol         = '';
            // Cierra todos los paneles abiertos
            for (const key in this.forms) {
                this.forms[key].mostrar = false;
            }
        }
    }
});

// Registro de componentes
app.component('login', login);
app.component('alumnos',                alumnos);
app.component('busqueda_alumnos',       busqueda_alumnos);
app.component('materias',               materias);
app.component('busqueda_materias',      busqueda_materias);
app.component('docentes',               docentes);
app.component('busqueda_docentes',      busqueda_docentes);
app.component('matricula',              matricula);
app.component('busqueda_matricula',     busqueda_matricula);
app.component('inscripciones',          inscripciones);
app.component('busqueda_inscripciones', busqueda_inscripciones);
app.component('mis_notas',              misNotas);
app.component('mi_perfil',              miPerfil);

app.mount('#app');