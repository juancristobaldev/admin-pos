import { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert, // Agregado para feedback de error
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { gql, useMutation } from "@apollo/client";
import { setCookie } from "nookies";
import { updateCookies } from "@/utils/cookies";

// 1. MUTACIÓN ALINEADA CON EL BACKEND RESOLVER
const LOGIN_MUTATION = gql`
  mutation Login($input: AuthInput!) {
    # Usamos loginClient con el argumento 'input'
    loginClient(input: $input) {
      accessToken
    }
  }
`;

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();

  // 2. ESTADOS LOCALES
  const [email, setEmail] = useState("mesero@restaurante.com"); // Email por defecto para pruebas
  const [password, setPassword] = useState("password123");
  const [errorMsg, setErrorMsg] = useState("");

  // 3. HOOK DE MUTACIÓN
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // ÉXITO: GUARDAMOS EL JWT Y LOS DATOS DEL USUARIO
      const token = data.loginClient.accessToken;

      updateCookies("token", token);
      // Almacenamiento local para persistencia y validación offline
      window.location.reload();
    },
    onError: (error) => {
      // ERROR: Mostrar mensaje amigable
      setErrorMsg("Credenciales inválidas. Verifique email y contraseña.");
      console.error("Error de Login:", error);
    },
  });

  // 4. FUNCIÓN DE ENVÍO
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Por favor complete todos los campos.");
      return;
    }
    // Ejecutar la mutación
    login({ variables: { input: { email, password } } });
  };

  return (
    <>
      {title ? (
        <Typography
          className="text-center"
          fontWeight="700"
          variant="h3"
          mb={1}
        >
          {title}
        </Typography>
      ) : null}

      {subtext}

      {/* Mensaje de Error Visual */}
      {errorMsg && (
        <Box mt={2}>
          <Alert severity="error">{errorMsg}</Alert>
        </Box>
      )}

      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            Ingreso de Administradores
          </Typography>
        </Divider>
      </Box>

      {/* 5. FORMULARIO ENVOLVIENDO LA STACK */}
      <form onSubmit={handleSubmit}>
        <Stack>
          <Box>
            <CustomFormLabel htmlFor="email">Email de Usuario</CustomFormLabel>
            <CustomTextField
              id="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Recordar este Dispositivo"
              />
            </FormGroup>
            {/* Mantener el enlace de Olvidé Contraseña por si acaso */}
            <Typography
              component={Link}
              href="/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              ¿Olvidó la Contraseña?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit" // CRÍTICO: Debe ser tipo submit
            disabled={loading} // Desactivar si está cargando
          >
            {loading ? "Iniciando..." : "Ingresar al Sistema"}
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
