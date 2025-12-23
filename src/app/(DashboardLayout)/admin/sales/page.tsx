'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { gql, useQuery } from '@apollo/client';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

// --- IMPORTS DE UI (MUI & ICONS) ---
import {
  Grid,
  Box,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import {
  IconCurrencyDollar,
  IconCreditCard,
  IconCash,
  IconArrowBackUp
} from '@tabler/icons-react';

// --- IMPORTS DE TUS COMPONENTES COMPARTIDOS (Ajusta las rutas si es necesario) ---
import PageContainer from '@/app/components/container/PageContainer';
import DashboardCard from '@/app/components/shared/DashboardCard';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import { useBusiness } from '@/store/bussines';
import { useClientContext } from '@/store/me';

// --- CARGA DINÁMICA DE APEXCHARTS ---
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ==============================================================
// 1. DEFINICIÓN DE LA QUERY GRAPHQL
// ==============================================================
const GET_DASHBOARD_V2 = gql`
  query GetDashboardV2($businessId: String!) {
    businessKpisV2(businessId: $businessId) {
      totalRevenue
      
      revenueUpdates {
        month
        earnings
        expense
      }
      
      productPerformances {
        id
        name
        category
        priority
        price
        budget
        percentage
      }
      
      recentTransactions {
        id
        title
        subtitle
        amount
        type
        date
        status
      }
    }
  }
`;

// ==============================================================
// 2. SUB-COMPONENTES DEFINIDOS LOCALMENTE
// ==============================================================

// --- A. REVENUE UPDATES (Gráfico de Área Azul Grande) ---
const RevenueUpdates = ({ isLoading, data = [] }: { isLoading: boolean; data?: any[] }) => {
  const [month, setMonth] = React.useState('1');
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const categories = data.length > 0 ? data.map((d) => d.month) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const seriesEarnings = data.length > 0 ? data.map((d) => d.earnings) : [0, 0, 0, 0, 0, 0, 0];
  const seriesExpense = data.length > 0 ? data.map((d) => d.expense) : [0, 0, 0, 0, 0, 0, 0];

  const optionschart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 320,
    },
    colors: [primary, secondary],
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    legend: { show: true, position: 'top', horizontalAlign: 'left' },
    grid: { show: true, borderColor: 'rgba(0,0,0,0.1)', strokeDashArray: 3, xaxis: { lines: { show: false } } },
    xaxis: { categories, axisBorder: { show: false } },
    yaxis: { tickAmount: 4 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light' },
  };

  const serieschart = [
    { name: 'Ganancias', data: seriesEarnings },
    { name: 'Gastos', data: seriesExpense },
  ];

  return (
    <DashboardCard
      title="Revenue updates"
      subtitle="Overview of Profit"
      action={
        <CustomSelect value={month} onChange={(e: any) => setMonth(e.target.value)} size="small">
          <MenuItem value={1}>March 2023</MenuItem>
          <MenuItem value={2}>April 2023</MenuItem>
        </CustomSelect>
      }
    >
      <Box className="rounded-bars" height="335px">
        <Chart options={optionschart} series={serieschart} type="area" height="320px" width={'100%'} />
      </Box>
    </DashboardCard>
  );
};

// --- B. YEARLY BREAKUP (Donut Chart - Arriba Derecha) ---
const YearlyBreakup = ({ isLoading, totalRevenue = 0 }: { isLoading: boolean; totalRevenue?: number }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;

  const optionschart: any = {
    chart: { type: 'donut', fontFamily: "'Plus Jakarta Sans', sans-serif;", height: 155 },
    colors: [primary, secondary, success], 
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: false }, 
            value: { show: false }, 
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '22px',
              fontWeight: '600',
              color: theme.palette.text.primary,
              formatter: () => `$${totalRevenue.toLocaleString()}`
            }
          }
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { show: false },
    tooltip: { theme: 'dark', fillSeriesColor: false },
  };
  
  const serieschart = [totalRevenue * 0.65, totalRevenue * 0.20, totalRevenue * 0.15];

  return (
    <DashboardCard title="Yearly updates" subtitle="Overview of Profit">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box height="200px" display="flex" justifyContent="center" alignItems="center">
            <Chart options={optionschart} series={serieschart} type="donut" height={180} width={"100%"} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={3} justifyContent="center" mt={-2}>
            {[
              { color: primary, label: '2023' },
              { color: secondary, label: '2022' },
              { color: success, label: '2021' }
            ].map((item, i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={1}>
                <Box width={8} height={8} borderRadius="50%" bgcolor={item.color} />
                <Typography variant="subtitle2" color="textSecondary">{item.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

// --- C. PRODUCT PERFORMANCES (Tabla - Abajo Izquierda) ---
const ProductPerformances = ({ products = [] }: { products?: any[] }) => {
  const [month, setMonth] = React.useState('1');
  const theme = useTheme();

  const optionsSparkline: any = {
    chart: { type: 'area', height: 35, sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    fill: { opacity: 0.2 },
    tooltip: { fixed: { enabled: false }, x: { show: false }, marker: { show: false } }
  };

  return (
    <DashboardCard 
      title="Product Performances" 
      subtitle="How it performs"
      action={
        <CustomSelect value={month} onChange={(e: any) => setMonth(e.target.value)} size="small">
          <MenuItem value={1}>March 2023</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table sx={{ whiteSpace: 'nowrap' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 0 }}><Typography variant="subtitle2" fontWeight={600}>Assigned</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Progress</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Priority</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Budget</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Chart</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ pl: 0 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 45, height: 45 }}>
                       {p.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{p.name}</Typography>
                      <Typography color="textSecondary" fontSize="12px">{p.category}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2">{p.percentage}%</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={p.priority} 
                    size="small" 
                    sx={{ 
                      bgcolor: p.priority === 'High' ? theme.palette.secondary.light : 
                               p.priority === 'Medium' ? theme.palette.warning.light : theme.palette.success.light,
                      color:   p.priority === 'High' ? theme.palette.secondary.main : 
                               p.priority === 'Medium' ? theme.palette.warning.main : theme.palette.success.main,
                      borderRadius: '4px',
                      fontWeight: 600
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>${p.budget.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Box width="60px">
                     <Chart 
                        options={{...optionsSparkline, colors: [theme.palette.primary.main]}} 
                        series={[{ data: [10, 20, 15, 30, 20] }]} 
                        type="area" 
                        height={35} 
                      />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

// --- D. RECENT TRANSACTIONS (Lista - Abajo Derecha) ---
const RecentTransactions = ({ transactions = [] }: { transactions?: any[] }) => {
  
  const getIcon = (title: string, type: string) => {
     if(title.toLowerCase().includes('paypal')) return <IconCurrencyDollar width={20} />;
     if(title.toLowerCase().includes('wallet')) return <IconCreditCard width={20} />;
     if(type === 'Income') return <IconCash width={20} />;
     return <IconArrowBackUp width={20} />;
  }

  const getColors = (index: number) => {
      const colors = ['primary', 'success', 'warning', 'error', 'secondary'];
      return colors[index % colors.length];
  }

  return (
    <DashboardCard title="Recent Transactions" subtitle="Income vs Expense">
      <>
        <Timeline
          sx={{
            p: 0, mb: 0,
            [`& .${timelineOppositeContentClasses.root}`]: { flex: 0, paddingLeft: 0 },
          }}
        >
          {transactions.map((t, i) => (
            <TimelineItem key={t.id}>
              <TimelineOppositeContent sx={{ display: 'none' }} />
              <TimelineSeparator>
                <Box 
                  bgcolor={`${getColors(i)}.light`} 
                  color={`${getColors(i)}.main`}
                  p={1} 
                  borderRadius="8px"
                  display="flex" alignItems="center" justifyContent="center"
                  mb={2}
                >
                    {getIcon(t.title, t.type)}
                </Box>
                {i < transactions.length - 1 && <TimelineConnector sx={{ bgcolor: 'transparent' }} />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: 0, mt: 0.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Box>
                        <Typography fontWeight="600" variant="subtitle1">{t.title}</Typography>
                        <Typography variant="caption" color="textSecondary">{t.subtitle}</Typography>
                    </Box>
                    <Typography fontWeight="600" color={t.type === 'Income' ? 'success.main' : 'error.main'}>
                        {t.type === 'Income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <Button fullWidth variant="outlined" sx={{ mt: 3 }}>View all transactions</Button>
      </>
    </DashboardCard>
  );
};

// ==============================================================
// 3. PÁGINA PRINCIPAL (DashboardPage)
// ==============================================================
export default function DashboardPage() { 
  const {business} = useBusiness()
  // Ejecutar Query
  const { data, loading, error } = useQuery(GET_DASHBOARD_V2, {
    variables: { businessId: business?.id },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading dashboard">
        <Alert severity="error">Error cargando KPIs: {error.message}</Alert>
      </PageContainer>
    );
  }

  const kpis = data?.businessKpisV2;

  return (
    <PageContainer title="Dashboard" description="Overview">
      <Box>
        <Grid container spacing={3}>
          
          {/* Fila 1: Gráficos Superiores */}
          <Grid item xs={12} lg={8}>
            <RevenueUpdates 
               isLoading={loading} 
               data={kpis?.revenueUpdates} 
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearlyBreakup 
               isLoading={loading} 
               totalRevenue={kpis?.totalRevenue} 
            />
          </Grid>

          {/* Fila 2: Tablas y Listas */}
          <Grid item xs={12} lg={8}>
            <ProductPerformances 
               products={kpis?.productPerformances} 
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions 
               transactions={kpis?.recentTransactions} 
            />
          </Grid>

        </Grid>
      </Box>
    </PageContainer>
  );
}