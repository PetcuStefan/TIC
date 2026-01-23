<template>
  <div class="home">
    <header class="header">
      <h1>PC Parts Store</h1>

      <div class="actions">
        <!-- ADMIN ONLY -->
        <button v-if="isAdmin" @click="goToAddProduct">
          ➕ Add Product
        </button>

        <button @click="logout">
          🚪 Logout
        </button>
      </div>
    </header>

    <ul class="products">
      <li v-for="product in products" :key="product.id">
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

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
}

onMounted(loadProducts)
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions button {
  margin-left: 10px;
}

.products {
  margin-top: 20px;
}
</style>
