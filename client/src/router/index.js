import { createRouter, createWebHistory } from 'vue-router';
import ProfilePage from '../pages/ProfilePage.vue';
import DialogsPage from '../pages/DialogsPage.vue';
import ChatPage from '../pages/ChatPage.vue';
import UsersPage from '../pages/UsersPage.vue';

const routes = [
  {
    path: '/',
    name: 'users',
    component: UsersPage
  },
  {
    path: '/dialogs',
    name: 'dialogs',
    component: DialogsPage
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
