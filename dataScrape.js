const fetch = require("node-fetch");
const cheerio = require("cheerio");
const getGroups = require("./getGroups");
const mongoose = require("mongoose");
const Event = require("./models/event");

module.exports = async function dataScrape() {
  // console.log("Starting data scrape...");
  let groupEvents = await getUpcomingEvents();
  await mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  // console.log(`${groupEvents.length} events found.`);
  for (let group of groupEvents) {
    // console.log("********************************************************");
    // console.log(group.groupName);
    // console.log("********************************************************");
    for (let event of group.upcomingEvents) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      // console.log(
      //   `\t${event.name}, ${event.datetime.toLocaleDateString(
      //     undefined,
      //     options
      //   )} ${event.datetime.toLocaleTimeString("en-US", {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   })}`
      // );
      let newEvent = new Event({
        group: group.groupName,
        name: event.name,
        datetime: event.datetime,
        link: "https://www.meetup.com" + event.link,
      });
      try {
        // console.log("Attempting to save event...");
        await newEvent.save();
        // console.log("Event saved.");
      } catch (err) {
        // console.log("Duplicate event.");
        // console.error(err);
      }
    }
  }
  await mongoose.connection.close();
};

async function getUpcomingEvents() {
  let finalData = [];
  let groups = await getGroups();
  for (let group of groups) {
    let data = await fetchEventData(group.url);
    if (data.length > 0) {
      finalData.push({
        groupName: group.name,
        upcomingEvents: data,
      });
      // console.log(`${group.name} events added`);
    } else {
      // console.log(`No events for ${group.name}`);
    }
  }
  return finalData;
}

async function fetchEventData(meetupGroupUrl) {
  let data = await fetch(meetupGroupUrl)
    .then((response) => response.text())
    .then((text) => {
      let $ = cheerio.load(text);
      let upcomingEvents = $(".groupHome-eventsList-upcomingEvents")
        .find(".chunk")
        .toArray();
      upcomingEvents = upcomingEvents.map((event) => {
        let datetime = new Date(
          parseInt($(event).find("time").attr("datetime"))
        );
        if (datetime.toString() === "Invalid Date") {
          return false;
        }
        let link = $(event).find("a.eventCardHead--title");
        return {
          name: $(link).text(),
          link: $(link).attr("href"),
          datetime: datetime,
        };
      });
      return upcomingEvents.filter((item) => item);
    });
  return data;
}

// dataScrape();
