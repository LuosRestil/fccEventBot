const Event = require("./models/event");
const Discord = require("discord.js");
const client = new Discord.Client();
const { eventsChannelId } = require("./config.json");

let now = new Date();
let endOfToday = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  23,
  59
).getTime();

module.exports = async function botDailyAlert() {
  client.once("ready", () => {
    Event.find({ datetime: { $lt: endOfToday } }, (err, events) => {
      if (err) {
        console.log(err);
        // log error, send me an email, something
      } else if (events) {
        events = events.sort((a, b) => a.datetime - b.datetime);
        if (events.length === 0) {
          return;
        } else {
          let messageString = "**Check out these events happening today!**\n\n";
          const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          for (let event of events) {
            let datetime = new Date(event.datetime);
            let eventString = `${event.group}:\n\t${
              event.name
            }\n\t${datetime.toLocaleDateString(
              undefined,
              options
            )} ${datetime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}\n\t${event.link}\n\n`;
            if (messageString.length + eventString.length > 2000) {
              messageString += "And more...";
              break;
            } else {
              messageString += eventString;
            }
          }
          client.channels.cache.get(eventsChannelId).send(messageString);
          client.destroy();
        }
      }
    });
  });
};
