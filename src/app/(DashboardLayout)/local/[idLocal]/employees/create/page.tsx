"use client";

// src/components/Forms/CreateEmployeeForm.tsx

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
import { IconUserPlus } from "@tabler/icons-react";
import { useMutation, gql } from "@apollo/client";
import BlankCard from "@/app/components/shared/BlankCard";
import { useBusiness } from "@/store/bussines";

// --- ROLES DISPONIBLES ---
const EMPLOYEE_ROLES = [
  { value: "WAITER", label: "Mesero" },
  { value: "KITCHEN", label: "Cocina" },
  { value: "ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
];

// --- ESTADOS DISPONIBLES ---
const EMPLOYEE_STATUS = [
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "SUSPENDED", label: "Suspendido" },
];

// --- 1. DEFINICIÓN DE QUERIES Y MUTACIONES INLINE ---

// MUTACIÓN para crear un nuevo usuario (empleado)
const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      status
      businessId
    }
  }
`;

// QUERY para refrescar la lista de usuarios en el Admin
// Se asume que estos son los campos necesarios para la tabla.
const GET_USERS_BY_BUSINESS = gql`
  query GetUsersByBusiness($businessId: String!) {
    usersByBusiness(businessId: $businessId) {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`;
// --- FIN DEFINICIÓN QUERIES ---

// --- ESQUEMA DE VALIDACIÓN (yup) ---
const validationSchema = yup.object({
  name: yup.string().required("El nombre del empleado es obligatorio."),
  email: yup
    .string()
    .email("Ingrese un correo electrónico válido.")
    .required("El correo es obligatorio."),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .required("La contraseña es obligatoria."),
  role: yup.string().required("El rol es obligatorio."),
  businessId: yup.string().required("El ID del negocio es requerido."),
});

// Interfaz para los datos del formulario
interface EmployeeFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
  businessId: string;
}

// Componente principal
const CreateEmployeeForm = () => {
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);
  const { business } = useBusiness();

  const initialValues: EmployeeFormValues = {
    name: "",
    email: "",
    password: "",
    role: "",
    businessId: business?.id || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const finalInput = { ...values, businessId: business?.id };
      alert(business?.id);
      try {
        // Ejecutar la mutación GraphQL
        await createUser({
          variables: { input: finalInput },

          // 2. IMPLEMENTACIÓN DEL REFETCH
          refetchQueries: [
            {
              query: GET_USERS_BY_BUSINESS,
              variables: {
                businessId: business?.id, // Usa el businessId del store
              },
            },
          ],
          awaitRefetchQueries: true, // Espera a que la lista se actualice
        });

        alert(`✅ Empleado "${finalInput.name}" creado exitosamente.`);
        resetForm();
      } catch (error: any) {
        console.error("Error al crear empleado:", error);

        if (error.message.includes("Unique constraint")) {
          alert("❌ Error: El correo electrónico ya está registrado.");
        } else {
          alert(`❌ Error al crear empleado. ${error.message}`);
        }
      }
    },
  });

  const currentDate = new Date().toLocaleDateString("es-CL");

  return (
    <BlankCard>
      <CardContent>
        <Typography variant="h4" fontWeight="700" mb={1}>
          Registrar Nuevo Empleado
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={3}>
          Complete el formulario para dar de alta a un nuevo usuario en el
          sistema.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Campo 1: Nombre Completo */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="name"
                name="name"
                label="Nombre Completo"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* Campo 2: Rol (Select) */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <InputLabel id="role-label">Rol del Empleado</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  label="Rol del Empleado"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="">
                    <em>Seleccione un rol</em>
                  </MenuItem>
                  {EMPLOYEE_ROLES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <FormHelperText>{formik.errors.role}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Campo 3: Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name="email"
                label="Correo Electrónico"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                variant="outlined"
                type="email"
              />
            </Grid>

            {/* Campo 4: Contraseña */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="password"
                name="password"
                label="Contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
                variant="outlined"
                type="password"
                autoComplete="new-password"
              />
            </Grid>

            {/*
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  label="Estado"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {EMPLOYEE_STATUS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
     */}

            {/* Campo 6: Fecha de Creación (Solo Lectura - UX) */}
            <Grid item xs={12} sm={6}>
              <TextField
                id="creation-date"
                label="Fecha de Registro"
                value={currentDate}
                fullWidth
                variant="outlined"
                disabled
                helperText="Se genera automáticamente"
              />
            </Grid>
          </Grid>

          {/* Botón de Envío */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              type="submit"
              startIcon={<IconUserPlus />}
              disabled={loading || formik.isSubmitting || !formik.isValid}
            >
              {loading ? "Registrando..." : "Crear Empleado"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </BlankCard>
  );
};

export default CreateEmployeeForm;
