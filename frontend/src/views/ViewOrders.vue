<template>
  <div class="orders-container">
    <h1>{{ isAdmin ? 'All Orders' : 'My Orders' }}</h1>

    <p v-if="orders.length === 0">No orders found.</p>

    <div v-for="order in orders" :key="order.id" class="order-card">
      <p><strong>Order ID:</strong> {{ order.id }}</p>

      <!-- ADMIN ONLY: show who placed the order -->
      <p v-if="isAdmin">
        <strong>User:</strong> {{ order.username }}
      </p>

      <p><strong>Total:</strong> ${{ order.total }}</p>

      <ul>
        <li v-for="item in order.items" :key="item.productId">
          {{ item.name }} × {{ item.quantity }} — ${{ item.price }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import '../styles/viewOrders.css'

const orders = ref([])
const isAdmin = localStorage.getItem('role') === 'admin'

async function loadOrders() {
  try {
    const url = isAdmin ? '/orders' : '/orders/my-orders'
    const res = await api.get(url)
    orders.value = res.data
  } catch (err) {
    console.error('Failed to load orders', err)
  }
}

onMounted(loadOrders)
</script>
