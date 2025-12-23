'use client';

import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';

// Imports de contenedores y componentes
import PageContainer from '@/app/components/container/PageContainer';
import TopCards from '@/app/components/dashboards/modern/TopCards';
import MonthlyEarnings from '@/app/components/dashboards/ecommerce/MonthlyEarnings';
import YearlyBreakup from '@/app/components/dashboards/modern/YearlyBreakup';
import Projects from '@/app/components/dashboards/modern/Projects';
import SalesOverview from '@/app/components/dashboards/ecommerce/SalesOverview';
import Growth from '@/app/components/dashboards/ecommerce/Growth';
import Customers from '@/app/components/dashboards/modern/Customers';
import SellingProducts from '@/app/components/dashboards/modern/SellingProducts';

// 1. Definición de la Query GraphQL
const GET_BUSINESS_KPIS = gql`
  query GetBusinessKpis($businessId: String!) {
    businessKpis(businessId: $businessId) {
      activeUsers
      avgOrdersPerUser
      avgDaysSinceLastLogin
      activeTables
      tableRotationRate
      totalFloors
      availableProducts
      totalProducts
      avgTicket
      totalRevenue
      netRevenue
      avgTip
      totalOrders
      completedOrders
      cancellationRate
      avgStatusChangeTimeMinutes
    }
  }
`;

export default function DashboardPage() {
  // 2. Obtener ID del negocio desde la URL
  const params = useParams<{ idLocal: string }>();

  // 3. Ejecutar Query
  const { data, loading, error } = useQuery(GET_BUSINESS_KPIS, {
    variables: { businessId: params.idLocal },
    fetchPolicy: 'network-only',
  });

  // 4. Estados de Carga y Error
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

  const kpis = data?.businessKpis;

  return (
    <PageContainer title="Dashboard" description="KPIs en tiempo real">
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Resumen Ejecutivo
        </Typography>

        <Grid container spacing={3}>
          {/* =========================================
              FILA 1: TARJETAS DE RESUMEN (KPIs Generales)
             ========================================= */}
          <Grid item xs={12}>
            <TopCards
              activeUsers={kpis.activeUsers}
              totalFloors={kpis.totalFloors}
              activeTables={kpis.activeTables}
              totalProducts={kpis.totalProducts}
              avgTicket={kpis.avgTicket}
              avgTip={kpis.avgTip}
            /> 
          </Grid>

          {/* =========================================
              FILA 2: METRICAS CLAVE (Revenue, Órdenes, Desglose)
             ========================================= */}
          <Grid item xs={12} lg={4}>
            <MonthlyEarnings
              isLoading={loading} 
              totalRevenue={kpis.totalRevenue} 
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <YearlyBreakup
              isLoading={loading} 
              totalOrders={kpis.totalOrders}
              completedOrders={kpis.completedOrders}
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Projects
              isLoading={loading} 
              totalOrders={kpis.totalOrders} 
            />
          </Grid>

          {/* =========================================
              FILA 3: DETALLE FINANCIERO Y OPERATIVO
             ========================================= */}
          <Grid item xs={12} lg={8}>
            <SalesOverview
              isLoading={loading}
              totalRevenue={kpis.totalRevenue}
              netRevenue={kpis.netRevenue}
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* Eficiencia (Tiempo promedio) */}
                <Growth
                  isLoading={loading}
                  minutes={kpis.avgStatusChangeTimeMinutes} 
                />
              </Grid>
              <Grid item xs={12}>
                {/* Usuarios Activos (Reutilizando Customers) */}
                <Customers
                  isLoading={loading}
                  count={kpis.activeUsers} 
                />
              </Grid>
            </Grid>
          </Grid>

          {/* =========================================
              FILA 4: INVENTARIO
             ========================================= */}
          <Grid item xs={12}>
            <SellingProducts
              availableProducts={kpis.availableProducts}
              totalProducts={kpis.totalProducts}
            />
          </Grid>

        </Grid>
      </Box>
    </PageContainer>
  );
}