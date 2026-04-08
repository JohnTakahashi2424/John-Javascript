@extends('layouts.app')

@section('title', 'Gestión de Alumnos')

@section('content')
<div class="row w-100 m-0">
    <div class="col-12 col-xl-11 mx-auto">
        <!-- Sección de Registro (Formulario) -->
        <div id="seccion-registro" class="mb-5">
            <form id="frmAlumnos" class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
                <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi bi-people-fill fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-1 fw-bold text-dark" id="form-title">Registro de Alumnos</h4>
                        <p class="mb-0 text-muted small">Crea o actualiza expedientes de estudiantes en la plataforma</p>
                    </div>
                </div>

                <input type="hidden" id="idAlumno" name="idAlumno" value="0">
                <input type="hidden" id="accion" name="accion" value="nuevo">

                <div class="row g-4 mt-1">
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Código del Alumno</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-upc-scan"></i></span>
                            <input id="codigo" name="codigo" placeholder="Ej. A001" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6 font-monospace">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Nombre Completo</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-person"></i></span>
                            <input id="nombre" name="nombre" placeholder="Apellidos, Nombres" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                    <div class="col-md-12">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Dirección Residencial</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-geo-alt"></i></span>
                            <input id="direccion" name="direccion" placeholder="Calle, Avenida, Casa..." required type="text" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Correo Electrónico Oficial</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-envelope"></i></span>
                            <input id="email" name="email" placeholder="usuario@institucion.edu" required type="email" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Teléfono de Contacto</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-telephone"></i></span>
                            <input id="telefono" name="telefono" placeholder="+00 (000) 0000-0000" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                    <button type="reset" class="btn btn-light text-muted fw-semibold px-4 py-2 border shadow-sm rounded-pill transition-all" id="btn-cancelar">
                        <i class="bi bi-eraser me-2"></i> Limpiar
                    </button>
                    <button type="submit" class="btn btn-primary fw-semibold px-5 py-2 shadow rounded-pill transition-all">
                        <i class="bi bi-check2-circle me-2"></i> Confirmar & Guardar
                    </button>
                </div>
            </form>
        </div>

        <!-- Sección de Búsqueda y Lista -->
        <div class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
            <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div class="d-flex align-items-center">
                    <div class="bg-success bg-opacity-10 text-success rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi bi-search fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-1 fw-bold text-dark">Búsqueda de Alumnos</h4>
                        <p class="mb-0 text-muted small">Localización y gestión de expedientes existentes</p>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <div class="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                    <span class="input-group-text bg-white border-end-0 pe-1 text-muted ps-4"><i class="bi bi-search"></i></span>
                    <input id="txtBuscar" autocomplete="off" type="search" placeholder="Ingresa código, nombre o email para buscar..." class="form-control border-start-0 ps-2 bg-white fs-6">
                </div>
            </div>
            
            <div class="table-responsive rounded-3 border border-light shadow-sm">
                <table class="table table-hover align-middle mb-0 bg-white">
                    <thead class="bg-light">
                        <tr>
                            <th class="py-3 px-4 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Código</th>
                            <th class="py-3 px-4 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Estudiante</th>
                            <th class="py-3 px-4 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Dirección</th>
                            <th class="py-3 px-4 text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Contacto</th>
                            <th class="py-3 px-4 text-end text-muted fw-semibold text-uppercase" style="font-size: 0.7rem;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="listaAlumnos">
                        <!-- Se llena vía JS -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let alumnos_cache = [];
        const listaAlumnos = document.getElementById('listaAlumnos');
        const txtBuscar = document.getElementById('txtBuscar');
        const frmAlumnos = document.getElementById('frmAlumnos');
        const btnCancelar = document.getElementById('btn-cancelar');

        const obtenerAlumnos = async () => {
            try {
                const res = await fetch('/api/alumnos');
                alumnos_cache = await res.json();
                filtrarAlumnos();
            } catch (error) {
                console.error('Error al obtener alumnos:', error);
            }
        };

        const filtrarAlumnos = () => {
            const buscar = txtBuscar.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const terminos = buscar.split(' ').filter(t => t.length > 0);
            
            const filtrados = alumnos_cache.filter(a => {
                const dataString = `${a.codigo} ${a.nombre} ${a.email} ${a.direccion} ${a.telefono}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return terminos.every(t => dataString.includes(t));
            });

            listaAlumnos.innerHTML = filtrados.length > 0 ? filtrados.map(a => `
                <tr data-id="${a.idAlumno}">
                    <td class="py-3 px-4 font-monospace small">${a.codigo}</td>
                    <td class="py-3 px-4 fw-bold">${a.nombre}</td>
                    <td class="py-3 px-4 text-muted small">${a.direccion}</td>
                    <td class="py-3 px-4">
                        <div class="small">${a.email}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">${a.telefono}</div>
                    </td>
                    <td class="py-3 px-4 text-end">
                        <button class="btn btn-sm btn-light text-primary rounded-circle btn-editar" title="Editar"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-light text-danger rounded-circle btn-eliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('') : `<tr><td colspan="5" class="text-center p-5 text-muted">No se encontraron registros</td></tr>`;
        };

        // Delegación de eventos para botones de la tabla (Puro Vanilla JS)
        listaAlumnos.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            if (!row) return;
            const id = parseInt(row.dataset.id);
            const a = alumnos_cache.find(x => x.idAlumno === id);

            if (e.target.closest('.btn-editar')) {
                if(!a) return;
                document.getElementById('idAlumno').value = a.idAlumno;
                document.getElementById('codigo').value = a.codigo;
                document.getElementById('nombre').value = a.nombre;
                document.getElementById('direccion').value = a.direccion;
                document.getElementById('email').value = a.email;
                document.getElementById('telefono').value = a.telefono;
                document.getElementById('accion').value = 'modificar';
                document.getElementById('form-title').textContent = 'Modificando Alumno: ' + a.nombre;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            if (e.target.closest('.btn-eliminar')) {
                if(!a) return;
                alertify.confirm('Eliminar Alumno', `¿Estás seguro de eliminar a ${a.nombre}?`, async () => {
                    const res = await fetch(`/api/alumnos/${id}`, { method: 'DELETE' });
                    if(await res.json() === true) {
                        alertify.success('Alumno eliminado');
                        obtenerAlumnos();
                    } else {
                        alertify.error('Error al eliminar');
                    }
                }, null);
            }
        });

        frmAlumnos.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(frmAlumnos));
            const id = document.getElementById('idAlumno').value;
            const accion = document.getElementById('accion').value;

            const url = accion === 'nuevo' ? '/api/alumnos' : `/api/alumnos/${id}`;
            const method = accion === 'nuevo' ? 'POST' : 'PUT';

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if(res.ok) {
                    alertify.success('Datos guardados correctamente');
                    frmAlumnos.reset();
                    resetForm();
                    obtenerAlumnos();
                } else {
                    alertify.error('Error al guardar datos');
                }
            } catch (error) {
                alertify.error('Error de conexión con el servidor');
            }
        });

        const resetForm = () => {
            document.getElementById('idAlumno').value = '0';
            document.getElementById('accion').value = 'nuevo';
            document.getElementById('form-title').textContent = 'Registro de Alumnos';
        };

        btnCancelar.addEventListener('click', resetForm);
        txtBuscar.addEventListener('keyup', filtrarAlumnos);

        obtenerAlumnos();
    });
</script>
@endpush
