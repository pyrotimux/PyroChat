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
            <option v-for="i of users"  :key="i">
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
      <p v-for="j in messages" :key="j.message">{{ j.from }}: {{ j.message }} </p>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors"  :key="error.message">
          {{error.message}}
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'MessageList',
  data () {
    return {
      mesg: {from: localStorage.getItem('username')},
      messages: [],
      errors: [],
      users:[]
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      axios.post(`http://localhost:9090/createmsg`, this.mesg)
      .then(response => {
        alert("Message Sent.")
        
      })
      .catch(e => {
        console.log(e)
        this.errors.push(e)
      })
    },
    myChange(evt) {
       let val = evt.target.value
       console.log("Hello")
   }
  },
  created () {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.get(`http://localhost:9090/getmsg`)
    .then(response => {
      this.messages = response.data
    })
    .catch(e => {
      this.errors.push(e)
      if(e.status === 401) {
        this.$router.push({
          name: 'Login'
        })
      }
    })

    axios.get(`http://localhost:9090/getusers`)
    .then(response => {
      this.users = response.data
    })
    .catch(e => {
      this.errors.push(e)
      if(e.status === 401) {
        this.$router.push({
          name: 'Login'
        })
      }
    })
  }
}
</script>