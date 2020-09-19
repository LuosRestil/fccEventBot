const Event = require("./models/event");
const Discord = require("discord.js");
const client = new Discord.Client();
const { eventsChannelId, generalChannelId } = require("./config.json");
const mongoose = require("mongoose");
require("dotenv").config();

const MILLISECONDS_IN_ONE_WEEK = 604800000;

let oneWeekFromNow = new Date().getTime() + MILLISECONDS_IN_ONE_WEEK;

module.exports = async function botWeeklyAlert() {
  // console.log("Performing weekly alert...");
  await client.login(process.env.TOKEN);
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  Event.find({ datetime: { $lt: oneWeekFromNow } }, async (err, events) => {
    // console.log("Event search complete");
    if (err) {
      console.error(err);
      // log error, send me an email, something
    } else if (events) {
      events = events.sort((a, b) => a.datetime - b.datetime);
      if (events.length === 0) {
        return;
      } else {
        let messageString =
          "***Check out these events happening this week!***\n\n";
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        for (let event of events) {
          let datetime = new Date(event.datetime);
          let eventString = `**${event.group}:**\n\t*${
            event.name
          }*\n\t${datetime.toLocaleDateString(
            undefined,
            options
          )} ${datetime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}\n\t<${event.link}>\n\n`;
          if (messageString.length + eventString.length > 2000) {
            await client.channels.cache
              .get(generalChannelId)
              .send(messageString);
            messageString = eventString;
          } else {
            messageString += eventString;
          }
        }
        await client.channels.cache.get(eventsChannelId).send(messageString);
        // console.log("Alert complete!");
        client.destroy();
        await mongoose.connection.close();
      }
    }
  });
};
