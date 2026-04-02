export default {
    data() {
        return {
            buscar: '',
            matriculas: [],
            alumnos: []
        }
    },
    methods: {
        modificarMatricula(matricula) {
            this.$emit('modificar', matricula);
        },
        async obtenerMatriculas() {
            fetch(`/api/matriculas?buscar=${this.buscar}`)
                .then(response => response.json())
                .then(data => {
                    this.matriculas = data;
                });
        },
        async eliminarMatricula(matricula, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar Matricula', `¿Está seguro de eliminar esta matrícula?`, async () => {
                fetch(`/api/matriculas/${matricula.idMatricula}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        if(data!=true) alertify.error(`Error al sincronizar con el servidor: ${data}`);
                        this.obtenerMatriculas();
                    });
                alertify.success(`Matrícula eliminada correctamente`);
            }, () => { });
        },
        mostrarFormulario(ventana){
            this.$emit('regresar', ventana);
        }
    },
    mounted() {
        this.obtenerMatriculas();
    },
    template: `
        <div class="row mt-4">
            <div class="col-12 col-md-10 col-lg-8 col-xl-7 mx-auto">
                <div class="card shadow-sm border-0 rounded-4 mb-4 bg-body">
                    <div class="card-header bg-success text-white text-center py-2 rounded-top-4 border-0">
                        <h5 class="mb-0 fw-bold fs-6"><i class="bi bi-search me-2"></i> BÚSQUEDA DE MATRÍCULAS</h5>
                    </div>
                    <div class="card-body p-3">
                        <div class="input-group input-group-sm mb-3 shadow-sm rounded-pill overflow-hidden">
                            <span class="input-group-text bg-body-tertiary border-0 text-secondary px-3"><i class="bi bi-search"></i></span>
                            <input autocomplete="off" type="search" @keyup="obtenerMatriculas()" v-model="buscar" placeholder="Buscar por alumno o ciclo..." class="form-control bg-body-tertiary border-0 px-3 text-body shadow-none py-1">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm fs-6 table-hover align-middle mb-0" id="tblMatriculas">
                                <thead>
                                    <tr>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">ALUMNO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">CICLO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">FECHA</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">PAGADO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">
                                    <tr v-for="matricula in matriculas" :key="matricula.idMatricula" @click="modificarMatricula(matricula)" class="cursor-pointer transition-all">
                                        <td class="fw-semibold">{{ matricula.nombreAlumno }}</td>
                                        <td><span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 fs-6 rounded-pill px-3">{{ matricula.ciclo }}</span></td>
                                        <td>{{ matricula.fecha }}</td>
                                        <td>
                                            <span :class="matricula.pago === 'Si' ? 'bg-success text-success' : 'bg-danger text-danger'" class="badge bg-opacity-10 border border-opacity-25 fs-6 rounded-pill px-3">
                                                {{ matricula.pago === 'Si' ? 'Sí' : 'No' }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <div class="btn-group">
                                                <button @click.stop="modificarMatricula(matricula)" class="btn btn-outline-info btn-sm rounded-pill shadow-sm px-2 me-1">
                                                    <i class="bi bi-pencil-fill"></i>
                                                </button>
                                                <button @click.stop="eliminarMatricula(matricula, $event)" class="btn btn-outline-danger btn-sm rounded-pill shadow-sm px-2">
                                                    <i class="bi bi-trash-fill"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="matriculas.length == 0">
                                        <td colspan="5" class="text-center text-muted py-3">No se encontraron matrículas...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 text-center pb-4">
                        <button type="button" @click="mostrarFormulario('matriculas')" class="btn btn-outline-secondary rounded-pill px-4 shadow-sm">
                            <i class="bi bi-arrow-left-circle me-1"></i> Volver a Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};