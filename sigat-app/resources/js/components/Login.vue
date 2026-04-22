<template>
  <div class="login-wrapper bg-dark text-white d-flex align-items-center justify-content-center vh-100">
    <div class="card bg-secondary border-0 shadow-lg" style="width: 25rem; border-radius: 15px;">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h2 class="fw-bold tracking-tight text-light">SIGAT</h2>
          <p class="text-muted mb-0">Stellar Trafic - Iniciar Sesión</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label text-light">Correo Electrónico</label>
            <input 
              type="email" 
              v-model="form.correo_electronico"
              class="form-control bg-dark border-secondary text-white custom-input" 
              placeholder="oficial@sigat.gob.sv" 
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label text-light">Contraseña</label>
            <input 
              type="password" 
              v-model="form.password"
              class="form-control bg-dark border-secondary text-white custom-input" 
              placeholder="••••••••" 
              required
            >
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold py-2 rounded-3 shadow-sm login-btn">
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Usaremos mixins o fetch nativo para conectarnos con Laravel
import Swal from 'sweetalert2';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        correo_electronico: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        if (!this.form.correo_electronico || !this.form.password) {
          Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, ingresa tus credenciales.',
            background: '#2d333b',
            color: '#fff'
          });
          return;
        }

        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Credenciales incorrectas');
        }

        // Guardar token y rol
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('usuario_id', data.usuario.id);

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada como ${data.rol}`,
          background: '#2d333b',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirigir según rol
        setTimeout(() => {
          if (data.rol === 'Conductor') {
            this.$router.push('/conductor');
          } else {
            this.$router.push('/pnc');
          }
        }, 1500);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de Autenticación',
          text: error.message,
          background: '#2d333b',
          color: '#fff'
        });
      }
    }
  }
}
</script>

<style scoped>
.custom-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.bg-secondary {
  background-color: #22272e !important;
}
.login-btn {
  transition: all 0.3s ease;
}
.login-btn:hover {
  transform: translateY(-2px);
}
</style>
