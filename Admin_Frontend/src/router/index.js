import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import ActiveMembers from '../views/ActiveMembers.vue'
import AddMembership from '../views/AddMembership.vue'
import AppUsers from '../views/AppUsers.vue'
import Announcements from '../views/Announcements.vue'
import Calendar from '../views/Calendar.vue'

const routes = [
  { path: '/',                name: 'Dashboard',      component: Dashboard },
  { path: '/members',         name: 'Active Members', component: ActiveMembers },
  { path: '/add-membership',  name: 'Add Membership', component: AddMembership },
  { path: '/users',           name: 'App Users',      component: AppUsers },
  { path: '/announcements',   name: 'Announcements',  component: Announcements },
  { path: '/calendar',        name: 'Calendar',       component: Calendar },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router