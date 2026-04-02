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
    },
    template: `
        <div class="row">
            <div class="col-6">
                <table class="table table-striped table-hover" id="tblAlumnos">
                    <thead>
                        <tr>
                            <th colspan="6">
                                <input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" placeholder="Buscar alumno" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>EMAIL</th>
                            <th>TELEFONO</th>
                            <th>HASH</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)">
                            <td>{{ alumno.codigo }}</td>
                            <td>{{ alumno.nombre }}</td>
                            <td>{{ alumno.direccion }}</td>
                            <td>{{ alumno.email }}</td>
                            <td>{{ alumno.telefono }}</td>
                            <td>{{ alumno.hash }}</td>
                            <td>
                                <button class="btn btn-danger" @click="eliminarAlumno(alumno, $event)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};