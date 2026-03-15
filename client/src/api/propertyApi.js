import api from "./apiClient";
import axios from "axios";

export const createProperty = async (data) => {
  const response = await api.post("/properties/", data);
  // console.log(response.data)
  return response.data;
};
export const updateProperty = async (id, data) => {
  const response = await api.patch(`/properties/${id}/`, data);
  return response.data;
};


export const getProperties = async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/properties/");
  return response.data;
};