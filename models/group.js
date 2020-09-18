const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const MeetupGroupSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
});

const MeetupGroup = mongoose.model("MeetupGroup", MeetupGroupSchema);

module.exports = MeetupGroup;
