const Event = require("./models/event");
const mongoose = require("mongoose");

module.exports = async function removeOldEvents() {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log("Removing old events...");
  let now = new Date().getTime();
  await Event.deleteMany({ datetime: { $lt: now } });
  console.log("Old events removed.");
  await mongoose.connection.close();
};
