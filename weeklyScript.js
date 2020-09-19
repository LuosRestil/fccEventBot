const removeOldEvents = require("./removeOldEvents");
const dataScrape = require("./dataScrape");
const botWeeklyAlert = require("./botWeeklyAlert.js");
const mongoose = require("mongoose");

async function weeklyScript() {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("Mongoose connection made...");
  await removeOldEvents();
  await dataScrape();
  await botWeeklyAlert();
  await mongoose.connection.close();
  console.log("Weekly script complete.");
}

weeklyScript();
