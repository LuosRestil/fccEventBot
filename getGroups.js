const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const Group = require("./models/group");
require("dotenv").config();

mongoose;

module.exports = async function getGroups() {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  let groups = await Group.find({});
  await mongoose.connection.close();
  return groups;
};
