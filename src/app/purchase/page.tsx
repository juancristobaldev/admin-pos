'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Alert
} from '@mui/material';
import { 
  IconLock, 
  IconShieldCheck, 
  IconCreditCard, 
  IconReceipt,
  IconAlertCircle,
  IconBarcode,
  IconMail
} from '@tabler/icons-react';




// Asegúrate de importar tus datos de planes correctamente
import { plans } from '@/store/data';
import SubscribeButton from '../components/forms/form-elements/button/SuscribeButton';

const PaymentGateway = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  
  // Estado para almacenar el ID de la orden generado
  const [orderId, setOrderId] = useState<string>('');
  const [email,setEmail] = useState("")

  // 1. GENERAR ID DE ORDEN AL MONTAR (Sin '#', sin '-')
  useEffect(() => {
    // Genera un número aleatorio y lo convierte a base 36 (alfanumérico) y lo pasa a mayúsculas
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const uniqueId = `SUB-${Date.now().toString().slice(-10)}`;
    setOrderId(uniqueId);
  }, []);

  // 2. OBTENER DATOS DE LA URL
  const planId = searchParams.get('id');
  const cycleParam = searchParams.get('cycle') || 'monthly';

  // 3. BUSCAR EL PLAN
  const selectedPlan = useMemo(() => {
    return plans.find(p => p.id === planId);
  }, [planId]);

  // 4. CALCULAR PRECIO FINAL
  const finalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    const base = selectedPlan.basePrice;
    if (cycleParam === 'semiannual') return base * 0.9;
    if (cycleParam === 'annual') return base * 0.85;
    return base;
  }, [selectedPlan, cycleParam]);

  // Etiquetas para mostrar en UI
  const cycleLabel = {
    monthly: 'Mensual',
    semiannual: 'Semestral',
    annual: 'Anual'
  }[cycleParam] || 'Mensual';

  // Formateador de moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // 5. FUNCIÓN PARA ENVIAR AL BACKEND
  const handlePay = () => {
    if (!selectedPlan || !orderId) return;

    // Aquí tienes todos los datos listos para tu POST al backend
    const payload = {
      orderId: orderId,       // El ID generado (ej: TRX7H9X2)
      planId: selectedPlan.id,
      cycle: cycleParam,
      amount: finalPrice,
      currency: 'USD'
    };

    console.log("✅ Enviando al Backend:", payload);
    alert(`Enviando orden ${orderId} por ${formatCurrency(finalPrice)}`);
    // Aquí iría tu fetch('/api/webpay/init', { method: 'POST', body: ... })
  };

  // Colores
  const primary = theme.palette.primary.main;
  const grayLight = theme.palette.grey[100];
  const successMain = theme.palette.success.main;

  // Validación si el plan no existe
  if (!selectedPlan) {
    return (
        <Box display="flex" justifyContent="center" mt={5}>
            <Alert icon={<IconAlertCircle />} severity="error" variant="filled">
                Plan no encontrado. Por favor selecciona un plan válido.
            </Alert>
        </Box>
    );
  }

  return (
    <Card
      sx={{
        p: 0,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '24px',
        boxShadow: theme.shadows[2],
        maxWidth: 500,
        mx: 'auto'
      }}
    >
      {/* --- ENCABEZADO SEGURO --- */}
      <Box 
        sx={{ 
          bgcolor: alpha(successMain, 0.1), 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1
        }}
      >
        <IconLock size={18} color={successMain} />
        <Typography variant="subtitle2" color="success.main" fontWeight={700}>
          Pago 100% Seguro y Encriptado (SSL)
        </Typography>
      </Box>

      <CardContent sx={{ p: 4 }}>
        
        {/* --- TOTAL A PAGAR --- */}
        <Box textAlign="center" mb={4}>
          <Typography variant="subtitle1" color="textSecondary" mb={0.5}>
            Total a Pagar
          </Typography>
          
          <Typography variant="h1" fontWeight={800} color="primary.main">
            ${finalPrice} CLP
          </Typography>

          {/* CHIP DE ORDEN (SIN # NI -) */}
          <Stack direction="row" justifyContent="center" spacing={1} mt={2}>
             <Chip 
                // Mostramos el ID generado dinámicamente
                label={`Orden ${orderId}`} 
                size="small"
                sx={{ bgcolor: grayLight, color: 'text.primary', fontWeight: 600, letterSpacing: '0.5px' }} 
            />
          </Stack>
        </Box>

        {/* --- MÉTODO DE PAGO (WEBPAY) --- */}
        <Box 
          sx={{ 
            border: `2px solid ${primary}`, 
            borderRadius: '16px', 
            p: 3, 
            mb: 3,
            bgcolor: alpha(primary, 0.04),
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'absolute', top: -12, left: 16, bgcolor: 'background.paper', px: 1 }}>
            <Typography variant="caption" fontWeight={700} color="primary">
              Webpay Plus
            </Typography>
          </Box>
          
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar variant="rounded" sx={{ bgcolor: '#FF3D00', width: 40, height: 28 }}>
                   <Typography variant="caption" color="white" fontWeight="bold">WP</Typography>
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>Redcompra / Crédito</Typography>
            </Stack>
            <IconShieldCheck size={24} color={successMain} />
          </Stack>

          <Typography variant="body2" color="textSecondary" mb={2}>
            Vas a pagar el plan <b>{selectedPlan.title}</b> ({cycleLabel}). Serás redirigido a Transbank.
          </Typography>

          <Stack direction="row" spacing={1}>
            {['Visa', 'Master', 'Amex', 'Magna'].map((card) => (
              <Box 
                key={card}
                sx={{ 
                  bgcolor: 'white', 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '6px',
                  px: 1,
                  py: 0.5
                }}
              >
                 <Typography variant="caption" fontWeight={700} color="textSecondary">{card}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* --- DETALLES DE LA TRANSACCIÓN (Read Only) --- */}
        <Stack spacing={2} mb={4}>
           {/* Campo para el ID de Orden accesible */}
           <TextField
            fullWidth
            label="Concepto"
            value={`Suscripción ${selectedPlan.title} (${cycleLabel})`}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconReceipt size={20} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
           <TextField
            fullWidth
            label="ID de Transacción"
            value={orderId} // Valor dinámico
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconBarcode size={20} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
            <TextField
            fullWidth
            label="Correo electronico para tu cuenta"
            value={email}
            InputProps={{
              onChange:(e) => {
                setEmail(e.target.value)
              },
              startAdornment: (
                <InputAdornment position="start">
                  <IconMail size={20} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
         
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* --- BOTÓN DE PAGO (Dispara handlePay) --- */}
        <SubscribeButton
        clientEmail={email}
        subscriptionId={planId}
        amount={finalPrice}
        />
        
        <Typography variant="caption" color="textSecondary" align="center" display="block" mt={2}>
            Se generará la orden <b>{orderId}</b> y serás redirigido.
        </Typography>

      </CardContent>
    </Card>
  );
};

export default PaymentGateway;