const Event = require("../models/event");

const MILLISECONDS_IN_ONE_WEEK = 604800000;

module.exports = async function getWeekEvents(message) {
  let oneWeekFromNow = new Date().getTime() + MILLISECONDS_IN_ONE_WEEK;

  Event.find({ datetime: { $lt: oneWeekFromNow } }, async (err, events) => {
    if (err) {
      message.channel.send(
        "Sorry, something's wrong with my circuits right now..."
      );
      // log error, send me an email, something
    } else if (events) {
      events = events.sort((a, b) => a.datetime - b.datetime);
      if (events.length === 0) {
        message.channel.send(
          "It looks like there's nothing happening for the next week."
        );
      } else {
        let messageString = "";
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
            await message.channel.send(messageString);
            messageString = eventString;
          } else {
            messageString += eventString;
          }
        }
        message.channel.send(messageString);
      }
    }
  });
};
