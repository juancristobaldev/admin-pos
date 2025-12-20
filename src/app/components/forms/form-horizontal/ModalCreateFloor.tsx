// ====================================================================
// CREATE FLOOR MODAL COMPONENT (SIMULA CreateFloorModal.tsx)
// ====================================================================
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  useTheme,
} from "@mui/material";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { useBusiness } from "@/store/bussines";
// ====================================================================
// GQL DEFINITIONS
// ====================================================================

import { gql } from "@apollo/client";

// 1. MUTACIÓN PARA CREAR UN NUEVO PLANO (ZONA)
export const CREATE_FLOOR_MUTATION = gql`
  mutation CreateFloor($name: String!) {
    createFloor(input: { name: $name }) {
      id
      name
      tables {
        id
      }
    }
  }
`;

// 2. MUTACIÓN PARA GUARDAR LAS MESAS ACTUALIZADAS (Coordenadas/Posición)
// NOTA: Esta mutación debe existir en tu backend (ej: floor.resolver.ts)
// Recibe el ID del Plano y la lista de Mesas (solo campos actualizables).
export const UPDATE_TABLES_MUTATION = gql`
  mutation UpdateTables($floorId: ID!, $tables: [UpdateTableInput!]!) {
    updateTables(floorId: $floorId, tables: $tables) {
      id
      name
      coordX
      coordY
      shape
      color
      capacity
    }
  }
`;
// Yup: Esquema de Validación
const FloorSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre de la zona es obligatorio")
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),
});

interface FloorFormValues {
  name: string;
}

interface CreateFloorModalProps {
  open: boolean;
  onClose: () => void;
  onFloorCreated: (newFloor: any) => void;
}

const CreateFloorModal: React.FC<CreateFloorModalProps> = ({
  open,
  onClose,
  onFloorCreated,
}) => {
  const { refreshBusiness } = useBusiness();
  const theme = useTheme();

  const [createFloor, { loading }] = useMutation(CREATE_FLOOR_MUTATION, {
    onCompleted: (data) => {
      const newFloor = data.createFloor;
      refreshBusiness();
      onFloorCreated(newFloor);
      formik.resetForm();
      onClose();
    },
    onError: (error) => {
      console.error("Error al crear el plano:", error.message);
      // Implementar un Toast/Snackbar aquí
    },
  });

  const formik = useFormik<FloorFormValues>({
    initialValues: {
      name: "",
    },
    validationSchema: FloorSchema,
    onSubmit: (values) => {
      createFloor({
        variables: {
          name: values.name,
        },
      });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: theme.palette.background.paper }}>
        Crear Nueva Zona/Plano
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              id="name"
              name="name"
              label="Nombre del Plano (Ej: Salón Principal)"
              variant="outlined"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formik.isValid}
            startIcon={<IconDeviceFloppy />}
          >
            {loading ? "Creando..." : "Guardar Plano"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateFloorModal;
