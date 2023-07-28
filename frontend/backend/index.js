require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];
//

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
app.use(express.static("dist"));
app.use(requestLogger);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

app.get("/info", (req, res) => {
  const personInfo = persons.length;
  let date = new Date();
  res.send(`Phonebook has info for ${personInfo} people <br/> ${date}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((note) => note.id !== id);
  res.status(204).end();
});
const generateID = () => {
  const randomID = Math.floor(
    Math.random() * (Math.floor(4000) - Math.ceil(5) + Math.ceil(5)),
  );
  return randomID;
};

app.post("/api/persons", function (req, res) {
  const body = req.body;
  // const nameExist = Person.find({ name }).then(
  //   (person) => person.name === name,
  // );
  // if (nameExist) {
  //   return res.status(400).json({
  //     error: "name already exist",
  //   });
  // }

  if (!body.name) {
    return res.status(400).json({
      error: "name not found",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number not found",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  console.log(`Adding ${body.name} ${body.number} to phonebook...`);
  person
    .save()
    .then((result) => {
      console.log(
        `added Name: ${body.name} Number: ${body.number} to phonebook. `,
      );
      res.json(result);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      res.status(500).json({
        error: "Something went wrong while adding data.",
      });
    });
});

app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
