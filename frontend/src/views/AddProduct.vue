<template>
  <div class="add-product-container">
    <h1>{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h1>

    <form @submit.prevent="submit">
      <input
        v-model="product.name"
        placeholder="Product name"
        required
      />

      <input
        v-model.number="product.price"
        type="number"
        placeholder="Price"
        required
      />

      <input
        v-model="product.category"
        placeholder="Category"
        required
      />

      <button type="submit">
        {{ isEditMode ? 'Update Product' : 'Add Product' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import '../styles/addProduct.css'

const route = useRoute()
const router = useRouter()

const product = ref({
  name: '',
  price: '',
  category: ''
})

const isEditMode = computed(() => !!route.params.id)

async function loadProduct() {
  if (!isEditMode.value) return

  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = {
      name: res.data.name,
      price: res.data.price,
      category: res.data.category?.name || res.data.category
    }
  } catch (err) {
    console.error(err)
    router.push('/')
  }
}

async function submit() {
  try {
    if (isEditMode.value) {
      await api.put(`/products/${route.params.id}`, product.value)
      alert('Product updated')
    } else {
      await api.post('/products', product.value)
      alert('Product added')
    }

    router.push('/')
  } catch (err) {
    alert('Operation failed')
    console.error(err)
  }
}

onMounted(loadProduct)
</script>
