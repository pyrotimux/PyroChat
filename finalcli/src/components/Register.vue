<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <h2>Please Register</h2>
      <div v-if="errors && errors.length">
        <div v-for="error of errors" :key="error.message">
          <b-alert show>{{error.message}}</b-alert>
        </div>
      </div>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Username">
          <b-form-input id="username" v-model.trim="register.username"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal2"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Password">
          <b-form-input type="password" id="password" v-model.trim="register.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Register</b-button>
        <b-button type="button" variant="success" @click="$router.go(-1)">Cancel</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'Register',
  data () {
    return {
      register: {},
      errors: []
    }
  },
  sockets: {
    serverError: function(data){
        this.errors.push(...data)
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$socket.emit('register', this.register)
      alert("Registered successfully")
      this.$router.push({
          name: 'Login'
        })
    }
  }
}
</script>
