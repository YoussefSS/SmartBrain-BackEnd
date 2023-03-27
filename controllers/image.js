import Clarifai from 'clarifai'
import dotenv from 'dotenv';

dotenv.config();

const app = new Clarifai.App({
    apiKey: process.env.NODE_APP_CLARIFAI_API_KEY // added to a .env file which is git ignored
  });
 
const handleApiCall = (req, res) =>{
    app.models.predict(
        'f76196b43bbd45c99b4f3cd8e8b40a8a', // This is the face detect model ID
        req.body.input // You have to use input here, not imageUrl .. why?
      )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.status(400).json('unable to work with API'));
}
    

const handleImage = (req, res, db) => {
    db('users').where('id', '=', req.body.id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
        res.json(entries[0].entries);
    })
    .catch((err) => {
        res.status(400).json('unable to get entries');
    })
}

export {handleImage, handleApiCall};