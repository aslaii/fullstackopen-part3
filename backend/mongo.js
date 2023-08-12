const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

console.log(`${name} ${number}`);

const url = `mongodb+srv://aslaii:${password}@fullstackopen.rn8bv2w.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
console.log("Connecting to MongoDB...");
mongoose.connect(url);
console.log("Done.");

const PhoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Persons = mongoose.model("Phonebook", PhoneBookSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Persons({
    name: name,
    number: number,
  });

  console.log(`Adding ${name} ${number} to phonebook...`);
  person.save().then((result) => {
    console.log(`added Name: ${name} Number: ${number} to phonebook. `);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  console.log("Phonebook: ");
  Persons.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name}  ${person.number}`);
    });

    mongoose.connection.close();
  });
} else {
  console.log("Incorrect number of arguments!");
  process.exit(1);
}
