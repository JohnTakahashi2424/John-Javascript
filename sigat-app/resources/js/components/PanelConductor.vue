<template>
  <div class="conductor-wrapper min-vh-100 bg-dark text-white p-4">
    <nav class="navbar navbar-dark bg-transparent border-bottom border-secondary mb-4 pb-3 flex-column flex-md-row">
      <h3 class="navbar-brand mb-0 text-primary fw-bold">SIGAT - Panel Conductor</h3>
      <button class="btn btn-outline-danger btn-sm mt-3 mt-md-0" @click="logout">Cerrar Sesión</button>
    </nav>

    <div class="row g-4">
      <!-- Módulo Formularios (Rúbricas 4 y 5) -->
      <div class="col-lg-6">
        <div class="card bg-secondary border-0 shadow-lg rounded-4">
          <div class="card-header bg-transparent border-bottom border-dark p-4">
            <h5 class="mb-0 fw-semibold text-light">Reportar Nuevo Incidente</h5>
          </div>
          
          <div class="card-body p-4">
            <form @submit.prevent="submitReport">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-light small fw-bold">Referencia de Ubicación</label>
                  <input type="text" v-model="form.referencia_ubicacion" class="form-control bg-dark text-white border-secondary aesthetic-input" required placeholder="Ej. Km 22 Autopista Sur">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label text-light small fw-bold">Tipo de Incidente</label>
                  <select v-model="form.tipo_incidente" class="form-select bg-dark text-white border-secondary aesthetic-input" required>
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="Colisión Múltiple">Colisión Múltiple</option>
                    <option value="Choque Frontal">Choque Frontal</option>
                    <option value="Atropello">Atropello</option>
                    <option value="Vuelco">Vuelco</option>
                    <option value="Daños Materiales Menores">Daños Minimos</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label text-light small fw-bold">Placa Avistada (Opcional)</label>
                  <input type="text" v-model="form.placa_avistada" class="form-control bg-dark text-white border-secondary aesthetic-input" placeholder="Ej. P123456">
                </div>

                <div class="col-md-6">
                  <label class="form-label text-light small fw-bold">Fecha del Siniestro</label>
                  <input type="datetime-local" v-model="form.fecha_siniestro" class="form-control bg-dark text-white border-secondary aesthetic-input" required>
                </div>

                <div class="col-12">
                  <label class="form-label text-light small fw-bold">Descripción de los hechos</label>
                  <textarea v-model="form.descripcion_hechos" class="form-control bg-dark text-white border-secondary aesthetic-input" rows="3" required placeholder="Describe brevemente cómo ocurrió el accidente..."></textarea>
                </div>
              </div>

              <div class="mt-4 text-end">
                <button type="submit" class="btn btn-primary px-4 fw-bold action-btn">
                  Enviar a Autoridades
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Módulo Historial -->
      <div class="col-lg-6">
        <div class="card bg-secondary border-0 shadow-lg rounded-4 h-100">
          <div class="card-header bg-transparent border-bottom border-dark p-4">
            <h5 class="mb-0 fw-semibold text-light">Mis Reportes Previos</h5>
          </div>
          <div class="card-body p-4 overflow-auto" style="max-height: 500px">
            <div v-if="misReportes.length === 0" class="text-center text-muted p-5">
              <i class="opacity-50">No has registrado ningún accidente aún.</i>
            </div>
            
            <table v-else class="table table-dark table-hover table-borderless text-light align-middle aesthetic-table">
              <thead class="border-bottom border-dark">
                <tr>
                  <th scope="col" class="text-primary small">FECHA</th>
                  <th scope="col" class="text-primary small">TIPO / LUGAR</th>
                  <th scope="col" class="text-primary small">ESTADO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reporte in misReportes" :key="reporte.id">
                  <td class="text-muted small">
                    {{ new Date(reporte.fecha_siniestro).toLocaleDateString() }}
                  </td>
                  <td>
                    <div class="fw-bold">{{ reporte.tipo_incidente }}</div>
                    <div class="small text-muted">{{ reporte.referencia_ubicacion }}</div>
                  </td>
                  <td>
                    <span :class="badgeClass(reporte.estado)" class="badge rounded-pill px-3 py-2">
                       {{ reporte.estado }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'PanelConductor',
  data() {
    return {
      misReportes: [],
      form: {
        usuario_id: localStorage.getItem('usuario_id'),
        referencia_ubicacion: '',
        tipo_incidente: '',
        descripcion_hechos: '',
        placa_avistada: '',
        fecha_siniestro: '',
        estado: 'Enviado'
      }
    }
  },
  mounted() {
    this.fetchMisReportes();
  },
  methods: {
    async fetchMisReportes() {
      try {
        const response = await fetch('/api/reportes-conductor', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        const userId = localStorage.getItem('usuario_id');
        this.misReportes = data.filter(r => String(r.usuario_id) === String(userId));
      } catch (e) {
        console.error("Error al cargar reportes:", e);
      }
    },
    async submitReport() {
      try {
        if (!this.form.referencia_ubicacion || !this.form.tipo_incidente || !this.form.fecha_siniestro) {
          Swal.fire({
            icon: 'warning',
            title: 'Información Incompleta',
            text: 'Llena todos los campos obligatorios.',
            background: '#22272e', color: '#fff'
          });
          return;
        }

        const response = await fetch('/api/reportes-conductor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.form)
        });

        if (!response.ok) throw new Error('Error al enviar el reporte.');

        Swal.fire({
          icon: 'success',
          title: '¡Reporte Enviado!',
          text: 'Las autoridades han sido notificadas de este incidente.',
          background: '#22272e', color: '#fff'
        });

        // Limpiar formulario y actualizar tabla
        this.form.referencia_ubicacion = '';
        this.form.tipo_incidente = '';
        this.form.descripcion_hechos = '';
        this.form.placa_avistada = '';
        this.form.fecha_siniestro = '';
        
        this.fetchMisReportes();

      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message, background: '#22272e', color: '#fff' });
      }
    },
    badgeClass(estado) {
      if(estado === 'Enviado') return 'bg-warning text-dark';
      if(estado === 'En proceso') return 'bg-info text-dark';
      return 'bg-success';
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
.aesthetic-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  outline: none;
}
.aesthetic-table tbody tr { transition: background-color 0.2s; }
.aesthetic-table tbody tr:hover { background-color: #2d333b; }
.action-btn { transition: all 0.3s ease; }
.action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4); }
</style>
