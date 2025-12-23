import { IconUser, IconBuildingStore, IconBriefcase } from '@tabler/icons-react';

export interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  basePrice: number; // Precio base mensual sin descuento
  features: string[];
  isPopular?: boolean;
  buttonVariant: 'outlined' | 'contained';
}

export const plans: PricingPlan[] = [
  {
    id: 'personal',
    title: 'Personal',
    subtitle: 'Para comenzar tu gestión',
    icon: IconUser,
    basePrice: 7500,
    features: [
      '1 Negocio',
      '4 Pisos',
      'Mesas ilimitadas',
      'Reportes básicos',
    ],
    buttonVariant: 'outlined',
  },
  {
    id: 'emprendedor',
    title: 'Emprendedor',
    subtitle: 'Para negocios en crecimiento',
    icon: IconBuildingStore,
    basePrice: 25000,
    features: [
      '5 Negocios',
      '6 Pisos por negocio',
      'Mesas limitadas',
      'Reportes avanzados',
    ],
    isPopular: true,
    buttonVariant: 'contained',
  },
  {
    id: 'empresarial',
    title: 'Empresarial',
    subtitle: 'Para grandes cadenas',
    icon: IconBriefcase,
    basePrice: 50000,
    features: [
      '10 Negocios',
      '10 Pisos por negocio',
      'Mesas limitadas',
      'Auditoría y Logs',
    ],
    buttonVariant: 'outlined',
  },
];