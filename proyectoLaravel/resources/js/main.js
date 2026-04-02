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
    methods:{
        buscar(ventana, metodo){
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana){
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        }
    }
}).mount("#app");
