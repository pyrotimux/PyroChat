// import libs and declare


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

var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
mongoose.connect('mongodb://localhost:27017/finaldb', {  
    promiseLibrary: require('bluebird') })
        .then(() =>  console.log('connection succesful'))
        .catch((err) => console.error(err));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

var muser = require('./models/user.js');
var User = mongoose.model('User');

var mmesg = require('./models/message.js');
var Message = mongoose.model('Message');

io.on('connection', (socket) => {  
	
	// on client connection write console and send client msg.
	console.log('Client connected'); 
	socket.emit('fromServer', {id: 'Hello'}); 

	// on client disconnect write to console
	socket.on('disconnect', (socket) => {
		console.log('Client disconnected');
	});

	// listen for client messages and respond.
	socket.on('fromClient', (data) => { 
		console.log('Received: ' + data.id);
		if(data.id == "Hi There!"){
			socket.emit('fromServer', {id: 'How are you!'}); 
		}
		
	});
});

// routes 
app.get('/', (req, res) => {
    res.send([{
        title: "HI!",
        description: "Hi There"

    }])

});


app.post('/register', function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.json({success: false, msg: 'Please pass username and password.'});
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      // save the user
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
  });

  app.post('/login', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token, username: user.username});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  app.post('/createmsg', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var mes = Message({
        to: 'hi',
        message: req.body.message,
        from: req.body.from
      });
      mes.save(function(err) {
        if (err) throw err;
        
        });
    } 
  });

  app.get('/getmsg', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Message.find({ 'from': 'phyo' }, function (err, dat) {
        if (err) return next(err);
        res.json(dat);
        console.log(dat);
      }).limit(50);
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  app.get('/getusers', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      User.find(function (err, dat) {
        if (err) return next(err);
        res.json(dat);
        console.log(dat);
      }).select({ "username": 1, "_id": 0});

      
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });



app.listen(process.env.Port | 9090)

