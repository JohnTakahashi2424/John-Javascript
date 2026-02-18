const inscripciones = {
    props:['forms'],
    data(){
        return{
            inscripcion:{
                idInscripcion:0,
                idMatricula:"",
                alumno:"",
                idMateria:"",
                materia:"",
                fecha:"",
                ciclo:""
            },
            accion:'nuevo',
            // Datos relacionales cargados desde DB
            matriculasActivas:[],
            materiasDisponibles:[],
            // Mensajes de advertencia
            sinMatriculas: false,
            sinMaterias: false,
        }
    },
    async mounted(){
        await this.cargarDatosRelacionales();
    },
    watch:{
        // Recarga los datos cada vez que se abre el panel
        'forms.inscripciones.mostrar'(visible){
            if(visible) this.cargarDatosRelacionales();
        }
    },
    methods:{
        getRomano(n) {
            const romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
            return romanos[n - 1] || n;
        },
        // Carga matrículas activas y materias desde la DB
        async cargarDatosRelacionales(){
            this.matriculasActivas = await db.matricula
                .filter(m => m.estado === 'Activo')
                .toArray();
            this.sinMatriculas = this.matriculasActivas.length === 0;

            this.materiasDisponibles = await db.materias.toArray();
            this.sinMaterias = this.materiasDisponibles.length === 0;
        },
        // Al seleccionar una matrícula, rellena el alumno automáticamente
        onMatriculaChange(){
            const mat = this.matriculasActivas.find(m => m.idMatricula == this.inscripcion.idMatricula);
            if(mat){
                this.inscripcion.alumno = mat.nombreAlumno;
                this.inscripcion.ciclo = mat.ciclo || '';
            } else {
                this.inscripcion.alumno = '';
            }
        },
        // Al seleccionar una materia, guarda el nombre
        onMateriaChange(){
            const mat = this.materiasDisponibles.find(m => m.idMateria == this.inscripcion.idMateria);
            if(mat){
                this.inscripcion.materia = mat.nombre;
            } else {
                this.inscripcion.materia = '';
            }
        },
        buscarInscripcion(){
            this.forms.busqueda_inscripciones.mostrar = !this.forms.busqueda_inscripciones.mostrar;
            this.$emit('buscar');
        },
        modificarInscripcion(ins){
            this.accion = 'modificar';
            this.idInscripcion = ins.idInscripcion;
            this.inscripcion.idMatricula = ins.idMatricula;
            this.inscripcion.alumno = ins.alumno;
            this.inscripcion.idMateria = ins.idMateria || '';
            this.inscripcion.materia = ins.materia;
            this.inscripcion.fecha = ins.fecha;
            this.inscripcion.ciclo = ins.ciclo;
        },
        async guardarInscripcion() {
            if(!this.inscripcion.idMatricula){
                alertify.error('Debe seleccionar una matrícula activa.');
                return;
            }
            if(!this.inscripcion.idMateria){
                alertify.error('Debe seleccionar una materia.');
                return;
            }
            let datos = {
                idInscripcion: this.accion=='modificar' ? this.idInscripcion : this.getId(),
                idMatricula: this.inscripcion.idMatricula,
                alumno: this.inscripcion.alumno,
                idMateria: this.inscripcion.idMateria,
                materia: this.inscripcion.materia,
                fecha: this.inscripcion.fecha,
                ciclo: this.inscripcion.ciclo
            };
            await db.inscripciones.put(datos);
            this.limpiarFormulario();
            alertify.success(`Inscripción guardada correctamente`);
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idInscripcion = 0;
            this.inscripcion.idMatricula = '';
            this.inscripcion.alumno = '';
            this.inscripcion.idMateria = '';
            this.inscripcion.materia = '';
            this.inscripcion.fecha = '';
            this.inscripcion.ciclo = '';
            this.cargarDatosRelacionales();
        },
    },
    template: `
        <div>
            <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                <i class="bi bi-pencil-square me-2 fs-5 text-secondary"></i>
                <h5 class="mb-0 fw-semibold">Registro de Inscripciones</h5>
                <span v-if="accion=='modificar'" class="badge bg-warning text-dark ms-2">Editando</span>
            </div>

            <!-- Alertas de prerrequisitos faltantes -->
            <div v-if="sinMatriculas" class="alert alert-warning d-flex align-items-center py-2 mb-3" style="max-width:520px;">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div class="small">
                    <strong>No hay matrículas activas.</strong>
                    Ve al módulo <strong>Matrícula</strong> y crea una primero.
                </div>
            </div>
            <div v-if="sinMaterias" class="alert alert-warning d-flex align-items-center py-2 mb-3" style="max-width:520px;">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div class="small">
                    <strong>No hay materias registradas.</strong>
                    Ve al módulo <strong>Materias</strong> y regístralas primero.
                </div>
            </div>

            <form id="frmInscripcion" @submit.prevent="guardarInscripcion" @reset.prevent="limpiarFormulario">
                <div class="card border-0 shadow-sm" style="max-width: 520px;">
                    <div class="card-body p-4">

                        <!-- Selector de Matrícula -->
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-semibold text-uppercase">
                                Matrícula
                                <span v-if="sinMatriculas" class="text-danger ms-1 small fw-normal">(ninguna activa)</span>
                            </label>
                            <select v-model="inscripcion.idMatricula" @change="onMatriculaChange"
                                class="form-select form-select-sm"
                                :class="sinMatriculas ? 'is-invalid' : ''"
                                required :disabled="sinMatriculas">
                                <option value="" disabled>Seleccione una matrícula activa...</option>
                                <option v-for="m in matriculasActivas" :key="m.idMatricula" :value="m.idMatricula">
                                    {{ m.codigo }} — {{ m.nombreAlumno }} ({{ m.carrera }})
                                </option>
                            </select>
                        </div>

                        <!-- Alumno (solo lectura, se rellena automáticamente) -->
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-semibold text-uppercase">Alumno</label>
                            <input :value="inscripcion.alumno" type="text" class="form-control form-control-sm bg-light"
                                placeholder="Se rellena al seleccionar la matrícula" readonly>
                        </div>

                        <!-- Selector de Materia -->
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-semibold text-uppercase">
                                Materia
                                <span v-if="sinMaterias" class="text-danger ms-1 small fw-normal">(ninguna registrada)</span>
                            </label>
                            <select v-model="inscripcion.idMateria" @change="onMateriaChange"
                                class="form-select form-select-sm"
                                :class="sinMaterias ? 'is-invalid' : ''"
                                required :disabled="sinMaterias">
                                <option value="" disabled>Seleccione una materia...</option>
                                <option v-for="m in materiasDisponibles" :key="m.idMateria" :value="m.idMateria">
                                    {{ m.codigo }} — {{ m.nombre }} ({{ m.uv }} UV)
                                </option>
                            </select>
                        </div>

                        <div class="row mb-1">
                            <div class="col-6">
                                <label class="form-label text-muted small fw-semibold text-uppercase">Fecha</label>
                                <input required v-model="inscripcion.fecha" type="date" class="form-control form-control-sm">
                            </div>
                            <div class="col-6">
                                <label class="form-label text-muted small fw-semibold text-uppercase">Ciclo</label>
                                <input :value="inscripcion.ciclo" type="text" class="form-control form-control-sm bg-light"
                                    placeholder="Se toma de la matrícula" readonly>
                            </div>
                        </div>

                    </div>
                    <div class="card-footer bg-white border-top d-flex gap-2 px-4 py-3">
                        <button type="submit" class="btn btn-sm px-3" style="background-color:#1a3a5c; color:white;"
                            :disabled="sinMatriculas || sinMaterias">
                            <i class="bi bi-save me-1"></i>Inscribir
                        </button>
                        <button type="reset" class="btn btn-sm btn-outline-secondary px-3">
                            <i class="bi bi-arrow-counterclockwise me-1"></i>Nuevo
                        </button>
                        <button type="button" @click="buscarInscripcion" class="btn btn-sm btn-outline-success px-3 ms-auto">
                            <i class="bi bi-search me-1"></i>Listado
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `
};