import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import logoIcon from "/public/images/logos/logoIcon.svg";
import Image from "next/image";

const Footer = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} justifyContent="center" mt={4}>
        <Grid item xs={12} sm={5} lg={4} textAlign="center">
          <Typography fontSize="16" color="textSecondary" mt={1} mb={4}>
            © {new Date().getFullYear()} Easy Flow. Todos los derechos
            reservados.
            <br />
            Diseñado y desarrollado por Juan Cristobal Quezada.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
