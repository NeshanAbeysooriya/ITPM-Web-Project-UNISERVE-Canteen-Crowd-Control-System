import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/timeslots";

export const getSlots = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const bookSlot = async (slotId) => {
  const response = await axios.post(`${API_URL}/book`, { slotId });
  return response.data;
};

export const createSlot = async ({ startTime, endTime, maxCapacity }) => {
  const response = await axios.post(`${API_URL}/create`, {
    startTime,
    endTime,
    maxCapacity,
  });
  return response.data;
};

export const updateSlot = async ({ slotId, maxCapacity, status }) => {
  const payload = { slotId };
  if (typeof maxCapacity !== "undefined") payload.maxCapacity = maxCapacity;
  if (typeof status !== "undefined") payload.status = status;

  const response = await axios.patch(`${API_URL}/update`, payload);
  return response.data;
};