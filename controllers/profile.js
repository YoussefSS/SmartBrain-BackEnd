const handleProfileGet = (req, res) => {
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
}

export {handleProfileGet}