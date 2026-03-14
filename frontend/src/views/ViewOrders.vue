<template>
  <div class="orders-container">
    <h1>{{ isAdmin ? 'All Orders' : 'My Orders' }}</h1>

    <p v-if="orders.length === 0">No orders found.</p>

    <div v-for="order in orders" :key="order.id" class="order-card">
      <p><strong>Order ID:</strong> {{ order.id }}</p>

      <p v-if="isAdmin">
        <strong>User:</strong> {{ order.username }}
      </p>

      <p><strong>Date:</strong> {{ formatDate(order.createdAt) }}</p>

      <p><strong>Total:</strong> ${{ order.total }}</p>

      <ul>
        <li v-for="item in order.items" :key="item.productId">
          {{ item.name }} × {{ item.quantity }} — ${{ item.price }}
        </li>
      </ul>

      <button @click="generateInvoice(order)">Generate Invoice</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import jsPDF from 'jspdf'
import '../styles/viewOrders.css'

const orders = ref([])
const isAdmin = localStorage.getItem('role') === 'admin'

// Load orders (all for admin, or only user’s own)
async function loadOrders() {
  try {
    const url = isAdmin ? '/orders' : '/orders/my-orders'
    const res = await api.get(url)
    orders.value = res.data
  } catch (err) {
    console.error('Failed to load orders', err)
  }
}

function formatDate(ts) {
  if (!ts) return ''
  // Firestore Timestamp has toDate method
  if (ts.toDate) return ts.toDate().toLocaleString()
  // fallback: if already string
  return new Date(ts).toLocaleString()
}

// Generate a PDF invoice for a given order
function generateInvoice(order) {
  const doc = new jsPDF()
  const lineHeight = 8
  let y = 20

  // Header
  doc.setFontSize(18)
  doc.text('Invoice', 105, y, null, null, 'center')
  y += 10

  doc.setFontSize(12)
  doc.text(`Order ID: ${order.id}`, 10, y)
  y += lineHeight
  if (order.username) {
    doc.text(`User: ${order.username}`, 10, y)
    y += lineHeight
  }
  if (order.createdAt) {
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      10,
      y
    )
    y += lineHeight
  }
  doc.text(`Total: $${order.total}`, 10, y)
  y += lineHeight + 4

  // Items Table Header
  doc.setFontSize(14)
  doc.text('Items', 10, y)
  y += lineHeight
  doc.setFontSize(12)

  // Items List
  order.items.forEach((item, idx) => {
    doc.text(
      `${idx + 1}. ${item.name} × ${item.quantity} — $${item.price}`,
      10,
      y
    )
    y += lineHeight
    // Create new page if exceeding page height
    if (y > 280) {
      doc.addPage()
      y = 20
    }
  })

  // Footer
  y += 10
  doc.setFontSize(10)
  doc.text('Thank you for shopping at PC Parts Store!', 105, y, null, null, 'center')

  // Save PDF
  doc.save(`invoice_${order.id}.pdf`)
}

onMounted(loadOrders)
</script>

<style scoped>
.orders-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}

.order-card {
  padding: 15px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #fdfdfd;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.order-card button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.order-card button:hover {
  background-color: #2c80b4;
}
</style>