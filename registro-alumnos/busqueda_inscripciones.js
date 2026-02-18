const busqueda_inscripciones = {
    data(){
        return{
            buscar:'',
            inscripciones:[]
        }
    },
    methods:{
        getRomano(n) {
            const romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
            return romanos[n - 1] || n;
        },
        modificarInscripcion(ins){
            this.$emit('modificar', ins);
        },
        async obtenerInscripciones(){
            this.inscripciones = await db.inscripciones.filter(
                ins => ins.alumno.toLowerCase().includes(this.buscar.toLowerCase())
                    || ins.materia.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarInscripcion(ins, e){
            e.stopPropagation();
            alertify.confirm('Eliminar', `¿Eliminar la inscripción de ${ins.alumno} en ${ins.materia}?`, async e=>{
                await db.inscripciones.delete(ins.idInscripcion);
                this.obtenerInscripciones();
                alertify.success(`Inscripción eliminada`);
            }, () => {});
        },
    },
    template: `
        <div>
            <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                <i class="bi bi-search me-2 fs-5 text-secondary"></i>
                <h5 class="mb-0 fw-semibold">Búsqueda de Inscripciones</h5>
            </div>
            <div class="mb-3" style="max-width: 340px;">
                <input type="search" @keyup="obtenerInscripciones()" v-model="buscar"
                    placeholder="Buscar por alumno o materia..." class="form-control form-control-sm">
            </div>
            <div class="table-responsive">
                <table class="table table-sm table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="text-muted small text-uppercase fw-semibold">Alumno</th>
                            <th class="text-muted small text-uppercase fw-semibold">Materia</th>
                            <th class="text-muted small text-uppercase fw-semibold">Fecha</th>
                            <th class="text-muted small text-uppercase fw-semibold text-center">Ciclo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="inscripciones.length === 0">
                            <td colspan="5" class="text-center text-muted py-3 small">Sin resultados</td>
                        </tr>
                        <tr v-for="ins in inscripciones" :key="ins.idInscripcion" @click="modificarInscripcion(ins)" style="cursor:pointer;">
                            <td class="small fw-semibold">{{ ins.alumno }}</td>
                            <td class="small">{{ ins.materia }}</td>
                            <td class="small text-muted">{{ ins.fecha }}</td>
                            <td class="text-center">
                                <span class="badge" style="background-color:#1a3a5c;">{{ getRomano(ins.ciclo) }}</span>
                            </td>
                            <td>
                                <button class="btn btn-outline-danger btn-sm py-0 px-2" @click="eliminarInscripcion(ins, $event)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};