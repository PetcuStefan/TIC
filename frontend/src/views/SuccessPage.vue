<template>
  <div class="success-container">
    <h1>Payment Successful!</h1>
    <p v-if="processing">Confirming your order...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else>Thank you for your order! Redirecting to home...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const sessionId = ref('')
const processing = ref(true)
const error = ref('')

// Auto-confirm order on mount
onMounted(async () => {
  sessionId.value = route.query.session_id || ''
  if (!sessionId.value) {
    processing.value = false
    error.value = 'No session ID found.'
    return
  }

  try {
    // Send JWT token in Authorization header
    await api.post(
      '/payment/confirm',
      { sessionId: sessionId.value },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )

    // Clear cart
    localStorage.removeItem('cart')

    // Redirect after short delay
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (err) {
    console.error('Failed to confirm order', err)
    error.value = 'Failed to confirm order. Please contact support.'
  } finally {
    processing.value = false
  }
})
</script>

<style scoped>
.success-container {
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  background: #f0f9f5;
  border-radius: 8px;
  text-align: center;
  font-family: Arial, sans-serif;
}

p {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
}

.success-container h1 {
  color: #42b883;
}
</style>