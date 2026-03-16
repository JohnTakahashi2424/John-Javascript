const busqueda_inscripciones = {
    data() {
        return {
            buscar: '',
            inscripciones: []
        }
    },
    methods: {
        modificarInscripcion(inscripcion) {
            this.$emit('modificar', inscripcion);
        },
        async obtenerInscripciones() {
            const allInscripciones = await db.inscripciones.toArray();
            const allAlumnos = await db.alumnos.toArray();
            const allMaterias = await db.materias.toArray();

            this.inscripciones = allInscripciones.filter(i => {
                const alumno = allAlumnos.find(a => a.idAlumno == i.idAlumno);
                const materia = allMaterias.find(m => m.idMateria == i.idMateria);
                const nombreAlumno = alumno ? alumno.nombre.toLowerCase() : "";
                const nombreMateria = materia ? materia.nombre.toLowerCase() : "";
                return nombreAlumno.includes(this.buscar.toLowerCase()) || nombreMateria.includes(this.buscar.toLowerCase()) || i.ciclo.toLowerCase().includes(this.buscar.toLowerCase());
            }).map(i => {
                const alumno = allAlumnos.find(a => a.idAlumno == i.idAlumno);
                const materia = allMaterias.find(m => m.idMateria == i.idMateria);
                return {
                    ...i,
                    nombreAlumno: alumno ? alumno.nombre : "Desconocido",
                    nombreMateria: materia ? materia.nombre : "Desconocida"
                };
            });
            
            if(allInscripciones.length < 1 && this.buscar.length <= 0) {
                fetch(`private/modulos/inscripciones/inscripcion.php?accion=consultar`)
                    .then(response => response.json())
                    .then(data => {
                        db.inscripciones.bulkAdd(data);
                        this.obtenerInscripciones(); // Re-render once data is added to IndexedDB
                    });
            }
        },
        async eliminarInscripcion(inscripcion, e) {
            e.stopPropagation();
            alertify.confirm('Eliminar Inscripcion', `¿Está seguro de eliminar esta inscripción?`, async e => {
                await db.inscripciones.delete(inscripcion.idInscripcion);
                this.obtenerInscripciones();
                alertify.success(`Inscripción eliminada correctamente`);
            }, () => { });
        }
    },
    mounted() {
        this.obtenerInscripciones();
    },
    template: `
        <div class="row mt-4">
            <div class="col-12 col-md-10 col-lg-8 col-xl-7 mx-auto">
                <div class="card shadow-sm border-0 rounded-4 mb-4 bg-body">
                    <div class="card-header bg-success text-white text-center py-2 rounded-top-4 border-0">
                        <h5 class="mb-0 fw-bold fs-6"><i class="bi bi-search me-2"></i> BÚSQUEDA DE INSCRIPCIONES</h5>
                    </div>
                    <div class="card-body p-3">
                        <div class="input-group input-group-sm mb-3 shadow-sm rounded-pill overflow-hidden">
                            <span class="input-group-text bg-body-tertiary border-0 text-secondary px-3"><i class="bi bi-search"></i></span>
                            <input autocomplete="off" type="search" @keyup="obtenerInscripciones()" v-model="buscar" placeholder="Buscar por alumno, materia o ciclo..." class="form-control bg-body-tertiary border-0 px-3 text-body shadow-none py-1">
                        </div>
                        <div class="table-responsive">
                            <table class="table table-sm fs-6 table-hover align-middle mb-0" id="tblInscripciones">
                                <thead>
                                    <tr>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">ALUMNO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">MATERIA</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">CICLO</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold">FECHA</th>
                                        <th class="py-2 border-bottom-0 text-secondary fw-semibold text-center">ELIMINAR</th>
                                    </tr>
                                </thead>
                                <tbody class="border-top-0">
                                    <tr v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)" class="cursor-pointer transition-all">
                                        <td class="fw-semibold">{{ inscripcion.nombreAlumno }}</td>
                                        <td>{{ inscripcion.nombreMateria }}</td>
                                        <td><span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 fs-6 rounded-pill px-3">{{ inscripcion.ciclo }}</span></td>
                                        <td>{{ inscripcion.fecha }}</td>
                                        <td class="text-center">
                                            <button @click.stop="eliminarInscripcion(inscripcion, $event)" class="btn btn-danger btn-sm rounded-pill shadow-sm px-2">
                                                <i class="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="inscripciones.length == 0">
                                        <td colspan="5" class="text-center text-muted py-3">No se encontraron inscripciones...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 text-center pb-4">
                        <button type="button" @click="mostrarFormulario('inscripciones')" class="btn btn-outline-secondary rounded-pill px-4 shadow-sm">
                            <i class="bi bi-arrow-left-circle me-1"></i> Volver a Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};