<template>
  <b-row class="justify-content-md-center">
    <b-col cols="12">
      <h2>
        Messages:
      </h2>
        <div v-if="errors && errors.length">
          <div v-for="error of errors" :key="error.message">
            <b-alert show>{{error.message}}</b-alert>
          </div>
        </div>

      <b-form @submit="onSubmit">
        <b-form-group id="from"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="From:">
          <b-form-input id="msg" v-model.trim="mesg.from"  disabled></b-form-input>
        </b-form-group>

        <b-form-group id="to"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="To:">
          <b-form-select v-model.trim="mesg.to" @change.native="myChange">
            <option v-for="i of users">
              {{i.username}}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="message"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Message:">
          <b-form-input id="msg" v-model.trim="mesg.message"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Send</b-button>
      </b-form>
      <br/><br/>
      <p v-for="j in messages">{{ j.from }}: {{ j.message }} </p>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors"  :key="error.message">
          {{error.message}}
        </li>
      </ul>
    </b-col>
  </b-row>
</template>


<script>
export default {
  data() {
    return {
      mesg: {from: localStorage.getItem('username'), token: localStorage.getItem('jwtToken')},
      messages: [],
      errors: [],
      users:[]
    }
  },

  sockets: {
    fromServer: function(data){
      console.log(data)
      this.messages.push(...data)
    },
    getUsers: function(data){
      this.users.push(...data)
    },
    serverError: function(data){
      this.errors.push(...data)
      this.$router.push({
          name: 'Login'
        })
    }
  },

  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.$socket.emit('fromClient', this.mesg)
    },
    myChange(evt) {
       this.mesg.to = evt.target.value
       this.$socket.emit('joinRoom', this.mesg)
   }
  },
  created () {
    this.$socket.emit('getUsers', {token: localStorage.getItem('jwtToken')})
  }
}
</script>
