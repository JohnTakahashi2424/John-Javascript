<template>
  <div class="container py-5 mt-4 fade-in">
    <!-- Encabezado de Sección -->
    <div class="row mb-5">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h2 class="fw-bolder mb-1 section-title">Central Operativa PNC</h2>
          <p class="text-muted mb-0">Plataforma Oficial de Inteligencia y Peritajes de Tránsito</p>
        </div>
        <div class="icon-wrapper gradient-pnc shadow-sm">
          <span class="fs-4">🚓</span>
        </div>
      </div>
    </div>

    <!-- Modulo 1: Buscador Avanzado (Rúbrica 6) -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="premium-card p-4">
          <h5 class="fw-bold mb-3 subtitle-text d-flex align-items-center gap-2">
            <span class="text-info">●</span> Búsqueda Dinámica Multicriterio
          </h5>
          
          <form @submit.prevent="searchAccidents" class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label text-muted small fw-bold">Estatus Operativo</label>
              <select v-model="searchFilters.estado_caso" class="form-select premium-input px-3" @change="searchAccidents">
                <option value="">Todos los casos</option>
                <option value="En proceso">Proceso Abierto</option>
                <option value="Cerrado">Caso Cerrado</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label text-muted small fw-bold">Rastreo por Dirección o Placa</label>
              <div class="position-relative">
                <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">🔍</span>
                <input type="text" v-model="searchFilters.direccion" class="form-control premium-input ps-5 py-2" placeholder="Ingrese dato y presione Enter..." @keyup.enter="searchAccidents">
              </div>
            </div>
            <div class="col-md-3">
              <button type="submit" class="btn btn-info gradient-pnc-btn w-100 py-2 rounded-3 text-white fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 interaction-btn">
                <span>Ejecutar Filtro</span>
              </button>
            </div>
          </form>

          <!-- Resultados de Búsqueda -->
          <div class="table-responsive mt-4" v-if="searchResults.length > 0">
            <table class="table premium-table align-middle">
              <thead>
                <tr>
                  <th class="ps-0 border-0 text-uppercase small tracking-wide">Fec. Registro</th>
                  <th class="border-0 text-uppercase small tracking-wide">Punto Referencial</th>
                <th class="border-0 text-uppercase small tracking-wide text-center">Vehículos</th>
                <th class="border-0 text-uppercase small tracking-wide">Acción Legal</th>
                <th class="border-0 text-uppercase small tracking-wide text-end pe-0">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="res in searchResults" :key="res.id" class="table-row-hover">
                  <td class="ps-0 py-3 text-muted small">{{ new Date(res.fecha_registro).toLocaleDateString() }}</td>
                  <td class="py-3 fw-bold text-main">
                    {{ res.direccion_exacta }}
                    <div v-if="res.reporte_conductor_id" class="small text-info mt-1" style="font-size: 0.75rem;">
                      🔗 Alerta Ciudadana Vinculada
                    </div>
                  </td>
                  <td class="text-center py-3 text-muted"><span class="badge bg-secondary-subtle text-secondary rounded-circle px-2 py-1">{{ res.vehiculos_involucrados.split(',').length || 1 }}</span></td>
                  <td class="py-3">
                    <span :class="badgeClass(res.estado_caso)" class="badge rounded-pill px-3 py-2 subtle-badge">{{ res.estado_caso }}</span>
                  </td>
                  <td class="text-end pe-0 py-3">
                    <button @click="editAccident(res)" class="btn btn-sm btn-outline-info rounded-circle me-2" title="Editar">✏️</button>
                    <button @click="deleteAccident(res.id)" class="btn btn-sm btn-outline-danger rounded-circle" title="Eliminar">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="searchFilters.direccion || searchFilters.estado_caso" class="text-center py-4 text-muted mt-3">
             <span class="fs-4 d-block mb-2">📂</span> No se encontraron expedientes con los criterios proporcionados.
          </div>
        </div>
      </div>
    </div>


    <!-- Modulo 2: Levantamiento Formulario (Rúbrica 5) -->
    <div class="row">
      <div class="col-12">
        <div class="premium-card p-4 p-md-5 position-relative overflow-hidden">
          <div class="glow-orb orb-pnc"></div>
          
          <div class="position-relative z-1">
            <h4 class="fw-bold mb-4 subtitle-text d-flex align-items-center gap-2">
              <span class="text-info">●</span> Formulario de Levantamiento Oficial (F.L.O.)
            </h4>
            
            <form @submit.prevent="submitAccidente">
              <div class="row g-4">
                <div class="col-md-12 mb-2">
                  <label class="form-label text-muted small fw-bold">Vincular a Alerta Ciudadana (Opcional)</label>
                  <select v-model="form.reporte_conductor_id" class="form-select premium-input px-3 py-2" @change="vincularReporte">
                    <option :value="null">Ninguno (Caso Autónomo)</option>
                    <option v-for="rep in reportesCiudadanos" :key="rep.id" :value="rep.id">
                      {{ new Date(rep.fecha_siniestro).toLocaleDateString() }} - {{ rep.tipo_incidente }} (Placa: {{ rep.placa_avistada || 'N/A' }})
                    </option>
                  </select>
                </div>

                <div class="col-md-8">
                  <label class="form-label text-muted small fw-bold">Geolocalización Descriptiva del Siniestro</label>
                  <input type="text" v-model="form.direccion_exacta" class="form-control premium-input px-3 py-2" required placeholder="Nomenclatura vial, kilómetro de la carretera...">
                </div>
                
                <div class="col-md-4">
                  <label class="form-label text-muted small fw-bold">Unidades Involucradas</label>
                  <input type="text" v-model="form.vehiculos_involucrados" class="form-control premium-input px-3 py-2" required placeholder="Marca, placa...">
                </div>
                
                <div class="col-md-6 border-end border-secondary-subtle pe-4">
                  <div class="d-flex align-items-center justify-content-between p-3 rounded-4 bg-opacity-10 bg-warning border border-warning-subtle">
                    <span class="fw-bold text-warning d-flex align-items-center gap-2">🩹 Heridos Leves/Graves</span>
                    <input type="number" v-model="form.numero_heridos" class="form-control premium-input text-center fw-bold" style="width: 80px;" min="0" required>
                  </div>
                </div>
                
                <div class="col-md-6 ps-4">
                  <div class="d-flex align-items-center justify-content-between p-3 rounded-4 bg-opacity-10 bg-danger border border-danger-subtle">
                    <span class="fw-bold text-danger d-flex align-items-center gap-2">✝️ Cuantía Perfiles Fatales</span>
                    <input type="number" v-model="form.numero_fallecidos" class="form-control premium-input text-center fw-bold" style="width: 80px;" min="0" required>
                  </div>
                </div>

                <div class="col-12 mt-4">
                  <label class="form-label text-muted small fw-bold">Croquis e Informe Técnico Policial</label>
                  <textarea v-model="form.informe_pericial" class="form-control premium-input px-4 py-3" rows="6" required placeholder="Redacte minuciosamente el atestado, deducción de responsabilidad e infracciones basadas en la ley de tránsito..."></textarea>
                </div>
              </div>

              <div class="mt-5 d-flex justify-content-end border-top border-secondary-subtle pt-4">
                <button type="submit" class="btn btn-info gradient-pnc-btn px-5 py-3 rounded-pill fw-bold text-white shadow-lg interaction-btn">
                  {{ isEditing ? 'ACTUALIZAR FOLIO' : 'ASIGNAR FOLIO OFICIAL' }}
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
      searchFilters: { estado_caso: '', direccion: '' },
      searchResults: [],
      reportesCiudadanos: [],
      isEditing: false,
      editId: null,
      form: {
        oficial_id: 1,
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
    this.fetchReportesCiudadanos();
  },
  methods: {
    async fetchReportesCiudadanos() {
      try {
        const response = await fetch('/api/reportes-conductor');
        this.reportesCiudadanos = await response.json();
      } catch(e) {}
    },
    vincularReporte() {
      if (this.form.reporte_conductor_id) {
        const reporteAsociado = this.reportesCiudadanos.find(r => r.id === this.form.reporte_conductor_id);
        if (reporteAsociado && !this.form.direccion_exacta) {
          // Completar mágicamente
          this.form.direccion_exacta = reporteAsociado.referencia_ubicacion;
        }
      }
    },
    async searchAccidents() {
      try {
        const response = await fetch('/api/accidentes-pnc/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(this.searchFilters)
        });
        const data = await response.json();
        this.searchResults = data;
      } catch (e) {
        console.error("Fallo de búsqueda", e);
      }
    },
    async submitAccidente() {
      if(!this.form.direccion_exacta || !this.form.informe_pericial) return;

      try {
        const url = this.isEditing ? `/api/accidentes-pnc/${this.editId}` : '/api/accidentes-pnc';
        const method = this.isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(this.form)
        });

        if (!response.ok) throw new Error('Error al registrar en SIGAT Data Center.');

        this.alertTheme('success', 'Peritaje Blindado', this.isEditing ? 'Folio actualizado correctamente.' : 'El informe policial se anexó a la central con éxito.');

        this.resetForm();
        if(this.searchFilters.direccion || this.searchFilters.estado_caso) {
          this.searchAccidents();
        }

      } catch (error) {
        this.alertTheme('error', 'Inconsistencia de Base', error.message);
      }
    },
    editAccident(res) {
      this.isEditing = true;
      this.editId = res.id;
      
      this.form = {
        oficial_id: res.oficial_id,
        reporte_conductor_id: res.reporte_conductor_id,
        direccion_exacta: res.direccion_exacta,
        vehiculos_involucrados: res.vehiculos_involucrados,
        numero_heridos: res.numero_heridos,
        numero_fallecidos: res.numero_fallecidos,
        informe_pericial: res.informe_pericial,
        estado_caso: res.estado_caso
      };
      
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    },
    async deleteAccident(id) {
      const isDark = document.body.className.includes('theme-dark') || localStorage.getItem('sigat-theme') === 'dark';
      const result = await Swal.fire({
        title: '¿Confirmas anular este peritaje?',
        text: 'Se purgará del registro oficial de forma definitiva.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00d2ff',
        cancelButtonColor: '#3a7bd5',
        confirmButtonText: 'Sí, Purgar',
        cancelButtonText: 'Cancelar',
        background: isDark ? '#131A2A' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
      });

      if(result.isConfirmed) {
        try {
          const response = await fetch(`/api/accidentes-pnc/${id}`, { method: 'DELETE' });
          if(!response.ok) throw new Error('No se pudo borrar el folio');
          
          this.alertTheme('success', 'Purgado', 'Folio pericial eliminado de la base.');
          this.searchAccidents();
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
        oficial_id: 1, reporte_conductor_id: null, direccion_exacta: '',
        vehiculos_involucrados: '', numero_heridos: 0, numero_fallecidos: 0,
        informe_pericial: '', estado_caso: 'En proceso'
      };
    },
    badgeClass(estado) {
      return estado === 'En proceso' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-success-subtle text-success border border-success-subtle';
    },
    alertTheme(icon, title, text) {
      const isDark = document.body.className.includes('theme-dark') || localStorage.getItem('sigat-theme') === 'dark';
      Swal.fire({
        icon: icon, title: title, text: text,
        background: isDark ? '#131A2A' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
        confirmButtonColor: '#00d2ff'
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
.gradient-pnc { background: linear-gradient(135deg, rgba(0,210,255,0.2), rgba(58,123,213,0.2)); color: #00d2ff; }
.gradient-pnc-btn { border: none; background: linear-gradient(135deg, #00d2ff, #3a7bd5); }

/* Luz de la tarjeta PNC */
.glow-orb {
  position: absolute;
  width: 400px; height: 400px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0; opacity: 0.12;
  top: -200px; right: -100px;
}
.orb-pnc { background: #00d2ff; }

.interaction-btn {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.interaction-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 210, 255, 0.4) !important;
}

/* Tabla */
.tracking-wide { letter-spacing: 1px; }
.table-row-hover { transition: background-color 0.2s; }
.table-row-hover:hover td { background-color: var(--glass-bg-hover) !important; }

.fade-in { animation: fadeIn 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
