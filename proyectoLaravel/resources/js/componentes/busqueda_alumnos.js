export default {
    data(){
        return{
            buscar:'',
            alumnos:[]
        }
    },
    methods:{
        modificarAlumno(alumno){
            this.$emit('modificar', alumno);
        },
        async obtenerAlumnos(){
            fetch(`/api/alumnos?buscar=${this.buscar}`)
                .then(response=>response.json())
                .then(data=>{
                    this.alumnos = data;
                });
        },
        async eliminarAlumno(alumno, e){
            e.stopPropagation();
            alertify.confirm('Elimanar alumnos', `¿Está seguro de eliminar el alumno ${alumno.nombre}?`, async e=>{
                fetch(`/api/alumnos/${alumno.idAlumno}`, { method: 'DELETE' })
                    .then(response=>response.json())
                    .then(data=>{
                        if(data!=true) alertify.error(`Error al sincronizar con el servidor: ${data}`);
                    });
                this.obtenerAlumnos();
                alertify.success(`Alumno ${alumno.nombre} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
        mostrarFormulario(ventana){
            this.$parent.abrirVentana(ventana);
        }
    },
    template: `
        <div class="row mt-4">
            <div class="col-12 col-md-11 col-lg-10 col-xl-9 mx-auto">
                <div class="card shadow-sm border-0 rounded-4 mb-4 bg-body">
                    <div class="card-header bg-success text-white text-center py-2 rounded-top-4 border-0">
                        <h5 class="mb-0 fw-bold fs-6"><i class="bi bi-search me-2"></i> BÚSQUEDA DE ALUMNOS</h5>
                    </div>
                    <div class="card-body p-3">
                        <div class="input-group input-group-sm mb-3 shadow-sm rounded-pill overflow-hidden">
                            <span class="input-group-text bg-body-tertiary border-0 text-secondary px-3"><i class="bi bi-search"></i></span>
                            <input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" placeholder="Buscar por código, nombre o correo..." class="form-control bg-body-tertiary border-0 px-3 text-body shadow-none py-1">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm fs-6 table-hover align-middle mb-0" id="tblAlumnos">
                                <thead>
                                    <tr>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">CÓDIGO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">NOMBRE</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">DIRECCIÓN</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">EMAIL</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">TELÉFONO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">
                                    <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)" class="cursor-pointer transition-all">
                                        <td><span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 fs-6 rounded-pill px-3">{{ alumno.codigo }}</span></td>
                                        <td class="fw-semibold">{{ alumno.nombre }}</td>
                                        <td>{{ alumno.direccion }}</td>
                                        <td>{{ alumno.email }}</td>
                                        <td>{{ alumno.telefono }}</td>
                                        <td class="text-center">
                                            <div class="btn-group">
                                                <button @click.stop="modificarAlumno(alumno)" class="btn btn-outline-info btn-sm rounded-pill shadow-sm px-2 me-1">
                                                    <i class="bi bi-pencil-fill"></i>
                                                </button>
                                                <button @click.stop="eliminarAlumno(alumno, $event)" class="btn btn-outline-danger btn-sm rounded-pill shadow-sm px-2">
                                                    <i class="bi bi-trash-fill"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="alumnos.length == 0">
                                        <td colspan="6" class="text-center text-muted py-3">No se encontraron alumnos...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 text-center pb-4">
                        <button type="button" @click="mostrarFormulario('alumnos')" class="btn btn-outline-secondary rounded-pill px-4 shadow-sm">
                            <i class="bi bi-arrow-left-circle me-1"></i> Volver a Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};