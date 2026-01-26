<template>
  <div v-if="product" class="product-details">
    <h1>{{ product.name }}</h1>
    <p><strong>Price:</strong> ${{ product.price }}</p>
    <p><strong>Category:</strong> {{ product.category?.name || product.category }}</p>

    <div class="actions">
      <input
        type="number"
        v-model.number="quantity"
        min="1"
      />

      <button class="add-btn" @click="addToCart">
        Add to Cart
      </button>
    </div>

    <!-- ADMIN CONTROLS -->
    <div v-if="isAdmin" class="admin-actions">
      <button class="edit-btn" @click="goToEdit">
        Update Product
      </button>

      <button class="delete-btn" @click="deleteProduct">
        Delete Product
      </button>
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
  const cart = JSON.parse(localStorage.getItem('cart')) || []

  const existing = cart.find(item => item.id === product.value.id)

  if (existing) {
    existing.quantity += quantity.value
  } else {
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
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
