import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Avatar,
  CircularProgress,
  Button
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
  Cell
} from "recharts";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [socialStats, setSocialStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      try {
        // Obtener datos del usuario
        const userRef = collection(db, "users");
        const userSnap = await getDocs(query(userRef, where("uid", "==", auth.currentUser.uid)));
        if (!userSnap.empty) {
          setUserData(userSnap.docs[0].data());
        }

        // Obtener eventos
        const eventsRef = collection(db, "events");
        const eventsSnap = await getDocs(query(eventsRef, where("userId", "==", auth.currentUser.uid)));
        const eventsData = eventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          eventDate: doc.data().eventDate.toDate(),
          createdAt: doc.data().createdAt.toDate()
        }));
        setEvents(eventsData);

        // Obtener estadísticas sociales
        const socialRef = collection(db, "socialPosts");
        const socialSnap = await getDocs(socialRef);
        const socialData = socialSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        }));
        setSocialStats(socialData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const socialMetricsData = [
    { name: 'Likes', value: socialStats.reduce((acc, post) => acc + post.likes, 0) },
    { name: 'Comentarios', value: socialStats.reduce((acc, post) => acc + post.comments, 0) },
    { name: 'Compartidos', value: socialStats.reduce((acc, post) => acc + post.shares, 0) },
  ];

  const platformStats = socialStats.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + post.impressions;
    return acc;
  }, {});

  const totalStats = {
    likes: socialStats.reduce((acc, post) => acc + post.likes, 0),
    comments: socialStats.reduce((acc, post) => acc + post.comments, 0),
    shares: socialStats.reduce((acc, post) => acc + post.shares, 0),
    impressions: socialStats.reduce((acc, post) => acc + post.impressions, 0),
    reach: socialStats.reduce((acc, post) => acc + post.reach, 0)
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Perfil del Usuario */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={userData?.photoURL} 
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="h5">{userData?.name}</Typography>
              <Typography color="textSecondary">{userData?.email}</Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>

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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Impresiones por Plataforma */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Impresiones por Plataforma
              </Typography>
              <BarChart
                width={400}
                height={300}
                data={Object.entries(platformStats).map(([platform, impressions]) => ({
                  platform,
                  impressions
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="impressions" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Eventos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Próximos Eventos
              </Typography>
              <Grid container spacing={2}>
                {events.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{event.eventName}</Typography>
                        <Typography color="textSecondary">
                          {format(event.eventDate, "PPP", { locale: es })}
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
