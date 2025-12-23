import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { IconRocket } from "@tabler/icons-react";

// third party
import { motion } from "framer-motion";

const StyledButton = styled(Button)(() => ({
  padding: "13px 48px",
  fontSize: "16px",
}));

const BannerContent = () => {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  return (
    <Box  mt={lgDown ? 8 : 0}>
      <motion.div
      className="max-md:flex max-md:justify-center max-md:flex-col"
        initial={{ opacity: 0, translateY: 550 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 30,
        }}
      >
        <Typography className="max-md:flex max-md:justify-center" variant="h6" display={"flex"} gap={1} mb={2}>
          <Typography color={"secondary"}>
            <IconRocket size={"21"} />
          </Typography>{" "}
          Tecnología real que sí resuelve problemas{" "}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            fontSize: {
              md: "45px",
              sm: "32px",
            },
            lineHeight: {
              md: "60px",
            },
          }}
        >
          El sistema más intuitivo y {""}
          <Typography component={"span"} variant="inherit" color={"primary"}>
            moderno
          </Typography>{" "}
          para gestionar tus restaurantes sin complicaciones.
        </Typography>
      </motion.div>
      <Box pt={4} pb={3}>
        <motion.div
          initial={{ opacity: 0, translateY: 550 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 30,
            delay: 0.2,
          }}
        >
          <Typography variant="h5" fontWeight={300}>
          Easy Flow te ofrece interfaz clara, flujos rápidos y un sistema
            offline-first que nunca te deja botado. Operaciones más ágiles,
            pedidos sin errores y una administración que por fin fluye.
          </Typography>
        </motion.div>
      </Box>
      <motion.div
        initial={{ opacity: 0, translateY: 550 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 30,
          delay: 0.4,
        }}
      >
        <Stack sx={{
  display: {
    xs: "flex !important",
    md: "flex !important",
    lg: "block",
  },
  justifyContent: {
    xs: "center !important",
    md: "center !important",
    lg: "flex-start",
  },
  textAlign: {
    xs: "center !important",
    md: "center !important",
    lg: "left",
  },
}} spacing={2} mt={3}>
          <StyledButton
            variant="contained"
            color="primary"
            href="/auth/auth1/login"
          >
            {"Ver planes"}
          </StyledButton>

          <StyledButton variant="outlined" href="#demos">
            {"Soy socio"}
          </StyledButton>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default BannerContent;
