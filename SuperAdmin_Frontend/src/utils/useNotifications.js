import { ref, computed } from "vue";

const notifications = ref([
  { id: 1, type: "expire",  name: "Jochelle Maltu",  message: "Jochelle Maltu's membership is expiring in 2 days.",  time: "Just now",    read: false },
  { id: 2, type: "join",    name: "Abegail Moyaen",  message: "Abegail Moyaen joined as a Monthly member.",          time: "5 mins ago",  read: false },
  { id: 3, type: "payment", name: "Roven Santos",    message: "Roven Santos completed payment of ₱2,500.",           time: "20 mins ago", read: false },
  { id: 4, type: "expire",  name: "Kurt Morales",    message: "Kurt Morales' membership is expiring in 5 days.",     time: "1 hour ago",  read: true  },
  { id: 5, type: "join",    name: "Janina Somera",   message: "Janina Somera joined as a Quarterly member.",         time: "3 hours ago", read: true  },
  { id: 6, type: "payment", name: "Chris P Bacon",   message: "Chris P Bacon completed payment of ₱1,800.",         time: "5 hours ago", read: true  },
  { id: 7, type: "expire",  name: "Chris P Bacon",   message: "Chris P Bacon's membership is expiring in 7 days.",  time: "1 day ago",   read: true  },
  { id: 8, type: "join",    name: "Roven Santos",    message: "Roven Santos renewed his Annual plan.",               time: "2 days ago",  read: true  },
]);

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

const markAsRead   = (id) => { const n = notifications.value.find(n => n.id === id); if (n) n.read = true; };
const markAsUnread = (id) => { const n = notifications.value.find(n => n.id === id); if (n) n.read = false; };
const markAllRead  = ()   => { notifications.value.forEach(n => n.read = true); };
const deleteNotif  = (id) => { notifications.value = notifications.value.filter(n => n.id !== id); };

export function useNotifications() {
  return { notifications, unreadCount, markAsRead, markAsUnread, markAllRead, deleteNotif };
}