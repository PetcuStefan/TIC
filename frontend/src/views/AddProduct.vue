<template>
  <div class="add-product">
    <h2>Add Product</h2>

    <form @submit.prevent="submit">
      <input
        v-model="name"
        type="text"
        placeholder="Product name"
        required
      />

      <input
        v-model.number="price"
        type="number"
        placeholder="Price"
        required
      />

      <input
        v-model="categoryName"
        type="text"
        placeholder="Category name (e.g. GPU)"
        required
      />

      <button type="submit">Add Product</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Product added successfully</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const price = ref(null)
const categoryId = ref('')
const categoryName = ref('')
const error = ref('')
const success = ref(false)

async function submit() {
  try {
    const categoryId = categoryName.value.toLowerCase().replace(/\s+/g, '-')
    await api.post('/products', {
      name: name.value,
      price: price.value,
      category: {
        id: categoryId,
        name: categoryName.value
      }
    })

    success.value = true
    setTimeout(() => router.push('/'), 1000)
  } catch (err) {
    error.value = err.response?.data || 'Failed to add product'
  }
}
</script>

<style scoped>
.add-product {
  max-width: 400px;
  margin: 50px auto;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
