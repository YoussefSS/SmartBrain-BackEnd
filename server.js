import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';

import {handleRegister} from './controllers/register.js';
import {handleSignIn} from './controllers/signin.js';
import {handleProfileGet} from './controllers/profile.js';
import {handleApiCall, handleImage} from './controllers/image.js';

dotenv.config();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : process.env.DATABASE_PASSWORD,
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.json('ok') })
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });
app.post('/signin', handleSignIn(db, bcrypt)); // can do this instead (currying?) check signin.js
app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { handleApiCall(req, res) });

// In the listen function we can have a secondary parameter that's a function that happens after the listen happens
app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/******
/ (root) --> res = this is working
/register --> POST request, returns the new user object
/signin --> POST request, respond with success/fail. Why POST? Because we don't want to send it as a query string in the URL, instead in the body of a secure HTTPS request
/profile/:userId --> URL with parameter, GET request, returns the user
/image --> PUT, increases the num of images the user posted by 1, so it's a PUT request that returns the user object
******/