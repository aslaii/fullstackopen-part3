const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

app.get("/api/persons", (req, res) => {
  res.json(persons);
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
    Math.random() * (Math.floor(4000) - Math.ceil(5) + Math.ceil(5))
  );
  return randomID;
};

app.post("/api/persons", function (req, res) {
  const body = req.body;
  const nameExist = persons.find((person) => person.name === body.name);
  if (nameExist) {
    return res.status(400).json({
      error: "name already exist",
    });
  }

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
  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(persons);
  const postLog = JSON.stringify(persons);
  console.log(postLog);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
