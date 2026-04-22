<template>
  <div class="pnc-wrapper min-vh-100 bg-dark text-white p-4">
    <nav class="navbar navbar-dark bg-transparent border-bottom border-secondary mb-4 pb-3 flex-column flex-md-row">
      <h3 class="navbar-brand mb-0 text-info fw-bold">SIGAT - Central PNC</h3>
      <button class="btn btn-outline-danger btn-sm mt-3 mt-md-0" @click="logout">Cerrar Sesión</button>
    </nav>

    <div class="row g-4">
      <!-- Sistema de Búsqueda y Lista (Rúbrica 6) -->
      <div class="col-lg-6">
        <div class="card bg-secondary border-0 shadow-lg rounded-4 h-100 d-flex flex-column">
          <div class="card-header bg-transparent border-bottom border-dark p-4 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-semibold text-light">Registros de Incidentes</h5>
            <span class="badge bg-info text-dark">Rúbrica 6</span>
          </div>
          
          <!-- Filtros de Búsqueda -->
          <div class="card-body p-4 bg-dark">
             <form @submit.prevent="searchAccidents">
              <div class="row g-2 align-items-end">
                <div class="col-md-4">
                  <label class="form-label text-light small">Filtrar por Estado</label>
                  <select v-model="searchFilters.estado_caso" class="form-select bg-dark text-white border-secondary select-aesthetic" @change="searchAccidents">
                    <option value="">(Todos)</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
                <div class="col-md-5">
                  <label class="form-label text-light small">Buscar en Dirección</label>
                  <input type="text" v-model="searchFilters.direccion" class="form-control bg-dark text-white border-secondary input-aesthetic" placeholder="Palabra clave..." @keyup.enter="searchAccidents">
                </div>
                <div class="col-md-3">
                  <button type="submit" class="btn btn-info action-btn text-dark fw-bold w-100 py-2">Buscar</button>
                </div>
              </div>
            </form>
          </div>

          <!-- Tabla de Resultados -->
          <div class="card-body p-0 flex-grow-1 overflow-auto" style="max-height: 480px;">
            <table v-if="searchResults.length > 0" class="table table-dark table-hover mb-0 aesthetic-table">
              <thead>
                <tr>
                   <th class="ps-4">DIRECCIÓN</th>
                   <th>VEHÍCULOS</th>
                   <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="res in searchResults" :key="res.id">
                  <td class="ps-4">
                    <div class="fw-bold text-light">{{ res.direccion_exacta }}</div>
                    <div class="small text-muted">{{ new Date(res.fecha_registro_oficial).toLocaleDateString() }}</div>
                  </td>
                  <td class="small">{{ res.vehiculos_involucrados }}</td>
                  <td>
                    <span :class="badgeClass(res.estado_caso)" class="badge rounded-pill px-3 py-1">
                      {{ res.estado_caso }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center text-muted p-5">
              <i class="opacity-50">No se encontraron registros.</i>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario Oficial (Rúbricas 4 y 5) -->
      <div class="col-lg-6">
        <div class="card bg-secondary border-0 shadow-lg rounded-4 h-100">
          <div class="card-header bg-transparent border-bottom border-dark p-4">
            <h5 class="mb-0 fw-semibold text-light">Levantar Informe Pericial</h5>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="submitAccidente">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label text-light small fw-bold">Dirección Exacta (Punto de Referencia Oficial)</label>
                  <input type="text" v-model="form.direccion_exacta" class="form-control bg-dark text-white border-secondary input-aesthetic" required placeholder="Ingresa zona del siniestro">
                </div>
                
                <div class="col-12">
                  <label class="form-label text-light small fw-bold">Vehículos Involucrados</label>
                  <input type="text" v-model="form.vehiculos_involucrados" class="form-control bg-dark text-white border-secondary input-aesthetic" required placeholder="Listado de marcas o placas implicadas">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label text-light small fw-bold">Número de Heridos</label>
                  <input type="number" v-model="form.numero_heridos" class="form-control bg-dark text-white border-secondary input-aesthetic" min="0" required>
                </div>
                
                <div class="col-md-6">
                  <label class="form-label text-light small fw-bold">Número de Fallecidos</label>
                  <input type="number" v-model="form.numero_fallecidos" class="form-control bg-dark text-white border-secondary input-aesthetic" min="0" required>
                </div>

                <div class="col-12">
                  <label class="form-label text-light small fw-bold">Informe Detallado del Oficial</label>
                  <textarea v-model="form.informe_pericial" class="form-control bg-dark text-white border-secondary input-aesthetic" rows="5" required placeholder="Redacta el informe del caso..."></textarea>
                </div>
              </div>

              <div class="mt-4 text-end">
                <button type="submit" class="btn btn-info px-4 fw-bold action-btn text-dark">
                  Procesar Informe
                </button>
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
        direccion: '' // Mapea a keyword
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
  mounted() {
    // Buscar todos por defecto al cargar el panel
    this.searchAccidents();
  },
  methods: {
    async searchAccidents() {
      try {
        const response = await fetch('/api/accidentes-pnc/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.searchFilters)
        });

        if (!response.ok) throw new Error('Error al realizar filtrado');

        this.searchResults = await response.json();
      } catch (error) {
        console.error("Error de búsqueda:", error);
      }
    },

    async submitAccidente() {
      if(!this.form.direccion_exacta || !this.form.informe_pericial) {
          Swal.fire({
            icon: 'warning',
            title: 'Datos Faltantes',
            text: 'Debes completar la dirección y el informe pericial.',
            background: '#22272e', color: '#fff'
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

        if (!response.ok) throw new Error('Error guardando en servidor.');

        Swal.fire({
          icon: 'success',
          title: 'Guardado Oficialmente',
          text: 'El informe se almacenó en la base de datos central.',
          background: '#22272e', color: '#fff'
        });

        // Limpiar formulario manual
        this.form.direccion_exacta = '';
        this.form.vehiculos_involucrados = '';
        this.form.numero_heridos = 0;
        this.form.numero_fallecidos = 0;
        this.form.informe_pericial = '';

        // Actualizar la tabla de búsquedas para ver el nuevo registro
        this.searchAccidents();

      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error Sistema', text: error.message, background: '#22272e', color: '#fff' });
      }
    },

    badgeClass(estado) {
      return estado === 'En proceso' ? 'bg-primary text-white' : 'bg-success text-white';
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.bg-secondary { background-color: #22272e !important; }
.input-aesthetic:focus, .select-aesthetic:focus {
  border-color: #0dcaf0;
  box-shadow: 0 0 0 0.2rem rgba(13, 202, 240, 0.25);
  outline: none;
}
.aesthetic-table tbody tr { transition: background-color 0.2s; border-bottom: 1px solid #2d333b; }
.aesthetic-table tbody tr:hover { background-color: #2d333b; }
.action-btn { transition: all 0.3s ease; }
.action-btn:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(13, 202, 240, 0.4); }
</style>
