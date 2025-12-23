import { Box, Typography, Button } from "@mui/material";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { registerType } from "@/app/(DashboardLayout)/types/auth/auth";
import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";

/* ============================
   VALIDACIÓN
============================ */
export const createClientSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});

/* ============================
   MUTATION
============================ */
export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      success
      errors
      client {
        id
        name
        email
      }
    }
  }
`;

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email") || "";
  const saleToken = searchParams.get("saleToken") || "";

  const [createClient, { loading }] = useMutation(CREATE_CLIENT);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      name: "",
      email: emailFromUrl,
      password: "",
    },
    validationSchema: createClientSchema,
    onSubmit: async (form) => {
      try {
        const { data } = await createClient({
          variables: {
            input: {
              name: form.name,
              email: form.email,
              password: form.password,
              saleToken,
            },
    
          },
        });

        const result = data?.createClient;

        if (!result?.success) {
          alert(result?.errors || "Error al crear usuario");
          return;
        }

        alert("Cuenta creada correctamente");
        router.push("/login");
      } catch (e) {
        console.error(e);
        alert("Error inesperado");
      }
    },
  });

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box>
        <CustomFormLabel htmlFor="name">Nombre completo</CustomFormLabel>
        <CustomTextField
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
        />
        {touched.name && errors.name && (
          <p style={{ color: "red" }}>{errors.name}</p>
        )}

        <CustomFormLabel htmlFor="email">Correo electrónico</CustomFormLabel>
        <CustomTextField
          id="email"
          name="email"
          value={values.email}
          disabled
          fullWidth
        />

        <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
        <CustomTextField
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
        />
        {touched.password && errors.password && (
          <p style={{ color: "red" }}>{errors.password}</p>
        )}

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          onClick={() => handleSubmit()}
        >
          Registrarse
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
