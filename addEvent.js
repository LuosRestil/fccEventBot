const Event = require("./models/event");
const mongoose = require("mongoose");
require("dotenv").config();

// node addEvent.js {groupName} {eventName} year month day hour minute URL

async function addEvent() {
  let args = process.argv.slice(2);
  let groupName = args[0];
  let eventName = args[1];
  let year = parseInt(args[2]);
  let month = parseInt(args[3]);
  let day = parseInt(args[4]);
  let hour = parseInt(args[5]);
  let minute = parseInt(args[6]);
  let link = args[7];
  let datetime = new Date(year, month - 1, day, hour, minute).getTime();

  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  let newEvent = new Event({
    group: groupName,
    name: eventName,
    datetime: datetime,
    link: link,
  });

  try {
    await newEvent.save();
    console.log("Event saved");
    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

addEvent();
