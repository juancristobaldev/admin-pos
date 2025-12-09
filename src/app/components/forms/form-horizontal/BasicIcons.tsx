import React from "react";
import { useMutation, gql } from "@apollo/client"; // 1. Apollo
import { useFormik } from "formik"; // 2. Formik
import * as yup from "yup"; // 3. Yup
import {
  Grid,
  InputAdornment,
  Button,
  CircularProgress,
  FormHelperText,
  Alert,
  Box,
} from "@mui/material";
import {
  IconBuildingArch, // Usado como icono por defecto si quieres
  IconPhone,
  IconPin,
  IconUser,
} from "@tabler/icons-react";

// Componentes de tu tema (Asegúrate de que las rutas sean correctas)
import CustomFormLabel from "../theme-elements/CustomFormLabel";
import CustomOutlinedInput from "../theme-elements/CustomOutlinedInput";

// ----------------------------------------------------------------------
// 1. DEFINICIÓN DE LA MUTACIÓN GRAPHQL
// ----------------------------------------------------------------------
const CREATE_BUSINESS_MUTATION = gql`
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      id
      name
      status
    }
  }
`;

// ----------------------------------------------------------------------
// 2. ESQUEMA DE VALIDACIÓN (YUP)
// ----------------------------------------------------------------------
const validationSchema = yup.object({
  name: yup
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre del negocio es obligatorio"),
  address: yup
    .string()
    .min(5, "La dirección debe ser real")
    .required("La dirección es obligatoria"),
  phone: yup
    .string()
    .matches(/^[0-9+ ]+$/, "Solo números y símbolos +") // Validación simple de teléfono
    .min(8, "El teléfono es muy corto")
    .required("El teléfono es obligatorio"),
});

const CreateBusinessForm = () => {
  // 3. HOOK DE MUTACIÓN
  const [createBusiness, { loading, error }] = useMutation(
    CREATE_BUSINESS_MUTATION,
    {
      onCompleted: (data) => {
        alert(`¡Negocio "${data.createBusiness.name}" creado con éxito!`);
        // Aquí podrías redirigir: router.push('/dashboard');
      },
      onError: (err) => {
        console.error("Error al crear negocio:", err);
      },
    }
  );

  // 4. CONFIGURACIÓN DE FORMIK
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await createBusiness({
          variables: {
            input: {
              name: values.name,
              address: values.address,
              phone: values.phone,
              // VALORES POR DEFECTO (Necesarios según tu Schema Prisma)
              // Como el formulario no los pide, los enviamos hardcodeados por ahora

              // clientId: Se asume que el Backend lo saca del Token (Context)
            },
          },
        });
      } catch (e) {
        // El error se maneja en el hook de mutation
      }
    },
  });

  return (
    <div>
      {/* Muestra error general si falla la API */}
      {error && (
        <Box mb={3}>
          <Alert severity="error">Error al guardar: {error.message}</Alert>
        </Box>
      )}

      {/* INICIO DEL FORMULARIO */}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* CAMPO 1: NOMBRE */}
          <Grid item xs={12} sm={3} display="flex" alignItems="center">
            <CustomFormLabel
              htmlFor="name"
              sx={{ mt: 0, mb: { xs: "-10px", sm: 0 } }}
            >
              Nombre del Negocio
            </CustomFormLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
            <CustomOutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser size="20" />
                </InputAdornment>
              }
              id="name"
              name="name" // Importante para Formik
              placeholder="Imperio Infame"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
            {/* Mensaje de Error UX */}
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error>{formik.errors.name}</FormHelperText>
            )}
          </Grid>

          {/* CAMPO 2: DIRECCIÓN */}
          <Grid item xs={12} sm={3} display="flex" alignItems="center">
            <CustomFormLabel
              htmlFor="address"
              sx={{ mt: 0, mb: { xs: "-10px", sm: 0 } }}
            >
              Dirección del Negocio
            </CustomFormLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
            <CustomOutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconPin size="20" />
                </InputAdornment>
              }
              id="address"
              name="address"
              placeholder="Los Girasoles 457"
              fullWidth
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
            />
            {/* Mensaje de Error UX */}
            {formik.touched.address && formik.errors.address && (
              <FormHelperText error>{formik.errors.address}</FormHelperText>
            )}
          </Grid>

          {/* CAMPO 3: TELÉFONO */}
          <Grid item xs={12} sm={3} display="flex" alignItems="center">
            <CustomFormLabel
              htmlFor="phone"
              sx={{ mt: 0, mb: { xs: "-10px", sm: 0 } }}
            >
              Teléfono
            </CustomFormLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
            <CustomOutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconPhone size="20" />
                </InputAdornment>
              }
              id="phone"
              name="phone"
              placeholder="+452642599"
              fullWidth
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
            />
            {/* Mensaje de Error UX */}
            {formik.touched.phone && formik.errors.phone && (
              <FormHelperText error>{formik.errors.phone}</FormHelperText>
            )}
          </Grid>

          {/* BOTÓN DE ACCIÓN */}
          <Grid item xs={12} sm={9} sx={{ ml: "auto" }}>
            {" "}
            {/* Alineado a la derecha del input */}
            <Button
              variant="contained"
              color="primary"
              type="submit" // Dispara el onSubmit de Formik
              disabled={loading} // Deshabilita mientras carga (UX)
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Creando..." : "Crear Negocio"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateBusinessForm;

/*
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel
            htmlFor="bi-phone"
            sx={{ mt: 0, mb: { xs: "-10px", sm: 0 } }}
          >
            Phone No
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <CustomOutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconPhone size="20" />
              </InputAdornment>
            }
            id="bi-phone"
            placeholder="412 2150 451"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel
            htmlFor="bi-message"
            sx={{ mt: 0, mb: { xs: "-10px", sm: 0 } }}
          >
            Message
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <CustomOutlinedInput
            id="bi-message"
            startAdornment={
              <InputAdornment position="start">
                <IconMessage2 size="20" />
              </InputAdornment>
            }
            placeholder="Hi, Do you  have a moment to talk Jeo ?"
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}></Grid>
*/
