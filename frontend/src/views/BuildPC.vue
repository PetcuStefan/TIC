<template>
  <div class="build-pc-container">
    <h1>🖥️ Build Your PC</h1>

    <div class="dropdowns">
      <label>CPU</label>
      <select v-model="selected.cpu">
        <option disabled value="">Select CPU</option>
        <option v-for="p in cpus" :key="p.id" :value="p">{{ p.name }} - ${{ p.price }}</option>
      </select>

      <label>Motherboard</label>
      <select v-model="selected.motherboard">
        <option disabled value="">Select Motherboard</option>
        <option v-for="p in filteredMotherboards" :key="p.id" :value="p">{{ p.name }} - ${{ p.price }}</option>
      </select>

      <label>RAM</label>
      <select v-model="selected.ram">
        <option disabled value="">Select RAM</option>
        <option v-for="p in filteredRams" :key="p.id" :value="p">{{ p.name }} - ${{ p.price }}</option>
      </select>

      <label>GPU</label>
      <select v-model="selected.gpu">
        <option disabled value="">Select GPU</option>
        <option v-for="p in gpus" :key="p.id" :value="p">{{ p.name }} - ${{ p.price }}</option>
      </select>

      <label>PSU</label>
      <select v-model="selected.psu">
        <option disabled value="">Select PSU</option>
        <option v-for="p in filteredPsus" :key="p.id" :value="p">{{ p.name }} - ${{ p.price }}</option>
      </select>
    </div>

    <div class="total-price">
      <h2>Total Price: ${{ totalPrice }}</h2>
    </div>

    <button @click="addToCart" :disabled="!canAddToCart">Add to Cart</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const products = ref([])

async function loadProducts() {
  try {
    const res = await api.get('/products')
    products.value = res.data.filter(p => p.stock > 0)
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadProducts)

const cpus = computed(() => products.value.filter(p => p.category === 'CPU'))
const motherboards = computed(() => products.value.filter(p => p.category === 'Motherboard'))
const rams = computed(() => products.value.filter(p => p.category === 'RAM'))
const gpus = computed(() => products.value.filter(p => p.category === 'GPU'))
const psus = computed(() => products.value.filter(p => p.category === 'PSU'))

const selected = ref({
  cpu: null,
  motherboard: null,
  ram: null,
  gpu: null,
  psu: null
})

const filteredMotherboards = computed(() => {
  if (!selected.value.cpu) return motherboards.value
  return motherboards.value.filter(mb => mb.socket === selected.value.cpu.socket)
})

const filteredRams = computed(() => {
  if (!selected.value.motherboard) return rams.value
  return rams.value.filter(r => r.ramType === selected.value.motherboard.ramType)
})

const filteredPsus = computed(() => {
  const powerNeeded = (selected.value.cpu?.tdp || 0) + (selected.value.gpu?.tdp || 0) + 100
  return psus.value.filter(psu => psu.wattage >= powerNeeded)
})

const totalPrice = computed(() => {
  return (selected.value.cpu?.price || 0) +
         (selected.value.motherboard?.price || 0) +
         (selected.value.ram?.price || 0) +
         (selected.value.gpu?.price || 0) +
         (selected.value.psu?.price || 0)
})

const canAddToCart = computed(() => {
  return selected.value.cpu && selected.value.motherboard && selected.value.ram &&
         selected.value.gpu && selected.value.psu
})

// Add each selected component individually to the cart
function addToCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || []

  const components = ['cpu', 'motherboard', 'ram', 'gpu', 'psu']

  components.forEach(key => {
    const part = selected.value[key]
    if (!part) return

    const price = part.discountedPrice || part.price
    const existing = cart.find(item => item.id === part.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        id: part.id,
        name: part.name,
        price: price,
        quantity: 1
      })
    }
  })

  localStorage.setItem('cart', JSON.stringify(cart))
  alert('Selected components added to cart!')
}
</script>

<style scoped>
.build-pc-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.dropdowns {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

select {
  padding: 8px;
  font-size: 16px;
}

.total-price {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

button {
  margin-top: 15px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>