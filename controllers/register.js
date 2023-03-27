const handleRegister = (req, res, db, bcrypt) => {
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
}

export {handleRegister};