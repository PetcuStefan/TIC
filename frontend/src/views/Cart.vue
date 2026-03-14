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

        <button class="remove-btn" @click="removeItem(item.id)">✖</button>
      </li>
    </ul>

    <div v-if="cart.length" class="cart-footer">
      <h3>Total: ${{ totalPrice }}</h3>
      <button class="order-btn" @click="checkout">Pay with Stripe</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const cart = ref([])
const router = useRouter()

// Load cart from localStorage
function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart')) || []
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

// Remove an item from the cart
function removeItem(id) {
  cart.value = cart.value.filter(item => item.id !== id)
  saveCart()
}

// Compute total price
const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// Checkout function
async function checkout() {
  if (!cart.value.length) return

  const userId = localStorage.getItem('userId')
  const username = localStorage.getItem('username')

  if (!userId || !username) {
    alert('You must be logged in to place an order.')
    router.push('/login')
    return
  }

  try {
    // 1️⃣ Create Stripe Checkout session in backend
    const res = await api.post('/payment/checkout', {
      items: cart.value,
      total: totalPrice.value,
      userId,
      username
    })

    // 2️⃣ Redirect to Stripe Checkout
    window.location.href = res.data.url
  } catch (err) {
    console.error('Stripe Checkout failed', err)
    alert('Payment initiation failed')
  }
}

onMounted(loadCart)
</script>

<style scoped>
.cart-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  background: #fff;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.cart-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-btn {
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
}

.order-btn:hover {
  background-color: #369b6d;
}
</style>