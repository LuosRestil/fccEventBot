const fetch = require("node-fetch");
const cheerio = require("cheerio");
const MeetupGroup = require("../models/meetupGroup");

module.exports = async function addMeetup(message, args) {
  if (args.length !== 1) {
    message.channel.send(
      "Sorry, I don't understand that. Requests should be made in the form of:\n`!events add-meetup https://www.meetup.com/groupname/`"
    );
  } else {
    // validate url
    let url = args[0];
    let re = /^https:\/\/www.meetup.com\/[^\/]+\/$/;
    if (!re.test(url)) {
      message.channel.send(
        "Sorry, that URL doesn't look valid. Requests should be made in the form of:\n`!events add-meetup https://www.meetup.com/groupname/`"
      );
    } else {
      // url valid, check that it's a real group
      let res = await fetch(url);
      let status = res.status;
      if (status === 200) {
        // get group name
        let text = await res.text();
        let $ = cheerio.load(text);
        let groupName = $("a.groupHomeHeader-groupNameLink").text();
        // add group to db
        let newGroup = new MeetupGroup({
          name: groupName,
          url: url,
        });
        try {
          await newGroup.save();
          message.channel.send(
            `Alright! I've added ${groupName} to our list of groups to follow. Thanks for the suggestion!`
          );
        } catch (err) {
          message.channel.send(
            "Looks like that group has already been added. If you're 100% sure this is a new group, I may have some wires crossed, and you should message an admin."
          );
          // console.error(err);
        }
      } else {
        message.channel.send(
          "Sorry, it doesn't look like that group exists. Try copying the URL directly from the Meetup group's homepage."
        );
      }
    }
  }
};
