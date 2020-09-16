const fetch = require("node-fetch");
const cheerio = require("cheerio");
const getEventUrls = require("./getEventUrls");

// getEventUrls().then((events) => {
//   fetch("https://www.meetup.com/nashville-software-beginners")
//     .then((response) => response.text())
//     .then((text) => {
//       let $ = cheerio.load(text);
//       let cards = $(".groupHome-eventsList-upcomingEvents")
//         .toArray()
//         .map((elem) => elem.text());
//     });
// });

fetch("https://www.meetup.com/SavvyCoders/")
  .then((response) => response.text())
  .then((text) => {
    let $ = cheerio.load(text);
    let events = [];
    let upcomingEvents = $(".groupHome-eventsList-upcomingEvents")
      .find(".chunk")
      .toArray();
    upcomingEvents = upcomingEvents.map((event) => {
      let datetime = new Date(parseInt($(event).find("time").attr("datetime")));
      let link = $(event).find("a.eventCardHead--title");
      return {
        name: $(link).text(),
        link: $(link).attr("href"),
        time: datetime,
      };
    });
    console.log(upcomingEvents);
  });
