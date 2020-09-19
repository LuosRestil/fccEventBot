const Event = require("./models/event");

module.exports = async function removeOldEvents() {
  console.log("Removing old events...");
  let now = new Date().getTime();
  await Event.deleteMany({ datetime: { $lt: now } });
  console.log("Old events removed.");
};
