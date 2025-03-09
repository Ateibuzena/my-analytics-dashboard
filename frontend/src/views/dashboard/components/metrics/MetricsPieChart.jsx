import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Divider,
  Zoom,
  Tooltip as MuiTooltip,
  Checkbox,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

const MetricsPieChart = ({ socialStats }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);
  const [viewType, setViewType] = useState("value");
  const [showChart, setShowChart] = useState(true);

  // Recalcular datos para las métricas
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

  const totalValue = socialMetricsData.reduce(
    (sum, entry) => sum + entry.value,
    0
  );

  // Función para renderizar etiquetas personalizadas dentro del gráfico
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14px"
        fontWeight="bold"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
      >
        {viewType === "value" ? value : `${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Renderizar el sector activo (efecto hover)
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Formateador personalizado para el tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2">
            Valor: <strong>{data.value.toLocaleString()}</strong>
          </Typography>
          <Typography variant="body2">
            Porcentaje:{" "}
            <strong>{((data.value / totalValue) * 100).toFixed(1)}%</strong>
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const handleViewTypeChange = (_, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const handleRefresh = () => {
    setShowChart(false);
    setTimeout(() => setShowChart(true), 300);
  };

  return (
    <Grid item xs={12} md={6} sx={{ width: "160%" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          mb={1}
        >
          <Box display="flex" alignItems="start">
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ mb: 0 }}
            >
              Métricas Redes Sociales
            </Typography>
            <MuiTooltip
              title="Datos agregados de actividad en redes sociales"
              arrow
            >
              <IconButton size="small" color="primary" sx={{ ml: 1 }}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </MuiTooltip>
          </Box>
          <Box display="flex" alignItems="start">
            <Checkbox
              value="value"
              aria-label="show values"
              onChange={() => {
                setViewType(viewType === "value" ? "percentage" : "value");
              }}
              sx={{
                display: "flex",
                alignItems: "start",
                position: "relative",
                top: "-5px",
                width: "10x",
                height: "40px",
              }}
            ></Checkbox>
            <Typography variant="caption" sx={{ pt: "6px" }}>
              %
            </Typography>
            <IconButton
              size="small"
              onClick={handleRefresh}
              sx={{ ml: 1, outline: "none" }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Zoom
          in={showChart}
          style={{ transitionDelay: showChart ? "100ms" : "0ms" }}
        >
          <Box>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={socialMetricsData}
                  cx="50%"
                  cy="52%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={130}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {socialMetricsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={activeIndex === index ? 2 : 1}
                      stroke={theme.palette.background.paper}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    paddingTop: "0px",
                    position: "relative",
                    marginTop: "-9px",
                  }}
                  formatter={(value, entry, index) => (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: COLORS[index % COLORS.length],
                        fontWeight: activeIndex === index ? "bold" : "normal",
                        textDecoration:
                          activeIndex === index ? "underline" : "none",
                      }}
                    >
                      {value}
                    </Typography>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Zoom>
      </CardContent>
    </Grid>
  );
};

export default MetricsPieChart;
