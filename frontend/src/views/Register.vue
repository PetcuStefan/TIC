<template>
  <div class="auth-container">
    <h2>Register</h2>

    <form @submit.prevent="register">
      <input v-model="username" type="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>

    <p>
      Already have an account?
      <router-link to="/login">Login</router-link>
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

async function register() {
  try {
    await api.post('/auth/signup', {
      username: username.value,
      password: password.value
    })

    router.push('/login')
  } catch (err) {
    error.value = err.response?.data || 'Registration failed'
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
