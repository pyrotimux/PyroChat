// we will use express for backend server along with passport to help manage creation of users
// mongoose will help us manage the db

// let's import all libs and declare necessary stuff
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var passport = require('passport');
var settings = require('./config/settings');
require('./config/passport')(passport);

var exp = require('express');
var bdparser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');

const app = exp();
app.use(morgan('combined'));
app.use(bdparser.json());


// our db connection info
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
mongoose.connect('mongodb://localhost:27017/finaldb', {
    promiseLibrary: require('bluebird') })
        .then(() =>  console.log('connection succesful'))
        .catch((err) => console.error(err));


// let's define what access control we want here.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// our models for users and messages
var muser = require('./models/user.js');
var User = mongoose.model('User');

var mmesg = require('./models/message.js');
var Message = mongoose.model('Message');

var server = app.listen(process.env.Port | 9090);
var io = require('socket.io')(server);

// socker io stuff
io.on('connection', (socket) => {

	// on client connection write console
	console.log('Client connected');

	// on client disconnect write to console
	socket.on('disconnect', (socket) => {
		console.log('Client disconnected');
	});

	// client is requesting a list of users
	// see if they are auth and return user list from db
	socket.on('getUsers', (req) => {
        if (req.token) {
            User.find(function (err, dat) {
                if (err) return next(err);
                socket.emit('getUsers', dat);
                console.log(dat);
              }).select({ "username": 1, "_id": 0});
        } else {
          socket.emit('serverError', {error: 'Unauthorized'});
        }
	});



	// client is requesting to join a room
	// so we will create a room based on who client wants to talk to
	// by sorting their names in alphabetical order
	// then retrieve the 50 messages and send it back to both clients.
	socket.on('joinRoom', (req) => {
	    let room = (req.from >= req.to) ? req.from + req.to : req.to + req.from;
        if (req.token) {
          Message.find({ 'room': room }, function (err, dat) {
            if (err) return next(err);
            socket.emit('fromServer', dat);
          }).limit(50);
        } else {
            socket.emit('serverError', {error: 'Unauthorized'});
        }
	});

    // when client send a message then we will save it in the message db
    // send the message back in the room so it will be displayed for everyone in room
	socket.on('fromClient', (req) => {
        let room = (req.from >= req.to) ? req.from + req.to : req.to + req.from;
        var token = req.token;
        if (token) {
            socket.join(room);
            io.sockets.in(room).emit('fromServer', [{message: req.message, from: req.from}]);
             var mes = Message({
                message: req.message,
                from: req.from,
                room: room
              });
              mes.save(function(err) {
                if (err) throw err;

                });

        }else {
            socket.emit('serverError', {error: 'Unauthorized'});
        }
    });

	// when they leave room we will disconnect them from the room
	socket.on('leaveRoom', (req) => {
		let room = (req.from >= req.to) ? req.from + req.to : req.to + req.from;
		socket.leave(room);
	});

    // client wants to register for our service
	socket.on('register', (req) => {
		if (!req.username || !req.password) {
            socket.emit('serverError', {error: 'Please pass username and password.'});
        } else {
          var newUser = new User({
            username: req.username,
            password: req.password
          });
          // save the user
          newUser.save(function(err) {
            if (err) {
              socket.emit('serverError', {error: 'Username already exists.'});
            }
            socket.emit('serverError', {error: 'Successful created new user.'});
          });
        }
	});

	// client wants to login so we check it against db
	socket.on('login', (req) => {
	    // check if user exists
		User.findOne({
          username: req.username
        }, function(err, user) {
          if (err) throw err;

          if (!user) {
            socket.emit('loginInfo', {error: 'Authentication failed. User not found.'});
          } else {
            // check password
            user.comparePassword(req.password, function (err, isMatch) {
              if (isMatch && !err) {
                // create a token for user and send it back
                var token = jwt.sign(user.toJSON(), settings.secret);
                socket.emit('loginInfo', {token: 'JWT ' + token, username: user.username});
              } else {
                socket.emit('loginInfo', {error: 'Authentication failed. Wrong password.'});
              }
            });
          }
        });

	});
});
