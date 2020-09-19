const removeOldEvents = require("./removeOldEvents");
const dataScrape = require("./dataScrape");
const botWeeklyAlert = require("./botWeeklyAlert.js");
const mongoose = require("mongoose");

async function weeklyScript() {
  // await mongoose.connect(process.env.ATLAS_URI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  // });
  await removeOldEvents();
  await dataScrape();
  await botWeeklyAlert();
  // await mongoose.connection.close();
  // console.log("Mongoose connection closed.");
  console.log("Weekly script complete.");
}

weeklyScript();
