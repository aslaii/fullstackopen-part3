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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
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
  Person.countDocuments({})
    .then((count) => {
      let date = new Date();
      res.send(`Phonebook has info for ${count} people <br/> ${date}`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: "An error occurred while getting info." });
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.json(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", function(req, res) {
  const body = req.body;

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

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
