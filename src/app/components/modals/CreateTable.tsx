import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  IconSquare,
  IconCircle,
  IconRectangleVertical,
  IconRectangle,
  IconWall,
} from "@tabler/icons-react";

// Tipos importados o redefinidos según tu proyecto
export type ShapeType =
  | "square"
  | "circle"
  | "rectangle-v"
  | "rectangle-h"
  | "wall";

export interface LocalTableState {
  id: string;
  name: string;
  coordX: number;
  coordY: number;
  shape: ShapeType;
  color: string;
  floorId: string;
  capacity?: number; // Agregamos capacidad si tu backend lo requiere
}

interface CreateTableModalProps {
  open: boolean;
  onClose: () => void;
  floorId: string;
  onAddTable: (table: LocalTableState) => void;
}

// Validación del formulario
const validationSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio (ej: M-1)"),
  shape: yup.string().required("Selecciona una forma"),
  capacity: yup
    .number()
    .min(1, "Mínimo 1 persona")
    .required("Capacidad requerida"),
});

export const CreateTableModal: React.FC<CreateTableModalProps> = ({
  open,
  onClose,
  floorId,
  onAddTable,
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      shape: "square" as ShapeType,
      capacity: 4,
      color: "#98FF98", // Color por defecto (Verde disponible)
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // 1. Crear objeto de mesa local
      const newTable: LocalTableState = {
        id: `temp-${Date.now()}`, // ID temporal único
        name: values.name,
        coordX: 50, // Posición inicial (esquina superior izquierda)
        coordY: 50,
        shape: values.shape,
        color: values.shape === "wall" ? "#555555" : values.color, // Gris si es pared
        floorId: floorId,
        capacity: values.capacity,
      };

      // 2. Pasar al estado del padre
      onAddTable(newTable);

      // 3. Limpiar y cerrar
      resetForm();
      onClose();
    },
  });

  // Mapa de iconos para el selector
  const shapeOptions = [
    { value: "square", label: "Cuadrada", icon: <IconSquare size={20} /> },
    { value: "circle", label: "Redonda", icon: <IconCircle size={20} /> },
    {
      value: "rectangle-h",
      label: "Rect. Horizontal",
      icon: <IconRectangle size={20} />,
    },
    {
      value: "rectangle-v",
      label: "Rect. Vertical",
      icon: <IconRectangleVertical size={20} />,
    },
    { value: "wall", label: "Muro / Obstáculo", icon: <IconWall size={20} /> },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Nueva Mesa / Elemento</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            {/* Campo Nombre */}
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Identificador (Ej: 10, VIP)"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              autoFocus
            />

            {/* Selector de Forma */}
            <FormControl fullWidth>
              <InputLabel id="shape-label">Forma</InputLabel>
              <Select
                labelId="shape-label"
                id="shape"
                name="shape"
                value={formik.values.shape}
                label="Forma"
                onChange={formik.handleChange}
              >
                {shapeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.icon}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo Capacidad (Ocultar si es Muro) */}
            {formik.values.shape !== "wall" && (
              <TextField
                fullWidth
                id="capacity"
                name="capacity"
                label="Capacidad (Personas)"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            )}

            {/* Selector de Color Simple */}
            {formik.values.shape !== "wall" && (
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Color Inicial
                </Typography>
                <Grid container spacing={1} mt={0.5}>
                  {["#98FF98", "#FF6961", "#FFB7FF", "#6A89CC", "#F8C291"].map(
                    (color) => (
                      <Grid item key={color}>
                        <Box
                          onClick={() => formik.setFieldValue("color", color)}
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: color,
                            borderRadius: "50%",
                            cursor: "pointer",
                            border:
                              formik.values.color === color
                                ? "2px solid black"
                                : "1px solid #ddd",
                          }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Agregar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
