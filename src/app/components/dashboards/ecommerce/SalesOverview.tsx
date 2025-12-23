import React from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../shared/DashboardCard';
import SkeletonSalesOverviewCard from '../skeleton/SalesOverviewCard';

// DEFINICIÓN DE PROPS
interface SalesOverviewCardProps {
  isLoading: boolean;
  totalRevenue?: number;
  netRevenue?: number;
}

const SalesOverview = ({ isLoading, totalRevenue = 0, netRevenue = 0 }: SalesOverviewCardProps) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const primarylight = theme.palette.primary.light;
  const textColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#2A3547';

  // CÁLCULO DE GASTOS (Impuestos + Descuentos)
  const expense = totalRevenue - netRevenue;
  
  // Data real para el gráfico [Profit, Expense, Placeholder]
  const seriescolumnchart = [netRevenue, expense, (totalRevenue * 0.1)]; 

  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: { show: false },
      height: 275,
    },
    labels: ["Neto", "Impuestos/Desc", "Otros"],
    colors: [primary, secondary, primarylight],
    plotOptions: {
      pie: {
        donut: {
          size: '89%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: true, offsetY: 7 },
            value: { show: false },
            total: {
              show: true,
              color: textColor,
              fontSize: '20px',
              fontWeight: '600',
              label: `$${totalRevenue.toLocaleString()}`, // Total en el centro
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  return (
    <>
      {isLoading ? (
        <SkeletonSalesOverviewCard />
      ) : (
        <DashboardCard title="Resumen Financiero" subtitle="Neto vs Bruto">
          <>
            <Box mt={3} height="255px">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height="275px"
                width={"100%"}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="space-between" mt={7}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  width={38}
                  height={38}
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    color="primary.main"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconGridDots width={22} />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    ${netRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ingreso Neto
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  width={38}
                  height={38}
                  bgcolor="secondary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    color="secondary.main"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconGridDots width={22} />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    ${expense.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Imp/Desc
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </>
        </DashboardCard>
      )}
    </>
  );
};

export default SalesOverview;