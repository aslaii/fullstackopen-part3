import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import personService from "./services/person";
import "./index.css";

const App = () => {
  const [newFilter, setNewFilter] = useState("");
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService
      .getData()
      .then((data) => {
        setPersons(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setPersons([]); // Ensure persons is always an array
      });
  }, []);

  const addPerson = (person) => {
    const existingPerson = persons.find((p) => p.name === person.name);

    if (existingPerson) {
      if (
        window.confirm(
          `${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: person.number };
        personService
          .updateData(existingPerson.id, updatedPerson)
          .then((updatedData) => {
            setPersons(
              persons.map((p) => (p.id !== existingPerson.id ? p : updatedData))
            );
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
      }
    } else {
      console.log("Name: ", person.name);
      console.log("Number: ", person.number);
      const personObject = {
        name: person.name,
        number: person.number,
      };
      personService
        .createData(personObject)
        .then((response) => {
          setPersons((prevPersons) => prevPersons.concat(response));
        })
        .catch((error) => {
          console.error("Error creating data:", error);
        });
    }
  };
  const handleFilterChange = (filter) => {
    setNewFilter(filter);
  };
  const filteredPersons = persons.filter(
    (person) =>
      person &&
      person.name &&
      person.name.toLowerCase().includes(newFilter.toLowerCase())
  );
  const handleDelete = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete ${personToDelete.name} ? `
      )
    ) {
      personService
        .deleteData(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error("Error Delete Data: ", error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterPersons={handleFilterChange} />

      <h3>Add a new</h3>

      <Form addPerson={addPerson} />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
