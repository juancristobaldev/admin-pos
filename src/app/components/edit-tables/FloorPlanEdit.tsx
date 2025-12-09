// src/components/FloorPlan/FloorPlanEditor.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import { useMutation, gql } from "@apollo/client";
import TableItem, { ShapeType } from "./TableItem";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { Floor, Table } from "@/entitys";
import { CreateTableModal } from "../modals/CreateTable";

// --- NUEVA DEFINICIÓN DE LA MUTACIÓN POR LOTES (ATÓMICA) ---
// Usa el nombre que definimos en el backend
const MANAGE_FLOOR_TABLES = gql`
  mutation ManageFloorTables($input: TableBatchUpdateInput!) {
    manageFloorTables(input: $input)
  }
`;

// Tipo de mesa que soporta datos temporales de Frontend
interface LocalTableState extends Table {
  // Añadimos un flag temporal para distinguir lo que viene de BD vs lo nuevo
  isNew?: boolean;
}

// Datos iniciales simulados (Mock)

type Props = {
  floor: Floor;
  handleAddTable: (item: any) => void;
};

const FloorPlanEditor = (props: Props) => {
  // 1. Inicialización con datos de la BD (si existen) o el mock, guardando el estado original
  const initialData: LocalTableState[] =
    (props.floor?.tables as LocalTableState[]) || [];
  const [tables, setTables] = useState<LocalTableState[]>(initialData);
  const [originalTables, setOriginalTables] =
    useState<LocalTableState[]>(initialData);

  const [hasChanges, setHasChanges] = useState(false);
  const [openCreateTable, setOpenCreateTable] = useState(false);

  // Hook de Apollo - Usamos la mutación por lotes
  const [manageTables, { loading }] = useMutation(MANAGE_FLOOR_TABLES);

  // Lógica para detectar el DELTA (qué se creó, qué se movió, qué se borró)
  const getBatchUpdateInput = useMemo(() => {
    // Mesas nuevas: Tienen el flag 'isNew'
    const tablesToCreate = tables
      .filter((t) => t.isNew)
      .map((t) => ({
        floorId: props.floor.id,
        name: t.name,
        coordX: t.coordX,
        coordY: t.coordY,
        capacity: t.capacity || 4, // Asegura que tenga capacidad
        shape: t.shape,
        color: t.color,
      }));

    // Mesas actualizadas: Existen en el estado original PERO sus coordenadas (o name) cambiaron
    const tablesToUpdate = tables
      .filter((t) => !t.isNew)
      .filter((t) => {
        const original = originalTables.find((o) => o.id === t.id);
        return (
          original &&
          (original.coordX !== t.coordX ||
            original.coordY !== t.coordY ||
            original.name !== t.name)
        );
      })
      .map((t) => ({
        id: t.id,
        coordX: t.coordX,
        coordY: t.coordY,
        name: t.name,
        // Puedes añadir aquí cualquier otro campo editable (ej. capacity, color)
      }));

    // IDs de mesas a eliminar: Están en el estado original PERO no están en el estado actual
    // (Esta lógica depende de cómo manejes la eliminación en el UI, aquí es un placeholder)
    const tableIdsToDelete: string[] = originalTables
      .filter(
        (original) => !tables.find((current) => current.id === original.id)
      )
      .map((t) => t.id);

    return {
      floorId: props.floor.id,
      tablesToCreate,
      tablesToUpdate,
      tableIdsToDelete,
    };
  }, [tables, originalTables, props.floor.id]);

  // Manejador cuando se suelta una mesa (actualiza el estado local y marca cambios)
  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, coordX: x, coordY: y } : t))
    );
    setHasChanges(true); // Se ha movido algo, hay que guardar
  };

  // 🎯 Guardar en Base de Datos (Integración de la Mutación Atómica)
  const handleSave = async () => {
    const input = getBatchUpdateInput;

    if (
      input.tablesToCreate.length === 0 &&
      input.tablesToUpdate.length === 0 &&
      input.tableIdsToDelete.length === 0
    ) {
      setHasChanges(false);
      alert("No hay cambios para guardar.");
      return;
    }

    try {
      // 1. Ejecutar la mutación por lotes
      await manageTables({ variables: { input } });

      // 2. Si es exitoso, restablecer el estado original al estado actual
      // NOTA: Idealmente, después de la mutación, recargarías los datos del servidor
      // para obtener los IDs reales de las mesas recién creadas. Aquí simulamos:
      setOriginalTables(
        tables.map((t) => ({
          ...t,
          isNew: false,
          id: t.isNew ? "NEW_ID_FROM_SERVER" : t.id,
        }))
      );
      setTables(
        tables.map((t) => ({
          ...t,
          isNew: false,
          id: t.isNew ? "NEW_ID_FROM_SERVER" : t.id,
        }))
      );

      setHasChanges(false);
      alert("¡Plano guardado exitosamente!");
    } catch (error) {
      console.error("Error guardando plano:", error);
    }
  };

  // Manejador para agregar una mesa desde la modal
  const handleAddTable = (table: any) => {
    const newTableState: LocalTableState = {
      id: `temp-${Date.now()}`,
      name: table.name || "Nueva Mesa",
      floorId: props.floor.id,
      coordX: 50,
      coordY: 50,
      shape: table.shape || "square",
      color: table.color || "#cccccc",
      capacity: table.capacity || 4,
      status: "Disponible",
      isNew: true, // Marca como nuevo
    };

    setTables((prev) => [...prev, newTableState]);
    setHasChanges(true);
    setOpenCreateTable(false);
  };

  // useEffect para debug, se mantiene
  useEffect(() => {
    // console.log("Estado actual de tables:", tables);
    // console.log("Input a enviar:", getBatchUpdateInput);
  }, [tables, getBatchUpdateInput]);

  return (
    <Box sx={{ p: 3 }}>
      <CreateTableModal
        open={openCreateTable}
        onClose={() => setOpenCreateTable(false)}
        floorId={props.floor?.id || ""}
        onAddTable={handleAddTable}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight="700">
          {props.floor.name}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<IconPlus />}
            onClick={() => setOpenCreateTable(true)}
            sx={{ mr: 2 }}
          >
            Agregar Mesa
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconDeviceFloppy />}
            onClick={handleSave}
            disabled={!hasChanges || loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* LIENZO DEL PLANO (CANVAS) */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              height: "500px",
              position: "relative",
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
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
                // Asegura que TableItem reciba las coordenadas y propiedades que necesita
                onStop={handleUpdatePosition}
              />
            ))}
          </Paper>
        </Grid>

        {/* SIDEBAR DE NAVEGACIÓN (Como en la foto) */}
      </Grid>
    </Box>
  );
};

export default FloorPlanEditor;
