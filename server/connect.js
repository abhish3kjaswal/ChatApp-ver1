const mongoose = require("mongoose");

const url =
  "mongodb+srv://chat_app_admin:admin1234@cluster0.0iis4jm.mongodb.net/ChatApp";

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
