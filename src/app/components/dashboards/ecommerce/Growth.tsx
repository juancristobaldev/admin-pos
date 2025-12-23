import React from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Avatar } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';
import { IconClock } from '@tabler/icons-react'; // Cambié icono a Reloj
import SkeletonGrowthCard from '../skeleton/GrowthCard';

// DEFINICIÓN DE PROPS
interface GrowthCardProps {
  isLoading: boolean;
  minutes?: number;
}

const Growth = ({ isLoading, minutes = 0 }: GrowthCardProps) => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      height: 25,
      fontFamily: `inherit`,
      foreColor: '#a1aab2',
      toolbar: { show: false },
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    colors: [secondary],
    stroke: { curve: 'straight', width: 2 },
    fill: { type: 'solid', opacity: 0.05 },
    markers: { size: 0 },
    tooltip: { theme: 'dark', x: { show: false } },
  };
  
  const seriescolumnchart = [{ name: '', data: [0, 10, 10, 10, 35, 45, 30, 30, 30, 50, 52] }];

  return (
    <>
      {isLoading ? (
        <SkeletonGrowthCard />
      ) : (
        <DashboardCard>
          <>
            <Box
              width={38}
              height={38}
              bgcolor="secondary.light"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Avatar sx={{ bgcolor: 'secondary.light', width: 25, height: 25 }}>
                 <IconClock width={25} color={secondary} />
              </Avatar>
            </Box>

            <Box mt={3} mb={2} height="25px">
              <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="25px" width={"100%"} />
            </Box>

            <Typography variant="h4">
              {minutes.toFixed(0)} min
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Tiempo Promedio Atención
            </Typography>
          </>
        </DashboardCard>
      )}
    </>
  );
};

export default Growth;