const mongoose = require('mongoose');


const profileSchema = mongoose.Schema({
  firstName: {
      type: String,
      required: true,
  },
  lastName: {
      type: String,
      required: true,
  },
  company: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
  },
  experience: {
      type: Number,
      required: true,
  },
})

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;


