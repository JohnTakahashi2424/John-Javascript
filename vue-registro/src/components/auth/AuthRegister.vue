<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-lg" style="max-width: 400px; width: 100%;">
      <div class="card-body p-4">
        <h2 class="card-title text-center mb-4">Registro</h2>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input 
              id="name"
              v-model="name" 
              type="text"
              class="form-control" 
              placeholder="Tu nombre completo" 
              required />
          </div>
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
          <button type="submit" class="btn btn-primary w-100 mb-3">Crear cuenta</button>
        </form>
        <p class="text-center">
          <button type="button" @click="goLogin" class="btn btn-link p-0">Ya tengo cuenta</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

function register() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.some(u => u.email === email.value)) {
    alert('El usuario ya existe')
    return
  }
  users.push({ name: name.value, email: email.value, password: password.value })
  localStorage.setItem('users', JSON.stringify(users))
  alert('Registro exitoso')
  router.push('/login')
}

function goLogin() {
  router.push('/login')
}
</script>