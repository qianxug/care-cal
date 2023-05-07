const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Care: Boolean,
    Name: String,
    Email: String,
    Products: []
});

const User = mongoose.model('User', userSchema)
module.exports = User;


// {
//     id: uuidv4(),
//     label: 'thing #1',
//     type: 'cleanser',
//     notes: 'amogusamogusamogusamogusamogusamogusamogusamogusamogusamogusamogusamogusamogus',
//     routine: [
//       {
//         meridian: 'am',
//         dayOfWeek: 'Monday'
//       },
//       {
//         meridian: 'pm',
//         dayOfWeek: 'Monday'
//       },
//       {
//         meridian: 'pm',
//         dayOfWeek: 'Wednesday'
//       }
//     ]
//   },