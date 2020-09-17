const fetch = require("node-fetch");
const cheerio = require("cheerio");
const getGroups = require("./getGroups");

getUpcomingEvents().then((data) => {
  for (let group of data) {
    console.log("********************************************************");
    console.log(group.groupName);
    console.log("********************************************************");
    for (let event of group.upcomingEvents) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      console.log(
        `\t${event.name}, ${event.time.toLocaleDateString(
          undefined,
          options
        )} ${event.time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    }
  }
});

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
      console.log(`${group.name} events added`);
    } else {
      console.log(`No events for ${group.name}`);
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
          time: datetime,
        };
      });
      return upcomingEvents.filter((item) => item);
    });
  return data;
}
