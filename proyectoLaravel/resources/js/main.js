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

document.addEventListener('DOMContentLoaded', () => {
    // === 1. LÓGICA DE MODO OSCURO ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    
    // Cargar preferencia guardada
    const savedTheme = localStorage.getItem('theme') || 'light';
    if(savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        themeIcon.classList.add('text-warning');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            let newTheme = 'light';
            
            if(currentTheme === 'dark') {
                htmlElement.removeAttribute('data-theme');
                themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
                themeIcon.classList.remove('text-warning');
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                newTheme = 'dark';
                themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
                themeIcon.classList.add('text-warning');
            }
            
            localStorage.setItem('theme', newTheme);
        });
    }
});


createApp({
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
            }
        }
    },
    computed: {
        anyFormActive() {
            return Object.values(this.forms).some(f => f.mostrar);
        }
    },
    methods:{
        buscar(ventana, metodo){
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana){
            // Comportamiento SPA: Ocultar todas las ventanas primero
            for (const key in this.forms) {
                this.forms[key].mostrar = false;
            }
            // Mostrar únicamente el módulo solicitado
            this.forms[ventana].mostrar = true;
        },
        volverInicio() {
            // Ocultar todos los formularios para volver a ver el Dashboard (Inicio)
            for (const key in this.forms) {
                this.forms[key].mostrar = false;
            }
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        }
    }
}).mount("#app");
