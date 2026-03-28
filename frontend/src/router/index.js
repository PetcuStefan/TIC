import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AddProduct from '../views/AddProduct.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Cart from '../views/Cart.vue'
import ViewOrders from '../views/ViewOrders.vue'
import SuccessPage from '../views/SuccessPage.vue'
import PaymentFailed from '../views/PaymentFailed.vue'
import BuildPC from '../views/BuildPC.vue'

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
},
{
  path: '/orders',
  component: ViewOrders
},
  {
    path: '/success',
    name: 'Success',
    component: SuccessPage
  },
  {
    path: '/payment-failed',
    name: 'PaymentFailed',
    component: PaymentFailed
  },
  {
    path: '/build-pc',
    name: 'BuildPC',
    component: BuildPC
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
