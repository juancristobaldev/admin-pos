import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, gql } from "@apollo/client";

// 1. DEFINICIÓN DE LA MUTATION
// Nota: Asegúrate de que coincida con el nombre que pusimos en el Resolver
const CREATE_FLOOR_MUTATION = gql`
  mutation CreateFloor($createFloorInput: CreateFloorInput!) {
    createFloor(createFloorInput: $createFloorInput) {
      id
      name
      businessId
    }
  }
`;

// 2. ESQUEMA DE VALIDACIÓN (YUP)
const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre es muy largo")
    .required("El nombre de la zona es obligatorio"),
});

// 3. INTERFACE DE PROPS
interface CreateFloorModalProps {
  open: boolean;
  onClose: () => void;
  businessId: string; // Necesitamos saber a qué negocio agregar el piso
  onSuccess: () => void; // Para recargar el mapa o mostrar notificación
}

export const CreateFloorModal: React.FC<CreateFloorModalProps> = ({
  open,
  onClose,
  businessId,
  onSuccess,
}) => {
  // Hook de Apollo para la mutación
  const [createFloor, { loading, error }] = useMutation(CREATE_FLOOR_MUTATION, {
    onCompleted: () => {
      formik.resetForm();
      onSuccess(); // Refrescar datos del padre
      onClose(); // Cerrar modal
    },
    onError: (err) => {
      console.error("Error al crear piso:", err);
    },
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createFloor({
        variables: {
          createFloorInput: {
            name: values.name,
            businessId: businessId, // Inyectamos el ID del negocio aquí
          },
        },
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose} // Evitar cierre accidental si está cargando
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Agregar Nueva Zona
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Crea una nueva zona para tu restaurante (ej: Terraza, Salón VIP,
              Barra). Luego podrás agregar mesas a esta zona.
            </Typography>

            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nombre de la Zona / Piso"
              placeholder="Ej: Salón Principal"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={loading}
              autoFocus
            />

            {/* Mensaje de error del Backend (si falla la API) */}
            {error && (
              <Typography color="error" variant="caption">
                Ocurrió un error: {error.message}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Guardando..." : "Crear Zona"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
