import React from "react";
import FeaturesTitle from "./FeaturesTitle";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  IconAdjustments,
  IconArchive,
  IconArrowsShuffle,
  IconBook,
  IconBuildingCarousel,
  IconCalendar,
  IconChartPie,
  IconDatabase,
  IconDiamond,
  IconLanguageKatakana,
  IconLayersIntersect,
  IconLockAccess,
  IconMessages,
  IconRefresh,
  IconSquareKey,
  IconTag,
  IconWand,
} from "@tabler/icons-react";
import AnimationFadeIn from "../animation/Animation";

interface FeaturesType {
  icon: React.ReactElement;
  title: string;
  subtext: string;
}

const featuresData: FeaturesType[] = [
  {
    icon: <IconWand width={40} height={40} strokeWidth={1.5} />,
    title: "Plano de Mesas Interactivo",
    subtext:
      "Organiza el salón arrastrando mesas y ajustando la distribución en segundos.",
  },

  {
    icon: <IconAdjustments width={40} height={40} strokeWidth={1.5} />,
    title: "Toma de Pedidos Rápida",
    subtext:
      "Interfaz ágil y clara diseñada para meseros en restaurantes con alto movimiento.",
  },
  {
    icon: <IconTag width={40} height={40} strokeWidth={1.5} />,
    title: "Gestión de Productos y Menú",
    subtext: "Actualiza precios, categorías y disponibilidad con un clic.",
  },
  {
    icon: <IconLockAccess width={40} height={40} strokeWidth={1.5} />,
    title: "Roles y Permisos",
    subtext:
      "Define accesos para administrador, mesera/o y cocina con control total.",
  },
  {
    icon: <IconSquareKey width={40} height={40} strokeWidth={1.5} />,
    title: "Gestión de Empleados",
    subtext:
      "Crea usuarios, asigna áreas y administra tu equipo desde un panel seguro.",
  },

  {
    icon: <IconLanguageKatakana width={40} height={40} strokeWidth={1.5} />,
    title: "Multidispositivo",
    subtext: "Compatible con tablets, PC, pantallas táctiles y móviles.",
  },
  {
    icon: <IconBuildingCarousel width={40} height={40} strokeWidth={1.5} />,
    title: "Flujo Cocina–Salón",
    subtext:
      "Comunicación instantánea entre meseros y cocina mediante WebSockets.",
  },
  {
    icon: <IconArrowsShuffle width={40} height={40} strokeWidth={1.5} />,
    title: "Editor Visual del Salón",
    subtext:
      "Reordena tu restaurante para eventos especiales sin soporte técnico.",
  },
  {
    icon: <IconChartPie width={40} height={40} strokeWidth={1.5} />,
    title: "Dashboard de Ventas",
    subtext:
      "Estadísticas en tiempo real: ingresos, productos más vendidos y rendimiento.",
  },
  {
    icon: <IconLayersIntersect width={40} height={40} strokeWidth={1.5} />,
    title: "Historial y Auditoría",
    subtext:
      "Registra cambios, movimientos y estados para mayor control interno.",
  },
  {
    icon: <IconRefresh width={40} height={40} strokeWidth={1.5} />,
    title: "Actualizaciones Constantes",
    subtext:
      "Mejoras y nuevas funciones basadas en el uso real de los restaurantes.",
  },

  {
    icon: <IconMessages width={40} height={40} strokeWidth={1.5} />,
    title: "Soporte Directo",
    subtext:
      "Acompañamiento personalizado para implementación y operación diaria.",
  },
];

const Features = () => {
  return (
    <Box py={6}>
      <Container maxWidth="lg">
        <FeaturesTitle />
        <AnimationFadeIn>
          <Box mt={6}>
            <Grid container spacing={3}>
              {featuresData.map((feature, index) => (
                <Grid item xs={12} sm={4} lg={3} textAlign="center" key={index}>
                  <Box className="flex justify-center" color="primary.main">
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" mt={3}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    mt={1}
                    mb={3}
                  >
                    {feature.subtext}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </AnimationFadeIn>
      </Container>
    </Box>
  );
};

export default Features;
