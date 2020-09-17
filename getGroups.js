const fs = require("fs");
const readline = require("readline");

module.exports = async function getGroups() {
  let groups = [];
  const fileStream = fs.createReadStream("NashTechEvents.csv");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    let nameAndUrlExtension = line.split(",");
    let name = nameAndUrlExtension[0];
    let url = "https://www.meetup.com" + nameAndUrlExtension[1];
    groups.push({ name: name, url: url });
  }

  return groups;
};
