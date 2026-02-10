<template>
  <div class="signUpPage">
    <h1>Sign Up</h1>

    <form @submit="register" class="signUpForm">
      <span>{{ spanFn }}</span>
      <input type="text" v-model="firstname" placeholder="First Name" />

      <span>{{ spanLn }}</span>
      <input type="text" v-model="lastname" placeholder="Last Name" />

      <span></span>
      <input type="text" v-model="username" placeholder="Username" />

      <span>{{ spanPwd }}</span>
      <input type="password" v-model="password" placeholder="Password" />

      <span>{{ spanCPwd }}</span>
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
      />

      <span>{{ spanEmail }}</span>
      <input type="text" v-model="email" placeholder="Email" />

      <span></span>
      <input type="text" v-model="contactNum" placeholder="Contact Number" />

      <span></span>
      <input type="text" v-model="address" placeholder="Address" />

      <button>Sign Up</button>
    </form>

    <p>Already have an account? <a href="">Log in</a></p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const firstname = ref("");
const lastname = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const contactNum = ref("");
const address = ref("");

const spanFn = ref("");
const spanLn = ref("");
const spanPwd = ref("");
const spanCPwd = ref("");
const spanEmail = ref("");

function checker() {
  const namePattern = /^[A-Za-z\s]+$/;
  const regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-.+])[a-zA-Z\d!@#$%^&*()-.+]{8,}$/;
  const emailPattern = /^[^\s@]+@gmail\.com$/;

  // First name validation
  if (firstname.value === "") {
    spanFn.value = "";
  } else if (!namePattern.test(firstname.value)) {
    spanFn.value = "Invalid";
  } else {
    spanFn.value = "";
  }

  // Last name validation
  if (lastname.value === "") {
    spanLn.value = "";
  } else if (!namePattern.test(lastname.value)) {
    spanLn.value = "Invalid";
  } else {
    spanLn.value = "";
  }

  // Password validation
  if (password.value === "") {
    spanPwd.value = "";
  } else if (!regex.test(password.value)) {
    spanPwd.value = "Invalid";
  } else {
    spanPwd.value = "";
  }

  // Confirm password validation
  if (confirmPassword.value === "") {
    spanCPwd.value = "";
  } else if (confirmPassword.value !== password.value) {
    spanCPwd.value = "Passwords do not match";
  } else {
    spanCPwd.value = "";
  }

  // Email validation
  if (email.value === "") {
    spanEmail.value = "";
  } else if (!emailPattern.test(email.value)) {
    spanEmail.value = "Invalid email";
  } else {
    spanEmail.value = "";
  }
}

async function register(event) {
  event.preventDefault();

  const emailPattern = /^[^\s@]+@gmail\.com$/;
  const namePattern = /^[A-Za-z\s]+$/;

  if (
    !firstname.value ||
    !lastname.value ||
    !username.value ||
    !email.value ||
    !password.value ||
    !contactNum.value ||
    !address.value
  ) {
    console.log("Needs All Credentials to be filled");
    return;
  }

  if (
    !namePattern.test(firstname.value) ||
    !namePattern.test(lastname.value) ||
    confirmPassword.value !== password.value ||
    !emailPattern.test(email.value)
  ) {
    console.log("Invalid Credentials");
    return;
  }

  const userInfo = {
    firstname: firstname.value,
    lastname: lastname.value,
    username: username.value,
    email: email.value,
    password: password.value,
    contactNum: contactNum.value,
    address: address.value,
  };

  try {
    const response = await fetch(
      "http://localhost:3500/userRegister/addUser",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userInfo),
      }
    );

    if (!response.ok) {
      throw new Error("Failed Add User");
    }

    const updates = await response.json();
    console.log(updates);

    // Reset fields
    firstname.value = "";
    lastname.value = "";
    email.value = "";
    username.value = "";
    password.value = "";
    confirmPassword.value = "";
    address.value = "";
    contactNum.value = "";
  } catch (err) {
    console.error(err);
  }
}

// Vue equivalent of useEffect dependency array
watch(
  [firstname, lastname, password, confirmPassword, email],
  checker
);
</script>

<style scoped>
/* Keep your existing styles or move your CSS here */
</style>
