import React from "react";

const Filter = ({ filterPersons }) => {
  const handleFilterChange = (event) => {
    filterPersons(event.target.value);
  };

  return (
    <div>
      Filter: <input onChange={handleFilterChange} />
    </div>
  );
};

export default Filter;
