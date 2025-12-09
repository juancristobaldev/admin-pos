// src/components/Forms/CreateProductForm.tsx

import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Divider,
  CardContent,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import BlankCard from "../shared/BlankCard";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useMutation, gql } from "@apollo/client";

// --- CATEGORÍAS DISPONIBLES (Ejemplo) ---
const PRODUCT_CATEGORIES = [
  "Plato Fuerte",
  "Entradas",
  "Bebidas",
  "Postres",
  "Sandwich",
];

// --- DEFINICIÓN DE LA MUTACIÓN (Frontend) ---
const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      price
      category
      available
      description
    }
  }
`;

// --- ESQUEMA DE VALIDACIÓN (yup) ---
const validationSchema = yup.object({
  name: yup.string().required("El nombre del producto es obligatorio."),
  description: yup.string().required("La descripción es obligatoria."),
  category: yup.string().required("La categoría es obligatoria."),
  price: yup
    .number()
    .min(0.01, "El precio debe ser mayor a 0.")
    .required("El precio es obligatorio.")
    .typeError("Debe ser un número válido."),
  available: yup.string().required("Debe definir la disponibilidad."),
  businessId: yup.string().required("El ID del negocio es requerido."),
});

// Interfaz para los datos del formulario (Coincide con la mutación CreateProductInput)
interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  available: string; // Usamos string para el Select ('true'/'false')
  businessId: string;
}

// Valores iniciales
const initialValues: ProductFormValues = {
  name: "",
  description: "",
  category: "",
  price: 0.0,
  available: "true",
  businessId: "simulated-business-id-001",
};

// Componente principal
const CreateProductForm = () => {
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT_MUTATION);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // 1. Preparar los datos para la mutación
      const finalInput = {
        ...values,
        available: values.available === "true", // Convertir a boolean
        price: parseFloat(values.price.toFixed(2)),
      };

      try {
        // 2. Ejecutar la mutación GraphQL
        await createProduct({
          variables: { input: finalInput },
          // Opcional: Refetch de la lista de productos para actualizar la tabla
          // refetchQueries: [{ query: GET_PRODUCTS }]
        });

        alert(`✅ Producto "${finalInput.name}" creado exitosamente.`);
        resetForm(); // Limpiar el formulario
      } catch (error) {
        console.error("Error al crear producto:", error);
        alert(
          "❌ Error al crear producto. Verifique la conexión o el ID del negocio."
        );
      }
    },
  });

  const currentDate = new Date().toLocaleDateString("es-CL");

  return (
    <BlankCard>
      <CardContent>
        <Typography variant="h4" fontWeight="700" mb={1}>
          Detalles del Producto
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={3}>
          Para cambiar los detalles del producto, rellena el formulario.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Campo 1: Nombre del Producto */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="name"
                name="name"
                label="Nombre del Producto"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Campo 2: Descripción */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="description"
                name="description"
                label="Descripción del producto"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                fullWidth
                multiline
                rows={1}
                variant="outlined"
              />
            </Grid>

            {/* Campo 3: Categoría (Select) */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
              >
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  label="Categoría"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="">
                    <em>Seleccione una categoría</em>
                  </MenuItem>
                  {PRODUCT_CATEGORIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <FormHelperText>{formik.errors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Campo 4: Estado / Disponibilidad (Select) */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={
                  formik.touched.available && Boolean(formik.errors.available)
                }
              >
                <InputLabel id="available-label">Estado</InputLabel>
                <Select
                  labelId="available-label"
                  id="available"
                  name="available"
                  label="Estado"
                  value={formik.values.available}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="true">Disponible</MenuItem>
                  <MenuItem value="false">Agotado (Offline)</MenuItem>
                </Select>
                {formik.touched.available && formik.errors.available && (
                  <FormHelperText>{formik.errors.available}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Campo 5: Precio */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="price"
                name="price"
                label="Precio ($)"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                fullWidth
                variant="outlined"
                type="number"
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            {/* Campo 6: Fecha de Creación (Solo Lectura) */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="creation-date"
                label="Fecha de Creación"
                value={currentDate}
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>

            {/* Campo 7: Última Actualización (Solo Lectura) */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="update-date"
                label="Última Actualización"
                value="N/A (Se asigna al actualizar)"
                fullWidth
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>

          {/* Botón de Envío */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              startIcon={<IconDeviceFloppy />}
              disabled={loading || formik.isSubmitting}
            >
              {loading ? "Creando..." : "Crear Producto"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </BlankCard>
  );
};

export default CreateProductForm;
