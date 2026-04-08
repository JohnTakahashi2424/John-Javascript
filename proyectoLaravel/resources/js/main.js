import alumnos from './componentes/alumnos.js';
import busqueda_alumnos from './componentes/busqueda_alumnos.js';
import materias from './componentes/materias.js';
import busqueda_materias from './componentes/busqueda_materias.js';
import docentes from './componentes/docentes.js';
import busqueda_docentes from './componentes/busqueda_docentes.js';
import matriculas from './componentes/matriculas.js';
import busqueda_matriculas from './componentes/busqueda_matriculas.js';
import inscripciones from './componentes/inscripciones.js';
import busqueda_inscripciones from './componentes/busqueda_inscripciones.js';

const { createApp } = Vue;
window.sha256 = CryptoJS.SHA256;

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Inicialización] DOM cargado. Preparando Delegación Global.');

    /* -----------------------------------------------------
       1. INICIALIZAR EL MODO OSCURO (Lectura de LocalStorage)
       ----------------------------------------------------- */
    const htmlElement = document.documentElement;
    
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            htmlElement.setAttribute('data-bs-theme', 'dark');
            
            // Si Vue aún no monta el ícono no importa, lo busca si ya existe.
            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) {
                themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
                themeIcon.classList.add('text-warning');
            }
        }
    } catch (error) {
        console.error('Error cargando inicial el tema:', error);
    }
});

/* -----------------------------------------------------
   2. EL SECRETO: EVENT DELEGATION GLOBAL
   Como Vue.js reconstruye el <div id="app"> al montarse, todos los 
   listeners ("addEventListener") atados a los botones mueren.
   Escuchamos directo al documento, que NUNCA muere.
   ----------------------------------------------------- */
document.addEventListener('click', function(e) {

    // === BOTÓN DE MODO OSCURO ===
    const btnDarkMode = e.target.closest('#themeToggle');
    if (btnDarkMode) {
        e.preventDefault();
        console.log('[Dark Mode] Botón interceptado mediante delegación global.');
        
        const htmlElement = document.documentElement;
        const themeIcon = document.getElementById('themeIcon');
        const isCurrentDark = htmlElement.getAttribute('data-theme') === 'dark';

        if (isCurrentDark) { // Apagar Oscuro
            htmlElement.removeAttribute('data-theme');
            htmlElement.removeAttribute('data-bs-theme');
            localStorage.setItem('theme', 'light');
            
            if (themeIcon) {
                themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
                themeIcon.classList.remove('text-warning');
            }
        } else { // Encender Oscuro
            htmlElement.setAttribute('data-theme', 'dark');
            htmlElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            if (themeIcon) {
                themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
                themeIcon.classList.add('text-warning');
            }
        }
    }

    // === BOTÓN DE OCULTAR/MOSTRAR SIDEBAR ===
    const btnSidebar = e.target.closest('#sidebarToggle');
    if (btnSidebar) {
        e.preventDefault();
        console.log('[Sidebar] Alternando visibilidad (Colapso)');
        document.body.classList.toggle('sidebar-collapsed');
    }

    // === BOTÓN DE RECARGA DE SISTEMA ===
    const btnReload = e.target.closest('#btnReloadApp');
    if (btnReload) {
        e.preventDefault();
        console.log('[Sistema] Reiniciando aplicación...');
        // Animación de rotación antes de recargar
        const icon = btnReload.querySelector('i');
        if (icon) icon.style.transition = 'transform 0.5s ease-in-out';
        if (icon) icon.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
});




const app = createApp({
    components:{
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
    directives: {
        focus: {
            mounted(el) {
                el.focus();
            }
        }
    },
    data(){

        return{
            forms:{
                alumnos:{mostrar:false},
                busqueda_alumnos:{mostrar:false},
                materias:{mostrar:false},
                busqueda_materias:{mostrar:false},
                docentes:{mostrar:false},
                busqueda_docentes:{mostrar:false},
                matriculas:{mostrar:false},
                busqueda_matriculas:{mostrar:false},
                inscripciones:{mostrar:false},
                busqueda_inscripciones:{mostrar:false}
            },
            stats: JSON.parse(document.getElementById('app').dataset.stats || '{}')
        }


    },
    methods:{
        buscar(ventana, metodo){
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana){
            // 1. Ocultar todas las ventanas
            for (const key in this.forms) {
                this.forms[key].mostrar = false;
            }
            // 2. Mostrar módulo solicitado
            this.forms[ventana].mostrar = true;

            // 3. Forzar refresco de datos en tiempo real al entrar
            const refBusqueda = `busqueda_${ventana}`;
            if (this.$refs[refBusqueda]) {
                const metodosDeCarga = {
                    'busqueda_alumnos': 'obtenerAlumnos',
                    'busqueda_materias': 'obtenerMaterias',
                    'busqueda_docentes': 'obtenerDocentes',
                    'busqueda_matriculas': 'obtenerMatriculas',
                    'busqueda_inscripciones': 'obtenerInscripciones'
                };
                const metodo = metodosDeCarga[refBusqueda];
                if (metodo && typeof this.$refs[refBusqueda][metodo] === 'function') {
                    this.$refs[refBusqueda][metodo]();
                }
            }
        },

        volverInicio() {
            // Ocultar todos los formularios para volver a ver el Dashboard (Inicio)
            for (const key in this.forms) {
                this.forms[key].mostrar = false;
            }
            // Actualizar estadísticas al volver al inicio
            fetch('/api/stats')
                .then(res => res.json())
                .then(data => { this.stats = data; })
                .catch(err => console.error('Error actualizando stats:', err));
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        }
    }
}).mount("#app");
