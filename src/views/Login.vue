<template>
  <div class="login-container">
    <img src="../assets/Logo.svg" alt="Do the Todo Logo" />
    <button class="google-login" @click="handleAuth">
      <img src="../assets/google_G.png" alt="Google G" class="google-g" />
      <p>SIGN IN WITH GOOGLE</p>
    </button>
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
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  justify-content: space-between;
  margin: 5rem auto;
  min-height: 30rem;
  padding: 2rem;
  width: 50rem;
}

button {
  border-radius: 5px;
  box-sizing: border-box;
  width: 20rem;
  height: 3rem;
  margin: auto;
  padding: 0 0 0 10px;
}

.google-g {
  width: 2rem;
  margin-right: auto;
}

button p {
  margin-right: auto;
}

button {
  align-items: center;
  background: #fff;
  border: none;
  color: green;
  cursor: pointer;
  display: flex;
  font-size: 1.1rem;
  font-weight: 700;
  justify-content: center;
  margin-top: auto;
  outline: none;
  padding: 1rem;
}

@media only screen and (max-width: 600px) {
  .login-container {
    background: none;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    justify-content: flex-start;
    padding: 1rem;
    margin: 0;
    min-height: 100vh;
    max-width: 100%;
  }

  button {
    position: fixed;
    bottom: 2rem;
    width: 90%;
  }

  .google-g {
    width: 1.5rem;
    margin-right: auto;
  }
}
</style>
