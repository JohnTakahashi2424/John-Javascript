const matricula = {
    props:['forms'],
    data(){
        return{
            matricula:{
                idMatricula:0,
                codigo:"",
                idAlumno: null,
                nombreAlumno:"",
                carrera:"",
                ciclo:"",
                fecha:"",
                estado:"Activo"
            },
            accion:'nuevo',
            idMatricula:0,
            // Búsqueda de alumno
            buscarAlumno:'',
            alumnosEncontrados:[],
            alumnoSeleccionado: null,
            buscandoAlumno: false,
            sinAlumnos: false,
        }
    },
    methods:{
        buscarMatricula(){
            this.forms.busqueda_matricula.mostrar = !this.forms.busqueda_matricula.mostrar;
            this.$emit('buscar');
        },
        // Busca alumnos en tiempo real mientras el usuario escribe
        async buscarAlumnos(){
            this.alumnoSeleccionado = null;
            this.matricula.idAlumno = null;
            this.matricula.nombreAlumno = '';
            if(this.buscarAlumno.trim().length === 0){
                this.alumnosEncontrados = [];
                this.sinAlumnos = false;
                return;
            }
            this.buscandoAlumno = true;
            const q = this.buscarAlumno.toLowerCase();
            this.alumnosEncontrados = await db.alumnos.filter(
                a => a.nombre.toLowerCase().includes(q) || a.codigo.toLowerCase().includes(q)
            ).toArray();
            this.sinAlumnos = this.alumnosEncontrados.length === 0;
            this.buscandoAlumno = false;
        },
        // Selecciona un alumno de la lista
        seleccionarAlumno(alumno){
            this.alumnoSeleccionado = alumno;
            this.matricula.idAlumno = alumno.idAlumno;
            this.matricula.nombreAlumno = alumno.nombre;
            this.buscarAlumno = alumno.nombre;
            this.alumnosEncontrados = [];
            this.sinAlumnos = false;
        },
        modificarMatricula(mat){
            this.accion = 'modificar';
            this.idMatricula = mat.idMatricula;
            this.matricula.codigo = mat.codigo;
            this.matricula.idAlumno = mat.idAlumno;
            this.matricula.nombreAlumno = mat.nombreAlumno;
            this.matricula.carrera = mat.carrera;
            this.matricula.ciclo = mat.ciclo;
            this.matricula.fecha = mat.fecha;
            this.matricula.estado = mat.estado;
            this.buscarAlumno = mat.nombreAlumno;
            this.alumnoSeleccionado = { idAlumno: mat.idAlumno, nombre: mat.nombreAlumno };
        },
        async guardarMatricula() {
            if(!this.alumnoSeleccionado){
                alertify.error('Debe seleccionar un alumno registrado.');
                return;
            }
            let datos = {
                idMatricula: this.accion=='modificar' ? this.idMatricula : this.getId(),
                codigo: this.matricula.codigo,
                idAlumno: this.matricula.idAlumno,
                nombreAlumno: this.matricula.nombreAlumno,
                carrera: this.matricula.carrera,
                ciclo: this.matricula.ciclo,
                fecha: this.matricula.fecha,
                estado: this.matricula.estado
            };
            await db.matricula.put(datos);
            this.limpiarFormulario();
            alertify.success(`Matrícula de ${datos.nombreAlumno} guardada correctamente`);
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idMatricula = 0;
            this.matricula.codigo = '';
            this.matricula.idAlumno = null;
            this.matricula.nombreAlumno = '';
            this.matricula.carrera = '';
            this.matricula.ciclo = '';
            this.matricula.fecha = '';
            this.matricula.estado = 'Activo';
            this.buscarAlumno = '';
            this.alumnoSeleccionado = null;
            this.alumnosEncontrados = [];
            this.sinAlumnos = false;
        },
    },
    template: `
        <div>
            <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                <i class="bi bi-card-checklist me-2 fs-5 text-secondary"></i>
                <h5 class="mb-0 fw-semibold">Gestión de Matrículas</h5>
                <span v-if="accion=='modificar'" class="badge bg-warning text-dark ms-2">Editando</span>
            </div>
            <form id="frmMatricula" @submit.prevent="guardarMatricula" @reset.prevent="limpiarFormulario">
                <div class="card border-0 shadow-sm" style="max-width: 520px;">
                    <div class="card-body p-4">

                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label text-muted small fw-semibold text-uppercase">Código</label>
                                <input placeholder="MAT-001" required v-model="matricula.codigo" type="text" class="form-control form-control-sm">
                            </div>
                            <div class="col-6">
                                <label class="form-label text-muted small fw-semibold text-uppercase">Fecha</label>
                                <input required v-model="matricula.fecha" type="date" class="form-control form-control-sm">
                            </div>
                        </div>

                        <!-- Búsqueda de alumno en tiempo real -->
                        <div class="mb-3 position-relative">
                            <label class="form-label text-muted small fw-semibold text-uppercase">
                                Alumno
                                <span v-if="alumnoSeleccionado" class="badge bg-success ms-1">
                                    <i class="bi bi-check-circle me-1"></i>Seleccionado
                                </span>
                            </label>
                            <input
                                type="text"
                                v-model="buscarAlumno"
                                @input="buscarAlumnos"
                                placeholder="Escribe el nombre o código del alumno..."
                                class="form-control form-control-sm"
                                :class="sinAlumnos ? 'is-invalid' : alumnoSeleccionado ? 'is-valid' : ''"
                                autocomplete="off">
                            <!-- Lista de sugerencias -->
                            <ul v-if="alumnosEncontrados.length > 0"
                                class="list-group position-absolute w-100 shadow-sm"
                                style="z-index:100; top:100%; max-height:160px; overflow-y:auto;">
                                <li v-for="a in alumnosEncontrados" :key="a.idAlumno"
                                    class="list-group-item list-group-item-action py-1 px-3 small"
                                    style="cursor:pointer;"
                                    @mousedown.prevent="seleccionarAlumno(a)">
                                    <span class="fw-semibold">{{ a.nombre }}</span>
                                    <span class="text-muted ms-2">{{ a.codigo }}</span>
                                </li>
                            </ul>
                            <!-- Mensaje de error -->
                            <div v-if="sinAlumnos" class="invalid-feedback d-block">
                                <i class="bi bi-exclamation-triangle me-1"></i>
                                Alumno no encontrado. <strong>Regístralo primero en el módulo Alumnos.</strong>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label text-muted small fw-semibold text-uppercase">Carrera</label>
                            <input placeholder="Ej. Ingeniería en Sistemas" required v-model="matricula.carrera" type="text" class="form-control form-control-sm">
                        </div>
                        <div class="row mb-1">
                            <div class="col-6">
                                <label class="form-label text-muted small fw-semibold text-uppercase">Ciclo</label>
                                <input placeholder="01-2026" required v-model="matricula.ciclo" type="text" class="form-control form-control-sm">
                            </div>
                            <div class="col-6">
                                <label class="form-label text-muted small fw-semibold text-uppercase">Estado</label>
                                <select v-model="matricula.estado" class="form-select form-select-sm">
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    <div class="card-footer bg-white border-top d-flex gap-2 px-4 py-3">
                        <button type="submit" class="btn btn-sm px-3" style="background-color:#1a3a5c; color:white;"
                            :disabled="!alumnoSeleccionado">
                            <i class="bi bi-save me-1"></i>Guardar
                        </button>
                        <button type="reset" class="btn btn-sm btn-outline-secondary px-3">
                            <i class="bi bi-arrow-counterclockwise me-1"></i>Nuevo
                        </button>
                        <button type="button" @click="buscarMatricula" class="btn btn-sm btn-outline-success px-3 ms-auto">
                            <i class="bi bi-search me-1"></i>Buscar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `
};