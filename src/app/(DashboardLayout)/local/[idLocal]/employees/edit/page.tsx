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
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import BlankCard from "@/app/components/shared/BlankCard";

/* --------------------------------------------------------
 * CONSTANTES
 * -------------------------------------------------------- */

const EMPLOYEE_ROLES = [
  { value: "WAITER", label: "Mesero" },
  { value: "KITCHEN", label: "Cocina" },
  { value: "ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
];

const EMPLOYEE_STATUS = [
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "SUSPENDED", label: "Suspendido" },
];

/* --------------------------------------------------------
 * GRAPHQL
 * -------------------------------------------------------- */

const GET_USER = gql`
  query getUser($userId: String!) {
    getUser(userId: $userId) {
      success
      errors
      user {
        id
        name
        email
        role
        status
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      role
      status
      updatedAt
    }
  }
`;

/* --------------------------------------------------------
 * TIPOS
 * -------------------------------------------------------- */

interface FormValues {
  name: string;
  email: string;
  role: string;
  status: string;
  password: string;
}

/* --------------------------------------------------------
 * VALIDACIÓN
 * -------------------------------------------------------- */

const validationSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  role: yup.string().required("El rol es obligatorio"),
  status: yup.string().required("El estado es obligatorio"),
  password: yup.string().min(6, "Mínimo 6 caracteres").optional(),
});

/* --------------------------------------------------------
 * COMPONENTE
 * -------------------------------------------------------- */

const EditEmployeeForm = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter()

  const { data, loading, error } = useQuery(GET_USER, {
    variables: {  userId },
    skip: !userId,
  });

  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER);

  const user = data?.getUser?.user;

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "",
      status: user?.status ?? "ACTIVE",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!userId) return;

      const input: any = {
        id: userId,
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
      };

      if (values.password.trim()) {
        input.password = values.password;
      }

      await updateUser({ variables: { input } });
      alert("✅ Empleado actualizado correctamente");

      return router.back()
    },
  });

  /* --------------------------------------------------------
   * ESTADOS
   * -------------------------------------------------------- */

  if (!userId) {
    return (
      <Typography color="error">
        ❌ No se proporcionó el ID del empleado
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Typography color="error">
        ❌ Error al cargar el empleado
      </Typography>
    );
  }

  /* --------------------------------------------------------
   * RENDER
   * -------------------------------------------------------- */

  return (
    <BlankCard>
      <CardContent>
        <Typography variant="h4" fontWeight="700" mb={1}>
          Editar Empleado
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={3}>
          Modifica los datos del empleado
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Nombre"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.name && formik.errors.name)}
                helperText={
                  formik.touched.name && typeof formik.errors.name === "string"
                    ? formik.errors.name
                    : ""
                }
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Correo"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={
                  formik.touched.email &&
                  typeof formik.errors.email === "string"
                    ? formik.errors.email
                    : ""
                }
              />
            </Grid>

            {/* Rol */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={Boolean(formik.touched.role && formik.errors.role)}
              >
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  label="Rol"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                >
                  {EMPLOYEE_ROLES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formik.touched.role &&
                  typeof formik.errors.role === "string"
                    ? formik.errors.role
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Estado */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={Boolean(formik.touched.status && formik.errors.status)}
              >
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  label="Estado"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  {EMPLOYEE_STATUS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formik.touched.status &&
                  typeof formik.errors.status === "string"
                    ? formik.errors.status
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="password"
                label="Nueva contraseña (opcional)"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                helperText="Completa solo si deseas cambiarla"
              />
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              startIcon={<IconDeviceFloppy />}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </BlankCard>
  );
};

export default EditEmployeeForm;
