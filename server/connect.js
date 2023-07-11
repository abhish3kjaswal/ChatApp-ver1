const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = connectDB;
