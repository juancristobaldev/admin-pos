import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
const FeaturesTitle = () => {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} sm={10} lg={6}>
        <Typography
          fontSize="16"
          textTransform="uppercase"
          color="primary.main"
          fontWeight={500}
          textAlign="center"
          mb={1}
        >
          TODO LO QUE TU RESTAURANTE NECESITA
        </Typography>

        <Typography
          variant="h2"
          fontWeight={700}
          textAlign="center"
          sx={{
            fontSize: {
              lg: "36px",
              xs: "25px",
            },
            lineHeight: {
              lg: "43px",
              xs: "30px",
            },
          }}
        >
          Funciones Poderosas y la Flexibilidad que tu Operación Exige
        </Typography>
      </Grid>
    </Grid>
  );
};

export default FeaturesTitle;
