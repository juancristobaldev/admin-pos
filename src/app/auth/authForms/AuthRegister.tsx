import { Box, Typography, Button, Divider, ButtonBase } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Stack } from "@mui/system";
import { registerType } from "@/app/(DashboardLayout)/types/auth/auth";
import AuthSocialButtons from "./AuthSocialButtons";
import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";

import * as Yup from "yup";

export const createClientSchema = Yup.object({
  name: Yup.string().required("El nombre es obligatorio"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
      id
      name
      email
    }
  }
`;

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const [createClient] = useMutation(CREATE_CLIENT);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: createClientSchema,
    onSubmit: async (form) => {
      await createClient({
        variables: {
          input: form,
        },
      });

      console.log("Cliente creado:", form);
    },
  });

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      {/**    <AuthSocialButtons title="Sign up with" />
     *  <Box mt={3}>
      <Divider>
        <Typography
          component="span"
          color="textSecondary"
          variant="h6"
          fontWeight="400"
          position="relative"
          px={2}
        >
          or sign up with
        </Typography>
      </Divider>
    </Box>

     */}

      <Box>
        <CustomFormLabel htmlFor="name">Nombre completo</CustomFormLabel>
        <CustomTextField
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
        />
        {touched.name && errors.name && (
          <p style={{ color: "red", marginTop: 4 }}>{errors.name}</p>
        )}

        <CustomFormLabel htmlFor="email">Correo electrónico</CustomFormLabel>
        <CustomTextField
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
        />
        {touched.email && errors.email && (
          <p style={{ color: "red", marginTop: 4 }}>{errors.email}</p>
        )}

        <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
        <CustomTextField
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
        />
        {touched.password && errors.password && (
          <p style={{ color: "red", marginTop: 4 }}>{errors.password}</p>
        )}

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
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
