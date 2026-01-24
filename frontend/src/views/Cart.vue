<template>
  <div class="cart-container">
    <h1>Your Cart</h1>

    <p v-if="cart.length === 0">Your cart is empty.</p>

    <ul v-else class="cart-list">
      <li v-for="item in cart" :key="item.id" class="cart-item">
        <div>
          <strong>{{ item.name }}</strong>
          <p>${{ item.price }} × {{ item.quantity }}</p>
        </div>

        <button class="remove-btn" @click="removeItem(item.id)">
          ✖
        </button>
      </li>
    </ul>

    <div v-if="cart.length" class="cart-footer">
      <h3>Total: ${{ totalPrice }}</h3>
      <button class="order-btn" @click="placeOrder">
        Place Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import '../styles/cart.css'

const cart = ref([])
const router = useRouter()

function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart')) || []
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

function removeItem(id) {
  cart.value = cart.value.filter(item => item.id !== id)
  saveCart()
}

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

async function placeOrder() {
  try {
    await api.post('/orders', {
      items: cart.value,
      total: totalPrice.value
    })

    localStorage.removeItem('cart')
    cart.value = []
    alert('Order placed successfully!')
    router.push('/')
  } catch (err) {
    alert('Failed to place order')
    console.error(err)
  }
}

onMounted(loadCart)
</script>
