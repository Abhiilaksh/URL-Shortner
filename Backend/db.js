const mongoose = require("mongoose");

require('dotenv').config();
const mongoUrl=process.env.MONGO_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Running'))
  .catch(err => console.error('MongoDB connection error:', err));

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    match: /^(https?:\/\/)[^\s$.?#].[^\s]*$/gm,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

urlSchema.index({ createdAt: 1 }, { expireAfterSeconds: 36000 });

const urlDB = mongoose.model('urlDB', urlSchema);

module.exports = urlDB;
