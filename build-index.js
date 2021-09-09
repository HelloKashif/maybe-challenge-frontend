//Note: Keeping this as JS not TS for simplicity.
//In future we can add this to the ts build process 
const fs = require("fs");
const elasticlunr = require("elasticlunr");
const data = require("./data/airports.json");

const FILENAME = "data/searchIndex.json"

const index = elasticlunr(function () {
  this.addField("name");
  this.addField("country");
  this.addField("city");
  this.addField("iata");
  this.setRef("iata");
});

data.forEach((doc) => index.addDoc(doc));

fs.writeFileSync(FILENAME, JSON.stringify(index))
console.log(`Indexed ${data.length} docs in ${FILENAME}`)
