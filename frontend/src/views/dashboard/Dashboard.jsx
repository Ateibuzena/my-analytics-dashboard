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
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Navbar from "../../components/Navbar";
import Calendar from "./components/calendar/Calendar";
import ImpressionsChart from "./components/impressions/ImpressionsChart";
import ReachChart from "./components/reach/ReachChart";
import ReachVsImpressions from "./components/reach-vs-impressions/ReachVsImpressionsChart";
import PlatformStats from "./components/platform/PlatformStatsChart";

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

  const socialMetricsData = [
    {
      name: "Likes",
      value: socialStats.reduce((acc, post) => acc + post.likes, 0),
    },
    {
      name: "Comentarios",
      value: socialStats.reduce((acc, post) => acc + post.comments, 0),
    },
    {
      name: "Compartidos",
      value: socialStats.reduce((acc, post) => acc + post.shares, 0),
    },
  ];

  const totalStats = {
    likes: socialStats.reduce((acc, post) => acc + post.likes, 0),
    comments: socialStats.reduce((acc, post) => acc + post.comments, 0),
    shares: socialStats.reduce((acc, post) => acc + post.shares, 0),
    impressions: socialStats.reduce((acc, post) => acc + post.impressions, 0),
    reach: socialStats.reduce((acc, post) => acc + post.reach, 0),
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Perfil del Usuario */}
      <Navbar />
      <Container
        spacing={3}
        sx={{ mb: 4, flexDirection: "row", display: "flex", alignItems: "center", gap: 3 }}
      >
        {/* Calendary */}
        <Calendar />
        {/* Gráfico de Impresiones por Plataforma */}
        <ImpressionsChart socialStats={socialStats} />
      </Container>
      <ReachChart socialStats={socialStats} />
      <ReachVsImpressions socialStats={socialStats} />
      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Likes
              </Typography>
              <Typography variant="h4">
                {totalStats.likes.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Comentarios
              </Typography>
              <Typography variant="h4">
                {totalStats.comments.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Compartidos
              </Typography>
              <Typography variant="h4">
                {totalStats.shares.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Impresiones
              </Typography>
              <Typography variant="h4">
                {totalStats.impressions.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Alcance
              </Typography>
              <Typography variant="h4">
                {totalStats.reach.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Gráfico de Métricas Sociales */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Métricas de Redes Sociales
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={socialMetricsData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {socialMetricsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
        <PlatformStats socialStats={socialStats} />
        {/* Lista de Eventos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximos Eventos
              </Typography>
              <Grid container spacing={2}>
                {eventsData.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.eid}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{event.eventName}</Typography>
                        <Typography color="textSecondary">
                          {/*format(event.dateTime, "PPP", { locale: es })}*/}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
