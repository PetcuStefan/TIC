<template>
  <div class="home-container">
    <header class="header">
      <h1>PC Parts Store</h1>

<div class="actions">
    <button @click="logout">
    Logout
  </button>
  
  <button class="cart-btn" @click="goToCart">
    🛒 View Cart
  </button>

  <!-- ADMIN ONLY -->
  <button v-if="isAdmin" @click="goToAddProduct">
    ➕ Add Product 
  </button>
</div>

    </header>

    <ul class="products">
      <li
        v-for="product in products"
        :key="product.id"
        @click="goToProduct(product.id)"
        class="product-item"
      >
      <strong>{{ product.name }}</strong>
         — ${{ product.price }}
      </li>

    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import '../styles/home.css'

const products = ref([])
const router = useRouter()

const isAdmin = localStorage.getItem('role') === 'admin'

async function loadProducts() {
  try {
    const res = await api.get('/products')
    products.value = res.data
  } catch (err) {
    console.error('Failed to load products', err)
  }
}

function goToAddProduct() {
  router.push('/add-product')
}

function goToCart() {
  router.push('/cart')
}

function goToProduct(id) {
  router.push(`/products/${id}`)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
}

onMounted(loadProducts)
</script>
