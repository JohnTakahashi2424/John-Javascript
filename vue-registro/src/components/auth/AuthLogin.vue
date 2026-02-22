<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-lg" style="max-width: 400px; width: 100%;">
      <div class="card-body p-4">
        <h2 class="card-title text-center mb-4">Iniciar sesión</h2>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              class="form-control" 
              placeholder="correo@ejemplo.com" 
              required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              class="form-control" 
              placeholder="Tu contraseña" 
              required />
          </div>
          <button type="submit" class="btn btn-primary w-100 mb-3">Entrar</button>
        </form>
        <p class="text-center">
          <button type="button" @click="goRegister" class="btn btn-link p-0">Crear cuenta</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.email === email.value && u.password === password.value)
  if (!user) {
    alert('Credenciales inválidas')
    return
  }
  localStorage.setItem('auth', 'true')
  alert('Login correcto')
  router.push('/alumnos')
}

function goRegister() {
  router.push('/register')
}
</script>