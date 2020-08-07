const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;
const knex = require('knex');
const dbPass = require('./dbPass');

const signin = require('./controllers/signin');
const signup = require('./controllers/signup');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'gus',
    password : `${dbPass.password}`,
    database : 'face-recon'
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  db.select('*').from('users')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('unable to retrieve users'))
});

//No need to inject req, res to handle functions below, as they receive automatically from '/'

app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/signup', signup.handleSignUp(db, bcrypt, saltRounds));
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));