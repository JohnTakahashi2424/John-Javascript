<template>
  <div :class="[themeClass, 'app-container min-vh-100 d-flex flex-column transition-theme']">
    
    <!-- Navbar Global SIGAT Premium -->
    <nav class="navbar navbar-expand-lg border-bottom px-4 navbar-premium">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand fw-bold mb-0 h1 d-flex align-items-center text-decoration-none logo-text">
          <span class="logo-icon align-middle">⚡</span> S I G A T
        </router-link>
        
        <div class="d-flex align-items-center gap-3">
          <!-- Dark / Light Mode Switcher (Fuera del colapso para visibilidad total) -->
          <button @click="toggleTheme" class="btn theme-toggle-btn rounded-pill px-3 py-1 d-flex align-items-center gap-2 shadow-sm border-0 interaction-btn">
            <span v-if="isDark" class="fs-5">☀️</span>
            <span v-else class="fs-5">🌙</span>
            <span class="d-none d-md-inline fw-bold small text-uppercase tracking-wider">
              {{ isDark ? 'Luz' : 'Noche' }}
            </span>
          </button>

          <button class="navbar-toggler custom-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav align-items-center gap-3">
            <li class="nav-item">
              <router-link to="/conductor" class="nav-link custom-nav-link" active-class="active-link-citizen">Portal Ciudadano</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/pnc" class="nav-link custom-nav-link" active-class="active-link-pnc">Portal PNC</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Componente central Vue Router -->
    <div class="flex-grow-1 position-relative p-0 m-0">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isDark: true
    }
  },
  computed: {
    themeClass() {
      return this.isDark ? 'theme-dark' : 'theme-light';
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem('sigat-theme', this.isDark ? 'dark' : 'light');
    }
  },
  mounted() {
    // Configurar theme persistente
    const savedTheme = localStorage.getItem('sigat-theme');
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    }
  }
};
</script>

<style>
/* 
===========================================
  MAESTRÍA DE VARIABLES (THEME ENGINE)
===========================================
*/
:root {
  /* Transiciones Globales */
  --transition-speed: 0.5s;
}

.theme-dark {
  --bg-main: #0B0F19;
  --bg-secondary: #131A2A;
  --text-main: #FFFFFF;
  --text-muted: #9BA9B8;
  --glass-bg: rgba(255, 255, 255, 0.02);
  --glass-bg-hover: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-hover: rgba(255, 255, 255, 0.2);
  --glass-shadow: rgba(0, 0, 0, 0.5);
  --input-bg: rgba(0, 0, 0, 0.3);
  --input-border: rgba(255, 255, 255, 0.1);
  --nav-bg: rgba(11, 15, 25, 0.8);
  --border-subtle: rgba(255,255,255,0.05);
}

.theme-light {
  --bg-main: #F3F4F6; /* Gris súper suave */
  --bg-secondary: #FFFFFF;
  --text-main: #111827;
  --text-muted: #6B7280;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-bg-hover: rgba(255, 255, 255, 1);
  --glass-border: rgba(255, 255, 255, 1);
  --glass-border-hover: rgba(209, 213, 219, 1);
  --glass-shadow: rgba(0, 0, 0, 0.05);
  --input-bg: rgba(255, 255, 255, 1);
  --input-border: rgba(209, 213, 219, 1);
  --nav-bg: rgba(255, 255, 255, 0.8);
  --border-subtle: rgba(0,0,0,0.05);
}

/* 
===========================================
  CLASES MAESTRAS DEL SISTEMA
===========================================
*/
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-main) !important; /* Force override local bg */
}

/* Aplicación del Theme wrapper (Asegura herencia) */
.transition-theme {
  background-color: var(--bg-main);
  color: var(--text-main);
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
}

/* NAVBAR MAGNIFICA */
.navbar-premium {
  background: var(--nav-bg) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--border-subtle) !important;
  z-index: 1000;
}

.logo-text {
  color: var(--text-main) !important;
  letter-spacing: 2px;
}
.logo-icon {
  font-size: 1.5rem;
  margin-right: 12px;
  filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));
}

.custom-nav-link {
  color: var(--text-muted) !important;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  transition: color 0.3s ease;
}
.custom-nav-link:hover {
  color: var(--text-main) !important;
}

/* Subrayado de active */
.active-link-citizen, .active-link-pnc {
  color: var(--text-main) !important;
  font-weight: 700;
}
.active-link-citizen::after {
  content: ''; position: absolute; left: 0; bottom: -5px; width: 100%; height: 3px; background: #FF4B2B; border-radius: 5px; box-shadow: 0 0 10px #FF4B2B;
}
.active-link-pnc::after {
  content: ''; position: absolute; left: 0; bottom: -5px; width: 100%; height: 3px; background: #00d2ff; border-radius: 5px; box-shadow: 0 0 10px #00d2ff;
}

/* BOTÓN DEL TEMA PREMIUM */
.theme-toggle-btn {
  background: var(--glass-bg) !important;
  color: var(--text-main) !important;
  border: 1px solid var(--glass-border) !important;
  font-size: 0.85rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.theme-toggle-btn:hover {
  background: var(--glass-bg-hover) !important;
  border-color: var(--glass-border-hover) !important;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 20px var(--glass-shadow) !important;
}

/* ESTILIZACION GENÉRICA DE COMPONENTES GLOBALES (Para paneles) */
.premium-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px var(--glass-shadow);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.premium-input {
  background-color: var(--input-bg) !important;
  border: 1px solid var(--input-border) !important;
  color: var(--text-main) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
}
.premium-input:focus {
  box-shadow: 0 0 0 3px rgba(13, 202, 240, 0.2) !important;
  border-color: #0dcaf0 !important;
  outline: none;
}
.premium-input::placeholder { color: var(--text-muted); opacity: 0.6; }


/* 
================================================================
  EXTERMINIO DE HUECOS BLANCOS (BOOTSTRAP OVERRIDE)
================================================================
*/
.premium-table, 
.premium-table tr, 
.premium-table th, 
.premium-table td,
.table-responsive {
  background-color: transparent !important;
  --bs-table-bg: transparent !important;
  --bs-table-accent-bg: transparent !important;
  --bs-table-striped-bg: transparent !important;
  --bs-table-active-bg: transparent !important;
  --bs-table-hover-bg: var(--glass-bg-hover) !important;
  color: var(--text-main) !important;
  border-bottom-color: var(--border-subtle) !important;
}

.premium-table thead th {
  background: transparent !important;
  border-bottom: 2px solid var(--border-subtle) !important;
  color: var(--text-muted) !important;
}

/* Forzar que Inputs no tengan fondos raros en Modo Claro si no es deseado */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--text-main);
  -webkit-box-shadow: 0 0 0px 1000px var(--input-bg) inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
