import express from "express";
import cors from "cors";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar Firebase Admin
initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.post("/track", async (req, res) => {
    try {
      const { uid, event, timestamp, data } = req.body;
  
      if (!uid || !event || !timestamp) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }
  
      // Guardar el evento en Firestore
      await db.collection("events").add({
        uid,
        event,
        timestamp,
        data,
      });
  
      res.status(200).json({ message: "Evento registrado correctamente" });
    } catch (error) {
      console.error("Error guardando evento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  
  app.get("/metrics/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
  
      // Obtener eventos del usuario desde Firestore
      const eventsSnapshot = await db.collection("events").where("uid", "==", uid).get();
  
      if (eventsSnapshot.empty) {
        return res.status(404).json({ error: "No hay eventos registrados para este usuario" });
      }
  
      let events = [];
      eventsSnapshot.forEach((doc) => events.push(doc.data()));
  
      res.status(200).json({ metrics: events });
    } catch (error) {
      console.error("Error obteniendo métricas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
/*node index.js 
(node:17094) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/ateibuzena/my_analytics/backend/index.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /home/ateibuzena/my_analytics/backend/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
Servidor corriendo en el puerto 5000*/