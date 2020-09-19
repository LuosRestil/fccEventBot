const botDailyAlert = require("./botDailyAlert.js");
const removeOldEvents = require("./removeOldEvents");
const mongoose = require("mongoose");

async function dailyScript() {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  await removeOldEvents();
  await botDailyAlert();
  await mongoose.connection.close();
}

dailyScript();
