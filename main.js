const { createApp } = Vue;

// Verificación de dependencias de forma segura (sin destructuración estricta que rompa el script)
let Dexie = window.Dexie;
let CryptoJS = window.CryptoJS;

if (!Dexie) {
    console.error("Error: Dexie no está cargado. Verifique la conexión al CDN.");
    if(typeof alertify !== 'undefined') alertify.error("Error crítico: No se pudo cargar la base de datos local (Dexie).");
}
if (!CryptoJS) {
    console.error("Error: CryptoJS no está cargado. Verifique la conexión al CDN.");
}

const db = Dexie ? new Dexie("db_academica") : null;
const sha256 = CryptoJS ? CryptoJS.SHA256 : null;

try {
    if (db) {
        db.version(2).stores({
            "alumnos": "idAlumno, codigo, nombre, direccion, email, telefono",
            "materias": "idMateria, codigo, nombre, uv",
            "docentes": "idDocente, codigo, nombre, direccion, email, telefono, escalafon",
            "matriculas": "idMatricula, idAlumno, ciclo, fecha, pago",
            "inscripciones": "idInscripcion, idAlumno, idMateria, ciclo, fecha"
        });
    }
} catch (e) {
    console.error("Dexie error:", e);
}

createApp({
    components: {
        alumnos,
        busqueda_alumnos,
        materias,
        busqueda_materias,
        docentes,
        busqueda_docentes,
        matriculas,
        busqueda_matriculas,
        inscripciones,
        busqueda_inscripciones
    },
    data() {
        return {
            darkMode: false,
            sesion: { autenticado: true, username: 'John Takahashi', rol: 'Administrador', foto: '' },
            forms: {
                alumnos: { mostrar: true },
                busqueda_alumnos: { mostrar: false },
                materias: { mostrar: false },
                busqueda_materias: { mostrar: false },
                docentes: { mostrar: false },
                busqueda_docentes: { mostrar: false },
                matriculas: { mostrar: false },
                busqueda_matriculas: { mostrar: false },
                inscripciones: { mostrar: false },
                busqueda_inscripciones: { mostrar: false }
            }
        }
    },
    methods: {
        toggleDarkMode() {
            this.darkMode = !this.darkMode;
            document.documentElement.setAttribute('data-bs-theme', this.darkMode ? 'dark' : 'light');
        },
        buscar(ventana, metodo) {
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana) {
            // Ocultar todos los formularios antes de mostrar el seleccionado
            Object.keys(this.forms).forEach(key => {
                if (key !== ventana) {
                    this.forms[key].mostrar = false;
                }
            });
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data) {
            this.$refs[ventana][metodo](data);
        }
    }
}).mount("#app");