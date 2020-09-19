const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const MeetupGroup = require("./models/meetupGroup");
require("dotenv").config();

mongoose;

module.exports = async function getGroups() {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  let groups = await MeetupGroup.find({});
  await mongoose.connection.close();
  return groups;
};
