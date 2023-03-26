import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import dotenv from 'dotenv';

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

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then((user) => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'));
        }
        else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'));
})

app.post('/register', (req, res) => {
    const bcryptHash = bcrypt.hashSync(req.body.password);

    db.transaction((trx) => {
        trx.insert({
            hash: bcryptHash,
            email: req.body.email
        })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: req.body.name,
                joined: new Date()
            })
            .then((user) => { // response is the result of .returning
                res.json(user[0]); // returns an array of 1 item, so get the first item
            })
        })
        .then(trx.commit) // If the transaction is all good, then commit
        .catch(trx.rollback) // If there was a problem with the transaction, ie one of the operations failed, rollback everything you did
    })
    .catch((err) => {
        res.status(400).json('unable to register'); // if you print out err, it will tell you that email already exists for example
    })
})


app.get('/profile/:id', (req, res) => {
    db.select('*').from('users')
    .where({
        id: req.params.id
    })
    .then((user) => {
        if(user.length > 0) {
            res.json(user[0]) // returns an array of 1 item, so get the first item
        }
        else {
            res.status(400).json('Not found');
        }
    })
    .catch((err) => {
        res.status(400).json('Error getting user');
    })
})

app.put('/image', (req, res) => {
    db('users').where('id', '=', req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
        res.json(entries[0].entries);
    })
    .catch((err) => {
        res.status(400).json('unable to get entries');
    })
    
    /*.update({
        entries:  // We use increment instead of grabbing the entries manually then incrementing it
    })*/
})




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