<template>
  <div class="auth-container">
    <h2>Login</h2>

    <form @submit.prevent="login">
      <input v-model="username" type="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>

    <p>
      Don't have an account?
      <router-link to="/register">Register</router-link>
    </p>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  try {
    const res = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data || 'Login failed'
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
}
.error {
  color: red;
}
</style>
