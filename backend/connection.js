const mongoose = require('mongoose');

const URI = 'mongodb+srv://mongo:pass@cluster0.cjnx2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log('SUCCESSS');
  } catch (e) {
    console.log(e);
  }
};
module.exports = connectDB;
