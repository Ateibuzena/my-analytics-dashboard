import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Box, Paper } from "@mui/material";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../../../firebase";
import EventLegend from "./EventLegend";

const generateCalendar = (year, month) => {
  const date = new Date(year, month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = date.getDay();

  let calendar = [];
  let dayCounter = 1;

  for (let week = 0; week < 6; week++) {
    let weekDays = [];
    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < firstDay) {
        weekDays.push(null);
      } else if (dayCounter <= daysInMonth) {
        weekDays.push(dayCounter);
        dayCounter++;
      } else {
        weekDays.push(null);
      }
    }
    calendar.push(weekDays);
  }

  return calendar;
};

const Calendar = () => {
  const [markedDate, setMarkedDate] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const handleDateClick = (day, monthOffset) => {
    if (day) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + monthOffset,
        day
      );
      setMarkedDate(date);
    }
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    console.log("🟢 NEW DATE:", newDate);
  };

  const calendarCurrent = generateCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const calendarNext = generateCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const fetchEvents = async (currentDate) => {
    if (!auth.currentUser) return;

    console.log("🟢 CURRENT DATE:", currentDate);

    // Convertimos la fecha a Date si es un string
    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 2); // Fin del mes siguiente?

    console.log("🟢 START DATE:", Timestamp.fromDate(startDate));
    console.log("🟢 END DATE:", Timestamp.fromDate(endDate));

    // Referencia al documento del usuario
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    // Referencia a la colección "events"
    const eventsRef = collection(db, "events");
    const eventsQuery = query(
      eventsRef,
      where("uid", "==", userDocRef), // uid es una referencia al documento del usuario
      where("dateTime", ">=", Timestamp.fromDate(startDate)), // Fecha desde
      where("dateTime", "<=", Timestamp.fromDate(endDate)) // Fecha hasta
    );

    try {
      const eventsSnap = await getDocs(eventsQuery);
      const eventsData = eventsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("🟢 EVENTS:", eventsData);
      return eventsData;
    } catch (error) {
      console.error("🔴 Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents(currentDate).then((events) => {
      setMarkedDate(events.map((event) => new Date(event.dateTime.toDate())));
      setEvents(events);
    });
  }, [currentDate]);

  console.log("🟢 MARKED DATE:", markedDate);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "auto",
        height: "100%",
      }}
    >
      {/* Header with Month and Year */}
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button onClick={() => handleMonthChange(-1)} sx={{ mr: 2 }}>
          &lt;
        </Button>
        <Typography variant="h6">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </Typography>
        <Button onClick={() => handleMonthChange(1)} sx={{ ml: 2}}>
          &gt;
        </Button>
      </Box>

      {/* Calendar Grids */}
      <Grid
        sx={{
          marginTop: 3,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          width: "100%",
        }}
      >
        {/* Current Month Calendar */}
        <Grid item xs={6} sx={{}}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              {currentDate.toLocaleString("default", { month: "long" })}
            </Typography>
            <Grid container spacing={1} sx={{ padding: 2 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <Grid
                    item
                    xs={1.7}
                    key={index}
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    <Typography variant="body2">{day}</Typography>
                  </Grid>
                )
              )}

              {calendarCurrent.map((week, index) => (
                <React.Fragment key={index}>
                  {week.map((day, dayIndex) => (
                    <Grid
                      item
                      xs={1.7}
                      key={dayIndex}
                      sx={{
                        textAlign: "center",
                        padding: 1,
                        cursor: "pointer",
                        backgroundColor: markedDate.some(
                          (markedDate) =>
                            day === markedDate?.getDate() &&
                            currentDate.getMonth() === markedDate?.getMonth()
                        )
                          ? "#cce7ff"
                          : "transparent",
                        fontWeight: markedDate.some(
                          (markedDate) =>
                            day === markedDate?.getDate() &&
                            currentDate.getMonth() === markedDate?.getMonth()
                        )
                          ? "bold"
                          : "normal",
                        borderRadius: "4px",
                      }}
                    >
                      <Grid
                        variant="body2"
                        sx={{
                          position: "relative",
                          color: day ? "" : "transparent",
                        }}
                      >
                        {day ? day : `0`}
                        {markedDate.some(
                          (markedDate) =>
                            day === markedDate?.getDate() &&
                            currentDate.getMonth() === markedDate?.getMonth()
                        ) ? (
                          markedDate.filter(
                            (markedDate) =>
                              day === markedDate?.getDate() &&
                              currentDate.getMonth() === markedDate?.getMonth()
                          ).length > 1 ? (
                            <div>TUKIS</div>
                          ) : (
                            <EventLegend
                              event={events.find(
                                (event) =>
                                  event.dateTime.toDate().toDateString() ===
                                  new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    day
                                  ).toDateString()
                              )}
                            />
                          )
                        ) : null}
                      </Grid>
                    </Grid>
                  ))}
                </React.Fragment>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Next Month Calendar */}
        <Grid item xs={6} sx={{}}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              {new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1
              ).toLocaleString("default", { month: "long" })}
            </Typography>
            <Grid container spacing={1} sx={{ padding: 2 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <Grid
                    item
                    xs={1.7}
                    key={index}
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    <Typography variant="body2">{day}</Typography>
                  </Grid>
                )
              )}

              {calendarNext.map((week, index) => (
                <React.Fragment key={index}>
                  {week.map((day, dayIndex) => (
                    <Grid
                      item
                      xs={1.7}
                      key={dayIndex}
                      sx={{
                        textAlign: "center",
                        padding: 1,
                        cursor: "pointer",
                        backgroundColor: markedDate.some(
                          (markedDate) =>
                            day === markedDate?.getDate() &&
                            currentDate.getMonth() + 1 ===
                              markedDate?.getMonth()
                        )
                          ? "#cce7ff"
                          : "transparent",
                        fontWeight: markedDate.some(
                          (markedDate) =>
                            day === markedDate?.getDate() &&
                            currentDate.getMonth() + 1 ===
                              markedDate?.getMonth()
                        )
                          ? "bold"
                          : "normal",
                        borderRadius: "4px",
                      }}
                    >
                      <Grid
                        variant="body2"
                        sx={{
                          position: "relative",
                          color: day ? "" : "transparent",
                        }}
                      >
                        {day ? day : `0`}
                        {markedDate.some(
                          (markedDate) =>
                            day === markedDate?.getDate() &&
                            currentDate.getMonth() + 1 ===
                              markedDate?.getMonth()
                        ) ? (
                          markedDate.filter(
                            (markedDate) =>
                              day === markedDate?.getDate() &&
                              currentDate.getMonth() + 1 ===
                                markedDate?.getMonth()
                          ).length > 1 ? (
                            <div>TUKIS</div>
                          ) : (
                            <EventLegend
                              event={events.find(
                                (event) =>
                                  event.dateTime.toDate().toDateString() ===
                                  new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth() + 1,
                                    day
                                  ).toDateString()
                              )}
                            />
                          )
                        ) : null}
                      </Grid>
                    </Grid>
                  ))}
                </React.Fragment>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendar;
