import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useSearchParams } from "next/navigation";

// 1. DEFINICIÓN DE LA QUERY GRAPHQL
// Pedimos el Negocio -> Pisos -> Mesas (Todo en un solo viaje)
const GET_BUSINESS_QUERY = gql`
  query GetBusiness($id: ID!) {
    business(id: $id) {
      id
      name
      address
      phone
      currency
      taxRate
      status
      floors {
        id
        name
        tables {
          id
          name
          coordX
          coordY
          capacity
          status
          shape
          color
        }
      }
    }
  }
`;

// 2. INTERFACES (Tipado fuerte para TypeScript)
export interface Table {
  id: string;
  name: string;
  coordX: number;
  coordY: number;
  capacity: number;
  status: string;
}

export interface Floor {
  id: string;
  name: string;
  tables: Table[];
}

export interface Business {
  id: string;
  name: string;
  currency: string;
  floors: Floor[];
  // ... otros campos
}

interface BusinessContextProps {
  business: Business | null;
  loading: boolean;
  error: any;
  currentFloor: Floor | null; // UX: Para saber qué piso estamos viendo
  setCurrentFloor: (floor: Floor) => void;
  refreshBusiness: () => void;
}

// 3. CREACIÓN DEL CONTEXTO
const BusinessContext = createContext<BusinessContextProps>(
  {} as BusinessContextProps
);

// 4. PROVIDER (El cerebro)
export const BusinessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams<{
 idLocal:string
  }>();
  const idBusiness = params.idLocal;
  const searchParams = useSearchParams()
  const businessId = searchParams.get('businessId');


  const [id,setId] = useState<string | null>("")

  useEffect(() => {
    if(businessId)setId(businessId)
      else if(idBusiness) setId(idBusiness)
  },[businessId,idBusiness])




  const [currentFloor, setCurrentFloor] = useState<Floor | null>(null);

  // Ejecutamos la Query
  const { data, loading, error, refetch } = useQuery(GET_BUSINESS_QUERY, {
    variables: { id },
    skip: !id, // No ejecutar si no hay ID
    fetchPolicy: "network-only", // Para desarrollo rápido, asegura datos frescos
    onCompleted: (data) => {
      // ESTRATEGIA UX:
      // Si el negocio carga y tiene pisos, seleccionamos el primero por defecto automáticamente.
      if (data?.business?.floors?.length > 0) {
        setCurrentFloor(data.business.floors[0]);
      }
    },
  });

  const business = data?.business || null;

  // Efecto de seguridad: Si cambia el negocio, reseteamos el piso actual
  useEffect(() => {
    if (business?.floors?.length > 0 && !currentFloor) {
      setCurrentFloor(business.floors[0]);
    }
  }, [business]);

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        error,
        currentFloor, // Estado global del piso seleccionado
        setCurrentFloor, // Función para cambiar de piso en la UI
        refreshBusiness: refetch,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

// 5. CUSTOM HOOK (Para usarlo fácil en cualquier componente)
export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness debe usarse dentro de un BusinessProvider");
  }
  return context;
};
