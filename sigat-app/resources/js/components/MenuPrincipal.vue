<template>
  <!-- Contenedor Maestro -->
  <div class="sigat-hero d-flex align-items-center justify-content-center position-relative overflow-hidden pt-5 mt-4">
    
    <!-- Orbes de Luz de Fondo (Efecto Inmersivo) -->
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>

    <div class="container position-relative z-int-1 py-5">
      
      <!-- Encabezado con efecto Glass -->
      <div class="text-center mb-5 fade-down">
        <div class="d-inline-block glass-pill px-4 py-2 mb-4 shadow-sm">
          <span class="text-info fw-bold tracking-wide">VERSIÓN 2.0</span>
        </div>
        <h1 class="sigat-title mb-3">S I G A T</h1>
        <h3 class="fw-light subtitle-text">Sistema Inteligente de Gestión Vial</h3>
      </div>

      <!-- Grid de Tarjetas Glassmorphism -->
      <div class="row g-5 justify-content-center mt-2">
        
        <!-- Portal Ciudadano -->
        <div class="col-12 col-md-5 col-lg-4 fade-up delay-1">
          <div class="glass-card main-glass p-5 text-center h-100 d-flex flex-column" @click="goTo('/conductor')">
            <div class="icon-wrapper gradient-citizen mx-auto mb-4">
               <span class="fs-1">🚗</span>
            </div>
            <h2 class="title-text fw-bold mb-3">Portal Ciudadano</h2>
            <p class="subtitle-text mb-5 fs-6 lh-lg flex-grow-1">
              Levante reportes de colisiones o despistes vehiculares con inmediatez. Contribuya a la fluidez vial de la ciudad.
            </p>
            <button class="btn custom-btn gradient-citizen-btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm mt-auto">
              ACCEDER AL PORTAL
            </button>
          </div>
        </div>

        <!-- Central PNC -->
        <div class="col-12 col-md-5 col-lg-4 fade-up delay-2">
          <div class="glass-card main-glass p-5 text-center h-100 d-flex flex-column" @click="goTo('/pnc')">
            <div class="icon-wrapper gradient-pnc mx-auto mb-4">
               <span class="fs-1">🚓</span>
            </div>
            <h2 class="title-text fw-bold mb-3">Central PNC</h2>
            <p class="subtitle-text mb-5 fs-6 lh-lg flex-grow-1">
              Plataforma oficial exclusiva para levantamiento de peritajes y deducción de responsabilidades legales.
            </p>
            <button class="btn custom-btn gradient-pnc-btn w-100 py-3 rounded-pill fw-bold text-white shadow-sm mt-auto">
              INGRESAR A CENTRAL
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuPrincipal',
  methods: {
    goTo(route) {
      this.$router.push(route);
    }
  }
}
</script>

<style scoped>
/* Aprovechamos las variables de App.vue para el Background */
.sigat-hero {
  min-height: calc(100vh - 70px);
  background-color: transparent; 
  font-family: 'Inter', system-ui, sans-serif;
}

.title-text { color: var(--text-main); }
.subtitle-text { color: var(--text-muted); }

/* 2. Efectos de Iluminación Ambiental (Orbes Neón) */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px); /* Mayor difuminado para suavizar en Light Mode */
  z-index: 0;
  opacity: 0.25; 
  animation: float 10s ease-in-out infinite alternate;
}
.orb-1 { width: 500px; height: 500px; background: #00d2ff; top: -100px; left: -100px; }
.orb-2 { width: 600px; height: 600px; background: #3a7bd5; bottom: -200px; right: -150px; animation-delay: -5s; }
.z-int-1 { z-index: 1; }

@keyframes float {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(50px) scale(1.1); }
}

/* 3. Tipografía Principal */
.sigat-title {
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 900;
  background: linear-gradient(to right, var(--text-main), var(--text-muted));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5rem;
}
.tracking-wide { letter-spacing: 0.2em; font-size: 0.85rem; }

/* 4. Efecto Glassmorphism (Usamos variables heredadas) */
.glass-pill {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.main-glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  box-shadow: 0 10px 30px var(--glass-shadow);
}

.main-glass:hover {
  transform: translateY(-15px);
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  box-shadow: 0 30px 60px var(--glass-shadow);
}

/* 5. Iconos Flotantes */
.icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s cubic-bezier(1, 0, 0, 1);
}
.main-glass:hover .icon-wrapper {
  transform: scale(1.15) rotate(-5deg);
}

.gradient-citizen { background: linear-gradient(135deg, #FF416C, #FF4B2B); }
.gradient-pnc { background: linear-gradient(135deg, #00d2ff, #3a7bd5); }

/* 6. Botones Dinámicos */
.custom-btn {
  border: none;
  letter-spacing: 1px;
  transition: all 0.4s ease;
}
.gradient-citizen-btn { background: linear-gradient(135deg, #FF416C, #FF4B2B); }
.gradient-pnc-btn { background: linear-gradient(135deg, #00d2ff, #3a7bd5); }

.main-glass:hover .gradient-citizen-btn {
  box-shadow: 0 10px 25px rgba(255, 65, 108, 0.4) !important;
}
.main-glass:hover .gradient-pnc-btn {
  box-shadow: 0 10px 25px rgba(0, 210, 255, 0.4) !important;
}

/* Animaciones Iniciales Opcionales */
.fade-down { animation: fadeDown 1s ease-out; }
.fade-up { animation: fadeUp 1s ease-out backwards; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
