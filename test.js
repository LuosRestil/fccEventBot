require("dotenv").config();
const Discord = require("discord.js");
const { command, generalChannelId } = require("./config.json");
const client = new Discord.Client();
const mongoose = require("mongoose");
const Event = require("./models/event");
const MeetupGroup = require("./models/meetupGroup");
const addEvent = require("./commands/addEvent");
const addMeetup = require("./commands/addMeetup");
const getTodayEvents = require("./commands/getTodayEvents");
const getTomorrowEvents = require("./commands/getTomorrowEvents");
const getWeekEvents = require("./commands/getWeekEvents");
const help = require("./commands/help");

client.once("ready", () => {
  // console.info(`Logged in as ${client.user.tag}!`);
  client.channels.cache.get(generalChannelId).send("Cron working.");
});

client.login(process.env.TOKEN);
