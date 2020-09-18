const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const EventSchema = new Schema({
  group: { type: String, required: true },
  name: { type: String, required: true },
  datetime: { type: Number, required: true },
  link: { type: String, required: true, unique: true },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
