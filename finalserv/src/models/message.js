var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var MessageSchema = new Schema({
  message: {
        type: String,
        required: true
    },
    from: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
});


  module.exports = mongoose.model('Message', MessageSchema);