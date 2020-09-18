require("dotenv").config();
const Discord = require("discord.js");
const { command, generalChannelId } = require("./config.json");
const client = new Discord.Client();
const mongoose = require("mongoose");
const Event = require("./models/event");
const Group = require("./models/group");
// const addEvent = require("./commands/addEvent");
// const addMeetup = require("./commands/addMeetup");
const getTodayEvents = require("./commands/getTodayEvents");
const getTomorrowEvents = require("./commands/getTomorrowEvents");
const getWeekEvents = require("./commands/getWeekEvents");
// const help = require("./commands/help");

client.once("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
  mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

client.on("message", (message) => {
  if (!message.content.startsWith(command) || message.author.bot) return;

  const args = message.content.trim().slice(command.length).trim().split(/ +/);
  args.shift();

  if (args.length === 0) {
    getWeekEvents(message);
  } else {
    switch (args[0]) {
      case "help":
        help(message);
        break;
      case "today":
        getTodayEvents(message);
        break;
      case "tomorrow":
        getTomorrowEvents(message);
        break;
      case "add-event":
        addEvent(message, args.slice(1));
        break;
      case "add-meetup":
        addMeetup(message, args.slice(1));
        break;
      default:
        message.channel.send(
          "Sorry, I don't understand that command. Try \"!event help\" to see what I'm able to do."
        );
    }
  }
});

function help(message) {
  message.channel.send("help");
}

function addEvent(message, args) {
  message.channel.send("addEvent");
}

function addMeetup(message, args) {
  message.channel.send("addMeetup");
}

function isToday(datetime) {
  const today = new Date();
  return (
    datetime.getDate() === today.getDate() &&
    datetime.getMonth() === today.getMonth() &&
    datetime.getFullYear() === today.getFullYear()
  );
}

function isTomorrow(datetime) {
  const today = new Date();
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );
  return (
    datetime.getDate() === tomorrow.getDate() &&
    datetime.getMonth() === tomorrow.getMonth() &&
    datetime.getFullYear() === tomorrow.getFullYear()
  );
}

client.login(process.env.TOKEN);