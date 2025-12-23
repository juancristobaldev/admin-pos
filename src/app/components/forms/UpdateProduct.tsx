// src/components/Forms/UpdateProductForm.tsx
import { gql } from "@apollo/client";


const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      description
      price
      category
      available
    }
  }
`;


 const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      businessId
      name
      description
      price
      available
      category
      createdAt
      updatedAt
    }
  }
`;



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
  CircularProgress,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as yup from "yup";
import { IconDeviceFloppy } from "@tabler/icons-react";
import BlankCard from "../shared/BlankCard";


/* =======================
   Constantes
======================= */

const PRODUCT_CATEGORIES = [
  "Plato Fuerte",
  "Entradas",
  "Bebidas",
  "Postres",
  "Sandwich",
];

/* =======================
   Tipos
======================= */

interface FormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  available: "true" | "false";
}

interface UpdateProductFormProps {
  productId: string | null;
  onUpdated?: () => void;
}

/* =======================
   Validación
======================= */

const validationSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  description: yup.string().required("La descripción es obligatoria"),
  category: yup.string().required("La categoría es obligatoria"),
  price: yup
    .number()
    .typeError("Debe ser un número válido")
    .min(0.01, "El precio debe ser mayor a 0")
    .required("El precio es obligatorio"),
  available: yup.string().required("Debe definir el estado"),
});

const UpdateProductForm = ({
  productId,
  onUpdated,
}: UpdateProductFormProps) => {
  /* ---------- Query ---------- */
  const { data, loading, error } = useQuery(GET_PRODUCT_QUERY, {
    variables: { id: productId },
  });

  /* ---------- Mutación ---------- */
  const [updateProduct, { loading: updating }] = useMutation(
    UPDATE_PRODUCT_MUTATION
  );

  /* ---------- Producto seguro ---------- */
  const product = data?.product;

  /* ---------- Formik (SIEMPRE se ejecuta) ---------- */
  const formik = useFormik<FormValues>({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      category: product?.category ?? "",
      price: product?.price ?? 0,
      available: product?.available ? "true" : "false",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!product) return;

      const input = {
        id: product.id,
        name: values.name,
        description: values.description,
        category: values.category,
        price: parseFloat(values.price.toFixed(2)),
        available: values.available === "true",
      };

      try {
        await updateProduct({ variables: { input } });
        alert("✅ Producto actualizado correctamente");
        onUpdated?.();
      } catch (err) {
        console.error(err);
        alert("❌ Error al actualizar el producto");
      }
    },
  });

  /* =======================
     Render
  ======================= */

  return (
    <BlankCard>
      <CardContent>
        {/* ---------- Loading ---------- */}
        {loading && (
          <Box textAlign="center" py={4}>
            <CircularProgress />
            <Typography mt={2}>Cargando producto...</Typography>
          </Box>
        )}

        {/* ---------- Error ---------- */}
        {!loading && (error || !product) && (
          <Typography color="error">
            ❌ No se pudo cargar el producto
          </Typography>
        )}

        {/* ---------- Formulario ---------- */}
        {!loading && product && (
          <>
            <Typography variant="h4" fontWeight={700} mb={1}>
              Editar Producto
            </Typography>

            <Typography variant="subtitle2" color="textSecondary" mb={3}>
              Última actualización:{" "}
              {new Date(product.updatedAt).toLocaleString("es-CL")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Nombre"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.name && Boolean(formik.errors.name)
                    }
                    helperText={
                      formik.touched.name &&
                      typeof formik.errors.name === "string"
                        ? formik.errors.name
                        : ""
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="description"
                    label="Descripción"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description &&
                      typeof formik.errors.description === "string"
                        ? formik.errors.description
                        : ""
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="available"
                      value={formik.values.available}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="true">Disponible</MenuItem>
                      <MenuItem value="false">Agotado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Precio"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.price && Boolean(formik.errors.price)
                    }
                    helperText={
                      formik.touched.price &&
                      typeof formik.errors.price === "string"
                        ? formik.errors.price
                        : ""
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<IconDeviceFloppy />}
                  disabled={updating}
                >
                  {updating ? "Guardando..." : "Guardar cambios"}
                </Button>
              </Box>
            </form>
          </>
        )}
      </CardContent>
    </BlankCard>
  );
};

export default UpdateProductForm;
