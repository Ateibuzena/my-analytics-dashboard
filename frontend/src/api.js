import axios from "axios";

const API_URL = "http://localhost:5000"; // Dirección del backend

export const sendEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/track`, eventData);
    console.log("Evento enviado:", response.data);
  } catch (error) {
    console.error("Error enviando evento:", error);
  }
};

export const getMetrics = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/metrics/${uid}`);
    return response.data.metrics;
  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    return [];
  }
};
