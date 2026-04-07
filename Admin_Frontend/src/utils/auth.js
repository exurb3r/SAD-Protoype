import { useAuth } from '../stores/auth'

export function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || []
  const foundUser = users.find(u => u.email === email)

  if (!foundUser) throw new Error('User not found')
  if (foundUser.password !== password) throw new Error('Incorrect password')

  const { loginUser } = useAuth()
  loginUser(foundUser)

  return foundUser
}

export function signup(newUser) {
  const users = JSON.parse(localStorage.getItem('users')) || []

  if (users.find(u => u.email === newUser.email)) {
    throw new Error('Email already registered')
  }

  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
}

export function logout() {
  const { logoutUser } = useAuth()
  logoutUser()
}