import React, { useEffect, useState } from "react";
import { sendEvent, getMetrics } from "./api";

function App() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const uid = "123456"; // ID del usuario autenticado

    // Enviar evento de página vista
    sendEvent({
      uid,
      event: "page_view",
      timestamp: Date.now(),
      data: { page: window.location.pathname }
    });

    // Obtener métricas del usuario
    getMetrics(uid).then(setMetrics);
  }, []);

  return (
    <div>
      <h1>Dashboard de Analíticas</h1>
      <h2>Métricas del usuario</h2>
      <ul>
        {metrics.map((metric, index) => (
          <li key={index}>
            {metric.event} en {new Date(metric.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
