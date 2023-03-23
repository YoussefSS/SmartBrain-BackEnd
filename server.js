import express from 'express';

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0, // how many times this user submitted a photo
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0, // how many times this user submitted a photo
            joined: new Date()
        }
    ]
}

app.use(express.json());


app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
    }
    else{
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    database.users.push({
        id: '125',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length-1]);
})


app.get('/profile/:id', (req, res) => {
    let found = false;

    database.users.forEach(user => {
        if(user.id === req.params.id) {
            found = true;
            return res.json(user);
        }
    });

    if(!found){
        res.status(400).json("not found");
    }
})

app.put('/image', (req, res) => {
    let found = false;

    database.users.forEach(user => {
        if(user.id === req.body.id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if(!found){
        res.status(400).json("not found");
    }
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