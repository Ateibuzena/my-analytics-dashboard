import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where, doc } from "firebase/firestore";

import { Button, Grid, Typography, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ROUTES from "../../routes/ROUTES";
import { db } from "../../firebase";

import EventDetailCard from "./components/event/EventDetailCard";
import IteractionsChart from "./components/iteractions/IteractionsChart";
import EngagementChart from "./components/engagement/EngagementChart";
import TimePerformanceChart from "./components/distribution/TimePerformanceChart";
import PlatformComparisonChart from "./components/platform/PlatformComparisonChart";
import ContentPerformanceChart from "./components/content/ContentPerfonmanceChart";
import TimeSeriesChart from "./components/engagement/TimeSeriesChart";

const DashboardEvent = () => {
  const { eid } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialStats, setSocialStats] = useState(null);

  const fetchData = async () => {
    const eventsRef = collection(db, "events");
    const eventsSnap = await getDocs(query(eventsRef, where("eid", "==", eid)));
    const eventData = eventsSnap.docs.map((doc) => doc.data());
    setEvent(eventData[0]), setLoading(false);

    const eventDocRef = doc(db, "events", eid); // DocumentReference
    const socialRef = collection(db, "socialPosts");
    const socialSnap = await getDocs(
      query(socialRef, where("eid", "==", eventDocRef))
    );

    if (!socialSnap.empty) {
      const socialStats = socialSnap.docs.map((doc) => doc.data());
      console.log("🟢 SOCIAL:", socialStats);
      setSocialStats(socialStats);
    } else {
      console.warn("⚠️ No se encontraron posts sociales.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eid]);

  if (!eid) return <Navigate to={ROUTES["DASHBOARD"]} />;

  return (
    <Grid>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="text"
        sx={{ mb: 2 }}
        onClick={() => window.history.back()}
      >
        Volver al dashboard
      </Button>

      {/* Event detail card */}
      <EventDetailCard event={event} loading={loading} />

      {/* Aquí se añadirán los gráficos y otros componentes */}
      <Typography variant="h5" component="h2" sx={{ mt: 6, mb: 3 }}>
        Estadísticas del evento
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Interacciones por Post
          </Typography>
          <IteractionsChart socialStats={socialStats} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Engagement por Post
          </Typography>
          <EngagementChart socialStats={socialStats} />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        {socialStats && <TimePerformanceChart socialStats={socialStats} />}
      </Grid>
      <Grid item xs={12} md={6}>
        <PlatformComparisonChart socialStats={socialStats} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ContentPerformanceChart socialStats={socialStats} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TimeSeriesChart socialStats={socialStats} />
      </Grid>
    </Grid>
  );
};

export default DashboardEvent;
