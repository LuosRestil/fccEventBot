let helpMessage =
  "**FreeCodeCamp Nashville EventBot Commands:**\n\n`!events`\n\tGets all events up to one week from the current time.\n\n`!events today`\n\tGets all events happening today.\n\n`!events tomorrow`\n\tGets all events happening tomorrow.\n\n`!events add-meetup https://www.meetup.com/groupname/`\n\tAdds a Meetup group to our event searches.";

module.exports = function help(message) {
  message.channel.send(helpMessage);
};
