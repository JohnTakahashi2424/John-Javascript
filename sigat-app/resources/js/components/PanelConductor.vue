<template>
  <div class="conductor-wrapper min-vh-100 bg-dark text-white p-4">
    <nav class="navbar navbar-dark bg-transparent border-bottom border-secondary mb-4 pb-3 flex-column flex-md-row">
      <h3 class="navbar-brand mb-0 text-primary fw-bold">SIGAT - Creador de Reportes</h3>
      <button class="btn btn-outline-danger btn-sm mt-3 mt-md-0" @click="logout">Cerrar Sesión</button>
    </nav>

    <div class="container max-w-md mx-auto">
      <div class="card bg-secondary border-0 shadow-lg rounded-4">
        <div class="card-header bg-transparent border-bottom border-dark p-4">
          <h5 class="mb-0 fw-semibold">Reportar Nuevo Incidente</h5>
        </div>
        
        <div class="card-body p-4">
          <form @submit.prevent="submitReport">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-light">Referencia de Ubicación</label>
                <input type="text" v-model="form.referencia_ubicacion" class="form-control bg-dark text-white border-secondary" required placeholder="Ej. Km 22 Autopista Sur">
              </div>
              
              <div class="col-md-6">
                <label class="form-label text-light">Tipo de Incidente</label>
                <select v-model="form.tipo_incidente" class="form-select bg-dark text-white border-secondary" required>
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="Colisión Múltiple">Colisión Múltiple</option>
                  <option value="Choque Frontal">Choque Frontal</option>
                  <option value="Atropello">Atropello</option>
                  <option value="Vuelco">Vuelco</option>
                  <option value="Daños Materiales Menores">Daños Materiales Menores</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-light">Placa Avistada (Opcional)</label>
                <input type="text" v-model="form.placa_avistada" class="form-control bg-dark text-white border-secondary" placeholder="Ej. P123456">
              </div>

              <div class="col-md-6">
                <label class="form-label text-light">Fecha del Siniestro</label>
                <input type="datetime-local" v-model="form.fecha_siniestro" class="form-control bg-dark text-white border-secondary" required>
              </div>

              <div class="col-12">
                <label class="form-label text-light">Descripción de los hechos</label>
                <textarea v-model="form.descripcion_hechos" class="form-control bg-dark text-white border-secondary" rows="3" required placeholder="Describe brevemente cómo ocurrió el accidente..."></textarea>
              </div>
            </div>

            <div class="mt-4 text-end">
              <button type="submit" class="btn btn-primary px-4 fw-bold action-btn">
                Enviar Reporte
              </button>
            </div>
          </form>
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
  methods: {
    async submitReport() {
      try {
        if (!this.form.referencia_ubicacion || !this.form.tipo_incidente || !this.form.fecha_siniestro) {
          Swal.fire({
            icon: 'warning',
            title: 'Información Incompleta',
            text: 'Por favor llena todos los campos obligatorios.',
            background: '#2d333b',
            color: '#fff'
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

        if (!response.ok) throw new Error('Error al enviar el reporte. Verifica tu conexión.');

        Swal.fire({
          icon: 'success',
          title: '¡Reporte Enviado!',
          text: 'Las autoridades han sido notificadas de este incidente.',
          background: '#2d333b',
          color: '#fff'
        });

        // Limpiar formulario
        this.form.referencia_ubicacion = '';
        this.form.tipo_incidente = '';
        this.form.descripcion_hechos = '';
        this.form.placa_avistada = '';
        this.form.fecha_siniestro = '';

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
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);
}
</style>
