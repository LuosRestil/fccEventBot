const Event = require("./models/event");
const Discord = require("discord.js");
const client = new Discord.Client();
const { eventsChannelId } = require("./config.json");

const MILLISECONDS_IN_ONE_WEEK = 604800000;

let oneWeekFromNow = new Date().getTime() + MILLISECONDS_IN_ONE_WEEK;

module.exports = async function botWeeklyAlert() {
  console.log("Performing weekly alert...");
  client.once("ready", () => {
    // console.info(`Logged in as ${client.user.tag}!`);
    Event.find({ datetime: { $lt: oneWeekFromNow } }, (err, events) => {
      if (err) {
        console.error(err);
        // log error, send me an email, something
      } else if (events) {
        events = events.sort((a, b) => a.datetime - b.datetime);
        if (events.length === 0) {
          return;
        } else {
          let messageString =
            "**Check out these events happening this week!**\n\n";
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
          console.log("Alert complete!");
          client.destroy();
        }
      }
    });
  });
};
