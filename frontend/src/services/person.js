import axios from "axios";
const baseUrl = "/api/persons";

const getData = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createData = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};
const deleteData = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updateData = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};
export default {
  getData,
  createData,
  deleteData,
  updateData,
};
