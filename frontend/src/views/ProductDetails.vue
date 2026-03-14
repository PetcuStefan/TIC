<template>
  <div v-if="product" class="product-details">

    <h1>{{ product.name }}</h1>

    <!-- IMAGE -->
    <img
      v-if="product.image"
      :src="getImageUrl(product.image)"
      class="product-image"
      alt="Product image"
    />

    <p>{{ product.description }}</p>

    <p>
      <strong>Category:</strong>
      {{ product.category }}
    </p>

    <p>
      <strong>Stock:</strong>
      {{ product.stock }}
    </p>

    <p v-if="product.discount">
      <strong>Price:</strong>
      <span class="old-price">${{ product.price }}</span>
      <span class="discounted-price">${{ product.discountedPrice }}</span>
      ({{ product.discount }}% off)
    </p>

    <p v-else>
      <strong>Price:</strong> ${{ product.price }}
    </p>

    <div class="actions">
      <input
        type="number"
        v-model.number="quantity"
        min="1"
        :max="product.stock"
      />

      <button
        class="add-btn"
        @click="addToCart"
        :disabled="product.stock === 0"
      >
        {{ product.stock === 0 ? 'Out of stock' : 'Add to Cart' }}
      </button>
    </div>

    <!-- ADMIN CONTROLS -->
    <div v-if="isAdmin" class="admin-actions">
      <button class="edit-btn" @click="goToEdit">Update Product</button>
      <button class="delete-btn" @click="deleteProduct">Delete Product</button>
    </div>

  </div>

  <p v-else>Loading product...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import '../styles/productDetails.css'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const quantity = ref(1)
const isAdmin = localStorage.getItem('role') === 'admin'

// Helper to convert backend path to URL
function getImageUrl(imagePath) {
  if (!imagePath) return null

  // if path already has http/https, return as is
  if (imagePath.startsWith('http')) return imagePath

  // Otherwise prepend server URL
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${imagePath}`
}

async function loadProduct() {
  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data
  } catch (err) {
    console.error('Failed to load product', err)
    router.push('/')
  }
}

function addToCart() {
  if (quantity.value > product.value.stock) {
    alert('Not enough stock')
    return
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || []

  const existing = cart.find(item => item.id === product.value.id)
  const price = product.value.discountedPrice || product.value.price

  if (existing) {
    existing.quantity += quantity.value
  } else {
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: price,
      quantity: quantity.value
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  alert('Added to cart')

  // Redirect to homepage automatically
  router.push('/')
}

function goToEdit() {
  router.push(`/products/${product.value.id}/edit`)
}

async function deleteProduct() {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await api.delete(`/products/${product.value.id}`)
    alert('Product deleted')
    router.push('/')
  } catch (err) {
    alert('Failed to delete product')
    console.error(err)
  }
}

onMounted(loadProduct)
</script>

<style scoped>
.product-image {
  max-width: 400px;
  width: 100%;
  margin: 15px 0;
  border-radius: 8px;
  object-fit: contain;
}
</style>