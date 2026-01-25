import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AddProduct from '../views/AddProduct.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Cart from '../views/Cart.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
  path: '/add-product',
  component: AddProduct,
  beforeEnter: () => {
    if (localStorage.getItem('role') !== 'admin') {
      return '/';
    }
  }
},
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
  path: '/products/:id/edit',
  name: 'EditProduct',
  component: AddProduct,
  meta: { requiresAdmin: true }
}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
