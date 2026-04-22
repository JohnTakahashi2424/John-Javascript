<template>
  <div class="pnc-wrapper min-vh-100 bg-dark text-white p-4">
    <nav class="navbar navbar-dark bg-transparent border-bottom border-secondary mb-4 pb-3 flex-column flex-md-row">
      <h3 class="navbar-brand mb-0 text-info fw-bold">SIGAT - Operaciones PNC</h3>
      <button class="btn btn-outline-danger btn-sm mt-3 mt-md-0" @click="logout">Cerrar Sesión</button>
    </nav>

    <div class="row g-4">
      <!-- Módulo de Búsqueda Multiparámetro -->
      <div class="col-lg-6">
        <div class="card bg-secondary border-0 shadow-lg rounded-4 h-100">
          <div class="card-header bg-transparent border-bottom border-dark p-4 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-semibold">Búsqueda de Incidentes</h5>
            <span class="badge bg-info text-dark">Rúbrica 6</span>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="searchAccidents" class="mb-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-light">Estado del Caso</label>
                  <select v-model="searchFilters.estado_caso" class="form-select bg-dark text-white border-secondary">
                    <option value="">Cualquier estado</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-light">Fecha de Registro</label>
                  <input type="date" v-model="searchFilters.fecha_registro" class="form-control bg-dark text-white border-secondary">
                </div>
                <div class="col-12 mt-3 text-end">
                  <button type="submit" class="btn btn-info action-btn text-dark fw-bold">Buscar Registros</button>
                </div>
              </div>
            </form>

            <div v-if="searchResults.length > 0">
              <div v-for="res in searchResults" :key="res.id" class="p-3 mb-3 bg-dark rounded border border-secondary">
                <h6 class="text-info mb-1">{{ res.direccion_exacta }}</h6>
                <div class="text-muted small">
                  <strong>Estado:</strong> {{ res.estado_caso }} | 
                  <strong>Fecha:</strong> {{ new Date(res.fecha_registro_oficial).toLocaleDateString() }}
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted p-4">
              No hay resultados para esta búsqueda o no has buscado aún.
            </div>
          </div>
        </div>
      </div>

      <!-- Módulo de Registro de Accidentes -->
      <div class="col-lg-6">
        <div class="card bg-secondary border-0 shadow-lg rounded-4 h-100">
          <div class="card-header bg-transparent border-bottom border-dark p-4">
            <h5 class="mb-0 fw-semibold">Registrar Informe Pericial</h5>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="submitAccidente">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label text-light">Dirección Exacta</label>
                  <input type="text" v-model="form.direccion_exacta" class="form-control bg-dark text-white border-secondary" required placeholder="Zona del siniestro">
                </div>
                <div class="col-12">
                  <label class="form-label text-light">Vehículos Involucrados</label>
                  <input type="text" v-model="form.vehiculos_involucrados" class="form-control bg-dark text-white border-secondary" required placeholder="Marca, modelo, color, placas">
                </div>
                <div class="col-md-6">
                  <label class="form-label text-light">Heridos</label>
                  <input type="number" v-model="form.numero_heridos" class="form-control bg-dark text-white border-secondary" min="0" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label text-light">Fallecidos</label>
                  <input type="number" v-model="form.numero_fallecidos" class="form-control bg-dark text-white border-secondary" min="0" required>
                </div>
                <!-- ID Reporte Conductor Opcional -->
                <div class="col-12 mt-2 text-warning small">
                  * El ID del Reporte Conductor es opcional.
                </div>
                <div class="col-12">
                  <label class="form-label text-light">Informe Pericial Oficial</label>
                  <textarea v-model="form.informe_pericial" class="form-control bg-dark text-white border-secondary" rows="4" required placeholder="Detalle oficial del accidente..."></textarea>
                </div>
              </div>

              <div class="mt-4 text-end">
                <button type="submit" class="btn btn-primary px-4 fw-bold action-btn">Guardar Informe Oficial</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'PanelPnc',
  data() {
    return {
      searchFilters: {
        estado_caso: '',
        fecha_registro: ''
      },
      searchResults: [],
      form: {
        oficial_id: localStorage.getItem('usuario_id'),
        reporte_conductor_id: null,
        direccion_exacta: '',
        vehiculos_involucrados: '',
        numero_heridos: 0,
        numero_fallecidos: 0,
        informe_pericial: '',
        estado_caso: 'En proceso'
      }
    }
  },
  methods: {
    async searchAccidents() {
      try {
        const response = await fetch('/api/accidentes-pnc/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.searchFilters)
        });

        if (!response.ok) throw new Error('Error al realizar búsqueda');

        this.searchResults = await response.json();

        if(this.searchResults.length === 0) {
           Swal.fire({
            icon: 'info',
            title: 'Sin coincidencias',
            text: 'No se encontraron accidentes con esos parámetros.',
            background: '#2d333b',
            color: '#fff',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    },

    async submitAccidente() {
      if(!this.form.direccion_exacta || !this.form.informe_pericial) {
          Swal.fire({
            icon: 'warning',
            title: 'Información Incompleta',
            text: 'La dirección y el informe pericial son obligatorios.',
            background: '#2d333b',
            color: '#fff'
          });
          return;
      }

      try {
        const response = await fetch('/api/accidentes-pnc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.form)
        });

        if (!response.ok) throw new Error('Error guardando en base de datos.');

        Swal.fire({
          icon: 'success',
          title: 'Registro Oficial Guardado',
          text: 'El informe ha sido agregado a la base de datos de manera irreversible.',
          background: '#2d333b',
          color: '#fff'
        });

        // Limpiar
        this.form.direccion_exacta = '';
        this.form.vehiculos_involucrados = '';
        this.form.numero_heridos = 0;
        this.form.numero_fallecidos = 0;
        this.form.informe_pericial = '';

      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.bg-secondary {
  background-color: #22272e !important;
}
.action-btn {
  transition: all 0.3s ease;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 202, 240, 0.4);
}
</style>
