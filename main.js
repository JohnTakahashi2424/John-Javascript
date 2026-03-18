const { createApp } = Vue;

let CryptoJS = window.CryptoJS;

if (!CryptoJS) {
    console.error("Error: CryptoJS no está cargado. Verifique la conexión al CDN.");
}

const sha256 = CryptoJS ? CryptoJS.SHA256 : null;

// Fuerza de Aniquilación de IndexedDB ("Cero Rastro")
if (window.indexedDB) {
    try {
        console.log("Eliminando cualquier IndexedDB heredada...");
        window.indexedDB.deleteDatabase('db_academica');
        window.indexedDB.deleteDatabase('db_academica_vue');
    } catch(e) { /* ignore */ }
}

// Inicializamos la base de datos de forma asíncrona
Database.iniciar().then(() => {
    console.log("Sistema BBDD (SQLite WASM) preparado.");
}).catch(err => {
    if(typeof alertify !== 'undefined') {
        alertify.error(`Error crítico SQLite: ${err.message}`);
    }
    console.error("Detalle del error SQLite:", err);
});

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
            isRefreshing: false,
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
        recargarApp() {
            this.isRefreshing = true;
            setTimeout(() => {
                location.reload();
            }, 500); // 500ms para que se vea el giro antes de recargar
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
            this.irAVentana(ventana); // Asegurar que el formulario sea visible al editar
        },
        irAVentana(ventana) {
            // Identificar el módulo base (ej: si es 'busqueda_alumnos' o 'alumnos', el base es 'alumnos')
            const moduloBase = ventana.replace('busqueda_', '');
            
            // Ocultar solo los formularios que NO pertenecen al módulo actual
            Object.keys(this.forms).forEach(key => {
                const keyBase = key.replace('busqueda_', '');
                if (keyBase !== moduloBase) {
                    this.forms[key].mostrar = false;
                }
            });

            // Mostrar la ventana solicitada
            this.forms[ventana].mostrar = true;
            
            // Forzar el scroll al inicio para ver el formulario
            this.$nextTick(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }, 50);
            });
        }
    }
}).mount("#app");