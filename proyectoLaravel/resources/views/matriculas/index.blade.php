@extends('layouts.app')

@section('title', 'Gestión de Matrículas')

@section('content')
<div class="row w-100 m-0">
    <div class="col-12 col-xl-11 mx-auto">
        <!-- Formulario -->
        <div class="mb-5">
            <form id="frmMatriculas" class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
                <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi bi-person-lines-fill fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-1 fw-bold text-dark" id="form-title">Registro de Matrículas</h4>
                        <p class="mb-0 text-muted small">Inscribe estudiantes en sus respectivos ciclos académicos</p>
                    </div>
                </div>

                <input type="hidden" id="idMatricula" name="idMatricula" value="0">
                <input type="hidden" id="accion" name="accion" value="nuevo">

                <div class="row g-4 mt-1">
                    <div class="col-md-8">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Estudiante</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-person-badge"></i></span>
                            <select id="idAlumno" name="idAlumno" required class="form-select border-start-0 ps-0 text-dark fs-6">
                                <option value="0" disabled selected>Seleccione un alumno...</option>
                                <!-- Se llena vía JS -->
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
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
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Estado de Pago</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-cash-coin"></i></span>
                            <select id="pago" name="pago" required class="form-select border-start-0 ps-0 text-dark fs-6">
                                <option value="Si">Completado</option>
                                <option value="No">Pendiente</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                    <button type="reset" id="btn-cancelar" class="btn btn-light text-muted fw-semibold px-4 py-2 border shadow-sm rounded-pill transition-all">
                        <i class="bi bi-eraser me-2"></i> Limpiar
                    </button>
                    <button type="submit" class="btn btn-primary fw-semibold px-5 py-2 shadow rounded-pill transition-all">
                        <i class="bi bi-check2-circle me-2"></i> Guardar Registro
                    </button>
                </div>
            </form>
        </div>

        <!-- Lista -->
        <div class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
            <div class="mb-4 d-flex justify-content-between align-items-center">
                <h5 class="fw-bold text-dark">Historial de Matrículas</h5>
                <input id="txtBuscar" type="search" placeholder="Buscar por alumno o ciclo..." class="form-control w-25 rounded-pill shadow-sm">
            </div>
            
            <div class="table-responsive rounded-3 border">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="py-3 px-4 small fw-bold">Estudiante</th>
                            <th class="py-3 px-4 small fw-bold">Ciclo</th>
                            <th class="py-3 px-4 small fw-bold">Fecha</th>
                            <th class="py-3 px-4 small fw-bold">Estado</th>
                            <th class="py-3 px-4 text-end small fw-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="listaMatriculas"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    let matriculas_cache = [];
    let alumnos_cache = [];
    const listaMatriculas = document.getElementById('listaMatriculas');
    const selectAlumnos = document.getElementById('idAlumno');
    const txtBuscar = document.getElementById('txtBuscar');
    const frmMatriculas = document.getElementById('frmMatriculas');

    const obtenerAlumnos = async () => {
        const res = await fetch('/api/alumnos');
        alumnos_cache = await res.json();
        selectAlumnos.innerHTML = '<option value="0" disabled selected>Seleccione un alumno...</option>' + 
            alumnos_cache.map(a => `<option value="${a.idAlumno}">${a.nombre}</option>`).join('');
    };

    const obtenerMatriculas = async () => {
        const res = await fetch('/api/matriculas');
        matriculas_cache = await res.json();
        filtrarMatriculas();
    };

    const filtrarMatriculas = () => {
        const buscar = txtBuscar.value.toLowerCase();
        const filtrados = matriculas_cache.filter(m => 
            m.nombreAlumno.toLowerCase().includes(buscar) || 
            m.ciclo.toLowerCase().includes(buscar)
        );

        listaMatriculas.innerHTML = filtrados.map(m => `
            <tr>
                <td class="py-3 px-4 fw-bold">${m.nombreAlumno}</td>
                <td class="py-3 px-4 font-monospace small">${m.ciclo}</td>
                <td class="py-3 px-4 small">${m.fecha}</td>
                <td class="py-3 px-4">
                    <span class="badge ${m.pago === 'Si' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}">
                        ${m.pago === 'Si' ? 'Solvente' : 'Pendiente'}
                    </span>
                </td>
                <td class="py-3 px-4 text-end">
                    <button onclick="editarMatricula(${m.idMatricula})" class="btn btn-sm btn-light text-primary rounded-circle"><i class="bi bi-pencil"></i></button>
                    <button onclick="eliminarMatricula(${m.idMatricula})" class="btn btn-sm btn-light text-danger rounded-circle"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    };

    const editarMatricula = (id) => {
        const m = matriculas_cache.find(x => x.idMatricula === id);
        if(!m) return;
        document.getElementById('idMatricula').value = m.idMatricula;
        document.getElementById('idAlumno').value = m.idAlumno;
        document.getElementById('ciclo').value = m.ciclo;
        document.getElementById('fecha').value = m.fecha;
        document.getElementById('pago').value = m.pago;
        document.getElementById('accion').value = 'modificar';
        document.getElementById('form-title').textContent = 'Modificando Matrícula';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarMatricula = (id) => {
        alertify.confirm('Matrículas', '¿Eliminar esta matrícula?', async () => {
            await fetch(`/api/matriculas/${id}`, { method: 'DELETE' });
            alertify.success('Eliminada');
            obtenerMatriculas();
        }, null);
    };

    frmMatriculas.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(frmMatriculas));
        const id = document.getElementById('idMatricula').value;
        const accion = document.getElementById('accion').value;
        const url = accion === 'nuevo' ? '/api/matriculas' : `/api/matriculas/${id}`;
        
        await fetch(url, {
            method: accion === 'nuevo' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        alertify.success('Guardada');
        frmMatriculas.reset();
        resetForm();
        obtenerMatriculas();
    };

    const resetForm = () => {
        document.getElementById('idMatricula').value = '0';
        document.getElementById('accion').value = 'nuevo';
        document.getElementById('form-title').textContent = 'Registro de Matrículas';
    };

    document.getElementById('btn-cancelar').onclick = resetForm;
    txtBuscar.onkeyup = filtrarMatriculas;
    
    obtenerAlumnos();
    obtenerMatriculas();
</script>
@endpush
