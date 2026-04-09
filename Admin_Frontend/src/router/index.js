import { createRouter, createWebHistory } from 'vue-router'

// ✅ Layout (IMPORTANT: should be layout with sidebar)
import AppLayout from '../layout/AppLayout.vue'

// Pages
import Dashboard      from '../views/Dashboard.vue'
import ActiveMembers  from '../views/ActiveMembers.vue'
import AddMembership  from '../views/AddMembership.vue'
import AppUsers       from '../views/AppUsers.vue'
import Announcements  from '../views/Announcements.vue'
import Calendar       from '../views/Calendar.vue'
import Staff          from '../views/Staff.vue'
import Notifications  from '../views/Notifications.vue'
import Reports        from '../views/Reports.vue'
import Settings       from '../views/Settings.vue'
import BranchLogbook  from '../views/BranchLogbook.vue'
import CommunityPost  from '../views/CommunityPost.vue'
import RewardUsers    from '../views/RewardUsers.vue'
import AdminLogin     from '../views/Login.vue'

const routes = [
  // ✅ LOGIN (NO SIDEBAR)
  {
    path: '/login',
    name: 'Admin Login',
    component: AdminLogin
  },

  // ✅ APP (WITH SIDEBAR LAYOUT)
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'members', name: 'Active Members', component: ActiveMembers },
      { path: 'add-membership', name: 'Add Membership', component: AddMembership },
      { path: 'users', name: 'App Users', component: AppUsers },
      { path: 'announcements', name: 'Announcements', component: Announcements },
      { path: 'calendar', name: 'Calendar', component: Calendar },
      { path: 'staff', name: 'Staff Management', component: Staff },
      { path: 'notifications', name: 'Notifications', component: Notifications },
      { path: 'reports', name: 'Reports & Analytics', component: Reports },
      { path: 'settings', name: 'Settings', component: Settings },
      { path: 'logbook', name: 'Branch Logbook', component: BranchLogbook },
      { path: 'community-posts', name: 'Community Posts', component: CommunityPost },
      { path: 'reward-users', name: 'Reward Users', component: RewardUsers },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* 🔐 AUTH GUARD (CRITICAL) */
router.beforeEach((to, from, next) => {
  const isAdmin = localStorage.getItem("isAdmin")

  if (to.path !== '/login' && !isAdmin) {
    next('/login')
  } else if (to.path === '/login' && isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router