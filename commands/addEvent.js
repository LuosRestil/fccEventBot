// const Event = require("../models/event");
// const mongoose = require("mongoose");

// module.exports = async function addEvent(message, args) {
//   // TODO
//   // format: !events add-event {groupName} {eventName} {dd/mm/yyyy} {hh:mm} {am/pm} {url}
//   const ERROR_MESSAGE =
//     "Sorry, I don't recognize the command as written. Try again in this format:\n`!events add-event groupname eventname dd/mm/yyyy hh:mm AM/PM eventurl`";
//   if (args.length !== 6) {
//     message.channel.send(ERROR_MESSAGE);
//     return;
//   } else {
//     // validate each piece of the event
//     let groupName = args[0];
//     let eventName = args[1];
//     let date = args[2];
//     let time = args[3];
//     let ampm = args[4].toLowerCase();
//     let url = args[5];

//     // check date format
//     let dateRegex = /^\d{2}\/\d{2}\/2\d{3}$/;
//     if (!dateRegex.test(date)) {
//       message.channel.send(ERROR_MESSAGE);
//       return;
//     }
//     date = date.split("/");
//     let day = parseInt(date[0]);
//     let month = parseInt(date[1]) - 1;
//     let year = parseInt(date[2]);

//     // check time format
//     let timeRegex = /^\d{1,2}:\d{2}$/;
//     if (!timeRegex.test(time)) {
//       message.channel.send(ERROR_MESSAGE);
//       return;
//     }
//     time = time.split(":");
//     let hour = parseInt(time[0]);
//     let minute = parseInt(time[1]);

//     // check time range
//     if (hour > 12 || minute > 59) {
//       message.channel.send("Sorry, that's not a valid time. Please try again.");
//       return;
//     }

//     // check am/pm validity, and update hour to 24 hour range
//     if (ampm !== "am" && ampm !== "pm") {
//       message.channel.send(ERROR_MESSAGE);
//       return;
//     }
//     if (ampm === "am") {
//       if (hour === 12) {
//         hour === 0;
//       }
//     } else if (ampm === "pm") {
//       if (hour != 12) {
//         hour += 12;
//       }
//     }

//     const INVALID_DATE_MESSAGE =
//       "Invalid date. Try again in this format:\n`!events add-event groupname eventname dd/mm/yyyy hh:mm AM/PM eventurl`";

//     // check date validity
//     if (day < 0) {
//       message.channel.send(INVALID_DATE_MESSAGE);
//       return;
//     }
//     switch (month) {
//       case 0:
//       case 2:
//       case 4:
//       case 6:
//       case 7:
//       case 9:
//       case 11:
//         if (day > 31) {
//           message.channel.send(INVALID_DATE_MESSAGE);
//           return;
//         }
//       case 3:
//       case 5:
//       case 8:
//       case 10:
//         if (day > 30) {
//           message.channel.send(INVALID_DATE_MESSAGE);
//           return;
//         }
//       case 1:
//         if (
//           year % 4 === 0 &&
//           (year % 100 !== 0 || year % 400 === 0) &&
//           day > 29
//         ) {
//           message.channel.send(INVALID_DATE_MESSAGE);
//           return;
//         } else if (day > 28) {
//           message.channel.send(INVALID_DATE_MESSAGE);
//           return;
//         }
//     }

//     let datetime = new Date(year, month, day, hour, minute).getTime();

//     // validate url
//     let response = await fetch(url);
//     if (response.status !== 200) {
//       message.channel.send("Sorry, it looks like that URL is invalid.");
//       return;
//     }

//     await mongoose.connect(process.env.ATLAS_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     });
//     // add event to database
//     let newEvent = new Event({
//       group: groupName,
//       name: eventName,
//       datetime: datetime,
//       link: url,
//     });
//     try {
//       await newEvent.save();
//     } catch {
//       message.channel.send(
//         "It looks like someone has already added that event. Thanks for the suggestion!"
//       );
//       return;
//     }
//   }
// };

// addEvent();
