import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import firebaseConfig from '../config'
import 'firebase/database'
import 'firebase/auth'
firebase.initializeApp(firebaseConfig)
let provider = new firebase.auth.GoogleAuthProvider();

Vue.config.productionTip = false

new Vue({
  beforeCreate() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userData.user = user
        if (this.$route.path != `/todos/${this.userData.user.uid}`) {
          this.$router.push(`/todos/${this.userData.user.uid}`)
        }
      } else {
        if (this.$route.name != 'Login') {
          this.$router.push('/')
        }
      }
    })
  },
  data() {
    return {
      fb: firebase,
      provider,
      userData: {}
    }
  },
  methods: {
    loginUser(token, user) {
      this.userData.token = token
      this.userData.user = user
      this.$router.push(`todos/${this.userData.user.uid}`)
    },
    signOut() {
      this.fb.auth().signOut()
    },
  },
  router,
  render: h => h(App)
}).$mount('#app')
