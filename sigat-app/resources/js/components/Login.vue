<template>
  <div class="login-wrapper bg-dark text-white d-flex align-items-center justify-content-center vh-100">
    <div class="card bg-secondary border-0 shadow-lg" style="width: 25rem; border-radius: 15px;">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h2 class="fw-bold tracking-tight text-light">SIGAT</h2>
          <p class="text-info mb-0">Stellar Trafic - Sistema Inteligente</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label text-light small fw-bold">Correo Electrónico</label>
            <input 
              type="email" 
              v-model="form.correo_electronico"
              class="form-control bg-dark border-secondary text-white custom-input" 
              placeholder="agente@sigat.gob.sv" 
              required
            >
          </div>
          
          <div class="mb-4">
            <label class="form-label text-light small fw-bold">Contraseña</label>
            <input 
              type="password" 
              v-model="form.password"
              class="form-control bg-dark border-secondary text-white custom-input" 
              placeholder="••••••••" 
              required
            >
          </div>

          <button type="submit" class="btn btn-info w-100 fw-bold py-2 rounded-3 shadow-sm login-btn text-dark">
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
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
            title: 'Credenciales Incompletas',
            text: 'Debes completar tu correo y contraseña.',
            background: '#22272e',
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

        // Guardamos autenticación local
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('usuario_id', data.usuario.id);

        Swal.fire({
          icon: 'success',
          title: 'Autenticación Exitosa',
          text: `Accediendo como ${data.rol}`,
          background: '#22272e',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirección dinámica basada en rol (Rúbrica)
        setTimeout(() => {
          if (data.rol === 'Conductor') {
            this.$router.push('/conductor');
          } else if (data.rol === 'PNC') {
            this.$router.push('/pnc');
          }
        }, 1200);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: error.message,
          background: '#22272e',
          color: '#fff'
        });
      }
    }
  }
}
</script>

<style scoped>
.bg-secondary { background-color: #22272e !important; }
.custom-input { transition: border-color 0.3s; }
.custom-input:focus {
  border-color: #0dcaf0;
  box-shadow: 0 0 0 0.2rem rgba(13, 202, 240, 0.25);
  outline: none;
}
.login-btn { transition: all 0.3s ease; }
.login-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(13, 202, 240, 0.4); }
</style>
