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

      <select v-model="product.category" required>
        <option disabled value="">Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <textarea
        v-model="product.description"
        placeholder="Description"
      ></textarea>

      <input
        v-model.number="product.stock"
        type="number"
        placeholder="Stock"
      />

      <input
        v-model.number="product.discount"
        type="number"
        placeholder="Discount %"
      />

      <!-- IMAGE UPLOAD -->
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        @change="uploadFile"/>     
       <div v-if="previewUrl">
        <p>Preview:</p>
        <img :src="previewUrl" class="preview" />
      </div>

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
import {categories} from '../categories'

const route = useRoute()
const router = useRouter()

const product = ref({
  name: '',
  price: 0,
  category: '',
  description: '',
  stock: 0,
  discount: 0,
  image: ''
})

const previewUrl = ref(null)
const isEditMode = computed(() => !!route.params.id)

async function loadProduct() {
  if (!isEditMode.value) return

  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data

    if (res.data.image) {
      previewUrl.value = res.data.image
    }

  } catch (err) {
    console.error(err)
    router.push('/')
  }
}

async function uploadFile(event) {
  const file = event.target.files[0]
  if (!file) return

  // show preview immediately
  previewUrl.value = URL.createObjectURL(file)

  // prepare FormData for backend
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // backend returns: { url: '/uploads/filename.jpg' }
    product.value.image = res.data.url

  } catch (err) {
    console.error(err)
    alert('Image upload failed')
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
    console.error(err)
    alert('Operation failed')
  }
}

onMounted(loadProduct)
</script>

<style scoped>
.add-product-container {
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input, textarea, button {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background-color: #45a049;
}

.preview {
  max-width: 200px;
  margin-top: 10px;
}
</style>