<template>
  <h1>Login to Your Account</h1>
  <form>
    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input v-model="email" class="input" type="email" placeholder="give your email" />
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input v-model="password" class="input" type="password" placeholder="....." />
      </div>
    </div>
    <p class="help is-danger" v-if="errMsg">{{ errMsg }}</p>

    <div class="control">
      <button class="button is-link is-light" @click.prevent="signIn">Login</button>
    </div>
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router' // import router
import { signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('test@test.com')
const password = ref('12345678')
const errMsg = ref('')

const router = useRouter() // get a reference to our vue router

const signIn = () => {
  signInWithEmailAndPassword(auth, email.value, password.value) // THIS LINE CHANGED
    .then((data) => {
      console.log('Successfully logged in!', data)

      router.push('/') // redirect to the feed
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = 'Invalid email'
          break
        case 'auth/user-not-found':
          errMsg.value = 'No account with that email was found'
          break
        case 'auth/wrong-password':
          errMsg.value = 'Incorrect password'
          break
        default:
          errMsg.value = 'Email or password was incorrect'
          break
      }
    })
}
</script>
