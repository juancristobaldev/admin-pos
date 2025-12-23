import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  alpha
} from '@mui/material';
import { IconCheck } from '@tabler/icons-react';
import { plans } from '@/store/data';

// Importamos los datos desde el archivo que acabamos de crear
// Asegúrate de que la ruta './PricingData' sea correcta según tu estructura

// --- TIPOS ---
type BillingCycle = 'monthly' | 'semiannual' | 'annual';

const PricingPlans = () => {
  const theme = useTheme();
  const [cycle, setCycle] = useState<BillingCycle>('annual');

  // Colores del tema
  const primaryMain = theme.palette.primary.main;
  const successLight = theme.palette.success.light;
  const successMain = theme.palette.success.main;
  const grayLight = theme.palette.grey[100];

  // Función para calcular precio según ciclo
  const getPrice = (basePrice: number) => {
    if (cycle === 'semiannual') return (basePrice * 0.9).toFixed(1); // 10% off
    if (cycle === 'annual') return (basePrice * 0.85).toFixed(1);    // 15% off
    return basePrice.toFixed(1);
  };

  return (
    <Box id={'pricing'} className="max-w-[1200px] mx-auto">
      {/* --- HEADER & TOGGLE --- */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Elige el plan perfecto para tu negocio
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" mb={4}>
          Descuentos disponibles para pagos adelantados
        </Typography>

        {/* Toggle de Ciclos */}
        <Box
          sx={{
            display: 'inline-flex',
            bgcolor: grayLight,
            p: 0.5,
            borderRadius: '12px',
          }}
        >
          <Stack direction="row" spacing={1}>
            {/* Mensual */}
            <Button
              variant={cycle === 'monthly' ? 'contained' : 'text'}
              onClick={() => setCycle('monthly')}
              sx={{
                borderRadius: '8px',
                color: cycle === 'monthly' ? '#fff' : 'text.secondary',
                bgcolor: cycle === 'monthly' ? 'white' : 'transparent',
                boxShadow: cycle === 'monthly' ? theme.shadows[2] : 'none',
                '&:hover': { bgcolor: cycle === 'monthly' ? 'white' : alpha(theme.palette.grey[300], 0.3) },
                textTransform: 'none',
                fontWeight: 600,
                
              }}
            >
              Mensual
            </Button>
            
            {/* Semestral */}
            <Button
              variant={cycle === 'semiannual' ? 'contained' : 'text'}
              onClick={() => setCycle('semiannual')}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                color: cycle === 'semiannual' ? 'text.primary' : 'text.secondary',
                bgcolor: cycle === 'semiannual' ? 'white' : 'transparent',
                boxShadow: cycle === 'semiannual' ? theme.shadows[2] : 'none',
                '&:hover': { bgcolor: cycle === 'semiannual' ? 'white' : alpha(theme.palette.grey[300], 0.3) },
              }}
            >
              Semestral <Chip label="-10%" size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem', bgcolor: successLight, color: successMain, fontWeight: 700 }} />
            </Button>

            {/* Anual */}
            <Button
              variant={cycle === 'annual' ? 'contained' : 'text'}
              onClick={() => setCycle('annual')}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                color: cycle === 'annual' ? 'text.primary' : 'text.secondary',
                bgcolor: cycle === 'annual' ? 'white' : 'transparent',
                boxShadow: cycle === 'annual' ? theme.shadows[2] : 'none',
                '&:hover': { bgcolor: cycle === 'annual' ? 'white' : alpha(theme.palette.grey[300], 0.3) },
              }}
            >
              Anual <Chip label="-15%" size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem', bgcolor: successLight, color: successMain, fontWeight: 700 }} />
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* --- CARDS GRID --- */}
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan:any) => {
          const price = plan.basePrice;
          const isPopular = plan.isPopular;

          return (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card
                sx={{
                  border: isPopular ? `2px solid ${primaryMain}` : `1px solid ${theme.palette.divider}`,
                  borderRadius: '24px',
                  boxShadow: isPopular ? theme.shadows[4] : 'none',
                  position: 'relative',
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Badge para el popular */}
                  {isPopular && (
                    <Chip
                      label="Recomendado"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        bgcolor: alpha(primaryMain, 0.1),
                        color: primaryMain,
                        fontWeight: 700,
                        borderRadius: '8px',
                      }}
                    />
                  )}

                  {/* Icono y Título */}
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: isPopular ? '#FFF5E0' : grayLight,
                        color: isPopular ? '#FFAE1F' : 'text.primary',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <plan.icon size={28} stroke={1.5} />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {plan.title}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="textSecondary" mb={3}>
                      {plan.subtitle}
                  </Typography>

                  {/* Precio */}
                  <Box mb={3}>
                    <Typography variant="h2" fontWeight={700} component="span">
                      ${price} CLP
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
                      /mes {cycle !== 'monthly' ? '(facturado ' + (cycle === 'semiannual' ? 'semestral' : 'anual') + ')' : ''}
                    </Typography>
                  </Box>

                  {/* Lista de características */}
                  <List sx={{ mb: 4, p: 0 }}>
                    {plan.features.map((feature:any[], idx:number) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: primaryMain,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconCheck size={12} color="white" />
                          </Box>
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} 
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* Botón de Contratar */}
                  <Button
                    fullWidth
                    size="large"
                    variant={plan.buttonVariant}
                    color="primary"
                    href={`/purchase?id=${plan.id}`}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      boxShadow: 'none',
                    }}
                  >
                    Contratar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PricingPlans;