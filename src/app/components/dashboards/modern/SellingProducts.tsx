import {
  Box,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";

// DEFINICIÓN DE PROPS
interface SellingProductsProps {
  availableProducts?: number;
  totalProducts?: number;
}

const SellingProducts = ({ availableProducts = 0, totalProducts = 0 }: SellingProductsProps) => {
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const borderColor = theme.palette.divider;

  // Cálculos
  const availablePercent = totalProducts > 0 ? Math.round((availableProducts / totalProducts) * 100) : 0;
  const unavailablePercent = 100 - availablePercent;

  return (
    <Paper
      sx={{ bgcolor: "primary.main", border: `1px solid ${borderColor}` }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h5" color="white">
          Estado del Inventario
        </Typography>
        <Typography variant="subtitle1" color="white" mb={4}>
          Disponibilidad
        </Typography>

        <Box textAlign="center" mt={2} mb="-40px">
          <Image src="/images/backgrounds/piggy.png" alt="SavingsImg" width="300" height="220" />
        </Box>
      </CardContent>
      <Paper
        sx={{
          overflow: "hidden",
          zIndex: "1",
          position: "relative",
          margin: "10px",
          mt: "-43px"
        }}
      >
        <Box p={3}>
          <Stack spacing={3}>
            {/* Disponibles */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                mb={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">Productos Disponibles</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {availableProducts} de {totalProducts}
                  </Typography>
                </Box>
                <Chip
                  sx={{
                    backgroundColor: primarylight,
                    color: primary,
                    borderRadius: "4px",
                    width: 55,
                    height: 24,
                  }}
                  label={availablePercent + "%"}
                />
              </Stack>
              <LinearProgress
                value={availablePercent}
                variant="determinate"
                color="primary"
              />
            </Box>

            {/* No Disponibles */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                mb={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h6">No Disponibles</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fuera de stock
                  </Typography>
                </Box>
                <Chip
                  sx={{
                    backgroundColor: secondarylight,
                    color: secondary,
                    borderRadius: "4px",
                    width: 55,
                    height: 24,
                  }}
                  label={unavailablePercent + "%"}
                />
              </Stack>
              <LinearProgress
                value={unavailablePercent}
                variant="determinate"
                color="secondary"
              />
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Paper>
  );
};

export default SellingProducts;