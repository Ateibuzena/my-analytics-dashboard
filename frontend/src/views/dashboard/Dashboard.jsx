import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  doc,
  collection,
  query,
  getDocs,
  getDoc,
  where,
} from "firebase/firestore";
import { Box, Container, Grid, CircularProgress } from "@mui/material";

import Calendar from "./components/calendar/Calendar";
import PlatformRadarChart from "./components/platform/PlatformRadarChart";
import ReachChart	 from "./components/posts/ReachChart";
import PostPerformanceChart from "./components/posts/PostPerformanceChart";
import EventStatsChart from "./components/events/EventStatsChart";
import MetricsCards from "./components/metrics/MetricsCards";
import MetricsPieChart from "./components/metrics/MetricsPieChart";
import EventSection from "./components/events/EventSection";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [eventsData, setEvents] = useState([]);
  const [municipio, setMunicipio] = useState([]);
  const [socialStats, setSocialStats] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid); // DocumentReference
        const socialRef = collection(db, "socialPosts");
        const socialSnap = await getDocs(
          query(socialRef, where("uid", "==", userDocRef))
        );

        if (!socialSnap.empty) {
          const socialStats = socialSnap.docs.map((doc) => doc.data());
          console.log("🟢 SOCIAL:", socialStats);
          setSocialStats(socialStats);
        } else {
          console.warn("⚠️ No se encontraron posts sociales.");
        }
        // Obtener eventos
        const eventsRef = collection(db, "events");
        const eventsSnap = await getDocs(
          query(eventsRef, where("uid", "==", userDocRef))
        );
        const eventsData = eventsSnap.docs.map((doc) => doc.data());
        //console.log("🟢 EVENT:", eventsData);
        setEvents(eventsData);

        // Obtener municipio de cada evento
        const municipioData = await Promise.all(
          eventsData.map(async (event) => {
            const midRef = event.mid; // La referencia al municipio (mid) del evento

            if (!midRef || typeof midRef !== "object" || !("id" in midRef)) {
              console.warn("⚠️ El evento no tiene un mid válido.");
              return null;
            }

            console.log("🔎 mid referencia:", midRef.path);

            // Obtener directamente el documento del municipio
            const municipioSnap = await getDoc(midRef);

            if (!municipioSnap.exists()) {
              console.warn("⚠️ No se encontró el municipio del evento.");
              return null;
            }

            console.log(
              "🟢 MUNICIPIO:",
              municipioSnap.id,
              municipioSnap.data()
            );
            return municipioSnap.data(); // Retornar los datos del municipio
          })
        );
        setMunicipio(municipioData);
      } catch (error) {
        console.error("❌ Error en ft_data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const totalStats = {
    likes: socialStats.reduce((acc, post) => acc + post.likes, 0),
    comments: socialStats.reduce((acc, post) => acc + post.comments, 0),
    shares: socialStats.reduce((acc, post) => acc + post.shares, 0),
    impressions: socialStats.reduce((acc, post) => acc + post.impressions, 0),
    reach: socialStats.reduce((acc, post) => acc + post.reach, 0),
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      <Grid
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Calendary */}
        <Calendar />
        {/* Gráfico de Métricas Redes Sociales */}
        <MetricsPieChart socialStats={socialStats} />
      </Grid>
      {/* Tarjetas de Resumen */}
      <MetricsCards totalStats={totalStats} />

	  <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        {/* Gráfico de Impresiones por Plataforma */}
        <PlatformRadarChart socialStats={socialStats} />
        {/* Gráfico de Alcance vs Impresiones */}
        <PostPerformanceChart socialStats={socialStats} />
      </Grid>

      <Grid
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 3,
        }}
      >
        {/* Gráfico de Alcance */}
        <ReachChart socialStats={socialStats} />
      </Grid>
      <Grid
        sx={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          gap: 3,
        }}
      >
        {/* Gráfico de Estadísticas por Plataforma */}
        <EventStatsChart events={eventsData} socialStats={socialStats}/>
      </Grid>

      

      {/* Lista de Eventos */}
      <EventSection events={eventsData} />
    </Container>
  );
};

export default Dashboard;
