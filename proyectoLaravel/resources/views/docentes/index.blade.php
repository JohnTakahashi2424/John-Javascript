@extends('layouts.app')

@section('title', 'Gestión de Docentes')

@section('content')
<div class="row w-100 m-0">
    <div class="col-12 col-xl-11 mx-auto">
        <!-- Formulario -->
        <div class="mb-5">
            <form id="frmDocentes" class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
                <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi bi-person-workspace fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-1 fw-bold text-dark" id="form-title">Registro de Docentes</h4>
                        <p class="mb-0 text-muted small">Crea o actualiza perfiles del profesorado</p>
                    </div>
                </div>

                <input type="hidden" id="idDocente" name="idDocente" value="0">
                <input type="hidden" id="accion" name="accion" value="nuevo">

                <div class="row g-4 mt-1">
                    <div class="col-md-4">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Código de Docente</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-upc-scan"></i></span>
                            <input id="codigo" name="codigo" placeholder="Ej. D001" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6 font-monospace">
                        </div>
                    </div>
                    <div class="col-md-8">
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
                    <div class="col-md-5">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Correo Electrónico</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-envelope"></i></span>
                            <input id="email" name="email" placeholder="profesor@institucion.edu" required type="email" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Teléfono</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-telephone"></i></span>
                            <input id="telefono" name="telefono" placeholder="+00 (000)" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Escalafón</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-award"></i></span>
                            <select id="escalafon" name="escalafon" required class="form-select border-start-0 ps-0 text-dark fs-6">
                                <option value="tecnico">Técnico</option>
                                <option value="profesor">Profesor</option>
                                <option value="ingeniero">Lic./Ingeniero</option>
                                <option value="maestria">Maestría</option>
                                <option value="doctor">Doctor</option>
                            </select>
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
                <h5 class="fw-bold text-dark">Búsqueda de Docentes</h5>
                <input id="txtBuscar" type="search" placeholder="Buscar docentes..." class="form-control w-25 rounded-pill shadow-sm">
            </div>
            
            <div class="table-responsive rounded-3 border">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="py-3 px-4 small fw-bold">Código</th>
                            <th class="py-3 px-4 small fw-bold">Docente</th>
                            <th class="py-3 px-4 small fw-bold">Escalafón</th>
                            <th class="py-3 px-4 small fw-bold">Contacto</th>
                            <th class="py-3 px-4 text-end small fw-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="listaDocentes"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let docentes_cache = [];
        const listaDocentes = document.getElementById('listaDocentes');
        const txtBuscar = document.getElementById('txtBuscar');
        const frmDocentes = document.getElementById('frmDocentes');
        const btnCancelar = document.getElementById('btn-cancelar');

        const obtenerDocentes = async () => {
            try {
                const res = await fetch('/api/docentes');
                docentes_cache = await res.json();
                filtrarDocentes();
            } catch (error) { console.error(error); }
        };

        const filtrarDocentes = () => {
            const buscar = txtBuscar.value.toLowerCase();
            const filtrados = docentes_cache.filter(d => 
                d.nombre.toLowerCase().includes(buscar) || 
                d.codigo.toLowerCase().includes(buscar) ||
                d.email.toLowerCase().includes(buscar)
            );

            listaDocentes.innerHTML = filtrados.map(d => `
                <tr data-id="${d.idDocente}">
                    <td class="py-3 px-4 font-monospace small">${d.codigo}</td>
                    <td class="py-3 px-4 fw-bold">${d.nombre}</td>
                    <td class="py-3 px-4"><span class="badge bg-info bg-opacity-10 text-info">${d.escalafon}</span></td>
                    <td class="py-3 px-4 small">${d.email}<br>${d.telefono}</td>
                    <td class="py-3 px-4 text-end">
                        <button class="btn btn-sm btn-light text-primary rounded-circle btn-editar"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-light text-danger rounded-circle btn-eliminar"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        };

        listaDocentes.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            if(!row) return;
            const id = parseInt(row.dataset.id);
            const d = docentes_cache.find(x => x.idDocente === id);

            if(e.target.closest('.btn-editar')) {
                if(!d) return;
                document.getElementById('idDocente').value = d.idDocente;
                document.getElementById('codigo').value = d.codigo;
                document.getElementById('nombre').value = d.nombre;
                document.getElementById('direccion').value = d.direccion;
                document.getElementById('email').value = d.email;
                document.getElementById('telefono').value = d.telefono;
                document.getElementById('escalafon').value = d.escalafon;
                document.getElementById('accion').value = 'modificar';
                document.getElementById('form-title').textContent = 'Modificando Docente: ' + d.nombre;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if(e.target.closest('.btn-eliminar')) {
                if(!d) return;
                alertify.confirm('Docentes', '¿Eliminar este docente?', async () => {
                    await fetch(`/api/docentes/${id}`, { method: 'DELETE' });
                    alertify.success('Eliminado');
                    obtenerDocentes();
                }, null);
            }
        });

        frmDocentes.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(frmDocentes));
            const id = document.getElementById('idDocente').value;
            const accion = document.getElementById('accion').value;
            const url = accion === 'nuevo' ? '/api/docentes' : `/api/docentes/${id}`;
            
            await fetch(url, {
                method: accion === 'nuevo' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            alertify.success('Guardado');
            frmDocentes.reset();
            resetForm();
            obtenerDocentes();
        });

        const resetForm = () => {
            document.getElementById('idDocente').value = '0';
            document.getElementById('accion').value = 'nuevo';
            document.getElementById('form-title').textContent = 'Registro de Docentes';
        };

        btnCancelar.addEventListener('click', resetForm);
        txtBuscar.addEventListener('keyup', filtrarDocentes);
        obtenerDocentes();
    });
</script>
@endpush
