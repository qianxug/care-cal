const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Care: Boolean,
    Name: String,
    Email: String,
    Products: {
        id: String,
        label: String,
        type: String,
        notes: String,
        routine: []
    }
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