@extends('layouts.app')

@section('title', 'Gestión de Materias')

@section('content')
<div class="row w-100 m-0">
    <div class="col-12 col-xl-11 mx-auto">
        <!-- Formulario -->
        <div class="mb-5">
            <form id="frmMaterias" class="bg-white rounded-4 shadow-sm border border-light p-4 p-md-5">
                <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                        <i class="bi bi-journal-bookmark-fill fs-4"></i>
                    </div>
                    <div>
                        <h4 class="mb-1 fw-bold text-dark" id="form-title">Registro de Materias</h4>
                        <p class="mb-0 text-muted small">Catálogo de asignaturas de la institución</p>
                    </div>
                </div>

                <input type="hidden" id="idMateria" name="idMateria" value="0">
                <input type="hidden" id="accion" name="accion" value="nuevo">

                <div class="row g-4 mt-1">
                    <div class="col-md-4">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Código de Materia</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-upc-scan"></i></span>
                            <input id="codigo" name="codigo" placeholder="Ej. MAT-101" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6 font-monospace">
                        </div>
                    </div>
                    <div class="col-md-8">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">Nombre de la Asignatura</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-book"></i></span>
                            <input id="nombre" name="nombre" placeholder="Nombre completo" required type="text" class="form-control border-start-0 ps-0 text-dark fs-6">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted fw-semibold text-uppercase" style="font-size: 0.75rem;">UV</label>
                        <div class="input-group input-group-lg shadow-sm">
                            <span class="input-group-text bg-white text-muted border-end-0 px-3"><i class="bi bi-award"></i></span>
                            <input id="uv" name="uv" placeholder="Unidades Valorativas" required type="number" min="1" max="10" class="form-control border-start-0 ps-0 text-dark fs-6">
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
                <h5 class="fw-bold text-dark">Catálogo de Materias</h5>
                <input id="txtBuscar" type="search" placeholder="Buscar materias..." class="form-control w-25 rounded-pill shadow-sm">
            </div>
            
            <div class="table-responsive rounded-3 border">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="py-3 px-4 small fw-bold">Código</th>
                            <th class="py-3 px-4 small fw-bold">Materia</th>
                            <th class="py-3 px-4 small fw-bold">UV</th>
                            <th class="py-3 px-4 text-end small fw-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="listaMaterias"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let materias_cache = [];
        const listaMaterias = document.getElementById('listaMaterias');
        const txtBuscar = document.getElementById('txtBuscar');
        const frmMaterias = document.getElementById('frmMaterias');
        const btnCancelar = document.getElementById('btn-cancelar');

        const obtenerMaterias = async () => {
            try {
                const res = await fetch('/api/materias');
                materias_cache = await res.json();
                filtrarMaterias();
            } catch (error) { console.error(error); }
        };

        const filtrarMaterias = () => {
            const buscar = txtBuscar.value.toLowerCase();
            const filtrados = materias_cache.filter(m => 
                m.nombre.toLowerCase().includes(buscar) || 
                m.codigo.toLowerCase().includes(buscar)
            );

            listaMaterias.innerHTML = filtrados.map(m => `
                <tr data-id="${m.idMateria}">
                    <td class="py-3 px-4 font-monospace small">${m.codigo}</td>
                    <td class="py-3 px-4 fw-bold">${m.nombre}</td>
                    <td class="py-3 px-4"><span class="badge bg-primary bg-opacity-10 text-primary">${m.uv} UV</span></td>
                    <td class="py-3 px-4 text-end">
                        <button class="btn btn-sm btn-light text-primary rounded-circle btn-editar"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-light text-danger rounded-circle btn-eliminar"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        };

        listaMaterias.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            if(!row) return;
            const id = parseInt(row.dataset.id);
            const m = materias_cache.find(x => x.idMateria === id);

            if(e.target.closest('.btn-editar')) {
                if(!m) return;
                document.getElementById('idMateria').value = m.idMateria;
                document.getElementById('codigo').value = m.codigo;
                document.getElementById('nombre').value = m.nombre;
                document.getElementById('uv').value = m.uv;
                document.getElementById('accion').value = 'modificar';
                document.getElementById('form-title').textContent = 'Modificando Materia: ' + m.nombre;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if(e.target.closest('.btn-eliminar')) {
                if(!m) return;
                alertify.confirm('Materias', '¿Eliminar esta materia?', async () => {
                    await fetch(`/api/materias/${id}`, { method: 'DELETE' });
                    alertify.success('Eliminada');
                    obtenerMaterias();
                }, null);
            }
        });

        frmMaterias.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(frmMaterias));
            const id = document.getElementById('idMateria').value;
            const accion = document.getElementById('accion').value;
            const url = accion === 'nuevo' ? '/api/materias' : `/api/materias/${id}`;
            
            await fetch(url, {
                method: accion === 'nuevo' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            alertify.success('Guardada');
            frmMaterias.reset();
            resetForm();
            obtenerMaterias();
        });

        const resetForm = () => {
            document.getElementById('idMateria').value = '0';
            document.getElementById('accion').value = 'nuevo';
            document.getElementById('form-title').textContent = 'Registro de Materias';
        };

        btnCancelar.addEventListener('click', resetForm);
        txtBuscar.addEventListener('keyup', filtrarMaterias);
        obtenerMaterias();
    });
</script>
@endpush
