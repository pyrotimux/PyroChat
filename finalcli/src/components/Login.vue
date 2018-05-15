<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error">
          <b-alert show>{{error}}</b-alert>
        </div>
      </div>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Username">
          <b-form-input id="username" v-model.trim="login.username"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal2"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Password">
          <b-form-input type="password" id="password" v-model.trim="login.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Login</b-button>
        <b-button type="button" variant="success" @click.stop="register()">Register</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      login: {},
      errors: []
    }
  },
  sockets: {
    loginInfo: function(response){
      if("error" in response){
        this.errors.push(response.error)
        console.log(response.error)
      }else{
        localStorage.setItem('jwtToken', response.token)
        localStorage.setItem('username', response.username)
        this.$router.push({
          name: 'Message'
        })
      }
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data.id
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$socket.emit('login', this.login)
    },
    register () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>
