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
          "Sorry, I don't understand that command. Try `!event help` to see what I'm able to do."
        );
    }
  }
});

client.login(process.env.TOKEN);
