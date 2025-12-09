"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Container,
} from "@mui/material";
import { IconDeviceFloppy, IconPlus, IconLayout } from "@tabler/icons-react";

// Components
import ParentCard from "@/app/components/shared/ParentCard";
import { useBusiness } from "@/store/bussines"; // Asegúrate que la ruta sea correcta (bussines vs business)
import FloorPlanEditor from "@/app/components/edit-tables/FloorPlanEdit"; // Asumo que este componente acepta 'tables' y 'onTablesChange'

// --- TIPOS ---
export type ShapeType =
  | "square"
  | "circle"
  | "rectangle-v"
  | "rectangle-h"
  | "wall";

// Interfaz alineada con tu Schema Prisma/GraphQL
export interface LocalTableData {
  id: string;
  name: string;
  capacity: number;
  coordX: number;
  coordY: number;
  status: string;
  floorId: string;
  shape: string; // Nuevo: El usuario lo seleccionará
  color: string; // Fijo por defecto
}

const TablesPlane = () => {
  const { business, refreshBusiness } = useBusiness(); // Asumo que tienes un refresh en el store

  // 1. ESTADO
  const [selectedFloor, setSelectedFloor] = useState<any | null>(null);
  const [tables, setTables] = useState<LocalTableData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCreateFloor, setOpenCreateFloor] = useState(false);

  // 2. EFECTO: Seleccionar el primer piso por defecto al cargar el negocio
  useEffect(() => {
    if (business?.floors?.length && !selectedFloor) {
      const firstFloor = business.floors[0];
      setSelectedFloor(firstFloor);
    }
  }, [business, selectedFloor]);

  // 3. EFECTO: Sincronizar mesas cuando cambia el piso seleccionado
  useEffect(() => {
    if (selectedFloor) {
      // Mapeamos las mesas del backend al formato del editor local
      // Aseguramos valores por defecto si vienen null del backend
      const mappedTables: LocalTableData[] = selectedFloor.tables.map(
        (t: any) => ({
          id: t.id,
          name: t.name,
          coordX: t.coordX || 0,
          coordY: t.coordY || 0,
          shape: t.shape || "square",
          color: t.color || "#98FF98",
          floorId: selectedFloor.id,
        })
      );
      setTables(mappedTables);
      setHasChanges(false); // Resetear flag de cambios al cambiar de piso
    } else {
      setTables([]);
    }
  }, [selectedFloor]);

  // 4. LÓGICA: Agregar nueva mesa (Localmente)
  const handleAddTable = (table: LocalTableData) => {
    if (!selectedFloor) return;

    setTables((prev) => [...prev, table]);
    setHasChanges(true);
  };

  // 5. LÓGICA: Guardar Cambios (Mutación)
  const handleSave = async () => {
    setLoading(true);
    try {
      // AQUÍ IMPLEMENTAS TU MUTACIÓN REAL
      // await updateTablesMutation({ variables: { tables: tables } });

      console.log("Guardando datos para el piso:", selectedFloor?.name, tables);

      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasChanges(false);
      // Opcional: refreshBusiness();
    } catch (error) {
      console.error("Error al guardar", error);
    } finally {
      setLoading(false);
    }
  };

  // 6. LÓGICA: Actualización desde el Hijo (FloorPlanEditor)
  // Esta función se pasa al componente hijo para que actualice el estado del padre al arrastrar
  const handleTablesUpdate = (updatedTables: LocalTableData[]) => {
    setTables(updatedTables);
    setHasChanges(true);
  };

  return (
    <ParentCard
      title={`Distribución: ${selectedFloor?.name || "Selecciona un Plano"}`}
    >
      <Grid container spacing={3}>
        {/* MODAL PARA CREAR PISO */}

        {/* COLUMNA IZQUIERDA: EDITOR GRÁFICO */}
        <Grid item xs={12} lg={9}>
          {!business?.floors?.length ? (
            // ESTADO VACÍO (Sin pisos)
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 5,
              }}
              maxWidth="md"
            >
              <Typography
                align="center"
                variant="h4"
                mb={2}
                color="textSecondary"
              >
                Aún no tienes zonas configuradas
              </Typography>
              <Typography align="center" mb={4} color="textSecondary">
                Crea tu primer plano (ej: Salón, Terraza) para comenzar a
                colocar mesas.
              </Typography>
              <Button
                onClick={() => setOpenCreateFloor(true)}
                color="primary"
                variant="contained"
                size="large"
                disableElevation
              >
                Crear mi primer plano
              </Button>
            </Container>
          ) : (
            // EDITOR ACTIVO
            selectedFloor && (
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  height: "600px",
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: "#f9f9f9",
                }}
              >
                {/* NOTA: FloorPlanEditor debe recibir 'tables' y una función para actualizarlas.
                   Si tu componente FloorPlanEditor maneja estado interno, debes refactorizarlo 
                   para que sea "Controlado" (Controlled Component) por estas props.
                */}
                <FloorPlanEditor
                  floor={selectedFloor}
                  handleAddTable={(item: any) =>
                    setTables((prev) => [...prev, item])
                  }
                />
              </Box>
            )
          )}
        </Grid>

        {/* COLUMNA DERECHA: SIDEBAR DE ACCIONES */}
        <Grid item xs={12} lg={3}>
          <Stack spacing={3}>
            {/* ACCIONES PRINCIPALES */}

            {/* LISTA DE PLANOS (PISOS) */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Mis Zonas
              </Typography>
              <Stack spacing={2}>
                {business?.floors?.map((floor: any) => (
                  <Paper
                    key={floor.id}
                    onClick={() => setSelectedFloor(floor)}
                    elevation={selectedFloor?.id === floor.id ? 3 : 1}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border:
                        selectedFloor?.id === floor.id
                          ? "2px solid #5D87FF"
                          : "1px solid transparent",
                      transition: "all 0.2s",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <IconLayout
                        size={24}
                        color={
                          selectedFloor?.id === floor.id ? "#5D87FF" : "gray"
                        }
                      />
                      <Box>
                        <Typography
                          fontWeight="bold"
                          color={
                            selectedFloor?.id === floor.id
                              ? "primary"
                              : "textPrimary"
                          }
                        >
                          {floor.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {floor.tables?.length || 0} Mesas
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}

                {/* BOTÓN AGREGAR PLANO */}
                <Paper
                  onClick={() => setOpenCreateFloor(true)}
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderStyle: "dashed",
                    borderColor: "primary.main",
                    bgcolor: "primary.light",
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    color="primary.main"
                  >
                    <IconPlus size={20} />
                    <Typography fontWeight="bold">Nueva Zona</Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </ParentCard>
  );
};

export default TablesPlane;

/*

<PageContainer
      title="Editor de Planos"
      description="Gestión visual de mesas"
    >
      <Breadcrumb title="Editor de Salon" items={BCrumb} />
      <Container
        className="!flex !items-center !justify-center !flex-col"
        maxWidth="md"
      >
        <Typography align="center" variant="h1" mb={4}>
          Opps no has creado tu primer plano
        </Typography>

        <Button
          className="place-self self-center"
          color="primary"
          variant="contained"
          href="/"
          disableElevation
        >
          Crea tu primer plano
        </Button>
      </Container>
    </PageContainer>

 <ParentCard title="Distribución del Restaurante">
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Salon Entrada</Typography>
              {hasChanges && (
                <Typography variant="caption" color="warning.main">
                  Hay cambios sin guardar...
                </Typography>
              )}
            </Box>

            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                height: "600px", // Altura fija del plano
                position: "relative", // IMPORTANTE: Define el contexto de coordenadas
                backgroundColor: "#f4f6f8",
                borderRadius: 2,
                overflow: "hidden",
                // Patrón de cuadrícula para guiar
                backgroundImage:
                  "radial-gradient(#cbd5e1 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {tables.map((table) => (
                <TableItem
                  key={table.id}
                  id={table.id}
                  name={table.name}
                  x={table.coordX}
                  y={table.coordY}
                  shape={table.shape}
                  color={table.color}
                  onStop={handleUpdatePosition}
                />
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Acciones
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<IconDeviceFloppy />}
                    disabled={!hasChanges || loading}
                    onClick={handleSave}
                    fullWidth
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<IconPlus />}
                    onClick={handleAddTable}
                    fullWidth
                  >
                    Nueva Mesa
                  </Button>
                </Stack>
              </Paper>

              <Box>
                <Typography variant="h6" mb={2}>
                  Mis Planos
                </Typography>
                <Stack spacing={2}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border: "1px solid",
                      borderColor: "primary.main",
                      bgcolor: "primary.light",
                      color: "primary.main",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <IconSquare size={24} />
                      <Box>
                        <Typography fontWeight="bold">Salon Entrada</Typography>
                        <Typography variant="caption" color="textPrimary">
                          15 Mesas
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <IconLayout size={24} />
                      <Box>
                        <Typography fontWeight="bold">Terraza</Typography>
                        <Typography variant="caption">7 Mesas</Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{ p: 2, cursor: "pointer", borderStyle: "dashed" }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      color="text.secondary"
                    >
                      <IconPlus size={24} />
                      <Typography fontWeight="bold">Agregar Plano</Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
*/
