import Image from "next/image";
import { Box, CardContent, Grid, Typography } from "@mui/material";

// DEFINIMOS PROPS REALES
interface TopCardsProps {
  activeUsers: number;
  totalFloors: number;
  activeTables: number;
  totalProducts: number;
  avgTicket: number;
  avgTip: number;
}

const TopCards = ({ 
  activeUsers = 0, 
  totalFloors = 0, 
  activeTables = 0, 
  totalProducts = 0, 
  avgTicket = 0, 
  avgTip = 0 
}: TopCardsProps) => {

  const topcards = [
    {
      icon: '/images/svgs/icon-user-male.svg',
      title: "Usuarios Activos",
      digits: activeUsers.toString(),
      bgcolor: "primary",
    },
    {
      icon: '/images/svgs/icon-briefcase.svg',
      title: "Pisos / Zonas",
      digits: totalFloors.toString(),
      bgcolor: "warning",
    },
    {
      icon: '/images/svgs/icon-mailbox.svg',
      title: "Mesas Ocupadas",
      digits: activeTables.toString(),
      bgcolor: "secondary",
    },
    {
      icon: '/images/svgs/icon-favorites.svg',
      title: "Productos",
      digits: totalProducts.toString(),
      bgcolor: "error",
    },
    {
      icon: '/images/svgs/icon-speech-bubble.svg',
      title: "Ticket Promedio",
      digits: `$${avgTicket.toFixed(1)}`,
      bgcolor: "success",
    },
    {
      icon: '/images/svgs/icon-connect.svg',
      title: "Propina Promedio",
      digits: `$${avgTip.toFixed(1)}`,
      bgcolor: "info",
    },
  ];

  return (
    <Grid container spacing={3} mt={1}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <Box bgcolor={topcard.bgcolor + ".light"} textAlign="center">
            <CardContent>
              <Image src={topcard.icon} alt={"icon"} width="50" height="50" />
              <Typography color={topcard.bgcolor + ".main"} mt={1} variant="subtitle1" fontWeight={600}>
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + ".main"} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;