<template>
  <div class="login-container">
    <button class="google-login" @click="handleAuth">LOGIN WITH GOOGLE</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      provider: this.$root.provider,
    }
  },
  methods: {
    handleAuth() {
      this.$root.fb
        .auth()
        .signInWithPopup(this.provider)
        .then(result => {
          let token = result.credential.accessToken
          let user = result.user
          this.$root.loginUser(token, user)
        })
        .catch(e => {
          console.log(e)
        })
    },
  },
}
</script>

<style scoped>
.login-container {
  box-shadow: 0 4px 10px -4px #aaa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 5rem auto;
  min-height: 30rem;
  padding: 2rem;
  width: 20rem;
}

h1 {
  margin: 0;
  padding: 0;
}

form {
  display: flex;
  flex-direction: column;
  min-height: 25rem;
  justify-content: space-between;
}

input,
button {
  box-sizing: border-box;
  width: 100%;
  height: 3rem;
  padding: 0 0 0 10px;
}

input {
  margin-top: 1rem;
}

button {
  background: #aaa;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: auto;
  outline: none;
}
</style>
