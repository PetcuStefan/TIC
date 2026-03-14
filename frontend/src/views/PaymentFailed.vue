<template>
  <div class="failed-container">
    <h1>Payment Failed</h1>
    <p>Your payment could not be completed.</p>
    <p>Please try again or contact support if the problem persists.</p>

    <button @click="goCart">Back to Cart</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goCart() {
  router.push('/cart')
}
</script>

<style scoped>
.failed-container {
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  background: #ffe6e6;
  border-radius: 8px;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}
</style>