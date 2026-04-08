@extends('layouts.app')

@section('title', 'Gestión de Inscripciones')

@section('content')
<div class="row w-100 m-0">
    <div class="col-12 col-xl-11 mx-auto">
        <!-- Formulario -->
        <div class="mb-5">
            <form id="frmInscripciones" class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
                <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi bi-journal-text fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-1 fw-bold text-dark" id="form-title">Registro de Inscripciones</h4>
                        <p class="mb-0 text-muted small">Asigna materias a los estudiantes para el ciclo actual</p>
                    </div>
                </div>

                <input type="hidden" id="idInscripcion" name="idInscripcion" value="0">
                <input type="hidden" id="accion" name="accion" value="nuevo">

                <div class="row g-4 mt-1">
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Estudiante</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-person-badge"></i></span>
                            <select id="idAlumno" name="idAlumno" required class="form-select border-start-0 ps-0 text-dark fs-6">
                                <option value="0" disabled selected>Seleccione un alumno...</option>
                                <!-- Se llena vía JS -->
                            </select>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Asignatura</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-book"></i></span>
                            <select id="idMateria" name="idMateria" required class="form-select border-start-0 ps-0 text-dark fs-6">
                                <option value="0" disabled selected>Seleccione una materia...</option>
                                <!-- Se llena vía JS -->
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Ciclo</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-calendar3"></i></span>
                            <input id="ciclo" name="ciclo" placeholder="Ej. 01-2026" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6 font-monospace">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Fecha</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-calendar-date"></i></span>
                            <input id="fecha" name="fecha" required type="date" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                    <button type="reset" id="btn-cancelar" class="btn btn-light text-muted fw-semibold px-4 py-2 border shadow-sm rounded-pill transition-all">
                        <i class="bi bi-eraser me-2"></i> Limpiar
                    </button>
                    <button type="submit" class="btn btn-primary fw-semibold px-5 py-2 shadow rounded-pill transition-all">
                        <i class="bi bi-check2-circle me-2"></i> Confirmar & Guardar
                    </button>
                </div>
            </form>
        </div>

        <!-- Lista -->
        <div class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
            <div class="mb-4 d-flex justify-content-between align-items-center">
                <h5 class="fw-bold text-dark">Archivo de Inscripciones</h5>
                <input id="txtBuscar" type="search" placeholder="Buscar por alumno o materia..." class="form-control w-25 rounded-pill shadow-sm">
            </div>
            
            <div class="table-responsive rounded-3 border">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="py-3 px-4 small fw-bold">Estudiante</th>
                            <th class="py-3 px-4 small fw-bold">Asignatura</th>
                            <th class="py-3 px-4 small fw-bold">Ciclo</th>
                            <th class="py-3 px-4 small fw-bold">Fecha</th>
                            <th class="py-3 px-4 text-end small fw-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="listaInscripciones"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    let inscripciones_cache = [];
    let alumnos_cache = [];
    let materias_cache = [];
    
    const listaInscripciones = document.getElementById('listaInscripciones');
    const selectAlumnos = document.getElementById('idAlumno');
    const selectMaterias = document.getElementById('idMateria');
    const txtBuscar = document.getElementById('txtBuscar');
    const frmInscripciones = document.getElementById('frmInscripciones');

    const cargarCatalogos = async () => {
        const [resA, resM] = await Promise.all([
            fetch('/api/alumnos'),
            fetch('/api/materias')
        ]);
        alumnos_cache = await resA.json();
        materias_cache = await resM.json();

        selectAlumnos.innerHTML = '<option value="0" disabled selected>Seleccione un alumno...</option>' + 
            alumnos_cache.map(a => `<option value="${a.idAlumno}">${a.nombre}</option>`).join('');
            
        selectMaterias.innerHTML = '<option value="0" disabled selected>Seleccione una materia...</option>' + 
            materias_cache.map(m => `<option value="${m.idMateria}">${m.nombre}</option>`).join('');
    };

    const obtenerInscripciones = async () => {
        const res = await fetch('/api/inscripciones');
        inscripciones_cache = await res.json();
        filtrarInscripciones();
    };

    const filtrarInscripciones = () => {
        const buscar = txtBuscar.value.toLowerCase();
        const filtrados = inscripciones_cache.filter(i => 
            i.nombreAlumno.toLowerCase().includes(buscar) || 
            i.nombreMateria.toLowerCase().includes(buscar) ||
            i.ciclo.toLowerCase().includes(buscar)
        );

        listaInscripciones.innerHTML = filtrados.map(i => `
            <tr>
                <td class="py-3 px-4 fw-bold">${i.nombreAlumno}</td>
                <td class="py-3 px-4">${i.nombreMateria}</td>
                <td class="py-3 px-4 font-monospace small">${i.ciclo}</td>
                <td class="py-3 px-4 small">${i.fecha}</td>
                <td class="py-3 px-4 text-end">
                    <button onclick="editarInscripcion(${i.idInscripcion})" class="btn btn-sm btn-light text-primary rounded-circle"><i class="bi bi-pencil"></i></button>
                    <button onclick="eliminarInscripcion(${i.idInscripcion})" class="btn btn-sm btn-light text-danger rounded-circle"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    };

    const editarInscripcion = (id) => {
        const i = inscripciones_cache.find(x => x.idInscripcion === id);
        if(!i) return;
        document.getElementById('idInscripcion').value = i.idInscripcion;
        document.getElementById('idAlumno').value = i.idAlumno;
        document.getElementById('idMateria').value = i.idMateria;
        document.getElementById('ciclo').value = i.ciclo;
        document.getElementById('fecha').value = i.fecha;
        document.getElementById('accion').value = 'modificar';
        document.getElementById('form-title').textContent = 'Modificando Inscripción';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarInscripcion = (id) => {
        alertify.confirm('Inscripciones', '¿Eliminar esta inscripción?', async () => {
            await fetch(`/api/inscripciones/${id}`, { method: 'DELETE' });
            alertify.success('Eliminada');
            obtenerInscripciones();
        }, null);
    };

    frmInscripciones.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(frmInscripciones));
        const id = document.getElementById('idInscripcion').value;
        const accion = document.getElementById('accion').value;
        const url = accion === 'nuevo' ? '/api/inscripciones' : `/api/inscripciones/${id}`;
        
        await fetch(url, {
            method: accion === 'nuevo' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alertify.success('Inscripción guardada');
        frmInscripciones.reset();
        resetForm();
        obtenerInscripciones();
    };

    const resetForm = () => {
        document.getElementById('idInscripcion').value = '0';
        document.getElementById('accion').value = 'nuevo';
        document.getElementById('form-title').textContent = 'Registro de Inscripciones';
    };

    document.getElementById('btn-cancelar').onclick = resetForm;
    txtBuscar.onkeyup = filtrarInscripciones;
    
    cargarCatalogos();
    obtenerInscripciones();
</script>
@endpush
