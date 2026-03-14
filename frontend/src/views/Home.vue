<template>
  <div class="home-container">
    <h1>PC Parts Store</h1>

    <div class="actions">
      <select v-model="selectedCategory" @change="loadProducts">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <button @click="logout">Logout</button>
      <button class="cart-btn" @click="goToCart">View Cart</button>
      <button class="orders-btn" @click="goToOrders">View Orders</button>
      <button v-if="isAdmin" @click="goToAddProduct">Add Product</button>
    </div>

    <ul class="products">
      <li v-for="product in products" :key="product.id" @click="goToProduct(product.id)">
        <img v-if="product.image" :src="getImageUrl(product.image)" class="product-thumb" />
        <strong>{{ product.name }}</strong>
        — ${{ product.discountedPrice || product.price }}
        <span v-if="product.discount">({{ product.discount }}% off)</span>
      </li>
    </ul>
        <p v-if="products.length === 0" class="no-products">
      No products available in this category.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { categories } from '../categories.js'
import '../styles/home.css'

const products = ref([])
const selectedCategory = ref("")
const router = useRouter()
const isAdmin = localStorage.getItem('role') === 'admin'

// Helper to convert relative backend image path to full URL
function getImageUrl(imagePath) {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${imagePath}`
}

// Load products (all or filtered by category)
async function loadProducts() {
  try {
    const url = selectedCategory.value
      ? `/products/category/${selectedCategory.value}`
      : '/products'
    const res = await api.get(url)
    products.value = res.data
  } catch (err) {
    console.error('Failed to load products', err)
  }
}

// Navigation & actions
function goToAddProduct() { router.push('/add-product') }
function goToCart() { router.push('/cart') }
function goToProduct(id) { router.push(`/products/${id}`) }
function goToOrders() { router.push('/orders') }
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
}

// Load products initially
onMounted(loadProducts)
</script>