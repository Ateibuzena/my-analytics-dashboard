import { useState } from "react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const EventLegend = ({ event }) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "-4px",
        left: "-6px",
        width: "40px",
        height: "30px",
        cursor: "pointer",
        zIndex: 1000,
      }}
      onMouseEnter={() => setEnabled(true)}
      onMouseLeave={() => setEnabled(false)}
    >
      {enabled && (
        <Card
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1000,
            width: "300px",
            boxShadow: 3,
            backgroundColor: "#cce7ff",
            ":hover": {
              width: "max-content",
            },
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={event?.image || "/placeholder-event.jpg"}
                sx={{ width: 56, height: 56 }}
                variant="rounded"
              />
              <Typography variant="h6" noWrap>
                {event?.eventName || "Nombre del Evento"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {new Date(event?.timeUnix).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) || "00:00"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {event?.place || "Ubicación del evento"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EventLegend;
