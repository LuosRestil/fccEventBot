const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const MeetupGroup = require("./models/meetupGroup");
require("dotenv").config();

async function populateDbFromGroups() {
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  let groups = await getGroupsFromLocalFile();
  await addGroupsToDb(groups);
  await mongoose.connection.close();
}

async function addGroupsToDb(groups) {
  for (let group of groups) {
    const newGroup = new MeetupGroup({
      name: group.name,
      url: group.url,
    });
    try {
      await newGroup.save();
    } catch (error) {
      console.error(error);
    }
  }
}

async function getGroupsFromLocalFile(collection) {
  let groups = [];
  const fileStream = fs.createReadStream("NashTechEvents.csv");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    let nameAndUrlExtension = line.split(",");
    let name = nameAndUrlExtension[0];
    let url = "https://www.meetup.com" + nameAndUrlExtension[1];
    groups.push({ name: name, url: url });
  }
  return groups;
}

populateDbFromGroups();
