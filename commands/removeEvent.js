const Event = require("../models/event");
const mongoose = require("mongoose");

module.exports = async function removeEvent(message, args) {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  Event.findOneAndDelete({ link: args[0] }, (err, doc) => {
    if (err) {
      message.channel.send(
        "Oops, I couldn't delete that item. It may already be deleted, or it may not be registered at all."
      );
    } else {
      message.channel.send("Event scrapped. Bye, Felicia.");
    }
  });
};
