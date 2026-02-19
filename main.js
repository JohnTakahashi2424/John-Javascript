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
            }
        };
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
        loginExitoso({ username, rol }) {
            this.sesion.autenticado = true;
            this.sesion.username    = username;
            this.sesion.rol         = rol;
        },
        cerrarSesion() {
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

app.mount('#app');