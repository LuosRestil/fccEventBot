const Event = require("../models/event");

module.exports = function getTomorrowEvents(message) {
  let now = new Date();
  let endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59
  ).getTime();
  let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  let endOfTomorrow = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    23,
    59
  ).getTime();

  Event.find(
    { datetime: { $gt: endOfToday, $lt: endOfTomorrow } },
    (err, events) => {
      if (err) {
        message.channel.send(
          "Sorry, something's wrong with my circuits right now..."
        );
        // log error, send me an email, something
      } else if (events) {
        events = events.sort((a, b) => a.datetime - b.datetime);
        if (events.length === 0) {
          message.channel.send(
            "It looks like there's nothing happening tomorrow."
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
              messageString += "And more...";
              break;
            } else {
              messageString += eventString;
            }
          }
          message.channel.send(messageString);
        }
      }
    }
  );
};
