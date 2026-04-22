<template>
  <div class="container py-5 mt-4 fade-in">
    <!-- Encabezado de Sección -->
    <div class="row mb-5">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h2 class="fw-bolder mb-1 section-title">Portal Ciudadano</h2>
          <p class="text-muted mb-0">Sistema de registro e historial anónimo de incidentes</p>
        </div>
        <div class="icon-wrapper gradient-citizen shadow-sm">
          <span class="fs-4">🚗</span>
        </div>
      </div>
    </div>

    <div class="row g-4">
      
      <!-- Módulo de Formulario (Glassmorphism) -->
      <div class="col-lg-6">
        <div class="premium-card p-4 p-md-5 h-100 position-relative overflow-hidden">
          <div class="glow-orb orb-citizen"></div>
          
          <div class="position-relative z-1">
            <h4 class="fw-bold mb-4 subtitle-text">
              <span class="text-danger me-2">●</span> Reportar Nuevo Incidente
            </h4>
            
            <form @submit.prevent="submitReport">
              <div class="row g-4">
                <div class="col-md-12">
                  <label class="form-label text-muted small fw-bold">Referencia de Ubicación</label>
                  <input type="text" v-model="form.referencia_ubicacion" class="form-control premium-input px-3 py-2" required placeholder="Punto de referencia o dirección aprox.">
                </div>
                
                <div class="col-md-6">
                  <label class="form-label text-muted small fw-bold">Tipo de Incidente</label>
                  <select v-model="form.tipo_incidente" class="form-select premium-input px-3 py-2" required>
                    <option value="" disabled>Selecciona...</option>
                    <option value="Colisión">Colisión</option>
                    <option value="Atropello">Atropello</option>
                    <option value="Desperfecto">Desperfecto mecánico</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label text-muted small fw-bold">Fecha del Siniestro</label>
                  <input type="datetime-local" v-model="form.fecha_siniestro" class="form-control premium-input px-3 py-2" required>
                </div>

                <div class="col-md-12">
                  <label class="form-label text-muted small fw-bold">Placa Involucrada (Opcional)</label>
                  <input type="text" v-model="form.placa_avistada" class="form-control premium-input px-3 py-2" placeholder="Ej. P123456">
                </div>

                <div class="col-12">
                  <label class="form-label text-muted small fw-bold">Descripción de los hechos</label>
                  <textarea v-model="form.descripcion_hechos" class="form-control premium-input px-3 py-2" rows="3" required placeholder="Relate cronológicamente lo sucedido..."></textarea>
                </div>
              </div>

              <div class="mt-5 text-end">
                <button type="submit" class="btn btn-danger gradient-citizen-btn px-5 py-3 rounded-pill fw-bold text-white shadow-lg w-100 interaction-btn">
                  {{ isEditing ? 'ACTUALIZAR REPORTE VIAL' : 'EMITIR REPORTE VIAL' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Tabla Historial (Minimalista) -->
      <div class="col-lg-6">
        <div class="premium-card p-4 p-md-5 h-100">
          <h4 class="fw-bold mb-4 subtitle-text d-flex justify-content-between align-items-center">
            <span>Mis Reportes Previos</span>
            <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2 fs-6 border">{{ misReportes.length }} Totales</span>
          </h4>
          
          <div class="table-responsive mt-4">
            <table class="table premium-table align-middle">
              <thead>
                <tr>
                  <th class="ps-0 border-0 text-uppercase small tracking-wide">Fecha</th>
                  <th class="border-0 text-uppercase small tracking-wide">Incidente</th>
                  <th class="border-0 text-uppercase small tracking-wide">Estatus</th>
                  <th class="border-0 text-uppercase small tracking-wide text-end pe-0">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reporte in misReportes" :key="reporte.id" class="table-row-hover">
                  <td class="ps-0 py-3 text-muted small">
                    {{ new Date(reporte.fecha_siniestro).toLocaleDateString() }}
                  </td>
                  <td class="py-3">
                    <div class="fw-bold text-main">{{ reporte.tipo_incidente }}</div>
                    <div class="small text-muted text-truncate" style="max-width: 150px;">{{ reporte.referencia_ubicacion }}</div>
                  </td>
                  <td class="py-3">
                    <span :class="badgeClass(reporte.estado)" class="badge rounded-pill px-3 py-2 subtle-badge">{{ reporte.estado }}</span>
                  </td>
                  <td class="text-end pe-0 py-3">
                    <button @click="editReport(reporte)" class="btn btn-sm btn-outline-info rounded-circle me-2" title="Editar">✏️</button>
                    <button @click="deleteReport(reporte.id)" class="btn btn-sm btn-outline-danger rounded-circle" title="Eliminar">🗑️</button>
                  </td>
                </tr>
                <tr v-if="misReportes.length === 0">
                  <td colspan="3" class="text-center py-5 text-muted">
                    No existen reportes previos en el historial.
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
      isEditing: false,
      editId: null,
      form: {
        usuario_id: 1,
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
        const response = await fetch('/api/reportes-conductor');
        const data = await response.json();
        this.misReportes = data.filter(r => String(r.usuario_id) === '1');
      } catch (e) {
        console.error("Error al cargar:", e);
      }
    },
    async submitReport() {
      if (!this.form.referencia_ubicacion || !this.form.tipo_incidente || !this.form.fecha_siniestro) return;

      try {
        const url = this.isEditing ? `/api/reportes-conductor/${this.editId}` : '/api/reportes-conductor';
        const method = this.isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(this.form)
        });

        if (!response.ok) throw new Error('Error al enviar reporte.');

        this.alertTheme('success', this.isEditing ? '¡Reporte Actualizado!' : '¡Reporte Emitido!', 'Tu información ha sido guardada exitosamente.');
        this.resetForm();
        this.fetchMisReportes();
      } catch (error) {
        this.alertTheme('error', 'Fallo técnico', error.message);
      }
    },
    editReport(reporte) {
      this.isEditing = true;
      this.editId = reporte.id;
      // Formatear datetime local para el input HTML5
      const dateVal = reporte.fecha_siniestro ? new Date(reporte.fecha_siniestro).toISOString().slice(0, 16) : '';
      
      this.form = {
        usuario_id: reporte.usuario_id,
        referencia_ubicacion: reporte.referencia_ubicacion,
        tipo_incidente: reporte.tipo_incidente,
        descripcion_hechos: reporte.descripcion_hechos,
        placa_avistada: reporte.placa_avistada,
        fecha_siniestro: dateVal,
        estado: reporte.estado
      };
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deleteReport(id) {
      const isDark = document.body.className.includes('theme-dark') || localStorage.getItem('sigat-theme') === 'dark';
      const result = await Swal.fire({
        title: '¿Confirmas eliminar este reporte?',
        text: 'La acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF416C',
        cancelButtonColor: '#3a7bd5',
        confirmButtonText: 'Sí, Borrar',
        cancelButtonText: 'Cancelar',
        background: isDark ? '#131A2A' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
      });

      if(result.isConfirmed) {
        try {
          const response = await fetch(`/api/reportes-conductor/${id}`, { method: 'DELETE' });
          if(!response.ok) throw new Error('No se pudo borrar el registro');
          
          this.alertTheme('success', 'Borrado', 'Reporte eliminado del historial.');
          this.fetchMisReportes();
          if(this.editId === id) this.resetForm();
        } catch(error) {
          this.alertTheme('error', 'Error', error.message);
        }
      }
    },
    resetForm() {
      this.isEditing = false;
      this.editId = null;
      this.form = {
        usuario_id: 1, referencia_ubicacion: '', tipo_incidente: '',
        descripcion_hechos: '', placa_avistada: '', fecha_siniestro: '', estado: 'Enviado'
      };
    },
    badgeClass(estado) {
      if(estado === 'Enviado') return 'bg-warning-subtle text-warning border border-warning-subtle';
      if(estado === 'En proceso') return 'bg-info-subtle text-info border border-info-subtle';
      return 'bg-success-subtle text-success border border-success-subtle';
    },
    alertTheme(icon, title, text) {
      const isDark = document.body.className.includes('theme-dark') || localStorage.getItem('sigat-theme') === 'dark';
      Swal.fire({
        icon: icon, title: title, text: text,
        background: isDark ? '#131A2A' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
        confirmButtonColor: '#FF4B2B'
      });
    }
  }
}
</script>

<style scoped>
.section-title { color: var(--text-main); }
.subtitle-text { color: var(--text-main); }
.text-main { color: var(--text-main) !important; }

/* Icono Superior Derecho */
.icon-wrapper {
  width: 60px; height: 60px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.gradient-citizen { background: linear-gradient(135deg, rgba(255,65,108,0.2), rgba(255,75,43,0.2)); color: #FF4B2B; }
.gradient-citizen-btn { border: none; background: linear-gradient(135deg, #FF416C, #FF4B2B); }

/* Luz de la tarjeta */
.glow-orb {
  position: absolute;
  width: 300px; height: 300px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0; opacity: 0.15;
  top: -150px; right: -150px;
}
.orb-citizen { background: #FF4B2B; }

.interaction-btn {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.interaction-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(255, 75, 43, 0.4) !important;
}

/* Tabla */
.tracking-wide { letter-spacing: 1px; }
.table-row-hover { transition: background-color 0.2s; }
.table-row-hover:hover td { background-color: var(--glass-bg-hover) !important; }

.fade-in { animation: fadeIn 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
