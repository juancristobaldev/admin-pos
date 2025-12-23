"use client";

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
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useMutation, gql } from "@apollo/client";
import BlankCard from "@/app/components/shared/BlankCard";
import { useBusiness } from "@/store/bussines";

// --- CATEGORÍAS ---
const PRODUCT_CATEGORIES = [
  "Plato Fuerte",
  "Entradas",
  "Bebidas",
  "Postres",
  "Sandwich",
];

// --- MUTATION ---
const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      errors
      success
      product {
        id
        name
        price
        category
        available
        description
      }
    }
  }
`;

// --- VALIDATION ---
const validationSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  description: yup.string().required("La descripción es obligatoria"),
  category: yup.string().required("La categoría es obligatoria"),
  price: yup
    .number()
    .min(1, "El precio debe ser mayor a 0")
    .required("El precio es obligatorio"),
  available: yup.string().required(),
  businessId: yup.string().required(),
});

interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  available: string;
  businessId: string;
}

const CreateProductForm = () => {
  const { business } = useBusiness();
  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT_MUTATION);

  const formik = useFormik<ProductFormValues>({
    enableReinitialize: true, // 🔑 CLAVE
    initialValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      available: "true",
      businessId: business?.id ?? "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const input = {
          ...values,
          available: values.available === "true",
          price: Number(values.price),
        };

        console.log("🚀 Enviando mutation:", input);

        const { data } = await createProduct({
          variables: { input },
        });

        if (data.createProduct.errors) {
          alert("❌ Producto ya existe");
          return;
        }

        alert(`✅ Producto "${data.createProduct.product.name}" creado`);
        resetForm();
      } catch (err) {
        console.error(err);
        alert("❌ Error al crear producto");
      }
    },
  });

  return (
    <BlankCard>
      <CardContent>
        <Typography variant="h4" fontWeight="700">
          Crear producto
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ✅ FORM REAL */}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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
                <FormHelperText>
                  {formik.touched.category && formik.errors.category}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Precio"
                type="number"
                fullWidth
                value={formik.values.price}
                onChange={formik.handleChange}
              />
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

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              startIcon={<IconDeviceFloppy />}
              disabled={loading}
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
