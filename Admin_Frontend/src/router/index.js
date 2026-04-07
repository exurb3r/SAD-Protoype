import { createRouter, createWebHistory } from 'vue-router'

import Dashboard      from '../views/Dashboard.vue'
import ActiveMembers  from '../views/ActiveMembers.vue'
import AddMembership  from '../views/AddMembership.vue'
import AppUsers       from '../views/AppUsers.vue'
import Announcements  from '../views/Announcements.vue'
import Calendar       from '../views/Calendar.vue'
import Staff          from '../views/Staff.vue'
import Payments       from '../views/Payments.vue'
import Notifications  from '../views/Notifications.vue'
import Reports        from '../views/Reports.vue'
import Settings       from '../views/Settings.vue'

const routes = [
  { path: '/',               name: 'Dashboard',          component: Dashboard },
  { path: '/members',        name: 'Active Members',      component: ActiveMembers },
  { path: '/add-membership', name: 'Add Membership',      component: AddMembership },
  { path: '/users',          name: 'App Users',           component: AppUsers },
  { path: '/announcements',  name: 'Announcements',       component: Announcements },
  { path: '/calendar',       name: 'Calendar',            component: Calendar },
  { path: '/staff',          name: 'Staff Management',    component: Staff },
  { path: '/payments',       name: 'Payment & Billing',   component: Payments },
  { path: '/notifications',  name: 'Notifications',       component: Notifications },
  { path: '/reports',        name: 'Reports & Analytics', component: Reports },
  { path: '/settings',       name: 'Settings',            component: Settings },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router